import { AuthenticatedAdmin } from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Breadcrumb, BreadcrumbItem } from "react-bootstrap";

export default function BookingIndex() {
  return (
    <AuthenticatedAdmin
      header={
        <div className="d-flex justify-content-between">
          <div className="flex-column d-flex">
            <h3 className="h4 fw-semibold">Data Peminjaman</h3>
            <Breadcrumb className="m-0" bsPrefix="m-0 breadcrumb">
              <BreadcrumbItem linkAs={Link} href={route('administrator.home')}>
                Dasbor Beranda
              </BreadcrumbItem>
              <BreadcrumbItem active>Data Peminjaman</BreadcrumbItem>
            </Breadcrumb>
          </div>
        </div>
      }
    >
      <Head title="Data Peminjaman" />
    </AuthenticatedAdmin>
  )
}
