<?php

namespace App\Interfaces;

use Illuminate\Http\JsonResponse;

/**
 * Interface SelectHelperInterface
 *
 * Defines the contract for the SelectHelper class.
 */
interface SelectHelper
{
    /**
     * Get filtered data for react-select from a given model and return as JSON response.
     *
     * @param string $modelClass The fully qualified name of the Eloquent model class.
     * @param string|null $search Optional search term to filter results.
     * @param array|null $fields Optional array of fields to select from the model.
     * @return JsonResponse The JSON response containing the success status and the data.
     */
    public function getDataForSelect(string $modelClass, ?string $search, ?array $fields = null): JsonResponse;
}
