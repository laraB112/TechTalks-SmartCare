<?php

namespace Database\Seeders;

use App\Models\Doctor;
use App\Models\Specialization;
use Illuminate\Database\Seeder;

class DoctorSeeder extends Seeder
{
    public function run(): void
    {
        $specializations = Specialization::factory()
            ->count(10)
            ->create();

        Doctor::factory()
            ->count(50)
            ->create([
                'specialization_id' => $specializations->random()->id,
            ]);
    }
}