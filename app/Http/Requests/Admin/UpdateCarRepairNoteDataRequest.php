<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCarRepairNoteDataRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Sesuaikan dengan logika otorisasi Anda
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'repair_date' => ['sometimes', 'required', 'date'],
            'description' => ['sometimes', 'required', 'string'],
            'cost' => ['sometimes', 'required', 'numeric', 'min:0', 'max:9999999.99'],
            'status' => ['sometimes', 'required', 'string', 'in:pending,in_progress,completed'],
            'notes' => ['nullable', 'string'],
            'car_data_id' => ['sometimes', 'required', 'exists:car_data,id'],
            'gallery' => ['nullable', 'array'],
            'gallery.*' => ['image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
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
        ];
    }
}
