import React, { useEffect, useState, ReactNode, useCallback, useMemo, forwardRef, useRef } from 'react';
import axios from 'axios';
import { Form, Table, Spinner, InputGroup, FormControl, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

type SortOrder = 'asc' | 'desc';

export interface Column<T> {
  accessorKey: keyof T;
  label: string;
  render?: (row: T, value?: T[keyof T]) => ReactNode;
  sortable?: boolean;
}

export interface Props<T> {
  columns: Column<T>[];
  url: string;
  withShowTrashedToggleData?: boolean;
}

const PAGE_SIZES = [5, 10, 25, 50, 100] as const;

export interface DataTableRef {
  refetch: () => void;
}

interface ApiResponse<T> {
  data: T[];
  total: number;
  last_page: number;
}

function DataTable<T>(
  { columns, url, withShowTrashedToggleData = false }: Props<T>,
  ref: React.Ref<DataTableRef>,
): React.ReactElement {
  const [state, setState] = useState({
    data: [] as T[],
    loading: false,
    page: 1,
    perPage: 10,
    totalRecords: 0,
    totalPages: 0,
    search: '',
    sortColumn: null as keyof T | null,
    sortOrder: 'asc' as SortOrder,
    showTrashed: false,
  });

  const renderCell = (row: T, column: Column<T>) => {
    const cellData = row[column.accessorKey];
    return column.render
      ? column.render(row, cellData)
      : React.isValidElement(cellData)
        ? cellData
        : String(cellData);
  };

  const handleSort = useCallback((column: keyof T) => {
    setState((prev) => ({
      ...prev,
      sortColumn: column,
      sortOrder:
        prev.sortColumn === column && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const { data: response } = await axios.get<ApiResponse<T>>(url, {
        params: {
          page: state.page,
          perPage: state.perPage,
          search: state.search,
          columnTarget: state.sortColumn,
          columnDirection: state.sortOrder,
          showTrashed: state.showTrashed,
        },
      });
      setState((prev) => ({
        ...prev,
        data: response.data,
        totalRecords: response.total,
        totalPages: response.last_page,
        loading: false,
      }));
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [url, state.page, state.perPage, state.search, state.sortColumn, state.sortOrder, state.showTrashed]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="container">
      <Form onSubmit={(e) => e.preventDefault()} className="mb-3 d-flex justify-content-between">
        <InputGroup>
          <FormControl
            placeholder="Search..."
            value={state.search}
            onChange={(e) => setState((prev) => ({ ...prev, search: e.target.value, page: 1 }))}
          />
        </InputGroup>
        {withShowTrashedToggleData && (
          <ToggleButtonGroup type="checkbox" value={state.showTrashed ? [1] : []}>
            <ToggleButton
              id="trashed-toggle"
              value={1}
              onChange={(e) => setState((prev) => ({ ...prev, showTrashed: e.currentTarget.checked }))}
            >
              Show Trashed
            </ToggleButton>
          </ToggleButtonGroup>
        )}
      </Form>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.accessorKey)}
                onClick={() => col.sortable !== false && handleSort(col.accessorKey)}
                className="text-center"
                style={{ cursor: col.sortable ? 'pointer' : 'default' }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {state.loading ? (
            <tr>
              <td colSpan={columns.length} className="text-center">
                <Spinner animation="border" /> Loading...
              </td>
            </tr>
          ) : (
            state.data.map((row, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td key={String(col.accessorKey)}>
                    {renderCell(row, col)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default forwardRef(DataTable);
