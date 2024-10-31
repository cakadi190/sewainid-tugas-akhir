<?php

namespace App\Interfaces;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

/**
 * Interface CrudHelper
 *
 * This interface defines methods for common CRUD (Create, Read, Update, Delete) operations.
 * It provides a standardized way to handle data operations across different models in a Laravel application.
 *
 * @package App\Interfaces
 */
interface CrudHelper
{
    /**
     * Retrieve all data for a given model.
     *
     * This method is responsible for fetching all records from the database for the specified model.
     * It can optionally use the request object to apply filters, sorting, or pagination.
     *
     * @param Model $model The Eloquent model to retrieve data from.
     * @param Request|null $request The HTTP request object (optional). Can be used for filtering or pagination.
     * @return JsonResponse A JSON response containing all the data. The response structure should include:
     *                      - A 'data' key with an array of model instances
     *                      - Optionally, pagination information
     *                      - A 'message' key with a success message
     *                      - A 'status' key indicating the operation status (e.g., 'success' or 'error')
     * @throws \Exception If there's an error during data retrieval.
     */
    function allData(Model $model, ?Request $request = null): JsonResponse;

    /**
     * Menambahkan kolom yang perlu diamankan datanya sebelum dibuka
     *
     * @param array<string> $columns Array kolom yang akan diamankan.
     * @param string $target Target kunci keamanan untuk kolom yang diamankan.
     * @return self Instance dari CRUD helper.
     */
    public function withSecuredColumn(?array $columns = [], string $target): self;

    /**
     * Menambahkan kolom digunakan pencarian data.
     *
     * @param array<string> $columns Array kolom yang akan digunakan.
     * @return self Instance dari CRUD helper.
     */
    public function searchColumn(array $columns = []): self;

    /**
     * Create a new data entry.
     *
     * This method is responsible for creating a new record in the database using the data provided in the request.
     * It should include validation of the input data before performing the creation.
     *
     * @param mixed $model The model instance or identifier of the record to be created.
     * @param mixed $request The HTTP request object containing the data to be created. This should be type-hinted
     *                       to a specific FormRequest class in the implementing method for proper validation.
     * @return RedirectResponse A redirect response after the create operation. This should typically:
     *                          - Redirect to the newly created resource's view page
     *                          - Include a success message in the session flash data
     * @throws \Illuminate\Validation\ValidationException If the input data fails validation.
     */
    function createData(mixed $request, Model $model): RedirectResponse;

    /**
     * Retrieve a single data entry for a given model.
     *
     * This method fetches a specific record from the database based on the provided model or identifier.
     * It can use the request object to include additional related data if needed.
     *
     * @param Model $model The model instance or identifier (e.g., primary key) to retrieve data for.
     * @param Request|null $request The HTTP request object (optional). Can be used to specify additional data to include.
     * @return JsonResponse A JSON response containing the single data entry. The response should include:
     *                      - A 'data' key with the model instance
     *                      - A 'message' key with a success message
     *                      - A 'status' key indicating the operation status
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException If the model is not found.
     */
    function singleData(Model $model, ?Request $request = null): JsonResponse;

    /**
     * Edit data for a given model.
     *
     * This method updates an existing record in the database with the data provided in the request.
     * It should include validation of the input data before performing the update.
     *
     * @param mixed $request The HTTP request object containing the data to be updated. This should be type-hinted
     *                       to a specific FormRequest class in the implementing method for proper validation.
     * @param Model $model The model instance or identifier of the record to be updated.
     * @return RedirectResponse A redirect response after the edit operation. This should typically:
     *                          - Redirect to the updated resource's view page
     *                          - Include a success message in the session flash data
     * @throws \Illuminate\Validation\ValidationException If the input data fails validation.
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException If the model to update is not found.
     */
    function editData(mixed $request, Model $model): RedirectResponse;

    /**
     * Delete data for a given model.
     *
     * This method removes a specific record from the database. It should include checks for
     * whether the deletion is allowed (e.g., user permissions, data dependencies).
     *
     * @param Model $model The model instance or identifier of the record to be deleted.
     * @param mixed $request The HTTP request object. Can be used for authorization checks.
     * @return RedirectResponse A redirect response after the delete operation. This should typically:
     *                          - Redirect to an index page or the previous page
     *                          - Include a success message in the session flash data
     * @throws \Illuminate\Auth\Access\AuthorizationException If the user is not authorized to perform this action.
     * @throws \Exception If there's an error during the deletion process or if deletion is not allowed due to dependencies.
     */
    function destroyData(Model $model, mixed $request): RedirectResponse;

    /**
     * Format a column's data using a specified callback function.
     *
     * This method allows for formatting a specific column in the model's data by applying a callback function.
     *
     * @param string $target The target column to be formatted.
     * @param callable $callback The callback function to format the column's data.
     * @return self Instance of CRUD helper for method chaining.
     */
    public function formatColumn(string $target, callable $callback): self;
}
