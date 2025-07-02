<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Helpers\SelectHelper;
use App\Http\Controllers\Controller;
use App\Models\CarData;
use Exception;
use Illuminate\Http\Request;

class CarDataOptionsController extends Controller
{
    public function __construct(
        protected readonly SelectHelper $selectHelper,
        protected readonly CarData $model
    ) {}

    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        try {
            $options = $this->selectHelper->getDataForSelect(
                get_class($this->model),
                $request->input('search'),
                ['id', ['brand', 'car_name', 'license_plate']]
            );

            return $options;
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}
