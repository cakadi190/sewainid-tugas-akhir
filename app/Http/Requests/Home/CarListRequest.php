<?php

namespace App\Http\Requests\Home;

use Illuminate\Foundation\Http\FormRequest;

class CarListRequest extends FormRequest
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
    public function rules()
    {
        return [
            'brand' => 'nullable|string',
            'model' => 'nullable|string',
            'year_from' => 'nullable|integer',
            'year_to' => 'nullable|integer',
            'fuel_type' => 'nullable|string',
            'transmission' => 'nullable|string',
            'status' => 'nullable|string',
            'condition' => 'nullable|string',
            'price_min' => 'nullable|integer',
            'price_max' => 'nullable|integer',
            'seats' => 'nullable|integer',
            'search' => 'nullable|string',
        ];
    }

    /**
     * Prepare the request data for validation.
     *
     * Converts 'price_min' and 'price_max' to integers if they are present,
     * otherwise sets them to null.
     */
    protected function prepareForValidation()
    {
        $this->merge([
            'price_min' => $this->price_min ? (int) $this->price_min : null,
            'price_max' => $this->price_max ? (int) $this->price_max : null,
        ]);
    }
}
