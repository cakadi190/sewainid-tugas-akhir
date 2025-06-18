<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:50'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:100',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'gender' => ['nullable', 'string', Rule::in(User::genders()->toArray())],
            'pbirth' => ['nullable', 'string', 'max:60'],
            'dbirth' => ['nullable', 'date'],
            'phone' => ['nullable', 'string', 'max:15'],
            'address' => ['nullable', 'string'],
            'password' => ['nullable', 'string', 'max:255'],
            'avatar' => ['nullable', 'string', 'max:255'],
            'nik' => ['nullable', 'string', 'max:128', Rule::unique(User::class)->ignore($this->user()->id)],
            'kk' => ['nullable', 'string', 'max:128', Rule::unique(User::class)->ignore($this->user()->id)],
            'sim' => ['nullable', 'string', 'max:128'],
            'google_id' => ['nullable', 'string', 'max:32'],
        ];
    }
}

