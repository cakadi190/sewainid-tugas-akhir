import DataTable from "@/Components/DataTable";
import { useDataTable } from "@/Hooks/useDatatables";
import { AuthenticatedAdmin } from "@/Layouts/AuthenticatedLayout";
import { Badge, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import { Head, Link } from "@inertiajs/react";
import type Database from "@/types/database";
import EditData from "./EditData";
import DeleteData from "@/Components/crud/DeleteData";
import RestoreData from "@/Components/crud/RestoreData";
import ForceDeleteData from "@/Components/crud/ForceDeleteData";
import CreateData from "./CreateData";
import AlertPage from "@/Components/AlertPage";
import Show from "./Show";

export default function Index() {
  const { dataTableRef, refetch } = useDataTable();

  const columns = [
    {
      data: 'garage_name',
      name: 'garage_name',
      title: 'Nama Garasi',
    },
    {
      data: 'address',
      name: 'address',
      title: 'Alamat',
    },
    {
      data: 'status',
      name: 'status',
      title: 'Status',
      render({ color, label }: { label: string; color: string }) {
        return (
          <Badge bg={color}>{label}</Badge>
        )
      }
    },
    {
      data: 'id',
      name: 'id',
      title: 'Aksi',
      sortable: false,
      render(value: number, row: Database['CarData']) {
        return (
          <div className="gap-2 d-flex flex-nowrap">
            <Show id={value} />
            {row.deleted_at ? (
              <>
                <RestoreData
                  url={route('v1.admin.garage-data.update', row.id)}
                  onSuccess={refetch}
                />
                <ForceDeleteData
                  onSuccess={refetch}
                  url={route('v1.admin.garage-data.destroy', row.id)}
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
                  url={route('v1.admin.garage-data.destroy', row.id)}
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
            <h3 className="h4 fw-semibold">Data Garasi</h3>
            <Breadcrumb className="m-0" bsPrefix="m-0 breadcrumb">
              <BreadcrumbItem linkAs={Link} href={route('administrator.home')}>Dasbor Beranda</BreadcrumbItem>
              <BreadcrumbItem active>Data Garasi</BreadcrumbItem>
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
        url={route('v1.admin.garage-data.index')}
        columns={columns}
      />
    </AuthenticatedAdmin>
  )
};
