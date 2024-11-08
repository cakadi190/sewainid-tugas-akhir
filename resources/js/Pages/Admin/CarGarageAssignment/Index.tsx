import DataTable from "@/Components/DataTable";
import { useDataTable } from "@/Hooks/useDatatables";
import { AuthenticatedAdmin } from "@/Layouts/AuthenticatedLayout";
import { Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import { Head, Link } from "@inertiajs/react";
// import { parseAntiXss } from "@/Helpers/string";
import type Database from "@/types/database";
// import EditData from "./EditData";
import DeleteData from "@/Components/crud/DeleteData";
import RestoreData from "@/Components/crud/RestoreData";
import ForceDeleteData from "@/Components/crud/ForceDeleteData";
// import CreateData from "./CreateData";
import AlertPage from "@/Components/AlertPage";
// import Show from "./Show";

export default function Index() {
  const { dataTableRef, refetch } = useDataTable();

  const columns = [
    {
      data: 'car_data_id',
      name: 'car_data_id',
      title: 'ID Data Mobil',
    },
    {
      data: 'from_garage_id',
      name: 'from_garage_id',
      title: 'ID Garasi Asal',
    },
    {
      data: 'to_garage_id',
      name: 'to_garage_id',
      title: 'ID Garasi Tujuan',
    },
    {
      data: 'assignment_date',
      name: 'assignment_date',
      title: 'Tanggal Penugasan',
    },
    {
      data: 'id',
      name: 'id',
      title: 'Aksi',
      sortable: false,
      // render(value: number, row: Database['CarGarageAssignment']) {
      //   return (
      //     <div className="gap-2 d-flex flex-nowrap">
      //       {row.deleted_at ? (
      //         <>
      //           <RestoreData
      //             url={route('v1.admin.car-garage-assignment.update', row.id)}
      //             onSuccess={refetch}
      //           />
      //           <ForceDeleteData
      //             onSuccess={refetch}
      //             url={route('v1.admin.car-garage-assignment.destroy', row.id)}
      //           />
      //         </>
      //       ) : (
      //         <>
      //           <Show
      //             id={Number(value)}
      //           />
      //           <EditData
      //             onSuccess={refetch}
      //             id={Number(value)}
      //           />
      //           <DeleteData
      //             withForceDeleteCheckbox
      //             url={route('v1.admin.car-garage-assignment.destroy', row.id)}
      //             onSuccess={refetch}
      //           />
      //         </>
      //       )}
      //     </div>
      //   )
      // }
    },
  ];

  return (
    <AuthenticatedAdmin
      header={
        <div className="d-flex justify-content-between">
          <div className="flex-column d-flex">
            <h3 className="h4 fw-semibold">Penugasan Mobil ke Garasi</h3>
            <Breadcrumb className="m-0" bsPrefix="m-0 breadcrumb">
              <BreadcrumbItem linkAs={Link} href={route('administrator.home')}>Dasbor Beranda</BreadcrumbItem>
              <BreadcrumbItem active>Penugasan Mobil ke Garasi</BreadcrumbItem>
            </Breadcrumb>
          </div>

          {/* <CreateData onSuccess={refetch} /> */}
        </div>
      }
    >
      <Head title="Penugasan Mobil ke Garasi" />

      <AlertPage />

      <DataTable
        ref={dataTableRef}
        withTrashToggle
        className="mt-3"
        url={route('v1.admin.car-garage-assignment.index')}
        columns={columns}
      />
    </AuthenticatedAdmin>
  )
};

