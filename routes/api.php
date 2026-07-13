<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\AppointmentStatusController;
use App\Http\Controllers\Api\AppointmentCancelController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/test', function () {
    return response()->json(['message' => 'API is working!']);
});
use App\Http\Controllers\Api\AppointmentController;

Route::post('/appointments', [AppointmentController::class, 'store'])->middleware('auth:sanctum');
Route::get('/appointments', [AppointmentController::class, 'index'])->middleware('auth:sanctum');
Route::get('/doctors', [DoctorController::class, 'index']);


Route::middleware(['auth:sanctum'])->group(function () {

    Route::prefix('doctor')->group(function () {
        Route::patch('/appointments/{appointment}/accept', [AppointmentStatusController::class, 'accept']);
        Route::patch('/appointments/{appointment}/reject', [AppointmentStatusController::class, 'reject']);
        Route::patch('/appointments/{appointment}/start', [AppointmentStatusController::class, 'start']);
        Route::patch('/appointments/{appointment}/complete', [AppointmentStatusController::class, 'complete']);
    });

    Route::prefix('patient')->group(function () {
        Route::patch('/appointments/{appointment}/cancel', [AppointmentCancelController::class, 'cancel']);
    });

});