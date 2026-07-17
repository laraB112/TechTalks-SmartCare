<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AppointmentCancelController extends Controller
{
    public function cancel(Request $request, $id)
    {
        try {
            $appointment = Appointment::where('patient_id', Auth::id())
                ->findOrFail($id);

            //Check if appointment can be cancelled
            $allowedStatuses = ['pending', 'accepted', 'waiting'];
            if (!in_array(strtolower($appointment->status), $allowedStatuses)) {
                return response()->json([
                    'message' => 'This appointment cannot be cancelled because it is already ' . $appointment->status
                ], 400);
            }

            // Check if appointment is in the future
            if ($appointment->date < now()->toDateString()) {
                return response()->json([
                    'message' => 'Cannot cancel past appointments'
                ], 400);
            }

            $appointment->status = 'cancelled';
            $appointment->cancelled_at = now();
            $appointment->cancelled_by = Auth::id();
            $appointment->cancellation_reason = $request->reason ?? 'Cancelled by patient';

            $appointment->save();

            return response()->json([
                'message' => 'Appointment cancelled successfully',
                'appointment' => $appointment
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error cancelling appointment',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}