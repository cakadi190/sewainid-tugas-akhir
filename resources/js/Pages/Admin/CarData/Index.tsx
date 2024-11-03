import DataTable from "@/Components/DataTable";
import { useDataTable } from "@/Hooks/useDatatables";
import { AuthenticatedAdmin } from "@/Layouts/AuthenticatedLayout";
import type Database from "@/types/database";
import { Head, Link, usePage } from "@inertiajs/react";
import { Alert, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import EditData from "./EditData";
import DeleteData from "@/Components/crud/DeleteData";
import RestoreData from "@/Components/crud/RestoreData";
import ForceDeleteData from "@/Components/crud/ForceDeleteData";
import CreateData from "./CreateData";
import { PageProps } from "@/types";
import AlertPage from "@/Components/AlertPage";

export default function Index() {
  const { dataTableRef, refetch } = useDataTable();
  const { props: { alert } } = usePage<PageProps>();

  const columns = [
    {
      data: 'name',
      name: 'name',
      title: 'Nama',
    },
    {
      data: 'brand',
      name: 'brand',
      title: 'Brand / Merk',
    },
    {
      data: 'license_plate',
      name: 'license_plate',
      title: 'Nomor Polisi',
      render: (value: string) => (
        <span className="font-mono">{value}</span>
      )
    },
    {
      data: 'frame_number',
      name: 'frame_number',
      title: 'Nomor Rangka',
      render: (value: string) => (
        <span className="font-mono">{value}</span>
      )
    },
    {
      data: 'model',
      name: 'model',
      title: 'Model Kendaraan',
      render: (value: { label: string; color: string }) => (
        <span className={`badge bg-${value.color}`}>{value.label}</span>
      )
    },
    {
      data: 'status',
      name: 'status',
      title: 'Model Kendaraan',
      render: (value: { label: string; color: string }) => (
        <span className={`badge bg-${value.color}`}>{value.label}</span>
      )
    },
    {
      data: 'id',
      name: 'id',
      title: 'Aksi',
      sortable: false,
      render(value: number, row: Database['CarData']) {
        return (
          <div className="gap-2 d-flex flex-nowrap">
            {row.deleted_at ? (
              <>
                <RestoreData
                  url={route('v1.admin.car-data.update', row.id)}
                  onSuccess={refetch}
                />
                <ForceDeleteData
                  onSuccess={refetch}
                  url={route('v1.admin.car-data.destroy', row.id)}
                />
              </>
            ) : (
              <>
                <EditData
                  onSuccess={refetch}
                  id={Number(value)}
                />
                <DeleteData
                  withForceDeleteCheckbox
                  url={route('v1.admin.car-data.destroy', row.id)}
                  onSuccess={refetch}
                />
              </>
            )}
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
            <h3 className="h4 fw-semibold">Data Kendaraan</h3>
            <Breadcrumb className="m-0" bsPrefix="m-0 breadcrumb">
              <BreadcrumbItem linkAs={Link} href={route('administrator.home')}>Dasbor Beranda</BreadcrumbItem>
              <BreadcrumbItem active>Data Kendaraan</BreadcrumbItem>
            </Breadcrumb>
          </div>

          <CreateData onSuccess={refetch} />
        </div>
      }
    >
      <Head title="Data Kendaraan" />

      <AlertPage />

      <DataTable
        ref={dataTableRef}
        withTrashToggle
        className="mt-3"
        url={route('v1.admin.car-data.index')}
        columns={columns}
      />
    </AuthenticatedAdmin>
  )
};
