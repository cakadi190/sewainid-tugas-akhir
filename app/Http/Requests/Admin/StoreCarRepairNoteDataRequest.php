<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreCarRepairNoteDataRequest extends FormRequest
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
        return [
            'repair_date' => ['required', 'date'],
            'description' => ['required', 'string'],
            'cost' => ['nullable', 'numeric', 'min:0', 'max:9999999.99'],
            'status' => ['required', 'string', 'in:pending,in_progress,completed'],
            'notes' => ['nullable', 'string'],
            'car_data_id' => ['required', 'exists:car_data,id'],
            'gallery' => ['nullable', 'array'],
            'gallery.*' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
            'current_mileage' => ['nullable', 'numeric', 'min:0'],
            'last_mileage' => ['nullable', 'numeric', 'min:0'],
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'repair_date.required' => 'Tanggal perbaikan wajib diisi',
            'repair_date.date' => 'Format tanggal perbaikan tidak valid',
            'description.required' => 'Deskripsi perbaikan wajib diisi',
            'cost.required' => 'Biaya perbaikan wajib diisi',
            'cost.numeric' => 'Biaya perbaikan harus berupa angka',
            'cost.min' => 'Biaya perbaikan tidak boleh negatif',
            'cost.max' => 'Biaya perbaikan terlalu besar',
            'status.required' => 'Status perbaikan wajib diisi',
            'status.in' => 'Status perbaikan tidak valid',
            'car_data_id.required' => 'Mobil wajib dipilih',
            'car_data_id.exists' => 'Mobil yang dipilih tidak valid',
            'gallery.array' => 'Galeri harus berupa daftar file',
            'gallery.*.image' => 'File harus berupa gambar',
            'gallery.*.mimes' => 'Format file tidak didukung. Gunakan: jpeg, png, jpg, atau gif',
            'gallery.*.max' => 'Ukuran file tidak boleh lebih dari 2MB',
            'current_mileage.numeric' => 'Jarak tempuh saat ini harus berupa angka',
            'current_mileage.min' => 'Jarak tempuh saat ini tidak boleh negatif',
            'last_mileage.numeric' => 'Jarak tempuh terakhir harus berupa angka',
            'last_mileage.min' => 'Jarak tempuh terakhir tidak boleh negatif',
        ];
    }
}

