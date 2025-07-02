import AlertPage from "@/Components/AlertPage";
import DeleteData from "@/Components/crud/DeleteData";
import DataTable from "@/Components/DataTable";
import {
  getCarRepairStatusColor,
  getCarRepairStatusLabel,
} from "@/Helpers/enums/carRepairStatusLabel";
import { currencyFormat } from "@/Helpers/number";
import { parseAntiXss } from "@/Helpers/string";
import { useDataTable } from "@/Hooks/useDatatables";
import { AuthenticatedAdmin } from "@/Layouts/AuthenticatedLayout";
import type Database from "@/types/database";
import { Head, Link } from "@inertiajs/react";
import dayjs from "dayjs";
import { Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import CreateData from "./CreateData";
import EditData from "./EditData";
import Show from "./Show";

export default function Index() {
  const { dataTableRef, refetch } = useDataTable();

  const columns = [
    {
      data: "car_brand",
      name: "car_brand",
      title: "Kendaraan",
      render: (value: string) => (
        <span dangerouslySetInnerHTML={{ __html: parseAntiXss(value) }} />
      ),
    },
    {
      data: "repair_date",
      name: "repair_date",
      title: "Tanggal Perbaikan",
      render: (value: string) => dayjs(value).format("DD MMMM YYYY"),
    },
    {
      data: "description",
      name: "description",
      title: "Deskripsi",
      render: (value: string) => (
        <span>
          {value.length > 50 ? value.substring(0, 50) + "..." : value}
        </span>
      ),
    },
    {
      data: "cost",
      name: "cost",
      title: "Biaya",
      render: (value: number) => (
        <span className={value > 0 ? "fw-bold" : "text-muted"}>
          {value > 0 ? currencyFormat(value) : "Tidak Ada Biaya"}
        </span>
      ),
    },
    {
      data: "status",
      name: "status",
      title: "Status",
      render: (value: string) => (
        <span className={`badge ${getCarRepairStatusColor(value)}`}>
          {getCarRepairStatusLabel(value)}
        </span>
      ),
    },
    {
      data: "id",
      name: "id",
      title: "Aksi",
      sortable: false,
      render(value: number, row: Database["CarRepairNoteData"]) {
        return (
          <div className="gap-2 d-flex flex-nowrap">
            <Show id={value} />
            <EditData onSuccess={refetch} id={value} />
            <DeleteData
              url={route("v1.admin.car-repair.destroy", row.id)}
              onSuccess={refetch}
            />
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
            <h3 className="h4 fw-semibold">Catatan Perbaikan</h3>
            <Breadcrumb className="m-0" bsPrefix="m-0 breadcrumb">
              <BreadcrumbItem linkAs={Link} href={route("administrator.home")}>
                Dasbor Beranda
              </BreadcrumbItem>
              <BreadcrumbItem
                linkAs={Link}
                href={route("administrator.car-data.index")}
              >
                Data Kendaraan
              </BreadcrumbItem>
              <BreadcrumbItem active>Catatan Perbaikan</BreadcrumbItem>
            </Breadcrumb>
          </div>

          <CreateData onSuccess={refetch} />
        </div>
      }
    >
      <Head title="Catatan Perbaikan" />

      <AlertPage />

      <DataTable
        ref={dataTableRef}
        className="mt-3"
        url={route("v1.admin.car-repair.index")}
        columns={columns}
      />
    </AuthenticatedAdmin>
  );
}
