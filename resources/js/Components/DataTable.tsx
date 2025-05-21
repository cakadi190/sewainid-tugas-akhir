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
import { faAngleDoubleLeft, faAngleDoubleRight, faChevronDown, faChevronLeft, faChevronRight, faChevronUp, faList, faSearch, faSync, faXmark } from '@fortawesome/free-solid-svg-icons';
import { twMerge } from 'tailwind-merge';

/**
 * Interface untuk mendefinisikan struktur kolom dalam DataTable
 * @interface Column
 * @property {string} data - Nama properti data yang akan ditampilkan dalam kolom
 * @property {string} name - Nama unik untuk identifikasi kolom
 * @property {string} title - Judul yang ditampilkan di header kolom
 * @property {boolean} [searchable] - Menentukan apakah kolom dapat dicari
 * @property {boolean} [sortable] - Menentukan apakah kolom dapat diurutkan
 * @property {function} [render] - Fungsi kustom untuk merender konten sel
 */
export interface Column {
  data: string;
  name: string;
  title: string;
  searchable?: boolean;
  sortable?: boolean;
  render?: (data: any, row: any) => React.ReactNode;
}

/**
 * Props untuk komponen DataTable
 * @interface DataTableProps
 * @property {string} url - URL endpoint untuk mengambil data
 * @property {Column[]} columns - Array dari definisi kolom
 * @property {{column: string, direction: 'asc' | 'desc'}} [defaultSort] - Pengaturan pengurutan default
 * @property {number} [defaultPageLength] - Jumlah item per halaman default
 * @property {boolean} [serverSide] - Flag untuk mengaktifkan server-side processing
 * @property {string} [className] - Kelas CSS tambahan
 * @property {React.ReactNode} [filterComponent] - Komponen filter tambahan
 * @property {function} [onDataLoad] - Callback yang dipanggil setelah data dimuat
 * @property {boolean} [withTrashToggle] - Flag untuk menampilkan toggle data terhapus
 */
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

/**
 * Interface untuk ref DataTable yang mengekspos method-method publik
 * @interface DataTableRef
 * @property {function} refetch - Method untuk memuat ulang data
 * @property {function} setSearch - Method untuk mengatur teks pencarian
 * @property {function} setPage - Method untuk mengatur halaman saat ini
 * @property {function} setPageLength - Method untuk mengatur jumlah item per halaman
 * @property {function} setSorting - Method untuk mengatur pengurutan
 */
export interface DataTableRef {
  refetch: () => Promise<void>;
  setSearch: (text: string) => void;
  setPage: (page: number) => void;
  setPageLength: (length: number) => void;
  setSorting: (column: string, direction: 'asc' | 'desc') => void;
}

/**
 * Interface untuk parameter query yang dikirim ke server
 * @interface QueryParams
 * @property {number} draw - Nomor request untuk sinkronisasi
 * @property {number} start - Index awal data yang diminta
 * @property {number} length - Jumlah data yang diminta
 * @property {Object} search - Parameter pencarian
 * @property {Array} order - Parameter pengurutan
 * @property {Array} columns - Konfigurasi kolom
 */
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

/**
 * Interface untuk response dari server
 * @interface ServerResponse
 * @property {number} draw - Nomor request untuk sinkronisasi
 * @property {number} recordsTotal - Total jumlah record
 * @property {number} recordsFiltered - Jumlah record setelah filter
 * @property {Array} data - Data yang dikembalikan
 * @property {string} [error] - Pesan error jika ada
 */
interface ServerResponse {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: any[];
  error?: string;
}

/**
 * @fileoverview Komponen DataTable kustom untuk menampilkan data dalam bentuk tabel dengan fitur-fitur seperti
 * pengurutan, pencarian, paginasi, dan integrasi dengan server-side processing.
 *
 * @module CustomDataTable
 * @requires react
 * @requires react-bootstrap
 * @requires axios
 * @requires @fortawesome/react-fontawesome
 * @requires @fortawesome/free-solid-svg-icons
 * @requires tailwind-merge
 */
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

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    if (!Array.isArray(columns) || columns.length === 0) {
      setLoading(false);
      setError('Konfigurasi kolom diperlukan');
      return;
    }

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
      columns: columns.map((column) => ({
        data: column.data,
        name: column.name || column.data,
        searchable: column.searchable !== false,
        orderable: column.sortable !== false,
        search: {
          value: '',
          regex: false
        }
      }))
    };

    try {
      const response = await axios.get<ServerResponse>(fetchUrl, {
        params,
        timeout: 30000
      });

      if (!response.data) {
        throw new Error('Respon server tidak valid');
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
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui';
      console.error('Error fetching data:', error);
      setError(errorMessage);
      setData([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    const controller = new AbortController();

    fetchData();
    setDraw(prev => prev + 1);

    return () => {
      controller.abort();
    };
  }, [currentPage, pageLength, searchText, sortColumn, sortDirection, includeTrashed]);

  const handleSort = (columnName: string) => {
    const column = columns.find(col => col.data === columnName);
    if (column?.sortable === false) return;

    setSortColumn(columnName);
    setSortDirection(sortColumn === columnName ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'asc');
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageLengthChange = (length: number) => {
    setPageLength(length);
    setCurrentPage(1);
  };

  const handleTrashToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeTrashed(e.target.checked);
    setCurrentPage(1);
  };

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

  const renderSortIcon = (columnName: string) => {
    return (
      <div className="d-flex flex-column">
        <FontAwesomeIcon className={sortColumn === columnName && sortDirection !== 'asc' ? 'opacity-50' : ''} style={{ width: '.5rem', height: '.5rem' }} icon={faChevronUp} />
        <FontAwesomeIcon className={sortColumn === columnName && sortDirection !== 'desc' ? 'opacity-50' : ''} style={{ width: '.5rem', height: '.5rem' }} icon={faChevronDown} />
      </div>
    )
  };

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
            <Col xl="6" xxl="4" className="d-flex align-items-center">
              <InputGroup>
                <InputGroup.Text>
                  <FontAwesomeIcon icon={faList} />
                </InputGroup.Text>
                <Form.Select
                  value={pageLength}
                  onChange={(e) => handlePageLengthChange(Number(e.target.value))}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </Form.Select>
                <InputGroup.Text>
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Cari..."
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
            <Col xl="6" xxl="4" className="gap-2 justify-content-center justify-content-xl-end d-flex align-items-center">
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
        <Table hover responsive className="mb-0">
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
                    <span className="visually-hidden">Memuat...</span>
                  </Spinner>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center text-nowrap">
                  {error ? 'Error memuat data' : 'Tidak ada data yang tersedia'}
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

        <div className="gap-2 px-3 pt-3 pb-3 datatable-footer flex-column flex-lg-row d-flex justify-content-between align-items-center">
          <div>
            Menampilkan {Math.min((currentPage - 1) * pageLength + 1, totalRecords)} ke{' '}
            {Math.min(currentPage * pageLength, totalRecords)} dari {totalRecords} daftar
          </div>
          {renderPagination()}
        </div>
      </div>
    </div >
  );
});

export default CustomDataTable;
