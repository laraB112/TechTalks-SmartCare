<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AppointmentResource;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Doctor;


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
    public function index()
    {
        $appointments = Appointment::where('patient_id', Auth::id())
            ->with(['doctor.user', 'hospital'])
            ->orderBy('date', 'asc')
            ->get();

        return response()->json($appointments);
    }

    // ✅ View doctor's appointments
    public function doctorAppointments(Request $request)
{
    $doctor = Doctor::where('user_id', Auth::id())->firstOrFail();

    $query = Appointment::where('doctor_id', $doctor->id)
        ->with(['patient']);

    // ✅ If date is provided, filter by date
    if ($request->has('date')) {
        $query->where('date', $request->date);
    }
    // ✅ If no date provided, return ALL appointments
    // (no additional filter)

    $appointments = $query->orderBy('time', 'asc')->get();

    return AppointmentResource::collection($appointments);
}
}