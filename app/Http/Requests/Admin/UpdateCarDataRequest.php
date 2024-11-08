<?php

namespace App\Http\Requests\Admin;

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
        if ($this->has('restore') && $this->boolean('restore')) {
            return [
                'restore' => 'required',
            ];
        }

        return [
            'car_name' => 'required|string|max:255',
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
            'engine_number' => [
                'required',
                'string',
                'max:255',
                Rule::unique('car_data')->ignore($this->route('car_datum')),
            ],
            'vehicle_registration_cert_number' => [
                'required',
                'string',
                'max:255',
                Rule::unique('car_data')->ignore($this->route('car_datum')),
            ],
            'vehicle_registration_cert_expiration' => 'required|date',
            'license_plate_expiration' => 'required|date',
            'big_luggage' => 'required|integer|min:0',
            'med_luggage' => 'required|integer|min:0',
            'small_luggage' => 'required|integer|min:0',
            'doors' => 'nullable|integer|min:0',
            'seats' => 'nullable|integer|min:0',
            'max_speed' => 'nullable|integer|min:0',
            'ac' => 'nullable|boolean',
            'audio' => 'nullable|boolean',
            'abs' => 'nullable|boolean',
            'child_lock' => 'nullable|boolean',
            'traction_control' => 'nullable|boolean',
            'baby_seat' => 'nullable|boolean',
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
            'car_name.required' => 'Nama mobil wajib diisi.',
            'brand.required' => 'Merek mobil wajib diisi.',
            'frame_number.required' => 'Nomor rangka wajib diisi.',
            'frame_number.unique' => 'Nomor rangka ini sudah terdaftar.',
            'license_plate.required' => 'Nomor plat wajib diisi.',
            'license_plate.unique' => 'Nomor plat ini sudah terdaftar.',
            'color.required' => 'Warna mobil wajib diisi.',
            'year_of_manufacture.required' => 'Tahun pembuatan wajib diisi.',
            'year_of_manufacture.digits' => 'Tahun pembuatan harus berupa 4 digit.',
            'year_of_manufacture.min' => 'Tahun pembuatan harus realistis (misalnya 1886 atau lebih baru).',
            'model.required' => 'Model mobil wajib dipilih.',
            'model.in' => 'Model mobil yang dipilih tidak valid.',
            'status.required' => 'Status mobil wajib dipilih.',
            'status.in' => 'Status mobil yang dipilih tidak valid.',
            'description.max' => 'Deskripsi tidak boleh lebih dari 500 karakter.',
            'gallery.array' => 'File gambar harus berupa array.',
            'gallery.max' => 'Anda hanya dapat mengunggah maksimal 3 gambar.',
            'gallery.*.mimes' => 'File gambar harus berformat JPEG atau PNG.',
            'gallery.*.max' => 'Ukuran setiap file gambar maksimal 10 MB.',
            'engine_number.required' => 'Nomor mesin wajib diisi.',
            'engine_number.unique' => 'Nomor mesin ini sudah terdaftar.',
            'vehicle_registration_cert_number.required' => 'STNK wajib diisi.',
            'vehicle_registration_cert_number.unique' => 'STNK ini sudah terdaftar.',
            'vehicle_registration_cert_expiration.required' => 'Tanggal kadaluarsa STNK wajib diisi.',
            'license_plate_expiration.required' => 'Tanggal kadaluarsa plat nomor wajib diisi.',
            'doors.required' => 'Jumlah pintu wajib diisi.',
            'seats.required' => 'Jumlah kursi wajib diisi.',
            'max_speed.required' => 'Kecepatan maksimal wajib diisi.',
            'big_luggage.required' => 'Kapasitas bagasi besar wajib diisi.',
            'med_luggage.required' => 'Kapasitas bagasi sedang wajib diisi.',
            'small_luggage.required' => 'Kapasitas bagasi kecil wajib diisi.',
            'ac.required' => 'AC wajib diisi.',
            'audio.required' => 'Audio wajib diisi.',
            'abs.required' => 'ABS wajib diisi.',
            'child_lock.required' => 'Kunci anak wajib diisi.',
            'traction_control.required' => 'Kontrol traksi wajib diisi.',
            'baby_seat.required' => 'Kursi bayi wajib diisi.',
        ];
    }
}
