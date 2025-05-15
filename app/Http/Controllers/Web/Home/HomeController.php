<?php

namespace App\Http\Controllers\Web\Home;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Showing the home page
     *
     * @return \Illuminate\Http\Response|\Inertia\ResponseFactory
     */
    public function index()
    {
        seo()
            ->description('Sewa mobil Ngawi untuk berbagai kebutuhan Anda, mulai dari wisata, perjalanan bisnis, hingga acara spesial. Kami siap membantu Anda dengan armada yang lengkap dan harga yang kompetitif.')
            ->title('Beranda')
            ->canonical(route('home'))
            ->generate();

        return inertia('Home/HomePage');
    }

    /**
     * Showing the wishlist page
     *
     * @return \Inertia\Response
     */
    public function wishlist()
    {
        seo()
            ->description('Daftar mobil yang Anda simpan untuk disewa.')
            ->title('Daftar Mobil Favorit')
            ->canonical(route('wishlist'))
            ->generate();

        return inertia('Home/Wishlist');
    }
}

