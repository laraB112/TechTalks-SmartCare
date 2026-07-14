<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class DoctorResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,

            'specialization' => $this->whenLoaded('specialization', fn () => [
                'id' => $this->specialization->id,
                'name' => $this->specialization->name,
                'slug' => $this->specialization->slug,
                'description' => $this->specialization->description,
            ]),

            'qualification' => $this->qualification,
            'experience_years' => $this->experience_years,
            'gender' => $this->gender,
            'city' => $this->city,
            'address' => $this->address,

            'consultation_fee' => $this->consultation_fee !== null
                ? (float) $this->consultation_fee
                : null,

            'bio' => $this->bio,

            'is_available' => $this->is_available,

            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}