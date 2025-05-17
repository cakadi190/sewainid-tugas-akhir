<?php

namespace App\Http\Controllers\Api\v1\Home;

use App\Http\Controllers\Controller;
use App\Models\CarData;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Validation\ValidationException;

class CheckoutController extends Controller
{
    /**
     * CheckoutController constructor.
     *
     * @param CarData $_carData The car data model instance.
     * @param Session $_session The session instance for managing user sessions.
     */
    public function __construct(
        protected readonly CarData $_carData,
    ) {
    }

    /**
     * Add or update a car in the checkout session
     */
    public function addOrUpdate(Request $request)
    {
        if (!$request->boolean('update') && session('order')) {
            throw ValidationException::withMessages([
                'order' => 'Anda sudah memiliki order. ERR_ALREADY_HAVE_ORDER',
            ]);
        }

        $request->validate([
            'car_id' => 'required|exists:car_data,id',
            'pickup_date' => 'required|date',
            'return_date' => 'required|date',
            'with_driver' => 'nullable|boolean',
        ]);

        $orderData = [
            'car_id' => $request->input('car_id'),
            'pickup_date' => $request->input('pickup_date'),
            'return_date' => $request->input('return_date'),
            'with_driver' => $request->input('with_driver'),
        ];

        session()->put('order', $orderData);

        return redirect()->route('checkout');
    }

    /**
     * Perform checkout
     */
    public function checkout()
    {
        $session = session()->get('order');

        if (!$session) {
            throw ValidationException::withMessages([
                'order' => 'You have no order! ERR_NO_ORDER',
            ]);
        }
    }
}
