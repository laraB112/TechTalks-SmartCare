<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment; 
use App\Http\Requests\StoreDoctorRequest;
use App\Http\Requests\UpdateDoctorRequest;
use App\Http\Resources\DoctorResource;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class DoctorController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:150'],
            'specialization_id' => ['nullable', 'integer'],
            'specialization_slug' => ['nullable', 'string'],
            'city' => ['nullable', 'string', 'max:100'],
            'gender' => ['nullable', 'in:male,female,other'],
            'min_experience' => ['nullable', 'integer', 'min:0'],
            'max_fee' => ['nullable', 'numeric', 'min:0'],
            'is_available' => ['nullable', 'boolean'],
            'sort_by' => ['nullable', 'in:experience_years,consultation_fee'],
            'sort_dir' => ['nullable', 'in:asc,desc'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $sortDir = $validated['sort_dir'] ?? 'desc';
        $perPage = $validated['per_page'] ?? 15;

        $allowedSorts = [
            'experience_years',
            'consultation_fee',
        ];

        $sortBy = $validated['sort_by'] ?? 'experience_years';
        $sortBy = in_array($sortBy, $allowedSorts) ? $sortBy : 'experience_years';

        $query = Doctor::query()
            ->with(['user', 'specialization']);  // ← Added 'user' relationship

        // ✅ SEARCH: Search by name, specialty, or experience
        if (!empty($validated['search'])) {
            $search = $validated['search'];
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%");
                })->orWhereHas('specialization', function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%");
                })->orWhere('experience_years', 'LIKE', "%{$search}%");
            });
        }

        // ✅ FILTER: Apply other filters
        if (!empty($validated['specialization_id'])) {
            $query->where('specialization_id', $validated['specialization_id']);
        }

        if (!empty($validated['specialization_slug'])) {
            $query->whereHas('specialization', function ($q) use ($validated) {
                $q->where('slug', $validated['specialization_slug']);
            });
        }

        if (!empty($validated['min_experience'])) {
            $query->where('experience_years', '>=', $validated['min_experience']);
        }

        if (!empty($validated['max_fee'])) {
            $query->where('consultation_fee', '<=', $validated['max_fee']);
        }

        if (!empty($validated['gender'])) {
            $query->whereHas('user', function ($q) use ($validated) {
                $q->where('gender', $validated['gender']);
            });
        }

        if (!empty($validated['city'])) {
            $query->whereHas('user', function ($q) use ($validated) {
                $q->where('city', 'LIKE', "%{$validated['city']}%");
            });
        }

        if ($request->has('is_available')) {
            $query->where('is_available', $validated['is_available']);
        } else {
            $query->where('is_available', true);
        }

        $doctors = $query
            ->orderBy($sortBy, $sortDir)
            ->paginate($perPage)
            ->withQueryString();

        return DoctorResource::collection($doctors)
            ->additional([
                'meta' => [
                    'current_page' => $doctors->currentPage(),
                    'last_page' => $doctors->lastPage(),
                    'total' => $doctors->total(),
                ],
            ]);
    }

    public function show(Doctor $doctor): DoctorResource
    {
        return new DoctorResource(
            $doctor->load(['user', 'specialization'])
        );
    }

    public function store(StoreDoctorRequest $request): DoctorResource
    {
        $data = $request->validated();

        $doctor = Doctor::create($data);

        return new DoctorResource($doctor->load(['user', 'specialization']));
    }

    public function update(UpdateDoctorRequest $request, Doctor $doctor): DoctorResource
    {
        $data = $request->validated();

        $doctor->update($data);

        return new DoctorResource($doctor->load(['user', 'specialization']));
    }

    public function destroy(Doctor $doctor): Response
    {
        $doctor->delete();

        return response()->noContent();
    }
    public function availableSlots(Request $request, Doctor $doctor)
{
    $request->validate([
        'date' => 'required|date|after_or_equal:today',
    ]);

    $date = $request->date;

    // ✅ Define all possible time slots (e.g., 9 AM to 5 PM, hourly)
    $allSlots = [
        '09:00', '10:00', '11:00', '12:00', 
        '13:00', '14:00', '15:00', '16:00', '17:00'
    ];

    // ✅ Get booked appointments for this doctor on this date
    $bookedSlots = Appointment::where('doctor_id', $doctor->id)
        ->where('date', $date)
        ->whereIn('status', ['pending', 'confirmed', 'in_progress'])
        ->pluck('time')
        ->map(function ($time) {
            return substr($time, 0, 5); // Format: 'HH:MM'
        })
        ->toArray();

    // ✅ Filter out booked slots
    $availableSlots = array_diff($allSlots, $bookedSlots);

    return response()->json([
        'date' => $date,
        'available_slots' => array_values($availableSlots),
        'booked_slots' => $bookedSlots,
        'all_slots' => $allSlots,
    ]);
}
}