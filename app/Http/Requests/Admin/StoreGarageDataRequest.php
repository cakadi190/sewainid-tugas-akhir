<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreGarageDataRequest extends FormRequest
{
    /**
     * Tentukan apakah pengguna berwenang untuk membuat permintaan ini.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Dapatkan aturan validasi yang berlaku untuk permintaan ini.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required|string|max:255|unique:garage_data,name',
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
     * Dapatkan pesan error khusus untuk aturan validasi.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'name.required' => 'Nama wajib diisi.',
            'name.unique' => 'Nama ini sudah terdaftar.',
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
