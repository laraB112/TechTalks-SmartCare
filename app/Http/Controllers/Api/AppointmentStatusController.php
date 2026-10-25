<?php

namespace App\Http\Controllers\Api;

use App\Enums\AppointmentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\RejectAppointmentRequest;
use App\Http\Resources\AppointmentResource;
use App\Models\Appointment;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AppointmentStatusController extends Controller
{
    use AuthorizesRequests;

    public function accept(Request $request, Appointment $appointment): JsonResponse
    {
        $this->authorize('accept', $appointment);

        $this->guardCurrentStatus($appointment, AppointmentStatus::PENDING);

        $appointment->transitionTo(
            AppointmentStatus::ACCEPTED,
            $request->user()
        );

        return $this->respond($appointment, 'Appointment accepted.');
    }

    public function reject(
        RejectAppointmentRequest $request,
        Appointment $appointment
    ): JsonResponse {
        $this->authorize('reject', $appointment);

        $this->guardCurrentStatus($appointment, AppointmentStatus::PENDING);

        $appointment->transitionTo(
            AppointmentStatus::REJECTED,
            $request->user(),
            $request->validated('reason')
        );

        return $this->respond($appointment, 'Appointment rejected.');
    }

    public function start(Request $request, Appointment $appointment): JsonResponse
    {
        $this->authorize('start', $appointment);

        $this->guardCurrentStatus($appointment, AppointmentStatus::ACCEPTED);

        $appointment->transitionTo(
            AppointmentStatus::IN_PROGRESS,
            $request->user()
        );

        return $this->respond($appointment, 'Consultation started.');
    }

    public function complete(
        Request $request,
        Appointment $appointment
    ): JsonResponse {
        $this->authorize('complete', $appointment);

        $this->guardCurrentStatus($appointment, AppointmentStatus::IN_PROGRESS);

        $validated = $request->validate([
            'consultation_notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $appointment->transitionTo(
            AppointmentStatus::COMPLETED,
            $request->user(),
            $validated['consultation_notes'] ?? null
        );

        return $this->respond($appointment, 'Appointment marked as completed.');
    }

    /**
     * Approve a patient's requested date and time.
     */
    public function approveReschedule(
        Request $request,
        Appointment $appointment
    ): JsonResponse {
        $this->authorize('manageStatus', $appointment);

        $updatedAppointment = DB::transaction(function () use ($appointment, $request) {
            $record = Appointment::whereKey($appointment->id)
                ->lockForUpdate()
                ->firstOrFail();

            if (!$record->requested_date || !$record->requested_time) {
                throw ValidationException::withMessages([
                    'appointment' => 'There is no pending reschedule request.',
                ]);
            }

            if (
                !in_array($record->status, [
                    AppointmentStatus::PENDING,
                    AppointmentStatus::ACCEPTED,
                ], true)
            ) {
                throw ValidationException::withMessages([
                    'appointment' => 'This appointment can no longer be rescheduled.',
                ]);
            }

            $requestedDate = $record->requested_date->toDateString();
            $requestedTime = substr((string) $record->requested_time, 0, 5);

            if (now()->parse("$requestedDate $requestedTime")->isPast()) {
                throw ValidationException::withMessages([
                    'time' => 'The requested time has already passed. Ask the patient to submit another request.',
                ]);
            }

            $conflict = Appointment::where('doctor_id', $record->doctor_id)
                ->whereDate('date', $requestedDate)
                ->whereTime('time', $requestedTime)
                ->where('id', '!=', $record->id)
                ->whereIn('status', [
                    AppointmentStatus::PENDING->value,
                    AppointmentStatus::ACCEPTED->value,
                    AppointmentStatus::IN_PROGRESS->value,
                ])
                ->exists();

            if ($conflict) {
                throw ValidationException::withMessages([
                    'time' => 'The requested slot is no longer available. The original appointment has not been changed.',
                ]);
            }

            // Save the doctor's decision before clearing the request.
            $record->date = $requestedDate;
            $record->time = $requestedTime;

            $record->reschedule_decision = 'approved';
            $record->reschedule_decided_at = now();

            $record->requested_date = null;
            $record->requested_time = null;
            $record->reschedule_requested_at = null;

            $record->save();
            $record->date = $requestedDate;
            $record->time = $requestedTime;
            $record->requested_date = null;
            $record->requested_time = null;
            $record->reschedule_requested_at = null;
            $record->save();

            return $record->fresh()->load(['doctor.user', 'patient']);
        });

        return $this->respond(
            $updatedAppointment,
            'Reschedule request approved. The appointment time has been updated.'
        );
    }

    /**
     * Decline only the reschedule request
     */
    public function rejectReschedule(
        Request $request,
        Appointment $appointment
    ): JsonResponse {
        $this->authorize('manageStatus', $appointment);

        $updatedAppointment = DB::transaction(function () use ($appointment) {
            $record = Appointment::whereKey($appointment->id)
                ->lockForUpdate()
                ->firstOrFail();

            if (!$record->requested_date || !$record->requested_time) {
                throw ValidationException::withMessages([
                    'appointment' => 'There is no pending reschedule request.',
                ]);
            }

            $record->reschedule_decision = 'rejected';
            $record->reschedule_decided_at = now();

            $record->requested_date = null;
            $record->requested_time = null;
            $record->reschedule_requested_at = null;

            $record->save();

            return $record->fresh()->load(['doctor.user', 'patient']);
        });

        return $this->respond(
            $updatedAppointment,
            'Reschedule request declined. The original appointment remains unchanged.'
        );
    }

    private function guardCurrentStatus(
        Appointment $appointment,
        AppointmentStatus $expected
    ): void {
        if ($appointment->status !== $expected) {
            abort(
                409,
                "This appointment is currently '{$appointment->status->label()}' and cannot perform this action."
            );
        }
    }

    private function respond(
        Appointment $appointment,
        string $message
    ): JsonResponse {
        return response()->json([
            'message' => $message,
            'data' => new AppointmentResource(
                $appointment->fresh(['doctor.user', 'patient'])
            ),
        ]);
    }
}
