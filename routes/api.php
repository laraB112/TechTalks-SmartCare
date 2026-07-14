<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\SpecializationController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\AppointmentStatusController;
use App\Http\Controllers\Api\AppointmentCancelController;

// Public routes (no authentication needed)
Route::get('/test', function () {
    return response()->json(['message' => 'API is working!']);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ================================================
// Doctors (Public - anyone can view)
// ================================================
Route::get('doctors', [DoctorController::class, 'index']);
Route::get('doctors/{doctor}', [DoctorController::class, 'show']);

// ================================================
// Specializations (Public)
// ================================================
Route::get('specializations', [SpecializationController::class, 'index']);

// ================================================
// Protected Routes (Require Authentication)
// ================================================
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/doctors/{doctor}/available-slots', [DoctorController::class, 'availableSlots']);

    // User
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // ================================================
    // Appointments (Patient & Doctor)
    // ================================================
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::get('/appointments', [AppointmentController::class, 'index']);

    // ================================================
    // Doctor Routes (Status Management)
    // ================================================
    Route::prefix('doctor')->group(function () {
        Route::patch('/appointments/{appointment}/accept', [AppointmentStatusController::class, 'accept']);
        Route::patch('/appointments/{appointment}/reject', [AppointmentStatusController::class, 'reject']);
        Route::patch('/appointments/{appointment}/start', [AppointmentStatusController::class, 'start']);
        Route::patch('/appointments/{appointment}/complete', [AppointmentStatusController::class, 'complete']);
    });

    // ================================================
    // Patient Routes
    // ================================================
    Route::prefix('patient')->group(function () {
        Route::patch('/appointments/{appointment}/cancel', [AppointmentCancelController::class, 'cancel']);
    });

    // ================================================
    // Doctor Management (Admin only - protected by policy)
    // ================================================
    Route::post('doctors', [DoctorController::class, 'store']);
    Route::put('doctors/{doctor}', [DoctorController::class, 'update']);
    Route::patch('doctors/{doctor}', [DoctorController::class, 'update']);
    Route::delete('doctors/{doctor}', [DoctorController::class, 'destroy']);

});