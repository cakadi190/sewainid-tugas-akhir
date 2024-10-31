<?php

namespace App\Interfaces;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Database\Query\Builder as QueryBuilder;

interface Datatables
{
    /**
     * Membuat instance baru dari Datatables helper.
     *
     * @param Builder|Model|Relation|QueryBuilder $query Query yang akan diproses.
     * @return self Instance dari Datatables helper.
     */
    public static function from(Builder|Model|Relation|QueryBuilder $query): self;

    /**
     * Menambahkan pencarian berdasarkan kolom yang ditentukan.
     *
     * @param array<string> $searchableColumns Array kolom yang dapat dicari.
     * @return self Instance dari Datatables helper.
     */
    public function withSearch(array $searchableColumns = ['title']): self;

    /**
     * Menambahkan filter untuk data yang sudah dihapus (soft deleted).
     *
     * @return self Instance dari Datatables helper.
     */
    public function withTrashed(): self;

    /**
     * Menambahkan kolom yang perlu diamankan datanya sebelum dibuka.
     *
     * @param array<string> $columns Array kolom yang akan diamankan.
     * @param string $targetData Target kunci keamanan untuk kolom yang diamankan.
     * @return self Instance dari Datatables helper.
     */
    public function withSecuredColumn(array $columns = [], string $targetData): self;

    /**
     * Set custom pagination amounts if they exist.
     *
     * @param array<int> $paginationAmount Value for custom pagination value.
     * @return self Instance dari Datatables helper.
     */
    public function setPaginationAmount(array $paginationAmount = []): self;

    /**
     * Menambahkan pengurutan berdasarkan kolom.
     *
     * @return self Instance dari Datatables helper.
     */
    public function withOrdering(): self;

    /**
     * Menambahkan kolom tambahan ke respons.
     *
     * @param string $column Nama kolom tambahan.
     * @param callable $callback Fungsi callback untuk menghasilkan nilai kolom.
     * @return self Instance dari Datatables helper.
     */
    public function addColumn(string $column, callable $callback): self;

    /**
     * Menandai kolom yang akan dirender sebagai HTML.
     *
     * @param string|array<string> $columns Nama kolom atau array kolom yang akan dirender sebagai HTML.
     * @return self Instance dari Datatables helper.
     */
    public function renderAsHtml(string|array $columns): self;

    /**
     * Format a column's data using a specified callback function.
     *
     * @param string $target The target column to be formatted.
     * @param callable $callback The callback function to format the column's data.
     * @return self Instance dari Datatables helper untuk chaining method.
     */
    public function formatColumn(string $target, callable $callback): self;

    /**
     * Membuat response JSON untuk datatables.
     *
     * @return JsonResponse Response JSON dengan format datatables.
     */
    public function make(): JsonResponse;
}
