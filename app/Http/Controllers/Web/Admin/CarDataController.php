<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\CarData;
use Inertia\{Inertia, Response};

/**
 * Class CarDataController
 *
 * Controller untuk mengelola data mobil di halaman admin.
 * Menggunakan Inertia.js untuk merender halaman dengan Vue.js frontend.
 * Terdapat dua method utama: index dan show.
 *
 * @package App\Http\Controllers\Web\Admin
 */
class CarDataController extends Controller
{
    /**
     * Menampilkan halaman index untuk data mobil.
     *
     * Menggunakan Inertia untuk merender halaman 'Admin/CarData/Index'
     * yang berfungsi sebagai halaman utama untuk daftar data mobil.
     *
     * @return \Inertia\Response Halaman Inertia untuk daftar data mobil.
     */
    public function index(): Response
    {
        return Inertia::render('Admin/CarData/Index');
    }

    /**
     * Menampilkan halaman detail untuk data mobil tertentu.
     *
     * Menggunakan Inertia untuk merender halaman 'Admin/CarData/Show'
     * dengan data spesifik dari model CarData yang dipilih.
     * Parameter $carDatum adalah instance model CarData yang
     * otomatis di-resolve oleh Laravel berdasarkan ID.
     *
     * @param CarData $carDatum Data mobil yang akan ditampilkan.
     * @return \Inertia\Response Halaman Inertia untuk menampilkan detail data mobil.
     */
    public function show(CarData $carDatum): Response
    {
        $carDatum->setAttribute('gallery', $carDatum->getMedia('gallery')->toArray());
        // Convert model and status to structured arrays
        $carDatum->setAttribute('modelEnum', [
            'label' => $carDatum->getAttribute('model')->label(),
            'color' => $carDatum->getAttribute('model')->color()
        ]);

        $carDatum->setAttribute('statusEnum', [
            'label' => $carDatum->getAttribute('status')->label(),
            'color' => $carDatum->getAttribute('status')->color()
        ]);

        return Inertia::render('Admin/CarData/Show', compact('carDatum'));
    }
}
