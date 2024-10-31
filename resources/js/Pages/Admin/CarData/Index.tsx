import DataTable, { Column } from "@/Components/DataTable";
import { useDataTable } from "@/Hooks/useDatatables";
import { AuthenticatedAdmin } from "@/Layouts/AuthenticatedLayout";
import type Database from "@/types/database";
import { Head, Link } from "@inertiajs/react";
import { Breadcrumb, BreadcrumbItem } from "react-bootstrap";

export default function Index() {
  const { dataTableRef, refetch } = useDataTable();

  const columns: Column<Database['CarData']>[] = [
    {
      label: 'Nama Mobil',
      accessorKey: 'name',
    },
    {
      label: 'Merk / Vendor',
      accessorKey: 'brand',
    },
    {
      label: 'Model',
      accessorKey: 'model',
      render(row, value) {
        const CarModelEnum = {
          mini_van: { label: 'Mini Van', color: 'primary' },
          van: { label: 'Van', color: 'primary' },
          city_car: { label: 'City Car', color: 'success' },
          hatchback: { label: 'Hatchback', color: 'success' },
          sedan: { label: 'Sedan', color: 'info' },
          suv: { label: 'SUV', color: 'warning' },
          mpv: { label: 'MPV', color: 'warning' },
          pickup: { label: 'Pickup Truck', color: 'primary' },
          luxury_car: { label: 'Luxury Car', color: 'danger' },
        };

        const model = CarModelEnum[value as keyof typeof CarModelEnum];
        if (!model) return null;

        return (
          <span className={`badge bg-${model.color}`}>
            {model.label}
          </span>
        );
      }
    },
    {
      label: 'Nomor Polisi',
      accessorKey: 'license_plate',
      render(row, value) {
        return (<span className="font-mono">{value}</span>)
      }
    },
    {
      label: 'Nomor Rangka',
      accessorKey: 'frame_number',
      render(row, value) {
        return (<span className="font-mono">{value}</span>)
      }
    },
    {
      label: 'Status',
      accessorKey: 'status',
      render(row, value) {
        // Mapping for CarStatusEnum in TypeScript
        const CarStatusEnum = {
          ready: { label: 'Siap Dipinjamkan', color: 'success' },
          borrowed: { label: 'Sudah Disewakan', color: 'primary' },
          crash: { label: 'Rusak', color: 'danger' },
          repair: { label: 'Direparasi', color: 'warning' },
          missing: { label: 'Hilang', color: 'dark' },
          sold: { label: 'Terjual', color: 'secondary' },
        };

        const status = CarStatusEnum[value as keyof typeof CarStatusEnum];
        if (!status) return null;

        return (
          <span className={`badge bg-${status.color}`}>
            {status.label}
          </span>
        );
      }
    },
    {
      label: 'Aksi',
      sortable: false,
      accessorKey: 'id',
    },
  ];

  return (
    <AuthenticatedAdmin
      header={
        <div className="d-flex justify-content-between">
          <div className="flex-column d-flex">
            <h3 className="h4 fw-semibold">Data Mobil</h3>
            <Breadcrumb className="m-0" bsPrefix="m-0 breadcrumb">
              <BreadcrumbItem linkAs={Link} href={route('administrator.home')}>Dasbor Beranda</BreadcrumbItem>
              <BreadcrumbItem active>Data Mobil</BreadcrumbItem>
            </Breadcrumb>
          </div>
        </div>
      }
    >
      <Head title="Data Mobil" />

      <DataTable
        className="mt-3"
        ref={dataTableRef}
        withShowTrashedToggleData
        url={route('v1.admin.car-data.index')}
        columns={columns}
      />
    </AuthenticatedAdmin>
  )
};
