import DataTable from "@/Components/DataTable";
import { useDataTable } from "@/Hooks/useDatatables";
import { AuthenticatedAdmin } from "@/Layouts/AuthenticatedLayout";
import { Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import { Head, Link } from "@inertiajs/react";
import { parseAntiXss } from "@/Helpers/string";
import type Database from "@/types/database";
import EditData from "./EditData";
import DeleteData from "@/Components/crud/DeleteData";
import CreateData from "./CreateData";
import AlertPage from "@/Components/AlertPage";
import Show from "./Show";

export default function Index() {
  const { dataTableRef, refetch } = useDataTable();

  const columns = [
    {
      data: 'car_data.car_name',
      name: 'car_data.car_name',
      title: 'Kendaraan',
      render: (value: string) => <span dangerouslySetInnerHTML={{ __html: parseAntiXss(value) }} />,
    },
    {
      data: 'repair_date',
      name: 'repair_date',
      title: 'Tanggal Perbaikan',
    },
    {
      data: 'description',
      name: 'description',
      title: 'Deskripsi',
      render: (value: string) => (
        <span>{value.length > 50 ? value.substring(0, 50) + '...' : value}</span>
      )
    },
    {
      data: 'cost',
      name: 'cost',
      title: 'Biaya',
      render: (value: number) => (
        <span>{value}</span>
      )
    },
    {
      data: 'status',
      name: 'status',
      title: 'Status',
      render: (value: { label: string; color: string }) => (
        <span className={`badge bg-${value.color}`}>{value.label}</span>
      )
    },
    {
      data: 'id',
      name: 'id',
      title: 'Aksi',
      sortable: false,
      render(value: string, row: Database['CarRepairNoteData']) {
        return (
          <div className="gap-2 d-flex flex-nowrap">
            <Show
              id={value}
            />
            <EditData
              onSuccess={refetch}
              id={value}
            />
            <DeleteData
              url={route('v1.admin.car-repair.destroy', row.id)}
              onSuccess={refetch}
            />
          </div>
        )
      }
    },
  ];

  return (
    <AuthenticatedAdmin
      header={
        <div className="d-flex justify-content-between">
          <div className="flex-column d-flex">
            <h3 className="h4 fw-semibold">Catatan Perbaikan Kendaraan</h3>
            <Breadcrumb className="m-0" bsPrefix="m-0 breadcrumb">
              <BreadcrumbItem linkAs={Link} href={route('administrator.home')}>Dasbor Beranda</BreadcrumbItem>
              <BreadcrumbItem active>Catatan Perbaikan Kendaraan</BreadcrumbItem>
            </Breadcrumb>
          </div>

          <CreateData onSuccess={refetch} />
        </div>
      }
    >
      <Head title="Catatan Perbaikan Kendaraan" />

      <AlertPage />

      <DataTable
        ref={dataTableRef}
        className="mt-3"
        url={route('v1.admin.car-repair.index')}
        columns={columns}
      />
    </AuthenticatedAdmin>
  )
};
