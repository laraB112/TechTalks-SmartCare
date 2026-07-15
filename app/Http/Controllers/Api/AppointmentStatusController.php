<?php

namespace App\Http\Controllers\Api;

use App\Enums\AppointmentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\RejectAppointmentRequest;
use App\Http\Resources\AppointmentResource;
use App\Models\Appointment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class AppointmentStatusController extends Controller
{
    use AuthorizesRequests;
    public function accept(Request $request, Appointment $appointment): JsonResponse
    {
        $this->authorize('accept', $appointment);

        $this->guardCurrentStatus(
            $appointment,
            AppointmentStatus::PENDING
        );

        $appointment->transitionTo(
            AppointmentStatus::ACCEPTED,
            $request->user()
        );

        return $this->respond(
            $appointment,
            'Appointment accepted.'
        );
    }

    public function reject(
        RejectAppointmentRequest $request,
        Appointment $appointment
    ): JsonResponse {
        $this->authorize('reject', $appointment);

        $this->guardCurrentStatus(
            $appointment,
            AppointmentStatus::PENDING
        );

        $appointment->transitionTo(
            AppointmentStatus::REJECTED,
            $request->user(),
            $request->validated('reason')
        );

        return $this->respond(
            $appointment,
            'Appointment rejected.'
        );
    }

    public function start(
        Request $request,
        Appointment $appointment
    ): JsonResponse {
        $this->authorize('start', $appointment);

        $this->guardCurrentStatus(
            $appointment,
            AppointmentStatus::ACCEPTED
        );

        $appointment->transitionTo(
            AppointmentStatus::IN_PROGRESS,
            $request->user()
        );

        return $this->respond(
            $appointment,
            'Consultation started.'
        );
    }

    public function complete(
        Request $request,
        Appointment $appointment
    ): JsonResponse {
        $this->authorize('complete', $appointment);

        $this->guardCurrentStatus(
            $appointment,
            AppointmentStatus::IN_PROGRESS
        );

        $validated = $request->validate([
            'consultation_notes' => [
                'nullable',
                'string',
                'max:2000',
            ],
        ]);

        $appointment->transitionTo(
            AppointmentStatus::COMPLETED,
            $request->user(),
            $validated['consultation_notes'] ?? null
        );

        return $this->respond(
            $appointment,
            'Appointment marked as completed.'
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
                $appointment->fresh([
                    'doctor.user',
                    'patient',
                ])
            ),
        ]);
    }
}