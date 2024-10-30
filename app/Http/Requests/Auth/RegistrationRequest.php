<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegistrationRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'gender' => 'required|in:male,female',
            'pbirth' => 'required|string|max:255',
            'dbirth' => 'required|date',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => ['required', 'confirmed', \Illuminate\Validation\Rules\Password::defaults()],
            'nik' => 'nullable|string|size:16|unique:users,nik',
            'kk' => 'nullable|string|size:16',
            'sim' => 'nullable|string|max:255',
            'accept_terms_condition' => 'required|boolean',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama wajib diisi.',
            'name.string' => 'Nama harus berupa teks.',
            'name.max' => 'Nama maksimal 255 karakter.',

            'gender.required' => 'Jenis kelamin wajib dipilih.',
            'gender.in' => 'Jenis kelamin harus salah satu dari: male atau female.',

            'pbirth.required' => 'Tempat lahir wajib diisi.',
            'pbirth.string' => 'Tempat lahir harus berupa teks.',
            'pbirth.max' => 'Tempat lahir maksimal 255 karakter.',

            'dbirth.required' => 'Tanggal lahir wajib diisi.',
            'dbirth.date' => 'Tanggal lahir harus berupa tanggal yang valid.',

            'email.required' => 'Email wajib diisi.',
            'email.string' => 'Email harus berupa teks.',
            'email.email' => 'Format email tidak valid.',
            'email.max' => 'Email maksimal 255 karakter.',
            'email.unique' => 'Email sudah digunakan, silakan gunakan email lain.',

            'password.required' => 'Kata sandi wajib diisi.',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok.',

            'nik.size' => 'NIK harus 16 karakter.',
            'nik.unique' => 'NIK sudah digunakan, silakan gunakan NIK lain.',

            'kk.size' => 'Nomor Kartu Keluarga (KK) harus 16 karakter.',

            'sim.max' => 'SIM maksimal 255 karakter.',

            'accept_terms_condition.required' => 'Anda harus menyetujui syarat dan ketentuan.',
            'accept_terms_condition.boolean' => 'Syarat dan ketentuan harus disetujui.',
        ];
    }
}
