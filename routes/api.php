<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\SpecializationController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\AppointmentStatusController;
use App\Http\Controllers\Api\AppointmentCancelController;
use App\Http\Controllers\Api\AdminController;

// ================================================
// Public Routes (No Authentication)
// ================================================
Route::get('/test', function () {
    return response()->json(['message' => 'API is working!']);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Doctors (Public)
Route::get('doctors', [DoctorController::class, 'index']);
Route::get('doctors/{doctor}', [DoctorController::class, 'show']);

// Specializations (Public)
Route::get('specializations', [SpecializationController::class, 'index']);

// ================================================
// Protected Routes (Require Authentication)
// ================================================
Route::middleware('auth:sanctum')->group(function () {

    // User
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // ================================================
    // Appointments
    // ================================================
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::get('/appointments', [AppointmentController::class, 'index']);

    // ================================================
    // Doctor Routes
    // ================================================
    Route::get('/doctor/appointments', [AppointmentController::class, 'doctorAppointments']);
    Route::get('/doctor/patients', [DoctorController::class, 'patients']);
    Route::get('/doctor/profile', [DoctorController::class, 'profile']);
    Route::put('/doctor/profile', [DoctorController::class, 'updateProfile']);
    Route::get('/doctors/{doctor}/available-slots', [DoctorController::class, 'availableSlots']);

    // Doctor Status Management
    Route::prefix('doctor')->group(function () {
        Route::patch('/appointments/{appointment}/accept', [AppointmentStatusController::class, 'accept']);
        Route::patch('/appointments/{appointment}/reject', [AppointmentStatusController::class, 'reject']);
        Route::patch('/appointments/{appointment}/start', [AppointmentStatusController::class, 'start']);
        Route::patch('/appointments/{appointment}/complete', [AppointmentStatusController::class, 'complete']);
    });

    // Patient Routes
    Route::prefix('patient')->group(function () {
        Route::patch('/appointments/{appointment}/cancel', [AppointmentCancelController::class, 'cancel']);
    });

    // ================================================
    // ADMIN ROUTES 
    // ================================================
    Route::prefix('admin')->group(function () {
        // Doctors
        Route::get('/doctors', [AdminController::class, 'getDoctors']);
        Route::get('/doctors/{id}', [AdminController::class, 'getDoctor']);
        Route::post('/doctors', [AdminController::class, 'storeDoctor']);
        Route::put('/doctors/{id}', [AdminController::class, 'updateDoctor']);
        Route::delete('/doctors/{id}', [AdminController::class, 'deleteDoctor']);

        // Patients
        Route::get('/patients', [AdminController::class, 'getPatients']);
        Route::get('/patients/{id}', [AdminController::class, 'getPatient']);
        Route::get('/patients/{id}/appointments', [AdminController::class, 'getPatientAppointments']);

        // Appointments
        Route::get('/appointments', [AdminController::class, 'getAppointments']);

        //  PROFILE ROUTES
        Route::get('/profile', [AdminController::class, 'getProfile']);
        Route::put('/profile', [AdminController::class, 'updateProfile']);
    });

    // ================================================
    // Doctor Management (Admin only - protected by policy)
    // ================================================
    Route::post('doctors', [DoctorController::class, 'store']);
    Route::put('doctors/{doctor}', [DoctorController::class, 'update']);
    Route::patch('doctors/{doctor}', [DoctorController::class, 'update']);
    Route::delete('doctors/{doctor}', [DoctorController::class, 'destroy']);
});