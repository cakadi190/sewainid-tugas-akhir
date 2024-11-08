<?php

namespace App\Helpers;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use App\Interfaces\SelectHelper as SelectHelperInterface;

/**
 * Class SelectHelper
 *
 * Provides methods to fetch data for react-select from Eloquent models.
 */
class SelectHelper implements SelectHelperInterface
{
    /**
     * Get filtered data for react-select from a given model and return as JSON response.
     *
     * @param string $modelClass The fully qualified name of the Eloquent model class.
     * @param string|null $search Optional search term to filter results.
     * @param array|null $fields Optional array of fields to select from the model.
     * @return JsonResponse The JSON response containing the success status and the data.
     */
    public function getDataForSelect(string $modelClass, ?string $search, ?array $fields = null): JsonResponse
    {
        if (!is_subclass_of($modelClass, Model::class)) {
            return $this->errorResponse("The provided class is not a valid Eloquent model.");
        }

        try {
            $model = new $modelClass;
            $selectedFields = $fields ?? ['id', 'name'];

            $data = $model
                ->select($selectedFields)
                ->when($search, function (Builder $query) use ($search) {
                    $query->where('name', 'LIKE', "%{$search}%");
                })
                ->get();

            return $this->successResponse($data, $selectedFields);
        } catch (\Throwable $th) {
            return $this->errorResponse($th);
        }
    }

    /**
     * Format data for react-select and return success response.
     *
     * @param Collection $data The collection of model data to format.
     * @param array $selectedFields The fields that were selected from the model.
     * @return JsonResponse The JSON response containing the success status and formatted data.
     */
    private function successResponse(Collection $data, array $selectedFields): JsonResponse
    {
        $formattedData = $data->map(function (Model $item) {
            return [
                'value' => $item->id,
                'label' => $item->name,
            ];
        })->toArray();

        $statusCode = $formattedData ? 200 : 404;

        return response()->json([
            'success' => !!$formattedData,
            'data' => $formattedData,
            'code' => $statusCode,
        ], $statusCode);
    }

    /**
     * Return error response.
     *
     * @param string $message The error message to include in the response.
     * @return JsonResponse The JSON response containing the error message.
     */
    private function errorResponse(string $message): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
        ], 400);
    }
}
