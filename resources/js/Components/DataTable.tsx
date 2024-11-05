import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  Table,
  Form,
  InputGroup,
  Pagination,
  Button,
  Spinner,
  Row,
  Col,
  Alert
} from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleLeft, faAngleDoubleRight, faChevronDown, faChevronLeft, faChevronRight, faChevronUp, faList, faSort, faSync, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { twMerge } from 'tailwind-merge';

// Definisi interface untuk tipe data
interface Column {
  data: string;
  name: string;
  title: string;
  searchable?: boolean;
  sortable?: boolean;
  render?: (data: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  url: string;
  columns: Column[];
  defaultSort?: { column: string; direction: 'asc' | 'desc' };
  defaultPageLength?: number;
  serverSide?: boolean;
  className?: string;
  filterComponent?: React.ReactNode;
  onDataLoad?: (data: any) => void;
  withTrashToggle?: boolean;
}

// Tambahkan interface untuk ref
export interface DataTableRef {
  refetch: () => Promise<void>;
  setSearch: (text: string) => void;
  setPage: (page: number) => void;
  setPageLength: (length: number) => void;
  setSorting: (column: string, direction: 'asc' | 'desc') => void;
}

interface QueryParams {
  draw: number;
  start: number;
  length: number;
  search: { value: string; regex: boolean };
  order: { column: number; dir: string }[];
  columns: {
    data: string;
    name: string;
    searchable: boolean;
    orderable: boolean;
    search: { value: string; regex: boolean };
  }[];
}

interface ServerResponse {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: any[];
  error?: string;
}

const CustomDataTable = forwardRef<DataTableRef, DataTableProps>(({
  url,
  columns,
  className,
  withTrashToggle,
  defaultSort,
  defaultPageLength = 10,
  filterComponent,
  onDataLoad
}, ref) => {
  // State management dengan nilai default yang aman
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageLength, setPageLength] = useState(defaultPageLength);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [sortColumn, setSortColumn] = useState(defaultSort?.column || '');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
    defaultSort?.direction || 'asc'
  );
  const [draw, setDraw] = useState(1);
  const [includeTrashed, setIncludeTrashed] = useState(false);

  // Fungsi untuk fetch data dengan penanganan error yang lebih baik
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validasi columns sebelum membuat params
      if (!Array.isArray(columns) || columns.length === 0) {
        throw new Error('Columns configuration is required');
      }

      // Build the URL with the trash toggle parameter if applicable
      const fetchUrl = `${url}${includeTrashed ? '?withTrashed=true' : ''}`;

      const sortColumnIndex = columns.findIndex(col => col.data === sortColumn);

      const params: QueryParams = {
        draw,
        start: (currentPage - 1) * pageLength,
        length: pageLength,
        search: {
          value: searchText,
          regex: false
        },
        order: [
          {
            column: sortColumnIndex >= 0 ? sortColumnIndex : 0,
            dir: sortDirection
          }
        ],
        columns: columns.map(column => ({
          data: column.data,
          name: column.name,
          searchable: column.searchable !== false,
          orderable: column.sortable !== false,
          search: {
            value: '',
            regex: false
          }
        }))
      };

      const response = await axios.get<ServerResponse>(fetchUrl, {
        params,
        timeout: 30000
      });

      if (!response.data) {
        throw new Error('Invalid server response');
      }

      const responseData = response.data;

      if (responseData.draw === draw) {
        setData(responseData.data || []);
        setTotalRecords(responseData.recordsFiltered || 0);
        if (onDataLoad) {
          onDataLoad(responseData);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error fetching data:', error);
      setError(errorMessage);
      setData([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    refetch: fetchData,
    setSearch: (text: string) => {
      setSearchText(text);
      setCurrentPage(1);
    },
    setPage: (page: number) => {
      setCurrentPage(page);
    },
    setPageLength: (length: number) => {
      setPageLength(length);
      setCurrentPage(1);
    },
    setSorting: (column: string, direction: 'asc' | 'desc') => {
      setSortColumn(column);
      setSortDirection(direction);
    }
  }));

  // Effect untuk memuat data
  useEffect(() => {
    const controller = new AbortController();

    fetchData();
    setDraw(prev => prev + 1);

    return () => {
      controller.abort();
    };
  }, [currentPage, pageLength, searchText, sortColumn, sortDirection, includeTrashed]);

  // Handler untuk pengurutan
  const handleSort = (columnName: string) => {
    const column = columns.find(col => col.data === columnName);
    if (column?.sortable === false) return;

    if (sortColumn === columnName) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnName);
      setSortDirection('asc');
    }
  };

  // Handler untuk pencarian
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    setCurrentPage(1);
  };

  // Handler untuk perubahan halaman
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handler untuk perubahan jumlah entri per halaman
  const handlePageLengthChange = (length: number) => {
    setPageLength(length);
    setCurrentPage(1);
  };

  // Handler untuk mengubah status trash toggle
  const handleTrashToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeTrashed(e.target.checked);
    setCurrentPage(1); // Reset to first page when toggling
  };

  // Render pagination dengan validasi
  const renderPagination = () => {
    const totalPages = Math.max(1, Math.ceil(totalRecords / pageLength));
    const items = [];

    items.push(
      <Pagination.First
        key="first"
        className="d-flex align-items-center justify-content-center"
        children={
          <FontAwesomeIcon style={{ fontSize: '.75rem' }} icon={faAngleDoubleLeft} />
        }
        disabled={currentPage === 1}
        onClick={() => handlePageChange(1)}
      />
    );
    items.push(
      <Pagination.Prev
        key="prev"
        className="d-flex align-items-center justify-content-center"
        children={
          <FontAwesomeIcon style={{ fontSize: '.75rem' }} icon={faChevronLeft} />
        }
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      />
    );

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    items.push(
      <Pagination.Next
        key="next"
        className="d-flex align-items-center justify-content-center"
        children={
          <FontAwesomeIcon style={{ fontSize: '.75rem' }} icon={faChevronRight} />
        }
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      />
    );
    items.push(
      <Pagination.Last
        key="last"
        className="d-flex align-items-center justify-content-center"
        children={
          <FontAwesomeIcon style={{ fontSize: '.75rem' }} icon={faAngleDoubleRight} />
        }
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(totalPages)}
      />
    );

    return <Pagination className='mb-0'>{items}</Pagination>;
  };

  // Render ikon pengurutan
  const renderSortIcon = (columnName: string) => {
    return (
      // <FontAwesomeIcon icon={sortColumn !== columnName ? faUpDown : (
      //   sortDirection === 'asc' ? faArrowUp : faArrowDown
      // )} />
      <div className="d-flex flex-column">
        <FontAwesomeIcon className={sortColumn === columnName && sortDirection !== 'asc' ? 'opacity-50' : ''} style={{ width: '.5rem', height: '.5rem' }} icon={faChevronUp} />
        <FontAwesomeIcon className={sortColumn === columnName && sortDirection !== 'desc' ? 'opacity-50' : ''} style={{ width: '.5rem', height: '.5rem' }} icon={faChevronDown} />
      </div>
    )
  };

  // Render komponen utama
  return (
    <div className={twMerge("custom-datatable", className)}>
      {error && (
        <Alert dismissible variant="danger">
          {error}
        </Alert>
      )}

      <div className="overflow-hidden border rounded-3">
        <div className="p-2 border-bottom">
          <Row className="gy-2 datatable-header d-flex justify-content-between align-items-center">
            <Col md="3" className="d-flex align-items-center">
              <InputGroup>
                <Form.Select
                  value={pageLength}
                  onChange={(e) => handlePageLengthChange(Number(e.target.value))}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </Form.Select>
                <InputGroup.Text>Senarai</InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search..."
                  value={searchText}
                  onChange={handleSearch}
                />
                {searchText && (
                  <Button onClick={() => setSearchText('')}>
                    <FontAwesomeIcon icon={faXmark} />
                  </Button>
                )}
              </InputGroup>
            </Col>
            <Col md="3" className="gap-2 justify-content-center justify-content-lg-end d-flex align-items-center">
              {filterComponent}

              {withTrashToggle && (
                <Form.Check
                  type="switch"
                  id="trash-toggle"
                  aria-label="Toggle Trash"
                  checked={includeTrashed}
                  onChange={handleTrashToggle}
                  label="Keranjang Sampah"
                />
              )}

              <Button className="rounded-2" onClick={fetchData} size="sm" disabled={loading}>
                <FontAwesomeIcon icon={faSync} spin={loading} />
              </Button>
            </Col>
          </Row>
        </div>
        <Table borderless responsive className="mb-0">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  className="text-nowrap border-bottom bg-light"
                  key={index}
                  onClick={() => handleSort(column.data)}
                  style={{
                    cursor: column.sortable !== false ? 'pointer' : 'default',
                    userSelect: 'none'
                  }}
                >
                  <div className="gap-2 align-items-center d-flex">
                    <span>{column.title}{' '}</span>
                    {column.sortable !== false && (
                      <span>{renderSortIcon(column.data)}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center text-nowrap">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center text-nowrap">
                  {error ? 'Error loading data' : 'No data available'}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="text-nowrap">
                      {column.render
                        ? column.render(row[column.data], row)
                        : row[column.data] ?? ''}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </Table>

        <div className="gap-2 px-3 pt-3 pb-3 border-top datatable-footer flex-column flex-lg-row d-flex justify-content-between align-items-center">
          <div>
            Menampilkan {Math.min((currentPage - 1) * pageLength + 1, totalRecords)} ke{' '}
            {Math.min(currentPage * pageLength, totalRecords)} dari {totalRecords} senarai
          </div>
          {renderPagination()}
        </div>
      </div>
    </div >
  );
});

export default CustomDataTable;
