<?php

namespace App\Http\Controllers\Api;

use App\Enums\AppointmentStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\AppointmentResource;
use App\Models\Appointment;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AppointmentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'doctor_id' => ['required', 'exists:doctors,id'],
            'specialization' => ['required', 'string'],
            'date' => ['required', 'date', 'after:today'],
            'time' => ['required', 'date_format:H:i'],
            'notes' => ['nullable', 'string'],
        ]);

        $conflict = Appointment::where('doctor_id', $validated['doctor_id'])
            ->whereDate('date', $validated['date'])
            ->whereTime('time', $validated['time'])
            ->whereIn('status', [
                AppointmentStatus::PENDING->value,
                AppointmentStatus::ACCEPTED->value,
                AppointmentStatus::IN_PROGRESS->value,
            ])
            ->exists();

        if ($conflict) {
            throw ValidationException::withMessages([
                'time' => 'This appointment slot is no longer available.',
            ]);
        }

        $appointment = Appointment::create([
            'patient_id' => Auth::id(),
            'doctor_id' => $validated['doctor_id'],
            'specialization' => $validated['specialization'],
            'date' => $validated['date'],
            'time' => $validated['time'],
            'notes' => $validated['notes'] ?? null,
            'status' => AppointmentStatus::PENDING,
        ]);

        return response()->json([
            'message' => 'Appointment booked successfully.',
            'appointment' => $appointment->load(['doctor.user', 'patient']),
        ], 201);
    }

    public function index()
    {
        return Appointment::where('patient_id', Auth::id())
            ->whereNull('hidden_at')
            ->with(['doctor.user', 'hospital'])
            ->orderBy('date')
            ->orderBy('time')
            ->get();
    }

    public function hide($appointment)
    {
        $appointment = Appointment::where('id', $appointment)
            ->where('patient_id', Auth::id())
            ->firstOrFail();

        $appointment->hidden_at = now();
        $appointment->save();

        return response()->json([
            'message' => 'Appointment hidden successfully.',
        ]);
    }

    /**
     * Submit a reschedule request without changing the booked appointment.
     */
    public function reschedule(Request $request, $appointment)
    {
        $validated = $request->validate([
            'date' => ['required', 'date', 'after_or_equal:today'],
            'time' => ['required', 'date_format:H:i'],
        ]);

        $newDate = $validated['date'];
        $newTime = $validated['time'];

        if (now()->parse("$newDate $newTime")->isPast()) {
            throw ValidationException::withMessages([
                'time' => 'The requested appointment time must be in the future.',
            ]);
        }

        $updatedAppointment = DB::transaction(function () use ($appointment, $newDate, $newTime) {
            $record = Appointment::where('patient_id', Auth::id())
                ->whereKey($appointment)
                ->lockForUpdate()
                ->firstOrFail();

            if (
                !in_array($record->status, [
                    AppointmentStatus::PENDING,
                    AppointmentStatus::ACCEPTED,
                ], true)
            ) {
                throw ValidationException::withMessages([
                    'appointment' => 'Only pending or accepted appointments can be rescheduled.',
                ]);
            }

            if ($record->requested_date && $record->requested_time) {
                throw ValidationException::withMessages([
                    'appointment' => 'A reschedule request is already waiting for the doctor.',
                ]);
            }

            if (
                $record->date?->toDateString() === $newDate &&
                substr((string) $record->time, 0, 5) === $newTime
            ) {
                throw ValidationException::withMessages([
                    'time' => 'Choose a different date or time.',
                ]);
            }

            $conflict = Appointment::where('doctor_id', $record->doctor_id)
                ->whereDate('date', $newDate)
                ->whereTime('time', $newTime)
                ->where('id', '!=', $record->id)
                ->whereIn('status', [
                    AppointmentStatus::PENDING->value,
                    AppointmentStatus::ACCEPTED->value,
                    AppointmentStatus::IN_PROGRESS->value,
                ])
                ->exists();

            if ($conflict) {
                throw ValidationException::withMessages([
                    'time' => 'That appointment slot is already booked.',
                ]);
            }


            // Leave the original date, time and status untouched.
            $record->requested_date = $newDate;
            $record->requested_time = $newTime;
            $record->reschedule_requested_at = now();

            // Clear the previous decision for this new request.
            $record->reschedule_decision = null;
            $record->reschedule_decided_at = null;

            $record->save();


            return $record->fresh()->load([
                'patient',
                'doctor.user',
                'hospital',
            ]);
        });

        return response()->json([
            'message' => 'Your reschedule request has been sent to the doctor.',
            'appointment' => new AppointmentResource($updatedAppointment),
        ]);
    }

    /**
     * Return the doctor's appointments, including any pending reschedule requests.
     */
    public function doctorAppointments(Request $request)
    {
        $doctor = Doctor::where('user_id', Auth::id())->firstOrFail();

        $query = Appointment::where('doctor_id', $doctor->id)
            ->with(['patient', 'doctor.user']);

        if ($request->filled('date')) {
            $query->whereDate('date', $request->query('date'));
        }

        $appointments = $query
            ->orderBy('time')
            ->get();

        return AppointmentResource::collection($appointments);
    }
}
