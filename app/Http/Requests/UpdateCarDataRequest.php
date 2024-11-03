<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCarDataRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        \Log::info('Car ID:', [$this->route('car_datum')]);

        if ($this->has('restore') && $this->boolean('restore')) {
            return [
                'restore' => 'required',
            ];
        }

        return [
            'name' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'frame_number' => [
                'required',
                'string',
                'max:255',
                Rule::unique('car_data')->ignore($this->route('car_datum')),
            ],
            'license_plate' => [
                'required',
                'string',
                'max:255',
                Rule::unique('car_data')->ignore($this->route('car_datum')),
            ],
            'color' => 'required|string|max:50',
            'year_of_manufacture' => 'required|integer|digits:4|min:1886', // first cars were made around 1886
            'model' => 'required|in:' . implode(',', \App\Models\CarData::getAllCarModels()->toArray()),
            'status' => 'required|in:' . implode(',', \App\Models\CarData::getAllCarStatuses()->toArray()),
            'description' => 'nullable|string|max:500',
            'gallery.*' => 'file|mimes:jpeg,png|max:10240', // maksimal 10 MB per file
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The name of the car is required.',
            'brand.required' => 'Please specify the car brand, e.g., Toyota, Suzuki.',
            'frame_number.required' => 'The frame number is mandatory.',
            'frame_number.unique' => 'The frame number must be unique. This one is already in use.',
            'license_plate.required' => 'A license plate is required.',
            'license_plate.unique' => 'The license plate must be unique. This one is already in use.',
            'color.required' => 'The color of the car is required.',
            'year_of_manufacture.required' => 'The manufacturing year is required.',
            'year_of_manufacture.digits' => 'The year of manufacture must be a 4-digit number.',
            'year_of_manufacture.min' => 'The year of manufacture must be realistic (e.g., 1886 or later).',
            'model.required' => 'The model of the car is required.',
            'model.in' => 'The selected model is invalid.',
            'status.required' => 'The car status is required.',
            'status.in' => 'The selected status is invalid.',
            'description.max' => 'The description may not exceed 500 characters.',
            'gallery.array' => 'File gambar harus berupa array.',
            'gallery.max' => 'Anda hanya dapat mengunggah maksimal 3 gambar.',
            'gallery.*.mimes' => 'File gambar harus berformat JPEG atau PNG.',
            'gallery.*.max' => 'Ukuran setiap file gambar maksimal 10 MB.',
        ];
    }
}
