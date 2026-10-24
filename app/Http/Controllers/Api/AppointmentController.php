<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AppointmentResource;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Doctor;
use App\Enums\AppointmentStatus;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AppointmentController extends Controller
{
    // Book an appointment
    public function store(Request $request)
    {
        $validated = $request->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'specialization' => 'required|string',
            'date' => 'required|date|after:today',
            'time' => 'required',
            'notes' => 'nullable|string',
        ]);

        $appointment = Appointment::create([
            'patient_id' => Auth::id(),
            'doctor_id' => $validated['doctor_id'],
            'specialization' => $validated['specialization'],
            'date' => $validated['date'],
            'time' => $validated['time'],
            'notes' => $validated['notes'] ?? null,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Appointment booked successfully',
            'appointment' => $appointment,
        ], 201);
    }

    // View patient's appointments
    // View patient's visible appointments
    public function index()
    {
        $appointments = Appointment::where('patient_id', Auth::id())
            ->whereNull('hidden_at')
            ->with(['doctor.user', 'hospital'])
            ->orderBy('date', 'asc')
            ->get();

        return response()->json($appointments);
    }
    // Hide an appointment from the patient's list
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

    public function reschedule(Request $request, $id)
    {
        $validated = $request->validate([
            'date' => ['required', 'date', 'after_or_equal:today'],
            'time' => ['required', 'date_format:H:i'],
        ]);

        $appointment = Appointment::where('patient_id', Auth::id())
            ->findOrFail($id);

        $status = $appointment->status;

        if (
            !in_array($status, [
                AppointmentStatus::PENDING,
                AppointmentStatus::ACCEPTED,
            ], true)
        ) {
            return response()->json([
                'message' => 'Only pending or accepted appointments can be rescheduled.',
            ], 422);
        }

        $newDate = $validated['date'];
        $newTime = $validated['time'];

        if (now()->parse("$newDate $newTime")->isPast()) {
            return response()->json([
                'message' => 'The new appointment time must be in the future.',
            ], 422);
        }

        $updatedAppointment = DB::transaction(function () use ($appointment, $newDate, $newTime) {
            $lockedAppointment = Appointment::whereKey($appointment->id)
                ->lockForUpdate()
                ->firstOrFail();

            $currentStatus = $lockedAppointment->status;

            if (
                !in_array($currentStatus, [
                    AppointmentStatus::PENDING,
                    AppointmentStatus::ACCEPTED,
                ], true)
            ) {
                throw ValidationException::withMessages([
                    'appointment' => 'This appointment can no longer be rescheduled.',
                ]);
            }

            $conflict = Appointment::where('doctor_id', $lockedAppointment->doctor_id)
                ->whereDate('date', $newDate)
                ->where('time', $newTime)
                ->where('id', '!=', $lockedAppointment->id)
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

            $lockedAppointment->date = $newDate;
            $lockedAppointment->time = $newTime;
            $lockedAppointment->status = AppointmentStatus::PENDING;
            $lockedAppointment->accepted_at = null;
            $lockedAppointment->save();

            return $lockedAppointment->fresh()->load([
                'patient',
                'doctor.user',
                'hospital',
            ]);
        });

        return response()->json([
            'message' => 'Appointment rescheduled successfully. The doctor must review the new time.',
            'appointment' => $updatedAppointment,
        ]);
    }


    // View doctor's appointments
    public function doctorAppointments(Request $request)
    {
        $doctor = Doctor::where('user_id', Auth::id())->firstOrFail();

        $query = Appointment::where('doctor_id', $doctor->id)
            ->with(['patient']);

        if ($request->has('date')) {
            $query->where('date', $request->date);
        }


        $appointments = $query->orderBy('time', 'asc')->get();

        return AppointmentResource::collection($appointments);
    }
}