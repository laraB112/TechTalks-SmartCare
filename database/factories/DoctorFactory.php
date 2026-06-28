<?php

namespace Database\Factories;

use App\Models\Specialization;
use Illuminate\Database\Eloquent\Factories\Factory;

class DoctorFactory extends Factory
{
    public function definition(): array
    {
        $specialization = Specialization::query()->inRandomOrder()->first();

        return [
            'name' => 'Dr. ' . fake()->name(),
            'email' => fake()->unique()->safeEmail(),

            'phone' => fake()->numerify('+961 ## ### ###'),

            'specialization_id' => $specialization?->id,

            'qualification' => fake()->randomElement([
                'MBBS',
                'MD',
                'MBBS, MD',
                'MBBS, MS',
                'DO',
                'PhD, MD'
            ]),

            'experience_years' => fake()->numberBetween(1, 40),

            'gender' => fake()->randomElement(['male', 'female']),

            'city' => fake()->city(),
            'address' => fake()->streetAddress(),

            'consultation_fee' => fake()->randomFloat(2, 25, 250),

            'bio' => 'Experienced specialist in medical care. ' . fake()->paragraph(2),

            'is_available' => fake()->boolean(85),
        ];
    }
}