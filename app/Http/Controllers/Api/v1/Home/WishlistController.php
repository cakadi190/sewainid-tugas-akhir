<?php

namespace App\Http\Controllers\Api\v1\Home;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class WishlistController extends Controller
{
    public function __construct(
        protected readonly Wishlist $wishlist
    ) {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $wishlists = $this->wishlist
                ->with([
                    'carData' => function ($query) {
                        $query->with([
                            'media',
                            'review' // Load semua review tanpa agregasi di sini
                        ]);
                    }
                ])
                ->where('user_id', auth()->id())
                ->select([
                    'id',
                    'car_data_id',
                ])
                ->latest()
                ->get()
                ->map(fn($wishlist) => $request->boolean('only_id') ? [
                    'id' => $wishlist->id,
                    'car_data_id' => $wishlist->car_data_id
                ] : [
                    'id' => $wishlist->id,
                    'car_data_id' => $wishlist->carData->id,
                    'car_name' => $wishlist->carData->car_name,
                    'slug' => $wishlist->carData->slug,
                    'brand' => $wishlist->carData->brand,
                    'rent_price' => $wishlist->carData->rent_price,
                    'mileage' => $wishlist->carData->mileage,
                    'fuel_type' => $wishlist->carData->fuel_type,
                    'year_of_manufacture' => $wishlist->carData->year_of_manufacture,
                    'transmission' => $wishlist->carData->transmission,
                    'model' => $wishlist->carData->model,
                    'seats' => $wishlist->carData->seats,
                    'max_speed' => $wishlist->carData->max_speed,
                    'preview_image' => $wishlist->carData->getFirstMediaUrl('gallery'),
                    'total_reviews' => $wishlist->carData->review->count(),
                    'average_rating' => $wishlist->carData->review->avg('rating') ?? 0,
                ]);

            return response()->json([
                'data' => $wishlists,
                'success' => true,
                'message' => 'Success fetching wishlist',
                'code' => Response::HTTP_OK
            ]);
        } catch (\Exception $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate(['car_id' => 'required|exists:car_data,id']);

        $this->wishlist->firstOrCreate([
            'user_id' => auth()->id(),
            'car_data_id' => $request->input('car_id')
        ]);

        return redirect(route('wishlist'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Wishlist $wishlist)
    {
        $wishlist->delete();

        return redirect(route('wishlist'));
    }
}
