<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    /**
     * Menampilkan halaman index booking.
     *
     * @return \Inertia\Response
     */
    public function __invoke()
    {
        seo()->title('Data Peminjaman')->generate();

        return inertia('Admin/Booking/Index');
    }
}
