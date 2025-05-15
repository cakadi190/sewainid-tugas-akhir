<?php

namespace App\Http\Controllers\Api\v1\Home;

use App\Enums\CarConditionEnum;
use App\Enums\CarStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Home\CarListRequest;
use App\Models\CarData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class CarListController extends Controller
{
    public function __construct(
        protected readonly CarData $_carData
    ) {
    }

    /**
     * Get list of popular car data
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function popularCars(Request $request)
    {
        $cars = $this->_carData
            ->whereIn('condition', [CarConditionEnum::EXCELLENT, CarConditionEnum::GOOD, CarConditionEnum::FAIR])
            ->where('status', [CarStatusEnum::READY, CarStatusEnum::BORROWED])
            ->withAvg('review', 'rating')
            ->withCount('review')
            ->orderBy(function ($query) {
                $query->selectRaw('AVG(rating)')
                    ->from('reviews')
                    ->whereColumn('reviews.car_data_id', 'car_data.id');
            }, 'desc')
            ->limit(6)
            ->get();

        $formattedCars = $cars->map(fn(CarData $car) => [
            'id' => $car->id,
            'car_name' => $car->car_name,
            'brand' => $car->brand,
            'license_plate' => $car->license_plate,
            'slug' => $car->slug,
            'rent_price' => $car->rent_price,
            'color' => $car->color,
            'doors' => $car->doors,
            'status' => $car->status,
            'seats' => $car->seats,
            'max_speed' => $car->max_speed,
            'mileage' => $car->mileage,
            'fuel_type' => $car->fuel_type,
            'year_of_manufacture' => $car->year_of_manufacture,
            'transmission' => $car->transmission,
            'model' => $car->model,
            'average_rating' => floatval($car->review_avg_rating),
            'total_reviews' => floatval($car->review_count),
            'preview_image' => $car->getMedia('gallery')->map(fn(Media $media) => $media->getUrl())->toArray(),
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'success',
            'data' => $formattedCars
        ]);
    }

    /**
     * Get all cars with filtering and pagination
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function allCars(CarListRequest $request)
    {
        Log::info("All Request Context", $request->all());

        $perPage = $request->input('per_page', 9);
        $query = $this->_carData->query();

        $query->when($request->filled('brand'), fn($q) => $q->where('brand', $request->input('brand')))
            ->when($request->filled('model'), fn($q) => $q->where('model', $request->input('model')))
            ->when($request->filled('year_from'), fn($q) => $q->where('year_of_manufacture', '>=', $request->input('year_from')))
            ->when($request->filled('year_to'), fn($q) => $q->where('year_of_manufacture', '<=', $request->input('year_to')))
            ->when($request->filled('fuel_type'), fn($q) => $q->where('fuel_type', $request->input('fuel_type')))
            ->when($request->filled('transmission'), fn($q) => $q->where('transmission', $request->input('transmission')))
            ->when($request->filled('status'), fn($q) => $q->where('status', $request->input('status')))
            ->when($request->filled('condition'), fn($q) => $q->where('condition', $request->input('condition')))
            ->when($request->filled('price_min'), fn($q) => $q->where('rent_price', '>=', $request->input('price_min')))
            ->when($request->filled('price_max'), fn($q) => $q->where('rent_price', '<=', $request->input('price_max')))
            ->when($request->filled('seats'), fn($q) => $q->where('seats', $request->input('seats')))
            ->when($request->filled('search'), fn($q) => $q->where('car_name', 'like', '%' . $request->input('search') . '%')
                ->orWhere('brand', 'like', '%' . $request->input('search') . '%')
                ->orWhere('license_plate', 'like', '%' . $request->input('search') . '%'));

        $query->withAvg('review', 'rating')
            ->withCount('review');

        $cars = $query->paginate($perPage);

        $formattedCars = $cars->map(fn(CarData $car) => [
            'id' => $car->id,
            'car_name' => $car->car_name,
            'brand' => $car->brand,
            'license_plate' => $car->license_plate,
            'slug' => $car->slug,
            'rent_price' => $car->rent_price,
            'color' => $car->color,
            'doors' => $car->doors,
            'status' => $car->status,
            'seats' => $car->seats,
            'max_speed' => $car->max_speed,
            'mileage' => $car->mileage,
            'fuel_type' => $car->fuel_type,
            'year_of_manufacture' => $car->year_of_manufacture,
            'transmission' => $car->transmission,
            'model' => $car->model,
            'condition' => $car->condition,
            'ac' => $car->ac,
            'audio' => $car->audio,
            'abs' => $car->abs,
            'child_lock' => $car->child_lock,
            'traction_control' => $car->traction_control,
            'baby_seat' => $car->baby_seat,
            'average_rating' => floatval($car->review_avg_rating),
            'total_reviews' => floatval($car->review_count),
            'preview_image' => $car->getMedia('gallery')->map(fn(Media $media) => $media->getUrl())->toArray(),
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'success',
            'data' => $formattedCars,
            'meta' => [
                'current_page' => $cars->currentPage(),
                'from' => $cars->firstItem(),
                'last_page' => $cars->lastPage(),
                'per_page' => $cars->perPage(),
                'to' => $cars->lastItem(),
                'total' => $cars->total(),
            ],
            'links' => [
                'first' => $cars->url(1),
                'last' => $cars->url($cars->lastPage()),
                'prev' => $cars->previousPageUrl(),
                'next' => $cars->nextPageUrl(),
            ],
        ]);
    }
}
