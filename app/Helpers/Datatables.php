<?php

namespace App\Helpers;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use App\Interfaces\Datatables as DataTableInterface;
use Illuminate\Database\Eloquent\Model;

class Datatables implements DataTableInterface
{
    protected $query;
    protected $columns = [];
    protected $rawColumns = [];
    protected $additionalColumns = [];
    protected $columnAttributes = [];
    protected $rowAttributes = [];
    protected $rowClass = [];
    protected $rowId = 'id';
    protected $rowData = null;
    protected $perPage = 10;
    protected $orderColumn = 'id';
    protected $orderDirection = 'desc';

    public function __construct($query)
    {
        if ($query instanceof Model) {
            $this->query = $query->newQuery();
        } elseif ($query instanceof Builder) {
            $this->query = $query;
        } else {
            throw new \InvalidArgumentException('Query must be an instance of Model or Builder');
        }
    }

    public function addColumn(string $name, callable $callback): self
    {
        $this->additionalColumns[$name] = $callback;
        return $this;
    }

    public function addColumns(array $columns): self
    {
        foreach ($columns as $name => $callback) {
            $this->addColumn($name, $callback);
        }
        return $this;
    }

    public function editColumn(string $name, callable $callback): self
    {
        $this->columns[$name] = $callback;
        return $this;
    }

    public function removeColumn(string $name): self
    {
        unset($this->columns[$name]);
        unset($this->additionalColumns[$name]);
        return $this;
    }

    public function rawColumns(array $columns): self
    {
        $this->rawColumns = array_merge($this->rawColumns, $columns);
        return $this;
    }

    public function setRowId($callback): self
    {
        $this->rowId = $callback;
        return $this;
    }

    public function setRowClass($callback): self
    {
        $this->rowClass = $callback;
        return $this;
    }

    public function setRowAttributes($callback): self
    {
        $this->rowAttributes = $callback;
        return $this;
    }

    public function setRowData(callable $callback): self
    {
        $this->rowData = $callback;
        return $this;
    }

    public function setPerPage(int $perPage): self
    {
        $this->perPage = $perPage;
        return $this;
    }

    public function orderBy(string $column, string $direction = 'asc'): self
    {
        $this->orderColumn = $column;
        $this->orderDirection = strtolower($direction);
        return $this;
    }

    public function make(bool $raw = false): array
    {
        // Get the total count
        $total = $this->query->count();

        // Apply pagination
        $page = request()->get('page', 1);
        $offset = ($page - 1) * $this->perPage;

        // Apply ordering
        $this->query->orderBy($this->orderColumn, $this->orderDirection);

        // Get paginated results
        $results = $this->query->offset($offset)->limit($this->perPage)->get();

        // Transform the data
        $data = $this->processResults($results);

        if ($raw) {
            return $data;
        }

        return [
            'data' => $data,
            'current_page' => (int) $page,
            'last_page' => ceil($total / $this->perPage),
            'per_page' => (int) $this->perPage,
            'total' => $total,
            'query' => $this->query->toSql()
        ];
    }

    protected function processResults($results)
    {
        return $results->map(function ($item) {
            $row = $this->processRow($item);

            // Add row ID
            // if (is_callable($this->rowId)) {
            $row['DT_RowId'] = is_callable($this->rowId) ? call_user_func($this->rowId, $item) : $item->{$this->rowId};
            // } else {
                // $row['DT_RowId'] = $item->{$this->rowId};
            // }

            // Add row class
            if ($this->rowClass) {
                $row['DT_RowClass'] = is_callable($this->rowClass)
                    ? call_user_func($this->rowClass, $item)
                    : $this->rowClass;
            }

            // Add row attributes
            if ($this->rowAttributes) {
                $row['DT_RowAttr'] = is_callable($this->rowAttributes)
                    ? call_user_func($this->rowAttributes, $item)
                    : $this->rowAttributes;
            }

            // Add custom row data
            if ($this->rowData) {
                $row['DT_RowData'] = call_user_func($this->rowData, $item);
            }

            return $row;
        })->toArray();
    }

    protected function processRow($item)
    {
        $row = $item->toArray();

        // Process edited columns
        foreach ($this->columns as $key => $callback) {
            $row[$key] = $callback($item);
        }

        // Process additional columns
        foreach ($this->additionalColumns as $key => $callback) {
            $row[$key] = $callback($item);
        }

        // Process raw columns
        foreach ($this->rawColumns as $key) {
            if (isset($row[$key])) {
                $row[$key] = ['raw' => $row[$key]];
            }
        }

        return $row;
    }
}
