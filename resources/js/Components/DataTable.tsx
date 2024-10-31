import React, {
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useMemo,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import axios from 'axios';
import {
  Table,
  Form,
  InputGroup,
  Pagination,
  Spinner,
  Container,
  Row,
  Col,
  Button,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faAnglesLeft, faAnglesRight, faSortDown, faSortUp, faSync } from '@fortawesome/free-solid-svg-icons';
import { twMerge } from 'tailwind-merge';

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
  className?: string;
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
  { columns, url, withShowTrashedToggleData = false, className }: Props<T>,
  ref: React.Ref<DataTableRef>,
): React.ReactElement {
  const [state, setState] = useState<{
    data: T[];
    loading: boolean;
    page: number;
    perPage: number;
    totalRecords: number;
    totalPages: number;
    search: string;
    sortColumn: keyof T | null;
    sortOrder: SortOrder;
    showTrashed: boolean;
  }>({
    data: [],
    loading: false,
    page: 1,
    perPage: 10,
    totalRecords: 0,
    totalPages: 0,
    search: '',
    sortColumn: null,
    sortOrder: 'asc',
    showTrashed: false,
  });

  const isFetchingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    if (isFetchingRef.current) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    isFetchingRef.current = true;
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
        signal: controller.signal,
      });

      setState((prev) => ({
        ...prev,
        data: response.data,
        totalRecords: response.total,
        totalPages: response.last_page,
        loading: false,
      }));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Previous request canceled');
      } else {
        console.error('Failed to fetch data:', error);
      }
      setState((prev) => ({ ...prev, loading: false }));
    } finally {
      isFetchingRef.current = false;
    }
  }, [
    url,
    state.page,
    state.perPage,
    state.search,
    state.sortColumn,
    state.sortOrder,
    state.showTrashed,
  ]);

  useImperativeHandle(ref, () => ({
    refetch: fetchData,
  }));

  useEffect(() => {
    fetchData();
  }, [
    state.search,
    state.page,
    state.perPage,
    state.sortColumn,
    state.sortOrder,
    state.showTrashed,
  ]);

  const handleSort = useCallback((column: keyof T) => {
    setState((prev) => ({
      ...prev,
      sortColumn: column,
      sortOrder:
        prev.sortColumn === column && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const renderCell = (row: T, column: Column<T>) =>
    column.render
      ? column.render(row, row[column.accessorKey])
      : (row[column.accessorKey] as ReactNode);

  return (
    <div id="datatables" className={twMerge(className, "px-3 mx-n3")}>
      <Row className="gap-0 mb-3 align-items-center">
        <Col md={4}>
          <InputGroup>
            <Form.Control
              type="text"
              value={state.search}
              onChange={(e) =>
                setState((prev) => ({ ...prev, search: e.target.value, page: 1 }))
              }
              placeholder="Cari..."
            />
          </InputGroup>
        </Col>
        <Col md={8} className="gap-3 d-flex align-items-center justify-content-end">
          <Button disabled={state.loading} variant="primary" onClick={fetchData}>
            <FontAwesomeIcon icon={faSync} />
          </Button>
          {withShowTrashedToggleData && (
            <Form.Check
              type="switch"
              checked={state.showTrashed}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  showTrashed: e.target.checked,
                }))
              }
              id="show-deleted"
              label="Lihat Sampah"
            />
          )}
          <Form.Select
            value={state.perPage}
            onChange={(e) =>
              setState((prev) => ({
                ...prev,
                perPage: Number(e.target.value),
              }))
            }
            style={{ width: 'auto' }}
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size} items
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      <div className="overflow-hidden border rounded-2 table-responsive">
        <Table hover striped className='mb-0'>
          <thead className="bg-light">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.accessorKey)}
                  onClick={() =>
                    col.sortable !== false && handleSort(col.accessorKey)
                  }
                  style={{ cursor: col.sortable !== false ? 'pointer' : 'default' }}
                >
                  <div className="gap-2 d-flex align-items-center">
                    {col.label}
                    {state.sortColumn === col.accessorKey && (
                      <FontAwesomeIcon icon={state.sortOrder === 'asc' ? faSortUp : faSortDown} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {state.loading ? (
              <tr>
                <td colSpan={columns.length} className="p-4 text-center">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                  <div className="mt-2">Loading...</div>
                </td>
              </tr>
            ) : state.data.length ? (
              state.data.map((row, idx) => (
                <tr key={idx}>
                  {columns.map((col) => (
                    <td key={String(col.accessorKey)}>
                      {renderCell(row, col)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-4 text-center">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <Row className="mt-3 align-items-center">
        <Col xs={12} md={4} className="d-none d-md-block">
          <span>
            Page {state.page} of {state.totalPages}
          </span>
        </Col>
        <Col xs={12} md={8} className="d-flex justify-content-center justify-content-md-end">
          <Pagination className="m-0">
            <Pagination.First
              children={<FontAwesomeIcon icon={faAnglesLeft} />}
              onClick={() => setState(prev => ({ ...prev, page: 1 }))}
              disabled={state.page === 1 || state.loading}
            />
            <Pagination.Prev
              children={<FontAwesomeIcon icon={faAngleLeft} />}
              onClick={() => setState(prev => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
              disabled={state.page === 1 || state.loading}
            />
            <Pagination.Next
              children={<FontAwesomeIcon icon={faAngleRight} />}
              onClick={() => setState(prev => ({ ...prev, page: Math.min(prev.page + 1, prev.totalPages) }))}
              disabled={state.page === state.totalPages || state.loading}
            />
            <Pagination.Last
              children={<FontAwesomeIcon icon={faAnglesRight} />}
              onClick={() => setState(prev => ({ ...prev, page: prev.totalPages }))}
              disabled={state.page === state.totalPages || state.loading}
            />
          </Pagination>
        </Col>
      </Row>
    </div>
  );
}

export default forwardRef(DataTable) as <T>(
  props: Props<T> & { ref?: React.Ref<DataTableRef> },
) => React.ReactElement;
