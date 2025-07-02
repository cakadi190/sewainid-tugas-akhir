import DashboardImage from "@/Assets/Images/Cover-Dashboard.jpg";
import DataTable, { Column } from "@/Components/DataTable";
import GlobalHeader from "@/Components/GlobalPartial/HeaderComponent";
import { formatDateToWIB, isMoreThanNow } from "@/Helpers/dayjs";
import { TransactionStatusEnum } from "@/Helpers/enum";
import {
  getTransactionStatusColor,
  getTransactionStatusLabel,
} from "@/Helpers/EnumHelper";
import { currencyFormat } from "@/Helpers/number";
import { useDataTable } from "@/Hooks/useDatatables";
import AuthenticatedUser from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Badge, OverlayTrigger, Popover } from "react-bootstrap";
import { FaExclamationTriangle } from "react-icons/fa";
import { FaEye } from "react-icons/fa6";

const ExpiredPopover = () => (
  <OverlayTrigger
    placement="top"
    overlay={
      <Popover id="expired-popover">
        <Popover.Header as="h3">Kadaluarsa</Popover.Header>
        <Popover.Body>
          Tagihan ini telah kadaluarsa. Silakan perbarui tagihan Anda.
        </Popover.Body>
      </Popover>
    }
  >
    <div
      data-bs-toggle="popover"
      title="Kadaluarsa"
      data-bs-content="Tagihan ini telah kadaluarsa"
    >
      <FaExclamationTriangle className="text-danger" />
    </div>
  </OverlayTrigger>
);

export default function TransactionPage() {
  const { dataTableRef } = useDataTable();

  const columns: Column[] = [
    {
      data: "id",
      name: "id",
      title: "ID Tagihan",
      render: (data: string) => (
        <Link href={route("dashboard.transaction.show", data)}>
          <strong>#{data}</strong>
        </Link>
      ),
    },
    {
      data: "updated_at",
      name: "updated_at",
      title: "Dibuat Pada",
      render: (data: string) => formatDateToWIB(data),
    },
    {
      data: "status",
      name: "status",
      title: "Status Tagihan",
      render: (data: null | TransactionStatusEnum) => (
        <Badge color={getTransactionStatusColor(data as TransactionStatusEnum)}>
          {getTransactionStatusLabel(data as TransactionStatusEnum)}
        </Badge>
      ),
    },
    {
      data: "expired_at",
      name: "expired_at",
      title: "Kadaluarsa",
      render: (data: string) => (
        <div className="gap-2 position-relative d-flex">
          <span>{formatDateToWIB(data)}</span>
          {isMoreThanNow(data) && <ExpiredPopover />}
        </div>
      ),
    },
    {
      data: "total_pay",
      name: "total_pay",
      title: "Total Bayar",
      render: (data: null | number) => currencyFormat(data || 0),
    },
    {
      data: "id",
      name: "id",
      title: "Aksi",
      searchable: false,
      sortable: false,
      render: (data: string) => (
        <div>
          <Link
            style={{ aspectRatio: 1, width: "fit-content" }}
            className="btn btn-primary btn-sm d-flex justify-content-center align-items-center"
            href={route("dashboard.transaction.show", data)}
          >
            <FaEye />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <AuthenticatedUser
      header={
        <GlobalHeader
          title="Semua Transaksi"
          description="Halaman ini menampilkan daftar semua transaksi yang Anda lakukan, termasuk transaksi yang sedang berlangsung dan yang sudah selesai. Anda dapat melihat detail transaksi dan statusnya di sini."
          backgroundImage={DashboardImage}
          breadcrumbItems={[
            { label: "Beranda", url: route("home") },
            { label: "Dasbor", url: route("dashboard") },
            { label: "Semua Transaksi" },
          ]}
        />
      }
    >
      <Head title="Semua Transaksi" />

      <DataTable
        ref={dataTableRef}
        className="mt-2 mb-4"
        url={route("v1.dashboard.transaction")}
        columns={columns}
      />
    </AuthenticatedUser>
  );
}
