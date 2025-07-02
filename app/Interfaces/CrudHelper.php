<?php

namespace App\Interfaces;

use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

/**
 * Interface CrudHelper
 *
 * This interface provides a standardized set of methods for basic CRUD (Create, Read, Update, Delete) operations
 * within a Laravel application. Each method defines operations for creating, retrieving, updating, and deleting data entries,
 * and includes support for handling file uploads through Laravel's MediaLibrary package.
 */
interface CrudHelper
{
    /**
     * Create a new data entry with optional file upload support.
     *
     * Handles the creation of a new database record by using validated request data.
     * Supports file uploads via the Laravel MediaLibrary package.
     *
     * @param  mixed  $request  The HTTP request object containing the data to be created.
     *                          It should be type-hinted to a specific FormRequest class in the implementing method for validation.
     * @param  Model  $model  The model instance for data creation.
     *                        When using MediaLibrary, the model should implement Spatie\MediaLibrary\HasMedia interface.
     * @param  array|null  $singleUploadTarget  Array of keys for single file upload fields.
     *                                          Each key represents a single media item to be stored in a specified collection.
     * @param  array|null  $multipleUploadTarget  Array of keys for multiple file upload fields.
     *                                            Each key represents multiple media items to be stored in a specified collection.
     * @param  callable|null  $beforeCreating  Optional callback executed before creating the data, allowing for custom logic or additional setup.
     * @param  callable|null  $afterCreating  Optional callback executed after the data has been created, for any necessary follow-up actions.
     * @return RedirectResponse Redirect response with success or error messages:
     *                          - Success: Redirects back with a success message.
     *                          - Error: Redirects back with error message and input data.
     *
     * @throws \Illuminate\Validation\ValidationException If request validation fails.
     * @throws Exception If the model does not implement HasMedia when using MediaLibrary.
     * @throws \Illuminate\Contracts\Filesystem\FileNotFoundException If file upload fails.
     */
    public function createData(mixed $request, Model $model, ?array $singleUploadTarget = [], ?array $multipleUploadTarget = [], ?callable $beforeCreating = null, ?callable $afterCreating = null): RedirectResponse;

    /**
     * Retrieve a single data entry for a given model, including media collections.
     *
     * Fetches a specific record from the database and includes its associated media collections based on the specified
     * single and multiple upload targets.
     *
     * @param  Model  $model  The model instance to retrieve data for, including media collections.
     * @param  Request|null  $request  Optional HTTP request object for additional request-based data.
     * @param  array  $singleUploadTarget  Names of media collections to retrieve a single media item from,
     *                                     injected into the response data with the collection name as the key.
     * @param  array|null  $multipleUploadTarget  Names of media collections to retrieve multiple media items from,
     *                                            injected into the response data as an array with the collection name as the key.
     * @return JsonResponse A JSON response with:
     *                      - 'data': The model instance with associated media items.
     *                      - 'status': Success status message.
     *                      - 'code': HTTP status code (200 for success).
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException If the model instance is not found.
     */
    public function singleData(Model $model, ?Request $request = null, array $singleUploadTarget = [], array $multipleUploadTarget = []): JsonResponse;

    /**
     * Update data for a given model with optional file upload support.
     *
     * Updates an existing database record using validated request data. Supports optional file uploads via the Laravel MediaLibrary package.
     *
     * @param  mixed  $request  The HTTP request object containing the updated data.
     *                          Should be type-hinted to a specific FormRequest class in the implementing method for validation.
     * @param  Model  $model  The model instance to be updated.
     *                        If using MediaLibrary, the model must implement Spatie\MediaLibrary\HasMedia interface.
     * @param  array|null  $singleUploadTarget  Array of keys for single file upload fields.
     * @param  array|null  $multipleUploadTarget  Array of keys for multiple file upload fields.
     * @param  callable|null  $beforeCreating  Optional callback to execute before updating the data, for additional setup or validation.
     * @param  callable|null  $afterCreating  Optional callback to execute after updating the data, for any necessary follow-up actions.
     * @return RedirectResponse Redirect response with success or error messages:
     *                          - Success: Redirects back with a success message.
     *                          - Error: Redirects back with error message and input data.
     *
     * @throws \Illuminate\Validation\ValidationException If request validation fails.
     * @throws Exception If the model does not implement HasMedia when using MediaLibrary.
     * @throws \Illuminate\Contracts\Filesystem\FileNotFoundException If file upload fails.
     */
    public function editData(mixed $request, Model $model, ?array $singleUploadTarget = [], ?array $multipleUploadTarget = [], ?callable $beforeCreating = null, ?callable $afterCreating = null): RedirectResponse;

    /**
     * Delete a specific data entry for a given model.
     *
     * Removes a record from the database, with checks to ensure the deletion is authorized
     * and safe, considering any potential data dependencies.
     *
     * @param  Model  $model  The model instance representing the record to be deleted.
     * @param  mixed  $request  The HTTP request object, which may be used for authorization checks.
     * @return RedirectResponse A redirect response after the delete operation, usually to an index page or previous page.
     *                          - Success: Redirects with a success message in the session flash data.
     *
     * @throws \Illuminate\Auth\Access\AuthorizationException If the user is not authorized to delete the record.
     * @throws Exception If an error occurs during the deletion process or if deletion is not allowed due to dependencies.
     */
    public function destroyData(Model $model, mixed $request): RedirectResponse;
}
