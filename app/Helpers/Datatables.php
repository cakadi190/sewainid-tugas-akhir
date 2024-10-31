<?php

namespace App\Helpers;

use App\Interfaces\Datatables as DatatablesInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

/**
 * Class Datatables
 *
 * Helper untuk menangani pengambilan data dengan format datatables, termasuk
 * fitur pagination, pencarian, pemformatan kolom, pengurutan, dan pengamanan kolom.
 *
 * @package App\Helpers
 */
class Datatables implements DatatablesInterface
{
    /**
     * Query builder instance untuk pengambilan data.
     *
     * @var Builder|QueryBuilder
     */
    protected Builder|QueryBuilder $_query;

    /**
     * Instance dari HTTP Request untuk akses parameter seperti pencarian dan pengurutan.
     *
     * @var Request
     */
    protected Request $_request;

    /**
     * Limitasi pagination kustom jika diperlukan.
     *
     * @var array|null
     */
    protected ?array $_paginationAmount = null;

    /**
     * Kumpulan custom callback untuk kolom tambahan.
     *
     * @var Collection<string, callable>
     */
    protected Collection $_columns;

    /**
     * Kumpulan nama kolom yang akan dirender sebagai HTML.
     *
     * @var Collection<int, string>
     */
    protected Collection $_htmlColumns;

    /**
     * Array untuk kolom yang diamankan sebelum ditampilkan.
     *
     * @var array
     */
    protected array $_securedColumn = [];

    /**
     * Target kunci keamanan untuk kolom terbatas.
     *
     * @var string
     */
    protected string $_securedTarget;

    /**
     * Kumpulan kolom yang diformat dengan callback.
     *
     * @var Collection<string, callable>
     */
    protected Collection $_formattedColumns;

    /**
     * Konstruktor untuk inisialisasi Collection dan Request.
     */
    public function __construct()
    {
        $this->_request = request();
        $this->_columns = collect();
        $this->_htmlColumns = collect();
        $this->_formattedColumns = collect();
    }

    /**
     * Membuat instance baru dari Datatables helper dengan query yang diberikan.
     *
     * @param Builder|Model|Relation|QueryBuilder $query Query yang akan diproses.
     * @return self Instance dari Datatables helper.
     */
    public static function from(Builder|Model|Relation|QueryBuilder $query): self
    {
        $instance = new self();
        $instance->_query = $query instanceof Model ? $query->newQuery() :
            ($query instanceof Relation ? $query->getQuery() : $query);

        return $instance;
    }

    /**
     * Menambahkan pencarian berdasarkan kolom yang ditentukan.
     *
     * @param array<string> $searchableColumns Array kolom yang dapat dicari.
     * @return self Instance dari Datatables helper.
     */
    public function withSearch(array $searchableColumns = []): self
    {
        if ($search = $this->_request->get('search')) {
            $this->_query->where(fn(Builder $query): Collection => collect($searchableColumns)->each(
                fn(string $column): mixed =>
                $query->orWhere($column, 'like', "%{$search}%")
            ));
        }
        return $this;
    }

    /**
     * Menambahkan kolom yang perlu diamankan datanya sebelum dibuka.
     *
     * @param array<string> $columns Array kolom yang akan diamankan.
     * @param string $target Target kunci keamanan untuk kolom yang diamankan.
     * @return self Instance dari Datatables helper.
     */
    public function withSecuredColumn(array $columns = [], string $target): self
    {
        $this->_securedTarget = $target;
        $this->_securedColumn = $columns;
        return $this;
    }

    /**
     * Menambahkan filter untuk data yang sudah dihapus (soft deleted).
     *
     * @return self Instance dari Datatables helper.
     */
    public function withTrashed(): self
    {
        $this->_query->when(
            $this->_request->get('showTrashed'),
            fn(Builder $query, bool|int|string $showTrashed): mixed => isTruthy(value: $showTrashed) ?
            $query->onlyTrashed() :
            $query->whereNull('deleted_at')
        );
        return $this;
    }

    /**
     * Set custom pagination amounts if they exist.
     *
     * @param array<int> $paginationAmount Value for custom pagination value.
     * @return self Instance dari Datatables helper.
     */
    public function setPaginationAmount(array $paginationAmount = []): self
    {
        $this->_paginationAmount = $paginationAmount;
        return $this;
    }

    /**
     * Menambahkan pengurutan berdasarkan kolom.
     *
     * @return self Instance dari Datatables helper.
     */
    public function withOrdering(): self
    {
        $this->_query->when(
            $this->_request->get('columnTarget') && $this->_request->get('columnDirection'),
            fn(Builder $query): Builder => $query->orderBy(
                $this->_request->get('columnTarget', 'id'),
                $this->_request->get('columnDirection', 'asc')
            )
        );
        return $this;
    }

    /**
     * Menambahkan kolom tambahan ke respons.
     *
     * @param string $column Nama kolom tambahan.
     * @param callable $callback Fungsi callback untuk menghasilkan nilai kolom.
     * @return self Instance dari Datatables helper.
     */
    public function addColumn(string $column, callable $callback): self
    {
        $this->_columns->put($column, $callback);
        return $this;
    }

    /**
     * Menambahkan kolom yang diformat dengan callback.
     *
     * @param string $column Nama kolom yang akan diformat.
     * @param callable $callback Fungsi callback untuk memformat kolom.
     * @return self Instance dari Datatables helper.
     */
    public function formatColumn(string $column, callable $callback): self
    {
        $this->_formattedColumns->put($column, $callback);
        return $this;
    }

    /**
     * Menandai kolom yang akan dirender sebagai HTML.
     *
     * @param string|array<string> $columns Nama kolom atau array kolom yang akan dirender sebagai HTML.
     * @return self Instance dari Datatables helper.
     */
    public function renderAsHtml(string|array $columns): self
    {
        $this->_htmlColumns = $this->_htmlColumns->merge(
            collect(is_array($columns) ? $columns : [$columns])
        );
        return $this;
    }

    /**
     * Membuat response JSON untuk datatables.
     *
     * @return JsonResponse Response JSON dengan format datatables.
     */
    public function make(): JsonResponse
    {
        $perPage = SecurityHelper::getPerPage(
            perPage: $this->_request->get('perPage', 10),
            customPagination: $this->_paginationAmount
        );

        $paginatedData = $this->_query->paginate($perPage);

        $data = collect($paginatedData->items())->map(function ($item) {
            // Terapkan callback pada kolom yang diformat
            $this->_formattedColumns->each(function ($callback, $column) use ($item) {
                $item->$column = $callback($item);
            });

            // Terapkan callback untuk kolom tambahan
            $this->_columns->each(function ($callback, $column) use ($item) {
                $value = $callback($item);
                $item->$column = $this->_htmlColumns->contains($column) ?
                    $value :
                    htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
            });

            return $item;
        });

        return response()->json([
            'data' => $data,
            'current_page' => $paginatedData->currentPage(),
            'last_page' => $paginatedData->lastPage(),
            'per_page' => $paginatedData->perPage(),
            'total' => $paginatedData->total(),
            'query' => returnConditionIfTrue(
                app()->environment('local', 'development'),
                $this->_query->toSql()
            ),
        ]);
    }

    /**
     * Mask sensitive data for secured columns.
     *
     * @param mixed $data The data to be masked
     * @return string The masked data
     */
    protected function maskSensitiveData($data): string
    {
        return is_string($data) ? Str::mask($data, '*', 0, -4) : '****';
    }
}
