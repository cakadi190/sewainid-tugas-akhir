<?php

namespace App\Interfaces;

interface Datatables
{
    /**
     * Create new instance of DataTable
     * @param mixed $query
     */
    public function __construct($query);

    /**
     * Add a new column to the DataTable
     * @param string $name
     * @param callable $callback
     * @return self
     */
    public function addColumn(string $name, callable $callback): self;

    /**
     * Add multiple columns at once
     * @param array $columns
     * @return self
     */
    public function addColumns(array $columns): self;

    /**
     * Edit an existing column
     * @param string $name
     * @param callable $callback
     * @return self
     */
    public function editColumn(string $name, callable $callback): self;

    /**
     * Remove a column from the DataTable
     * @param string $name
     * @return self
     */
    public function removeColumn(string $name): self;

    /**
     * Set columns to be displayed without escaping
     * @param array $columns
     * @return self
     */
    public function rawColumns(array $columns): self;

    /**
     * Set the row ID
     * @param string|callable $callback
     * @return self
     */
    public function setRowId($callback): self;

    /**
     * Set the row class
     * @param string|callable $callback
     * @return self
     */
    public function setRowClass($callback): self;

    /**
     * Set row attributes
     * @param array|callable $callback
     * @return self
     */
    public function setRowAttributes($callback): self;

    /**
     * Set custom row data
     * @param callable $callback
     * @return self
     */
    public function setRowData(callable $callback): self;

    /**
     * Set items per page for pagination
     * @param int $perPage
     * @return self
     */
    public function setPerPage(int $perPage): self;

    /**
     * Set ordering column and direction
     * @param string $column
     * @param string $direction
     * @return self
     */
    public function orderBy(string $column, string $direction = 'asc'): self;

    /**
     * Generate the DataTable response
     * @param bool $raw
     * @return array
     */
    public function make(bool $raw = false): array;
}
