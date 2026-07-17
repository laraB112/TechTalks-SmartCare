<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use App\Models\User;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    // ================================================
    // DOCTOR MANAGEMENT
    // ================================================

    public function getDoctors(Request $request)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $doctors = Doctor::with(['user', 'specialization'])->get();

        return response()->json([
            'data' => $doctors->map(function ($doctor) {
                return [
                    'id' => $doctor->id,
                    'name' => $doctor->user->name ?? 'Unknown',
                    'email' => $doctor->user->email ?? '',
                    'specialization_id' => $doctor->specialization_id,
                    'specialty' => $doctor->specialization->name ?? 'General',
                    'experience' => $doctor->experience_years ?? 0,
                    'phone' => $doctor->user->phone ?? '',
                    'isAvailable' => $doctor->is_available ?? true,
                    'age' => $doctor->user->age ?? null,
                ];
            })
        ]);
    }

    public function getDoctor($id)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $doctor = Doctor::with(['user', 'specialization'])->findOrFail($id);

        return response()->json([
            'data' => [
                'id' => $doctor->id,
                'name' => $doctor->user->name ?? 'Unknown',
                'email' => $doctor->user->email ?? '',
                'specialization_id' => $doctor->specialization_id,
                'specialty' => $doctor->specialization->name ?? 'General',
                'experience' => $doctor->experience_years ?? 0,
                'phone' => $doctor->user->phone ?? '',
                'isAvailable' => $doctor->is_available ?? true,
                'age' => $doctor->user->age ?? null,
            ]
        ]);
    }

    public function storeDoctor(Request $request)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'specialization_id' => 'required|exists:specializations,id',
            'experience' => 'required|integer|min:0',
            'phone' => 'required|string|max:20',
            'isAvailable' => 'boolean',
            'age' => 'nullable|integer|min:1|max:150',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'age' => $validated['age'] ?? null,
            'phone' => $validated['phone'],
            'password' => bcrypt('password123'),
            'role' => 'doctor',
        ]);

        $doctor = Doctor::create([
            'user_id' => $user->id,
            'specialization_id' => $validated['specialization_id'],
            'experience_years' => $validated['experience'] ?? 0,
            'is_available' => $validated['isAvailable'] ?? true,
        ]);

        return response()->json([
            'message' => 'Doctor created successfully',
            'data' => $doctor
        ], 201);
    }

    public function updateDoctor(Request $request, $id)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $doctor = Doctor::with('user')->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $doctor->user_id,
            'specialization_id' => 'sometimes|exists:specializations,id',
            'experience' => 'sometimes|integer|min:0',
            'phone' => 'sometimes|string|max:20',
            'isAvailable' => 'sometimes|boolean',
        ]);

        if (isset($validated['name']) || isset($validated['email']) || isset($validated['phone'])) {
            $doctor->user->update([
                'name' => $validated['name'] ?? $doctor->user->name,
                'email' => $validated['email'] ?? $doctor->user->email,
                'phone' => $validated['phone'] ?? $doctor->user->phone,
            ]);
        }

        $doctor->update([
            'specialization_id' => $validated['specialization_id'] ?? $doctor->specialization_id,
            'experience_years' => $validated['experience'] ?? $doctor->experience_years,
            'is_available' => $validated['isAvailable'] ?? $doctor->is_available,
        ]);

        return response()->json([
            'message' => 'Doctor updated successfully',
            'data' => $doctor
        ]);
    }
    // Reschedule an appointment
    public function reschedule(Request $request, $id)
    {
        try {
            $appointment = Appointment::where('patient_id', Auth::id())
                ->findOrFail($id);

            // Check if appointment can be rescheduled
            $allowedStatuses = ['pending', 'accepted', 'waiting'];
            if (!in_array(strtolower($appointment->status), $allowedStatuses)) {
                return response()->json([
                    'message' => 'This appointment cannot be rescheduled because it is already ' . $appointment->status
                ], 400);
            }

            // Check if appointment is in the future
            if ($appointment->date < now()->toDateString()) {
                return response()->json([
                    'message' => 'Cannot reschedule past appointments'
                ], 400);
            }

            $validated = $request->validate([
                'date' => 'required|date|after_or_equal:today',
                'time' => 'required',
            ]);

            // Check if the new slot is available
            $existingAppointment = Appointment::where('doctor_id', $appointment->doctor_id)
                ->where('date', $validated['date'])
                ->where('time', $validated['time'])
                ->where('id', '!=', $id)
                ->whereIn('status', ['pending', 'accepted', 'in_progress'])
                ->first();

            if ($existingAppointment) {
                return response()->json([
                    'message' => 'This time slot is already booked. Please choose another time.',
                ], 409);
            }

            // Update the appointment
            $appointment->date = $validated['date'];
            $appointment->time = $validated['time'];
            $appointment->status = 'pending'; // Reset to pending after reschedule
            $appointment->save();

            return response()->json([
                'message' => 'Appointment rescheduled successfully',
                'appointment' => $appointment
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error rescheduling appointment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteDoctor($id)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $doctor = Doctor::findOrFail($id);
        $user = User::find($doctor->user_id);

        if ($user) {
            $user->delete();
        }
        $doctor->delete();

        return response()->json(['message' => 'Doctor deleted successfully']);
    }

    // ================================================
    // PATIENT MANAGEMENT
    // ================================================

    public function getPatients(Request $request)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $patients = User::where('role', 'patient')->get();

        return response()->json([
            'data' => $patients->map(function ($patient) {
                return [
                    'id' => $patient->id,
                    'name' => $patient->name,
                    'email' => $patient->email,
                    'phone' => $patient->phone ?? 'N/A',
                    'age' => $patient->age ?? 0,
                    'gender' => $patient->gender ?? 'Not specified',
                    'appointments_count' => Appointment::where('patient_id', $patient->id)->count(),
                    'last_visit' => Appointment::where('patient_id', $patient->id)
                        ->where('status', 'completed')
                        ->latest('date')
                        ->first()
                            ?->date,
                ];
            })
        ]);
    }

    public function getPatient($id)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $patient = User::where('role', 'patient')->findOrFail($id);

        return response()->json([
            'data' => [
                'id' => $patient->id,
                'name' => $patient->name,
                'email' => $patient->email,
                'phone' => $patient->phone ?? 'N/A',
                'age' => $patient->age ?? 0,
                'gender' => $patient->gender ?? 'Not specified',
                'city' => $patient->city ?? null,
                'address' => $patient->address ?? null,
                'appointments_count' => Appointment::where('patient_id', $patient->id)->count(),
                'last_visit' => Appointment::where('patient_id', $patient->id)
                    ->where('status', 'completed')
                    ->latest('date')
                    ->first()
                        ?->date,
                'created_at' => $patient->created_at,
            ]
        ]);
    }

    public function getPatientAppointments($id)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $appointments = Appointment::where('patient_id', $id)
            ->with(['doctor.user', 'doctor.specialization'])
            ->orderBy('date', 'desc')
            ->get();

        return response()->json([
            'data' => $appointments->map(function ($appointment) {
                return [
                    'id' => $appointment->id,
                    'doctor_name' => $appointment->doctor->user->name ?? 'Unknown',
                    'specialty' => $appointment->doctor->specialization->name ?? 'General',
                    'date' => $appointment->date,
                    'time' => $appointment->time,
                    'status' => $appointment->status,
                ];
            })
        ]);
    }

    // ================================================
    // APPOINTMENT MANAGEMENT
    // ================================================

    public function getAppointments(Request $request)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = Appointment::with(['patient', 'doctor.user', 'doctor.specialization']);

        if ($request->has('date') && $request->date) {
            $query->where('date', $request->date);
        }

        $appointments = $query->orderBy('date', 'desc')->get();

        return response()->json([
            'data' => $appointments->map(function ($appointment) {
                return [
                    'id' => $appointment->id,
                    'patient_name' => $appointment->patient->name ?? 'Unknown',
                    'doctor_name' => $appointment->doctor->user->name ?? 'Unknown',
                    'specialty' => $appointment->doctor->specialization->name ?? 'General',
                    'date' => $appointment->date instanceof \DateTime
                        ? $appointment->date->format('Y-m-d')
                        : $appointment->date,
                    'time' => $appointment->time,
                    'status' => $appointment->status,
                    'created_at' => $appointment->created_at,
                ];
            })
        ]);
    }

    // ================================================
    // PROFILE MANAGEMENT
    // ================================================

    // Get admin profile
    public function getProfile(Request $request)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $admin = Auth::user();

        return response()->json([
            'data' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'phone' => $admin->phone ?? '',
                'gender' => $admin->gender ?? '',
                'age' => $admin->age ?? 0,
                'role' => $admin->role,
                'city' => $admin->city ?? '',
                'address' => $admin->address ?? '',
                'created_at' => $admin->created_at,
            ]
        ]);
    }

    // Update admin profile
    public function updateProfile(Request $request)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $admin = Auth::user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20',
            'city' => 'sometimes|string|max:100',
            'address' => 'sometimes|string|max:255',
        ]);

        $admin->update($validated);

        return $this->getProfile($request);
    }
}