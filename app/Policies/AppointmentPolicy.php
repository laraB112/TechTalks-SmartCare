<?php

namespace App\Policies;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Models\User;

class AppointmentPolicy
{
    public function view(User $user, Appointment $appointment): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        if (
            $user->role === 'doctor' &&
            $appointment->doctor &&
            $appointment->doctor->user_id === $user->id
        ) {
            return true;
        }

        return $user->role === 'patient'
            && $appointment->patient_id === $user->id;
    }

    public function manageStatus(User $user, Appointment $appointment): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        return $user->role === 'doctor'
            && $appointment->doctor
            && $appointment->doctor->user_id === $user->id;
    }

    public function accept(User $user, Appointment $appointment): bool
    {
        return $this->manageStatus($user, $appointment);
    }

    public function reject(User $user, Appointment $appointment): bool
    {
        return $this->manageStatus($user, $appointment);
    }

    public function start(User $user, Appointment $appointment): bool
    {
        return $this->manageStatus($user, $appointment);
    }

    public function complete(User $user, Appointment $appointment): bool
    {
        return $this->manageStatus($user, $appointment);
    }

    public function cancel(User $user, Appointment $appointment): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        return $user->role === 'patient'
            && $appointment->patient_id === $user->id
            && in_array(
                $appointment->status,
                [
                    AppointmentStatus::PENDING,
                    AppointmentStatus::ACCEPTED,
                ],
                true
            );
    }
}