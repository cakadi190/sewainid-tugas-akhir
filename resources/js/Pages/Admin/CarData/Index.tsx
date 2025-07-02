import AlertPage from "@/Components/AlertPage";
import DeleteData from "@/Components/crud/DeleteData";
import ForceDeleteData from "@/Components/crud/ForceDeleteData";
import RestoreData from "@/Components/crud/RestoreData";
import DataTable from "@/Components/DataTable";
import { CarModelEnum, CarStatusEnum } from "@/Helpers/enum";
import {
  getCarModelColor,
  getCarModelLabel,
  getCarStatusColor,
  getCarStatusIcon,
  getCarStatusLabel,
} from "@/Helpers/EnumHelper";
import { parseAntiXss } from "@/Helpers/string";
import { useDataTable } from "@/Hooks/useDatatables";
import { AuthenticatedAdmin } from "@/Layouts/AuthenticatedLayout";
import type Database from "@/types/database";
import { Head, Link } from "@inertiajs/react";
import { Badge, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import { FaEye } from "react-icons/fa6";
import CreateData from "./CreateData";
import EditData from "./EditData";

export default function Index() {
  const { dataTableRef, refetch } = useDataTable();

  const columns = [
    {
      data: "brand",
      name: "brand",
      title: "Brand / Merk",
    },
    {
      data: "car_name",
      name: "car_name",
      title: "Nama",
      render: (value: string) => (
        <span dangerouslySetInnerHTML={{ __html: parseAntiXss(value) }} />
      ),
    },
    {
      data: "license_plate",
      name: "license_plate",
      title: "Nomor Polisi",
      render: (value: string) => <span className="font-mono">{value}</span>,
    },
    {
      data: "frame_number",
      name: "frame_number",
      title: "Nomor Rangka",
      render: (value: string) => <span className="font-mono">{value}</span>,
    },
    {
      data: "model",
      name: "model",
      title: "Model Kendaraan",
      render: (value: string) => (
        <Badge bg={getCarModelColor(value as CarModelEnum)}>
          {getCarModelLabel(value as CarModelEnum)}
        </Badge>
      ),
    },
    {
      data: "status",
      name: "status",
      title: "Status Kendaraan",
      render: (value: string) => (
        <div className="gap-2 d-flex align-items-center">
          <span className={`text-${getCarStatusColor(value as CarStatusEnum)}`}>
            {getCarStatusIcon(value as CarStatusEnum)}
          </span>
          {getCarStatusLabel(value as CarStatusEnum)}
        </div>
      ),
    },
    {
      data: "id",
      name: "id",
      title: "Aksi",
      sortable: false,
      render(value: number, row: Database["CarData"]) {
        return (
          <div className="gap-2 d-flex flex-nowrap">
            {row.deleted_at ? (
              <>
                <RestoreData
                  url={route("v1.admin.car-data.update", row.id)}
                  onSuccess={refetch}
                />
                <ForceDeleteData
                  onSuccess={refetch}
                  url={route("v1.admin.car-data.destroy", row.id)}
                />
              </>
            ) : (
              <>
                <Link
                  className="btn btn-sm btn-primary"
                  href={route("administrator.car-data.show", row.id)}
                >
                  <FaEye />
                </Link>
                <EditData onSuccess={refetch} id={Number(value)} />
                <DeleteData
                  withForceDeleteCheckbox
                  url={route("v1.admin.car-data.destroy", row.id)}
                  onSuccess={refetch}
                />
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <AuthenticatedAdmin
      header={
        <div className="d-flex justify-content-between">
          <div className="flex-column d-flex">
            <h3 className="h4 fw-semibold">Data Kendaraan</h3>
            <Breadcrumb className="m-0" bsPrefix="m-0 breadcrumb">
              <BreadcrumbItem linkAs={Link} href={route("administrator.home")}>
                Dasbor Beranda
              </BreadcrumbItem>
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
        className="mt-3"
        url={route("v1.admin.car-data.index")}
        columns={columns}
      />
    </AuthenticatedAdmin>
  );
}
