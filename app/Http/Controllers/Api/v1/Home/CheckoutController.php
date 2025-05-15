<?php

namespace App\Http\Controllers\Api\v1\Home;

use App\Http\Controllers\Controller;
use App\Models\CarData;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

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
        protected readonly Session $_session,
    ) {
    }

    /**
     * Add a car to the checkout session
     */
    public function add(Request $request)
    {
        if ($this->_session->get('order')) {
            return throw new Exception('You already have an order');
        }

        $request->validate([
            'car_id' => 'required|exists:car_data,id',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'pickup_date' => 'required|date',
            'return_date' => 'required|date',
        ]);

        $this->_session->put('order', $request->validated());
    }

    /**
     * Perform checkout
     */
    public function checkout()
    {
    }
}
