<?php

namespace App\Listeners;

use App\Events\AppointmentStatusUpdated;

class SendAppointmentStatusNotification
{
    public function handle(AppointmentStatusUpdated $event): void
    {
    }
}