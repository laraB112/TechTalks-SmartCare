<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

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

Route::get('doctors', [DoctorController::class, 'index']);
Route::get('doctors/{doctor}', [DoctorController::class, 'show']);

Route::get('specializations', [SpecializationController::class, 'index']);

Route::post('/appointments', [AppointmentController::class, 'store'])->middleware('auth:sanctum');
Route::get('/appointments', [AppointmentController::class, 'index'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {

    Route::post('doctors', [DoctorController::class, 'store']);
    Route::put('doctors/{doctor}', [DoctorController::class, 'update']);
    Route::patch('doctors/{doctor}', [DoctorController::class, 'update']);
    Route::delete('doctors/{doctor}', [DoctorController::class, 'destroy']);
});