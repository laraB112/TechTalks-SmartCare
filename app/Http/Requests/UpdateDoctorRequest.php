<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDoctorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $doctorId = $this->route('doctor')?->id;

        return [
            'name' => ['sometimes', 'required', 'string', 'max:150'],

            'email' => [
                'sometimes',
                'required',
                'email',
                'max:150',
                Rule::unique('doctors', 'email')->ignore($doctorId),
            ],

            'phone' => [
                'sometimes',
                'nullable',
                'regex:/^(?:\+961|961|0)?(3|70|71|76|78|79|81)\d{6}$/',
            ],

            'specialization_id' => [
                'sometimes',
                'nullable',
                'integer',
                Rule::exists('specializations', 'id'),
            ],

            'qualification' => [
                'sometimes',
                'nullable',
                'string',
                'max:150',
            ],

            'experience_years' => [
                'sometimes',
                'nullable',
                'integer',
                'min:0',
                'max:80',
            ],

            'gender' => [
                'sometimes',
                'nullable',
                Rule::in(['male', 'female']),
            ],

            'city' => [
                'sometimes',
                'nullable',
                'string',
                'max:100',
            ],

            'address' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
            ],

            'consultation_fee' => [
                'sometimes',
                'nullable',
                'numeric',
                'min:0',
            ],

            'bio' => [
                'sometimes',
                'nullable',
                'string',
                'max:2000',
            ],

            'is_available' => [
                'sometimes',
                'nullable',
                'boolean',
            ],
        ];
    }
}