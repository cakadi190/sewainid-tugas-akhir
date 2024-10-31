<?php

namespace App\Helpers;

use App\Interfaces\CrudHelper as CrudInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Helpers\Datatables;

/**
 * Class CrudHelper
 *
 * Helper untuk menjalankan operasi CRUD (Create, Read, Update, Delete)
 * dengan integrasi pada Eloquent Model dan sistem response JSON untuk datatables.
 *
 * @package App\Helpers
 */
class CrudHelper implements CrudInterface
{
    /**
     * Array of secured column names that require special handling.
     *
     * @var ?array
     */
    protected array $_securedColumn = [];

    /**
     * Array of columns to be used in search functionality.
     *
     * @var ?array
     */
    protected array $_searchColumn = [];

    /**
     * Security key for accessing secured columns.
     *
     * @var string
     */
    protected string $_securedTarget;

    /**
     * CrudHelper constructor.
     *
     * @param Datatables $_datatables Instance of Datatables helper for data management.
     */
    public function __construct(
        private readonly Datatables $_datatables,
    ) {
        $this->_securedTarget = '';
    }

    /**
     * Define searchable columns for data retrieval.
     *
     * @param array<string> $columns List of columns that should be searchable.
     * @return self Fluent interface for chaining methods.
     */
    public function searchColumn(array $columns = []): self
    {
        $this->_searchColumn = $columns;
        return $this;
    }

    /**
     * Define secured columns that require access restrictions.
     *
     * @param array<string> $columns List of secured column names.
     * @param string $target Security key to access the secured columns.
     * @return self Fluent interface for chaining methods.
     */
    public function withSecuredColumn(?array $columns = [], string $target): self
    {
        $this->_securedColumn = $columns;
        $this->_securedTarget = $target;
        return $this;
    }

    /**
     * Format a specified column with a callback.
     *
     * @param string $column Column name to be formatted.
     * @param callable $callback Function to format the column.
     * @return self Fluent interface for chaining methods.
     */
    public function formatColumn(string $column, callable $callback): self
    {
        $this->_datatables->formatColumn($column, $callback);
        return $this;
    }

    /**
     * Retrieve all data for a given model in JSON format, with support for pagination and filtering.
     *
     * @param Model $model The Eloquent model to retrieve data from.
     * @param Request|null $request Optional request object with additional parameters.
     * @return JsonResponse JSON response with data and pagination details.
     * @throws \Exception If there is an error in data retrieval.
     */
    public function allData(Model $model, Request|null $request = null): JsonResponse
    {
        return $this->_datatables->from($model)
            ->withTrashed()
            ->withSecuredColumn($this->_securedColumn ?? [], $this->_securedTarget)
            ->withSearch($this->_searchColumn)
            ->withOrdering()
            ->make();
    }

    /**
     * Create a new record in the model.
     *
     * @param mixed $request The HTTP request with data for creation.
     * @param Model $model The model instance for data creation.
     * @return RedirectResponse Redirect response with success or error messages.
     */
    public function createData(mixed $request, Model $model): RedirectResponse
    {
        try {
            $data = collect($request->validated());
            $model->create($data->toArray());

            return redirect()->back()->with('success', "Data berhasil ditambahkan!");
        } catch (\Throwable $th) {
            Log::error($th);

            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => "Terjadi kesalahan saat menambahkan data. Silakan coba lagi!"]);
        }
    }

    /**
     * Retrieve a single data entry for a given model in JSON format.
     *
     * @param Model $model The model instance to retrieve data for.
     * @param Request|null $request Optional request object.
     * @return JsonResponse JSON response with the single data entry.
     */
    public function singleData(Model $model, Request|null $request = null): JsonResponse
    {
        return response()->json([
            'data' => $model,
            'status' => 'success',
            'code' => 200,
        ]);
    }

    /**
     * Update an existing data record for a given model.
     *
     * @param mixed $request The HTTP request with data for update.
     * @param Model $model The model instance to be updated.
     * @return RedirectResponse Redirect response with success or error messages.
     */
    public function editData(mixed $request, Model $model): RedirectResponse
    {
        try {
            if ($request->has('restore')) {
                $model->restore();
                return redirect()->back()->with('success', "Data berhasil dipulihkan!");
            }

            $model->update($request->validated());
            return redirect()->back()->with('success', "Data berhasil diperbarui!");
        } catch (\Throwable $th) {
            Log::error($th);

            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => "Terjadi kesalahan saat memperbarui data. Silakan coba lagi!"]);
        }
    }

    /**
     * Delete a data record for a given model.
     *
     * @param Model $model The model instance to be deleted.
     * @param mixed $request The HTTP request.
     * @return RedirectResponse Redirect response with success or error messages.
     */
    public function destroyData(Model $model, mixed $request): RedirectResponse
    {
        try {
            if ($request->boolean('forceDelete')) {
                $model->forceDelete();
                return redirect()->back()->with('success', "Data berhasil dihapus permanen!");
            } else {
                $model->delete();
                return redirect()->back()->with('success', "Data berhasil dihapus sementara!");
            }
        } catch (\Throwable $th) {
            Log::error($th);

            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => "Terjadi kesalahan saat menghapus data. Silakan coba lagi!"]);
        }
    }
}
