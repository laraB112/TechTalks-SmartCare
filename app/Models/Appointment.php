<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $fillable = [
        'patient_id',
        'doctor_id',
        'hospital_id',
        'specialization',
        'date',
        'time',
        'notes',
        'status',
        'checked_in_at',
    ];

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    public function hospital()
    {
        return $this->belongsTo(Hospital::class);
    }

    public function getQueuePositionAttribute()
    {
        return Appointment::where('doctor_id', $this->doctor_id)
            ->where('date', $this->date)
            ->where('status', '!=', 'rejected')
            ->where('status', '!=', 'done')
            ->where('time', '<=', $this->time)
            ->count();
    }
}