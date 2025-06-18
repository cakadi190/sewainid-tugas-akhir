import { AuthenticatedAdmin } from "@/Layouts/AuthenticatedLayout";
import { Badge, Breadcrumb, BreadcrumbItem, Button, ButtonGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Head, Link, router } from "@inertiajs/react";
import AlertPage from "@/Components/AlertPage";
import { useDataTable } from "@/Hooks/useDatatables";
import DataTable, { Column } from "@/Components/DataTable";
import { getTransactionStatusColor, getTransactionStatusLabel } from "@/Helpers/EnumHelper";
import { TransactionStatusEnum } from "@/Helpers/enum";
import dayjs from "@/Helpers/dayjs";
import { FaBan, FaCheck, FaEye, FaTrash } from "react-icons/fa6";
import Database from "@/types/database";
import { currencyFormat } from "@/Helpers/number";
import DeleteData from "@/Components/crud/DeleteData";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { extractQueryParams } from "@/Helpers/url";

export default function Index() {
  const { dataTableRef, refetch } = useDataTable();
  const queryParams = extractQueryParams(window.location.href);
  const searchQuery = queryParams.search || '';

  const updateTransactionStatus = (id: string, status: TransactionStatusEnum) => {
    withReactContent(Swal).fire({
      title: 'Apakah kamu yakin?',
      html: "Apakah kamu yakin akan merubah status transaksi ini menjadi \"<strong>" + getTransactionStatusLabel(status) + "\"</strong>? Jika iya, maka aksi ini tidak dapat dikembalikan.",
      showCancelButton: true,
      showConfirmButton: true,
      reverseButtons: true,
      icon: 'warning',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#333',
      confirmButtonText: 'Ubah Status',
      cancelButtonText: 'Batalkan',
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        if (status === TransactionStatusEnum.PAID) {
          showFileUploadDialog(id, status);
        } else {
          updateTransaction(id, status);
        }
      }
    });
  };

  const showFileUploadDialog = (id: string, status: TransactionStatusEnum) => {
    withReactContent(Swal).fire({
      title: 'Upload Bukti Pembayaran',
      html: `
      <div style="text-align: left;">
        <label for="file-upload" style="display: block; margin-bottom: 8px; font-weight: 500;">
          Pilih file bukti pembayaran:
        </label>
        <input
          type="file"
          id="file-upload"
          accept="image/*,.pdf"
          class="form-control"
        />
        <small style="color: #666; margin-top: 4px; display: block;">
          Format yang didukung: JPG, PNG, PDF (Max: 5MB)
        </small>
      </div>
    `,
      showCancelButton: true,
      confirmButtonText: 'Upload & Update Status',
      cancelButtonText: 'Batalkan',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#333',
      preConfirm: () => {
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        const file = fileInput?.files?.[0];

        if (!file) {
          Swal.showValidationMessage('Silakan pilih file terlebih dahulu');
          return false;
        }

        // Validasi ukuran file (5MB)
        if (file.size > 5 * 1024 * 1024) {
          Swal.showValidationMessage('Ukuran file tidak boleh lebih dari 5MB');
          return false;
        }

        // Validasi tipe file
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
          Swal.showValidationMessage('Format file tidak didukung. Gunakan JPG, PNG, atau PDF');
          return false;
        }

        return file;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        updateTransactionWithFile(id, status, result.value);
      }
    });
  };

  const updateTransaction = (id: string, status: TransactionStatusEnum, file?: File) => {
    const formData = new FormData();
    formData.append('status', status);
    formData.append('action', 'updateTransactionStatus');
    formData.append('_method', 'PUT');

    if (file) {
      formData.append('payment_proof', file);
    }

    router.post(route('v1.admin.booking.update', id), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onSuccess: () => {
        Swal.fire({
          title: 'Berhasil!',
          text: 'Status transaksi berhasil diperbarui',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        refetch();
      },
      onError: (errors) => {
        Swal.fire({
          title: 'Gagal!',
          text: 'Terjadi kesalahan saat memperbarui status',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        refetch();
      },
    });
  };

  const updateTransactionWithFile = (id: string, status: TransactionStatusEnum, file: File) => {
    // Tampilkan loading saat upload
    Swal.fire({
      title: 'Mengupload...',
      text: 'Sedang memproses upload file dan update status',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    updateTransaction(id, status, file);
  };

  const columns: Column[] = [
    {
      data: 'id',
      name: 'id',
      title: 'ID Tagihan',
      render: (value: string) => (
        <strong>#{value}</strong>
      )
    },
    {
      data: 'created_at',
      name: 'created_at',
      title: 'Dibuat Tanggal',
      render: (value: string) => dayjs(value).locale('id').format('LLLL')
    },
    {
      data: 'expired_at',
      name: 'expired_at',
      title: 'Kadaluarsa Pada',
      render: (value: string) => dayjs(value).locale('id').format('LLLL')
    },
    {
      data: 'total_pay',
      name: 'total_pay',
      title: 'Total Tagihan',
      render: (value: number) => currencyFormat(value),
    },
    {
      data: 'status',
      name: 'status',
      title: 'Status Tagihan',
      render: (value: string) => (
        <Badge color={getTransactionStatusColor(value as unknown as TransactionStatusEnum)}>{getTransactionStatusLabel(value as unknown as TransactionStatusEnum)}</Badge>
      ),
    },
    {
      data: 'id',
      name: 'id',
      title: 'Aksi',
      render: (value: string, row: Database['Transaction']) => (
        <ButtonGroup size="sm">
          {row.status === TransactionStatusEnum.UNPAID && (
            <>
              <Button
                variant="danger"
                title="Batalkan"
                onClick={() => updateTransactionStatus(value, TransactionStatusEnum.FAILED)}
              >
                <FaBan />
              </Button>
              <Button
                variant="success"
                onClick={() => updateTransactionStatus(value, TransactionStatusEnum.PAID)}
                title="Verifikasi Manual"
              >
                <FaCheck />
              </Button>
            </>
          )}
          <Button
            title="Lihat Tagihan"
            variant="primary"
          >
            <FaEye />
          </Button>
          <DeleteData
            url={route('v1.admin.booking.destroy', row.id)}
            onSuccess={refetch}
          />
        </ButtonGroup>
      ),
    },
  ];

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

      <DataTable
        ref={dataTableRef}
        search={searchQuery}
        className="mt-3"
        url={route('v1.admin.booking.index')}
        columns={columns}
      />
    </AuthenticatedAdmin>
  )
};
