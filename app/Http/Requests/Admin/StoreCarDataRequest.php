<?php

namespace App\Http\Requests\Admin;

use App\Enums\CarConditionEnum;
use App\Enums\FuelTypeEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Enums\CarModelEnum;
use App\Enums\CarStatusEnum;
use App\Enums\CarTransmissionEnum;

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
            'car_name' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'frame_number' => 'required|string|max:255|unique:car_data,frame_number',
            'license_plate' => 'required|string|max:20|unique:car_data,license_plate',
            'color' => 'required|string|max:50',
            'year_of_manufacture' => 'required|integer|min:1900|max:' . date('Y'),
            'model' => ['required', Rule::in(CarModelEnum::cases())],
            'status' => ['required', Rule::in(CarStatusEnum::cases())],
            'transmission' => ['required', Rule::in(CarTransmissionEnum::cases())],
            'condition' => ['required', Rule::in(CarConditionEnum::cases())],
            'description' => 'nullable|string|max:1000',
            'gallery' => 'nullable|array|max:3',
            'gallery.*' => 'file|mimes:jpeg,png|max:10240',
            'engine_number' => 'required|string|max:255|unique:car_data,engine_number',
            'vehicle_registration_cert_number' => 'required|string|max:255|unique:car_data,vehicle_registration_cert_number',
            'vehicle_registration_cert_expiration' => 'required|date',
            'vehicle_ownership_book_number' => 'required|string|max:255|unique:car_data,vehicle_ownership_book_number',
            'rent_price' => 'required|integer|min:0',
            'fuel_type' => ['required', Rule::in(FuelTypeEnum::cases())],
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
            'gps_imei' => 'nullable|string|max:16',
            'mileage' => 'nullable|integer|min:0',
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
            'car_name.required' => 'Nama mobil wajib diisi.',
            'brand.required' => 'Merek mobil wajib diisi.',
            'frame_number.required' => 'Nomor rangka wajib diisi.',
            'frame_number.unique' => 'Nomor rangka ini sudah terdaftar.',
            'license_plate.required' => 'Nomor plat wajib diisi.',
            'license_plate.unique' => 'Nomor plat ini sudah terdaftar.',
            'color.required' => 'Warna mobil wajib diisi.',
            'year_of_manufacture.required' => 'Tahun pembuatan wajib diisi.',
            'year_of_manufacture.min' => 'Tahun pembuatan tidak valid.',
            'year_of_manufacture.max' => 'Tahun pembuatan tidak valid.',
            'model.required' => 'Model mobil wajib dipilih.',
            'model.in' => 'Model mobil yang dipilih tidak valid.',
            'status.required' => 'Status mobil wajib dipilih.',
            'status.in' => 'Status mobil yang dipilih tidak valid.',
            'gallery.array' => 'File gambar harus berupa array.',
            'gallery.max' => 'Anda hanya dapat mengunggah maksimal 3 gambar.',
            'gallery.*.mimes' => 'File gambar harus berformat JPEG atau PNG.',
            'gallery.*.max' => 'Ukuran setiap file gambar maksimal 10 MB.',
            'engine_number.required' => 'Nomor mesin wajib diisi.',
            'engine_number.unique' => 'Nomor mesin ini sudah terdaftar.',
            'vehicle_registration_cert_number.required' => 'STNK wajib diisi.',
            'vehicle_registration_cert_number.unique' => 'STNK ini sudah terdaftar.',
            'vehicle_registration_cert_expiration.required' => 'Tanggal kadaluarsa STNK wajib diisi.',
            'license_plate_expiration.required' => 'Tanggal kadaluarsa nomor polisi wajib diisi.',
            'big_luggage.required' => 'Kapasitas bagasi besar wajib diisi.',
            'med_luggage.required' => 'Kapasitas bagasi sedang wajib diisi.',
            'small_luggage.required' => 'Kapasitas bagasi kecil wajib diisi.',
            'ac.required' => 'AC wajib diisi.',
            'audio.required' => 'Audio wajib diisi.',
            'abs.required' => 'ABS wajib diisi.',
            'child_lock.required' => 'Kunci anak wajib diisi.',
            'traction_control.required' => 'Kontrol traksi wajib diisi.',
            'baby_seat.required' => 'Kursi bayi wajib diisi.',
            'gps_imei.max' => 'IMEI GPS tidak boleh lebih dari 16 karakter.',
            'description.max' => 'Deskripsi mobil tidak boleh lebih dari 1000 karakter.',
            'rent_price.min' => 'Harga sewa minimal 0.',
            'doors.min' => 'Jumlah pintu minimal 0.',
            'seats.min' => 'Jumlah kursi minimal 0.',
            'max_speed.min' => 'Kecepatan maksimal minimal 0.',
            'mileage.min' => 'Kilometer berjalan minimal 0.',
            'condition.in' => 'Kondisi mobil yang dipilih tidak valid.',
            'condition.required' => 'Kondisi mobil wajib dipilih.',
        ];
    }
}

