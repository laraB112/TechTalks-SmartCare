<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'status' => $this->status->value,
            'status_label' => $this->status->label(),

            'appointment_date' => $this->date?->toDateString(),
            'time_slot' => $this->time,

            'notes' => $this->notes,

            'doctor' => [
                'id' => $this->doctor?->id,
                'name' => $this->doctor?->user?->name,
            ],

            'patient' => [
                'id' => $this->patient?->id,
                'name' => $this->patient?->name,
                'phone' => $this->patient?->phone,   
                'age' => $this->patient?->age,       
                'gender' => $this->patient?->gender, 
            ],

            'rejection_reason' => $this->rejection_reason,
            'consultation_notes' => $this->consultation_notes,
            'cancellation_reason' => $this->cancellation_reason,

            'accepted_at' => $this->accepted_at?->toDateTimeString(),
            'rejected_at' => $this->rejected_at?->toDateTimeString(),
            'started_at' => $this->started_at?->toDateTimeString(),
            'completed_at' => $this->completed_at?->toDateTimeString(),
            'cancelled_at' => $this->cancelled_at?->toDateTimeString(),

            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
        ];
    }
}