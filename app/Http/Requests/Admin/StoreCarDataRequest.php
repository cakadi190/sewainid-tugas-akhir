<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Enums\CarModelEnum;
use App\Enums\CarStatusEnum;

class StoreCarDataRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'frame_number' => 'required|string|max:255|unique:car_data,frame_number',
            'license_plate' => 'required|string|max:20|unique:car_data,license_plate',
            'color' => 'required|string|max:50',
            'year_of_manufacture' => 'required|integer|min:1900|max:' . date('Y'),
            'model' => ['required', Rule::in(CarModelEnum::cases())],
            'status' => ['required', Rule::in(CarStatusEnum::cases())],
            'description' => 'nullable|string|max:1000',
            'gallery' => 'nullable|array|max:3',
            'gallery.*' => 'file|mimes:jpeg,png|max:10240', // maksimal 10 MB per file
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
            'brand.required' => 'Brand wajib diisi.',
            'frame_number.required' => 'Nomor rangka wajib diisi.',
            'frame_number.unique' => 'Nomor rangka ini sudah terdaftar.',
            'license_plate.required' => 'Plat nomor wajib diisi.',
            'license_plate.unique' => 'Plat nomor ini sudah terdaftar.',
            'color.required' => 'Warna wajib diisi.',
            'year_of_manufacture.required' => 'Tahun pembuatan wajib diisi.',
            'year_of_manufacture.min' => 'Tahun pembuatan tidak valid.',
            'year_of_manufacture.max' => 'Tahun pembuatan tidak valid.',
            'model.required' => 'Model mobil wajib dipilih.',
            'status.required' => 'Status mobil wajib dipilih.',
            'gallery.array' => 'File gambar harus berupa array.',
            'gallery.max' => 'Anda hanya dapat mengunggah maksimal 3 gambar.',
            'gallery.*.mimes' => 'File gambar harus berformat JPEG atau PNG.',
            'gallery.*.max' => 'Ukuran setiap file gambar maksimal 10 MB.',
        ];
    }
}
