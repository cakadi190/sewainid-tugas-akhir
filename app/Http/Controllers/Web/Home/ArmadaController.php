<?php

namespace App\Http\Controllers\Web\Home;

use App\Http\Controllers\Controller;
use App\Models\CarData;
use Spatie\SchemaOrg\Schema;

class ArmadaController extends Controller
{
    /**
     * Menampilkan halaman daftar armada yang tersedia.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $car_data = CarData::with('review')->latest()->paginate(12);

        $itemList = Schema::itemList()
            ->name('Daftar Armada Kami')
            ->url(url()->current())
            ->numberOfItems($car_data->total())
            ->itemListElement(
                $car_data->map(
                    fn ($car_data) => Schema::listItem()
                        ->position($loop->iteration ?? 1) // wajib untuk listItem
                        ->item(
                            Schema::car()
                                ->name($car_data->fullName)
                                ->url(route('armada.show', $car_data->slug))
                                ->image($car_data->getFirstMediaUrl('gallery'))
                                ->description($car_data->description)
                                ->offers(
                                    Schema::offer()
                                        ->priceCurrency('IDR')
                                        ->price($car_data->rent_price)
                                )
                                ->aggregateRating(
                                    Schema::aggregateRating()
                                        ->ratingValue(round($car_data->review->avg('rating') ?? 0, 1))
                                        ->reviewCount($car_data->review->count())
                                )
                        )
                )->toArray()
            );

        $schemas = [
            Schema::rentalCarReservation()
                ->name('Armada Kami')
                ->description('Nikmati kenyamanan dan keamanan dalam perjalanan dengan armada kami, pilihan terbaik untuk perjalanan Anda dari Ngawi ke tujuan anda.')
                ->url(url()->current()),
            $itemList,
        ];

        seo()
            ->title('Daftar Armada Kami')
            ->description('Sewa mobil Ngawi untuk berbagai kebutuhan Anda, mulai dari wisata, perjalanan bisnis, hingga acara spesial. Kami siap membantu Anda dengan armada yang lengkap dan harga yang kompetitif.')
            ->keywords('Sewa Mobil Ngawi, Rental Mobil Ngawi, Sewa Mobil Murah Ngawi, Sewa Mobil Avanza Ngawi, Sewa Mobil Xenia Ngawi, Sewa Mobil Innova Ngawi, Sewa Mobil Fortuner Ngawi, Sewa Mobil Hiace Ngawi,')
            ->generate();

        return inertia('Home/Armada/Index', compact('car_data'))
            ->withViewData(compact('schemas'));
    }

    /**
     * Menampilkan halaman detail armada yang dipilih.
     *
     * @return \Inertia\Response
     */
    public function show(CarData $car_data)
    {
        $car_data->getMedia('gallery');

        $car_data->load('review')
            ->makeHidden([
                'gps_imei',
                'frame_number',
                'engine_number',
                'license_plate',
                'license_plate_expiration',
                'vehicle_registration_cert_number',
                'vehicle_ownership_book_number',
                'vehicle_registration_cert_expiration',
            ]);

        $reviews = $car_data->review()->latest()->paginate(10);
        $averageRating = round($car_data->review->avg('rating') ?? 0, 1);
        $reviewCount = $car_data->review->count();
        $disabledCalendar = $car_data->getUnavailableDate();

        seo()
            ->title("Detail Kendaraan {$car_data->brand} {$car_data->car_name}")
            ->description("Nikmati kenyamanan dan keamanan dalam perjalanan dengan {$car_data->brand} {$car_data->car_name}, pilihan terbaik untuk perjalanan Anda dari Ngawi ke tujuan anda.")
            ->keywords('Sewa Mobil Ngawi, Rental Mobil Ngawi, Sewa Mobil Murah Ngawi, Sewa Mobil Avanza Ngawi, Sewa Mobil Xenia Ngawi, Sewa Mobil Innova Ngawi, Sewa Mobil Fortuner Ngawi, Sewa Mobil Hiace Ngawi')
            ->generate();

        $schemas = [
            Schema::car()
                ->name($car_data->full_name)
                ->image($car_data->getFirstMediaUrl('gallery'))
                ->description($car_data->description)
                ->brand($car_data->brand)
                ->modelDate($car_data->year_of_manufacture)
                ->offers([
                    Schema::offer()
                        ->priceSpecification(
                            Schema::unitPriceSpecification()
                                ->priceCurrency('IDR')
                                ->price($car_data->rent_price)
                        ),
                ]),
            Schema::aggregateRating()
                ->itemReviewed($car_data->full_name)
                ->ratingValue($averageRating)
                ->reviewCount($reviewCount),
        ];

        return inertia('Home/Armada/Show', compact('car_data', 'disabledCalendar'))->withViewData(compact('schemas'));
    }
}
