import { AuthenticatedAdmin } from "@/Layouts/AuthenticatedLayout";
import { Badge, Breadcrumb, BreadcrumbItem, Button, ButtonGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Head, Link } from "@inertiajs/react";
import AlertPage from "@/Components/AlertPage";
import { useDataTable } from "@/Hooks/useDatatables";
import DataTable from "@/Components/DataTable";
import { getTransactionStatusColor, getTransactionStatusLabel } from "@/Helpers/EnumHelper";
import { TransactionStatusEnum } from "@/Helpers/enum";
import dayjs from "@/Helpers/dayjs";
import { FaBan, FaCheck, FaEye } from "react-icons/fa";

export default function Index() {
  const { dataTableRef } = useDataTable();

  const columns = [
    {
      data: 'id',
      name: 'id',
      title: 'ID Tagihan',
      render: (value: string) => (
        <strong>#{value}</strong>
      )
    },
    {
      data: 'created_at',
      name: 'created_at',
      title: 'Dibuat Tanggal',
      render: (value: string) => dayjs(value).locale('id').format('LLLL')
    },
    {
      data: 'expired_at',
      name: 'expired_at',
      title: 'Kadaluarsa Pada',
      render: (value: string) => dayjs(value).locale('id').format('LLLL')
    },
    {
      data: 'status',
      name: 'status',
      title: 'Status Tagihan',
      render: (value: string) => (
        <Badge color={getTransactionStatusColor(value as unknown as TransactionStatusEnum)}>{getTransactionStatusLabel(value as unknown as TransactionStatusEnum)}</Badge>
      ),
    },
    {
      data: 'id',
      name: 'id',
      title: 'Aksi',
      render: (value: string) => (
        <ButtonGroup size="sm">
          <Button
            variant="danger"
            title="Batalkan"
          >
            <FaBan />
          </Button>
          <Button
            variant="success"
            title="Verifikasi Manual"
            >
            <FaCheck />
          </Button>
          <Button
            title="Lihat Tagihan"
            variant="primary"
          >
            <FaEye />
          </Button>
        </ButtonGroup>
      ),
    },
  ];

  return (
    <AuthenticatedAdmin
      header={
        <div className="d-flex justify-content-between">
          <div className="flex-column d-flex">
            <h3 className="h4 fw-semibold">Data Pemesanan</h3>
            <Breadcrumb className="m-0" bsPrefix="m-0 breadcrumb">
              <BreadcrumbItem linkAs={Link} href={route('administrator.home')}>Dasbor Beranda</BreadcrumbItem>
              <BreadcrumbItem active>Data Pemesanan</BreadcrumbItem>
            </Breadcrumb>
          </div>
          {/* Tambahkan tombol aksi jika diperlukan */}
        </div>
      }
    >
      <Head title="Data Pemesanan" />

      <AlertPage />

      <DataTable
        ref={dataTableRef}
        className="mt-3"
        url={route('v1.admin.booking.index')}
        columns={columns}
      />
    </AuthenticatedAdmin>
  )
};
