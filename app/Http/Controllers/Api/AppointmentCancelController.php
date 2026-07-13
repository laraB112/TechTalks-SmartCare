<?php

namespace App\Http\Controllers\Api;

use App\Enums\AppointmentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\CancelAppointmentRequest;
use App\Http\Resources\AppointmentResource;
use App\Models\Appointment;
use Illuminate\Http\JsonResponse;

class AppointmentCancelController extends Controller
{
    public function cancel(CancelAppointmentRequest $request, Appointment $appointment): JsonResponse
    {
        $this->authorize('cancel', $appointment);

        if (! in_array($appointment->status, [AppointmentStatus::PENDING, AppointmentStatus::ACCEPTED], true)) {
            abort(409, "This appointment is currently '{$appointment->status->label()}' and can no longer be cancelled.");
        }

        $appointment->transitionTo(
            AppointmentStatus::CANCELLED,
            $request->user(),
            $request->validated('cancellation_reason')
        );

        return response()->json([
            'message' => 'Appointment cancelled successfully.',
            'data' => new AppointmentResource(
                $appointment->fresh(['doctor.user', 'patient'])
            ),
        ]);
    }
}