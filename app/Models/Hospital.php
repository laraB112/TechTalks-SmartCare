<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hospital extends Model
{
    protected $fillable = [
        'name',
        'location',
    ];

    public function doctors()
    {
        return $this->hasMany(Doctor::class);
    }
}