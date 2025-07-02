import AlertPage from "@/Components/AlertPage";
import DataTable, { Column } from "@/Components/DataTable";
import {
  getRentalStatusColor,
  getRentalStatusLabel,
} from "@/Helpers/EnumHelper";
import dayjs from "@/Helpers/dayjs";
import { RentalStatusEnum, TransactionStatusEnum } from "@/Helpers/enum";
import { currencyFormat } from "@/Helpers/number";
import { extractQueryParams } from "@/Helpers/url";
import { useDataTable } from "@/Hooks/useDatatables";
import { AuthenticatedAdmin } from "@/Layouts/AuthenticatedLayout";
import Database from "@/types/database";
import { Head, Link, router } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ButtonGroup,
  Form,
  Modal,
} from "react-bootstrap";
import { FaCheck, FaTimes } from "react-icons/fa";
import { GiSteeringWheel } from "react-icons/gi";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

interface DriverData {
  [key: string]: string;
}

interface AssignModalData {
  show: boolean;
  transactionId: string;
  currentDriverId?: number;
  currentConductorId?: number;
}

export default function Index() {
  const { dataTableRef, refetch } = useDataTable();
  const [drivers, setDrivers] = useState<DriverData>({});
  const [conductors, setConductors] = useState<DriverData>({});
  const [assignModal, setAssignModal] = useState<AssignModalData>({
    show: false,
    transactionId: "",
  });
  const [selectedDriverId, setSelectedDriverId] = useState<string>("0");
  const [selectedConductorId, setSelectedConductorId] = useState<string>("0");

  const queryParams = useMemo(
    () => extractQueryParams(window.location.href),
    []
  );
  const searchQuery = queryParams.search || "";

  useEffect(() => {
    const fetchDriversAndConductors = async () => {
      try {
        const [driversResponse, conductorsResponse] = await Promise.all([
          axios.get(route("v1.admin.user-assign.driver")),
          axios.get(route("v1.admin.user-assign.conductor")),
        ]);

        setDrivers(driversResponse.data.data || {});
        setConductors(conductorsResponse.data.data || {});
      } catch (error) {
        console.error("Gagal mengambil data sopir/kernet:", error);
      }
    };

    fetchDriversAndConductors();
  }, []);

  const handleUpdateRentStatus = (id: string, status: RentalStatusEnum) => {
    withReactContent(Swal)
      .fire({
        title: "Apakah kamu yakin?",
        text:
          "Apakah kamu yakin akan merubah status sewa ini ke " +
          getRentalStatusLabel(status) +
          "?",
        showCancelButton: true,
        showConfirmButton: true,
        icon: "warning",
        confirmButtonColor: "#ffc107",
        cancelButtonColor: "#0d6efd",
        confirmButtonText: "Ya, Ubah Status",
        cancelButtonText: "Batal",
        reverseButtons: true,
      })
      .then(({ isConfirmed }) => {
        if (isConfirmed) {
          router.put(
            route("v1.admin.transaction.update", id),
            {
              rental_status: status,
              action: "updateRentStatus",
            },
            {
              onSuccess: () => {
                refetch();
              },
            }
          );
        }
      });
  };

  const handleAssignDriverConductor = (
    transactionId: string,
    currentDriverId?: number,
    currentConductorId?: number
  ) => {
    setAssignModal({
      show: true,
      transactionId,
      currentDriverId,
      currentConductorId,
    });
    setSelectedDriverId(currentDriverId?.toString() || "0");
    setSelectedConductorId(currentConductorId?.toString() || "0");
  };

  const handleModalClose = () => {
    setAssignModal({ show: false, transactionId: "" });
    setSelectedDriverId("0");
    setSelectedConductorId("0");
  };

  const handleModalSubmit = () => {
    const driverId = selectedDriverId === "0" ? null : Number(selectedDriverId);
    const conductorId =
      selectedConductorId === "0" ? null : Number(selectedConductorId);

    router.put(
      route("v1.admin.transaction.update", assignModal.transactionId),
      {
        driver_id: driverId,
        conductor_id: conductorId,
        action: "assignDriverConductor",
      },
      {
        onSuccess: () => {
          handleModalClose();
          refetch();
          Swal.fire({
            title: "Berhasil!",
            text: "Sopir dan kernet berhasil di-assign",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        },
        onError: () => {
          Swal.fire({
            title: "Gagal!",
            text: "Terjadi kesalahan saat assign sopir & kernet",
            icon: "error",
          });
        },
      }
    );
  };

  const columns: Column[] = useMemo(
    () => [
      {
        data: "id",
        name: "id",
        title: "ID Sewa",
        render: (value: string) => <strong>#{value}</strong>,
      },
      {
        data: "car_data",
        name: "car_data",
        title: "Kendaraan",
        render: (value: Database["CarData"]) => (
          <span>
            {value.brand} {value.car_name}
          </span>
        ),
      },
      {
        data: "driver",
        name: "driver",
        title: "Driver",
        render: (
          value: Database["User"] | null,
          row: Database["Transaction"] & {
            driver: Database["User"] | null;
            conductor: Database["User"] | null;
          }
        ) => {
          const assignedDriver = row.driver;
          const assignedConductor = row.conductor;

          if (assignedDriver || assignedConductor) {
            return (
              <div>
                {assignedDriver && (
                  <div>
                    <div className="fw-semibold">
                      <small className="text-primary">Sopir:</small>{" "}
                      {assignedDriver.name}
                    </div>
                    <small className="text-muted">{assignedDriver.phone}</small>
                  </div>
                )}
                {assignedConductor && (
                  <div className={assignedDriver ? "mt-1" : ""}>
                    <div className="fw-semibold">
                      <small className="text-success">Kernet:</small>{" "}
                      {assignedConductor.name}
                    </div>
                    <small className="text-muted">
                      {assignedConductor.phone}
                    </small>
                  </div>
                )}
              </div>
            );
          }

          return value ? (
            <div>
              <div className="fw-semibold">{value.name}</div>
              <small className="text-muted">{value.phone}</small>
            </div>
          ) : (
            <Badge bg="secondary">Tanpa Driver</Badge>
          );
        },
      },
      {
        data: "pickup_date",
        name: "pickup_date",
        title: "Tanggal Mulai",
        render: (value: string) =>
          dayjs(value).locale("id").format("DD MMM YYYY"),
      },
      {
        data: "return_date",
        name: "return_date",
        title: "Tanggal Selesai",
        render: (value: string) =>
          dayjs(value).locale("id").format("DD MMM YYYY"),
      },
      {
        data: "id",
        name: "id",
        title: "Durasi",
        render: (_: number, row: Database["Transaction"]) => {
          const pickDateObj = row.pickup_date
            ? dayjs(row.pickup_date)
            : undefined;
          const returnDateObj = row.return_date
            ? dayjs(row.return_date)
            : undefined;
          const duration = returnDateObj
            ? returnDateObj.diff(pickDateObj, "day") + 1
            : 0;
          return <strong>{duration} Hari</strong>;
        },
      },
      {
        data: "total_price",
        name: "total_price",
        title: "Harga Sewa",
        render: (value: number) => currencyFormat(value),
      },
      {
        data: "rental_status",
        name: "rental_status",
        title: "Status Sewa",
        render: (value: RentalStatusEnum) => (
          <Badge bg={getRentalStatusColor(value)}>
            {getRentalStatusLabel(value)}
          </Badge>
        ),
      },
      {
        data: "created_at",
        name: "created_at",
        title: "Dibuat Tanggal",
        render: (value: string) =>
          dayjs(value).locale("id").format("DD MMM YYYY, HH:mm"),
      },
      {
        data: "id",
        name: "id",
        title: "Aksi",
        render: (
          value: string,
          row: Database["Transaction"] & {
            driver: Database["User"] | null;
            conductor: Database["User"] | null;
          }
        ) =>
          [RentalStatusEnum.PENDING, RentalStatusEnum.IN_PROGRESS].includes(
            row.rental_status
          ) && row.status === TransactionStatusEnum.PAID ? (
            <ButtonGroup size="sm">
              {row.rental_status === RentalStatusEnum.PENDING &&
                (!row.driver || !row.conductor) && (
                  <Button
                    variant="primary"
                    onClick={() =>
                      handleAssignDriverConductor(
                        value,
                        row.driver?.id,
                        row.conductor?.id
                      )
                    }
                    title="Assign Sopir & Kernet"
                  >
                    <GiSteeringWheel />
                  </Button>
                )}
              <Button
                variant={
                  row.rental_status === RentalStatusEnum.IN_PROGRESS
                    ? "danger"
                    : "success"
                }
                onClick={() =>
                  handleUpdateRentStatus(
                    value,
                    row.rental_status === RentalStatusEnum.IN_PROGRESS
                      ? RentalStatusEnum.COMPLETED
                      : RentalStatusEnum.IN_PROGRESS
                  )
                }
                className="gap-2 d-flex align-items-center"
              >
                {row.rental_status !== RentalStatusEnum.IN_PROGRESS ? (
                  <FaCheck />
                ) : (
                  <FaTimes />
                )}
                {row.rental_status === RentalStatusEnum.IN_PROGRESS
                  ? "Akhiri Trip"
                  : "Mulai Trip"}
              </Button>
            </ButtonGroup>
          ) : (
            <small className="text-muted">Tidak Ada Aksi</small>
          ),
      },
    ],
    [refetch, drivers, conductors]
  );

  return (
    <AuthenticatedAdmin
      header={
        <div className="d-flex justify-content-between">
          <div className="flex-column d-flex">
            <h3 className="h4 fw-semibold">Data Sewa Kendaraan</h3>
            <Breadcrumb className="m-0" bsPrefix="m-0 breadcrumb">
              <BreadcrumbItem linkAs={Link} href={route("administrator.home")}>
                Dasbor Beranda
              </BreadcrumbItem>
              <BreadcrumbItem active>Data Sewa Kendaraan</BreadcrumbItem>
            </Breadcrumb>
          </div>
        </div>
      }
    >
      <Head title="Data Sewa Kendaraan" />
      <AlertPage />
      <DataTable
        ref={dataTableRef}
        search={searchQuery}
        className="mt-3"
        url={route("v1.admin.transaction.index")}
        columns={columns}
      />

      <Modal show={assignModal.show} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Assign Sopir & Kernet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Pilih Sopir:</Form.Label>
              <Form.Select
                value={selectedDriverId}
                onChange={(e) => setSelectedDriverId(e.target.value)}
              >
                <option value="0">Tidak Ada Sopir</option>
                {Object.entries(drivers).map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Pilih Kernet:</Form.Label>
              <Form.Select
                value={selectedConductorId}
                onChange={(e) => setSelectedConductorId(e.target.value)}
              >
                <option value="0">Tidak Ada Kernet</option>
                {Object.entries(conductors).map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Batal
          </Button>
          <Button variant="success" onClick={handleModalSubmit}>
            Assign
          </Button>
        </Modal.Footer>
      </Modal>
    </AuthenticatedAdmin>
  );
}
