
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

Route::get('/test', fn () => response()->json([
    'message' => 'API is working!',
]));

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/doctors', [DoctorController::class, 'index']);
Route::get('/doctors/{doctor}', [DoctorController::class, 'show']);
Route::get('/specializations', [SpecializationController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn (Request $request) => $request->user());
    Route::post('/logout', [AuthController::class, 'logout']);

    // Appointments
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::patch(
        '/appointments/{appointment}/reschedule',
        [AppointmentController::class, 'reschedule']
    );

    Route::post(
        '/patient/appointments/{appointment}/hide',
        [AppointmentController::class, 'hide']
    );

    Route::patch(
        '/patient/appointments/{appointment}/cancel',
        [AppointmentCancelController::class, 'cancel']
    );

    // Doctor dashboard
    Route::get('/doctor/appointments', [
        AppointmentController::class,
        'doctorAppointments',
    ]);

    Route::get('/doctor/patients', [DoctorController::class, 'patients']);
    Route::get('/doctor/profile', [DoctorController::class, 'profile']);
    Route::put('/doctor/profile', [DoctorController::class, 'updateProfile']);

    Route::get('/doctors/{doctor}/available-slots', [
        DoctorController::class,
        'availableSlots',
    ]);

    // Doctor appointment status actions
    Route::prefix('doctor/appointments/{appointment}')->group(function () {
        Route::patch('/accept', [AppointmentStatusController::class, 'accept']);
        Route::patch('/reject', [AppointmentStatusController::class, 'reject']);
        Route::patch('/start', [AppointmentStatusController::class, 'start']);
        Route::patch('/complete', [AppointmentStatusController::class, 'complete']);

        // Reschedule request actions
        Route::patch('/reschedule/approve', [
            AppointmentStatusController::class,
            'approveReschedule',
        ]);

        Route::patch('/reschedule/reject', [
            AppointmentStatusController::class,
            'rejectReschedule',
        ]);
    });

    // Admin
    Route::prefix('admin')->group(function () {
        Route::get('/doctors', [AdminController::class, 'getDoctors']);
        Route::get('/doctors/{id}', [AdminController::class, 'getDoctor']);
        Route::post('/doctors', [AdminController::class, 'storeDoctor']);
        Route::put('/doctors/{id}', [AdminController::class, 'updateDoctor']);
        Route::delete('/doctors/{id}', [AdminController::class, 'deleteDoctor']);

        Route::get('/patients', [AdminController::class, 'getPatients']);
        Route::get('/patients/{id}', [AdminController::class, 'getPatient']);
        Route::get('/patients/{id}/appointments', [
            AdminController::class,
            'getPatientAppointments',
        ]);

        Route::get('/appointments', [AdminController::class, 'getAppointments']);
        Route::get('/profile', [AdminController::class, 'getProfile']);
        Route::put('/profile', [AdminController::class, 'updateProfile']);
    });

    // Existing doctor management routes
    Route::post('/doctors', [DoctorController::class, 'store']);
    Route::put('/doctors/{doctor}', [DoctorController::class, 'update']);
    Route::patch('/doctors/{doctor}', [DoctorController::class, 'update']);
    Route::delete('/doctors/{doctor}', [DoctorController::class, 'destroy']);
});
