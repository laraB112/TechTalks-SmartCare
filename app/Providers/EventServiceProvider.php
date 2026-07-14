<?php

namespace App\Providers;

use App\Events\AppointmentStatusUpdated;
use App\Listeners\SendAppointmentStatusNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        AppointmentStatusUpdated::class => [
            SendAppointmentStatusNotification::class,
        ],
    ];

    public function boot(): void
    {
    }
}