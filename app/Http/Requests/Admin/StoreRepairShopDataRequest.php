<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreRepairShopDataRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'repair_shop_name' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string'],
            'coordinate' => ['required', 'string'],
            'phone' => ['nullable', 'string'],
            'opening_time' => ['nullable', 'date_format:H:i'],
            'closing_time' => ['nullable', 'date_format:H:i'],
            'is_active' => ['boolean'],
            'description' => ['nullable', 'string'],
        ];
    }

    /**
     * Get the custom messages for validation errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'repair_shop_name.required' => 'The repair shop name is required.',
            'repair_shop_name.string' => 'The repair shop name must be a string.',
            'repair_shop_name.max' => 'The repair shop name may not be greater than 255 characters.',
            'address.required' => 'The address is required.',
            'coordinate.required' => 'The coordinate is required.',
            'opening_time.date_format' => 'The opening time must be in the format HH:MM.',
            'closing_time.date_format' => 'The closing time must be in the format HH:MM.',
            'is_active.boolean' => 'The is active field must be true or false.',
        ];
    }
}
