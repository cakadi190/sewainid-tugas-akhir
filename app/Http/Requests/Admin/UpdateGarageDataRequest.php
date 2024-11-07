<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * UpdateGarageDataRequest digunakan untuk validasi data saat mengupdate data garasi.
 */
class UpdateGarageDataRequest extends FormRequest
{
    /**
     * Menentukan apakah pengguna diizinkan untuk membuat permintaan ini.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Mendapatkan aturan validasi yang berlaku untuk permintaan ini.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        if ($this->has('restore') && $this->boolean('restore')) {
            return [
                'restore' => 'required',
            ];
        }

        return [
            'garage_name' => [
                "required", "string", "max:255",
                Rule::unique('garage_data')->ignore($this->route('garage_datum')),
            ],
            'address' => 'required|string|max:255',
            'coordinate' => 'required|string|max:100',
            'capacity' => 'required|integer|min:0',
            'phone' => 'nullable|string|max:15',
            'opening_time' => 'nullable|date_format:H:i',
            'closing_time' => 'nullable|date_format:H:i',
            'is_active' => 'boolean',
            'description' => 'nullable|string|max:1000',
        ];
    }

    /**
     * Mendapatkan pesan kustom untuk kesalahan validasi.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'garage_name.required' => 'Nama garasi wajib diisi.',
            'garage_name.unique' => 'Nama garasi ini sudah terdaftar.',
            'address.required' => 'Alamat wajib diisi.',
            'coordinate.required' => 'Koordinat wajib diisi.',
            'capacity.required' => 'Kapasitas wajib diisi.',
            'capacity.min' => 'Kapasitas tidak boleh kurang dari 0.',
            'phone.max' => 'Nomor telepon tidak boleh lebih dari 15 karakter.',
            'opening_time.date_format' => 'Format waktu pembukaan tidak valid. Gunakan format HH:mm.',
            'closing_time.date_format' => 'Format waktu penutupan tidak valid. Gunakan format HH:mm.',
            'is_active.boolean' => 'Status aktif harus berupa boolean.',
            'description.max' => 'Deskripsi tidak boleh lebih dari 1000 karakter.',
        ];
    }
}
