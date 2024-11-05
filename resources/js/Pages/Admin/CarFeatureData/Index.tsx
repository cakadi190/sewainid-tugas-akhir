import { AuthenticatedAdmin } from "@/Layouts/AuthenticatedLayout";
import { Link } from "@inertiajs/react";
import { Breadcrumb } from "react-bootstrap";

export default function Index() {
  return (
    <AuthenticatedAdmin
      header={
        <div className="d-flex justify-content-between">
          <div className="flex-column d-flex">
            <h3 className="h4 fw-semibold">Data Fitur Kendaraan</h3>
            <Breadcrumb className="m-0" bsPrefix="m-0 breadcrumb">
              <Breadcrumb.Item linkAs={Link} href={route('administrator.home')}>Dasbor Beranda</Breadcrumb.Item>
              <Breadcrumb.Item active>Data Fitur Kendaraan</Breadcrumb.Item>
            </Breadcrumb>
          </div>

          {/* <CreateData onSuccess={refetch} /> */}
        </div>
      }
    ></AuthenticatedAdmin>
  )
};
