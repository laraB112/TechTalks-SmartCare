<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AppointmentController extends Controller
{
    // Book an appointment
    public function store(Request $request)
    {
        $validated = $request->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'hospital_id' => 'required|exists:hospitals,id',
            'specialization' => 'required|string',
            'date' => 'required|date|after:today',
            'time' => 'required',
            'notes' => 'nullable|string',
        ]);

        $appointment = Appointment::create([
            'patient_id' => Auth::id(),
            'doctor_id' => $validated['doctor_id'],
            'hospital_id' => $validated['hospital_id'],
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
    public function index()
    {
        $appointments = Appointment::where('patient_id', Auth::id())
            ->with(['doctor.user', 'hospital'])
            ->orderBy('date', 'asc')
            ->get();

        return response()->json($appointments);
    }
}