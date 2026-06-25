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

Route::post('/appointments', [AppointmentController::class, 'store'])->middleware('auth:sanctum');
Route::get('/appointments', [AppointmentController::class, 'index'])->middleware('auth:sanctum');