<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class SpecializationFactory extends Factory
{
    public function definition(): array
    {
        $specializations = [
            [
                'name' => 'Cardiology',
                'description' => 'Diagnosis and treatment of heart and blood vessel diseases.',
            ],
            [
                'name' => 'Dermatology',
                'description' => 'Diagnosis and treatment of skin, hair, and nail conditions.',
            ],
            [
                'name' => 'Pediatrics',
                'description' => 'Medical care for infants, children, and adolescents.',
            ],
            [
                'name' => 'Neurology',
                'description' => 'Diagnosis and treatment of disorders of the nervous system.',
            ],
            [
                'name' => 'Orthopedics',
                'description' => 'Treatment of bones, joints, muscles, and ligaments.',
            ],
            [
                'name' => 'Psychiatry',
                'description' => 'Diagnosis and treatment of mental health disorders.',
            ],
            [
                'name' => 'Ophthalmology',
                'description' => 'Medical and surgical care of the eyes.',
            ],
            [
                'name' => 'Dentistry',
                'description' => 'Diagnosis and treatment of teeth and oral health conditions.',
            ],
            [
                'name' => 'General Medicine',
                'description' => 'General healthcare and diagnosis of common illnesses.',
            ],
            [
                'name' => 'Gynecology',
                'description' => 'Healthcare related to the female reproductive system.',
            ],
            [
                'name' => 'ENT',
                'description' => 'Treatment of ear, nose, and throat disorders.',
            ],
            [
                'name' => 'Urology',
                'description' => 'Diagnosis and treatment of urinary tract and male reproductive conditions.',
            ],
        ];

        $specialization = fake()->unique()->randomElement($specializations);

        return [
            'name' => $specialization['name'],
            'slug' => Str::slug($specialization['name']),
            'description' => $specialization['description'],
        ];
    }
}