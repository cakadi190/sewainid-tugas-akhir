import { AuthenticatedAdmin } from "@/Layouts/AuthenticatedLayout";
import { Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import { Head, Link } from "@inertiajs/react";
import AlertPage from "@/Components/AlertPage";

export default function Index() {
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

      {/* Konten Booking/Pemesanan akan ditambahkan di sini */}
      <div className="mt-3">
        {/* Contoh: Tampilkan pesan atau komponen lain terkait Booking */}
        <p>Silakan kelola data pemesanan di halaman ini.</p>
      </div>
    </AuthenticatedAdmin>
  )
};
