<?php

namespace App\Http\Controllers\Web\Home;

use App\Http\Controllers\Controller;
use App\Models\CarData;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function __construct(
        protected readonly CarData $_carData
    ) {
    }

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

    /**
     * Showing the checkout page
     *
     * @return \Inertia\Response
     */
    public function checkout()
    {
        seo()
            ->description('Proses checkout untuk sewa mobil.')
            ->title('Checkout')
            ->canonical(route('checkout'));

        $order = session('order');

        /** @var CarData $carData */
        $carData = $this->_carData
            ->select(['id', 'car_name', 'brand', 'license_plate', 'rent_price', 'slug'])
            ->find($order['car_id'] ?? null);

        $carThumbnail = $carData?->getMedia('gallery')->first();
        $forbiddenDate = $carData?->getUnavailableDate();

        if (!$carData || !session()->has('order')) {
            return redirect()->route('home');
        }

        return inertia('Home/Checkout', compact('carData', 'order', 'carThumbnail', 'forbiddenDate'));
    }
}

