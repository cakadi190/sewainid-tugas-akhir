import { AuthenticatedAdmin } from "@/Layouts/AuthenticatedLayout";
import { Badge, Breadcrumb, BreadcrumbItem, Button, ButtonGroup } from "react-bootstrap";
import { Head, Link, router } from "@inertiajs/react";
import AlertPage from "@/Components/AlertPage";
import { useDataTable } from "@/Hooks/useDatatables";
import DataTable, { Column } from "@/Components/DataTable";
import { getTransactionStatusColor, getTransactionStatusLabel } from "@/Helpers/EnumHelper";
import { TransactionStatusEnum } from "@/Helpers/enum";
import dayjs from "@/Helpers/dayjs";
import { FaBan, FaCheck, FaEye, FaFile } from "react-icons/fa6";
import Database from "@/types/database";
import { currencyFormat } from "@/Helpers/number";
import DeleteData from "@/Components/crud/DeleteData";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { extractQueryParams } from "@/Helpers/url";
import { useCallback, useMemo } from "react";

const SwalInit = withReactContent(Swal);

const FILE_UPLOAD_CONFIG = {
  maxSize: 5 * 1024 * 1024,
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  allowedExtensions: 'JPG, PNG, PDF'
} as const;

const SWAL_STYLES = {
  confirm: '#28a745',
  danger: '#d33',
  cancel: '#333'
} as const;

export default function Index() {
  const { dataTableRef, refetch } = useDataTable();
  const queryParams = useMemo(() => extractQueryParams(window.location.href), []);
  const searchQuery = queryParams.search || '';

  const validateFile = useCallback((file: File | null): string | null => {
    if (!file) return 'Silakan pilih file terlebih dahulu';

    if (file.size > FILE_UPLOAD_CONFIG.maxSize) {
      return 'Ukuran file tidak boleh lebih dari 5MB';
    }

    if (!FILE_UPLOAD_CONFIG.allowedTypes.includes(file.type as "image/jpeg" | "image/jpg" | "image/png" | "application/pdf")) {
      return `Format file tidak didukung. Gunakan ${FILE_UPLOAD_CONFIG.allowedExtensions}`;
    }

    return null;
  }, []);

  const updateTransaction = useCallback((id: string, status: TransactionStatusEnum, file?: File) => {
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
        SwalInit.fire({
          title: 'Berhasil!',
          text: 'Status transaksi berhasil diperbarui',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        refetch();
      },
      onError: () => {
        SwalInit.fire({
          title: 'Gagal!',
          text: 'Terjadi kesalahan saat memperbarui status',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        refetch();
      },
    });
  }, [refetch]);

  const updateTransactionWithFile = useCallback((id: string, status: TransactionStatusEnum, file: File) => {
    SwalInit.fire({
      title: 'Mengupload...',
      text: 'Sedang memproses upload file dan update status',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        SwalInit.showLoading();
      }
    });

    updateTransaction(id, status, file);
  }, [updateTransaction]);

  const showFileUploadDialog = useCallback((id: string, status: TransactionStatusEnum) => {
    SwalInit.fire({
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
            Format yang didukung: ${FILE_UPLOAD_CONFIG.allowedExtensions} (Max: 5MB)
          </small>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Upload & Update Status',
      cancelButtonText: 'Batalkan',
      confirmButtonColor: SWAL_STYLES.confirm,
      cancelButtonColor: SWAL_STYLES.cancel,
      preConfirm: () => {
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        const file = fileInput?.files?.[0] || null;

        const validationError = validateFile(file);
        if (validationError) {
          SwalInit.showValidationMessage(validationError);
          return false;
        }

        return file;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        updateTransactionWithFile(id, status, result.value);
      }
    });
  }, [validateFile, updateTransactionWithFile]);

  const updateTransactionStatus = useCallback((
    id: string,
    status: TransactionStatusEnum,
    hasTransactionConfirmation: boolean = false
  ) => {
    SwalInit.fire({
      title: 'Apakah kamu yakin?',
      html: `Apakah kamu yakin akan merubah status transaksi ini menjadi "<strong>${getTransactionStatusLabel(status)}</strong>"? Jika iya, maka aksi ini tidak dapat dikembalikan.`,
      showCancelButton: true,
      showConfirmButton: true,
      reverseButtons: true,
      icon: 'warning',
      confirmButtonColor: SWAL_STYLES.danger,
      cancelButtonColor: SWAL_STYLES.cancel,
      confirmButtonText: 'Ubah Status',
      cancelButtonText: 'Batalkan',
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        if (status === TransactionStatusEnum.PAID && !hasTransactionConfirmation) {
          showFileUploadDialog(id, status);
        } else {
          updateTransaction(id, status);
        }
      }
    });
  }, [showFileUploadDialog, updateTransaction]);

  const seeConfirmationData = useCallback((transactionConfirmation: Database['TransactionConfirmation']) => {
    SwalInit.fire({
      title: `Data Bukti Pembayaran #${transactionConfirmation.transaction_id}`,
      html: `
        <div class="form-group mb-3 d-flex w-100 flex-column justify-content-start align-items-start">
          <label for="transaction_receipt" class="fw-bold mb-1">Diunggah Pada</label>
          <div>${dayjs(transactionConfirmation.created_at).locale('id').format('LLLL')}</div>
        </div>
        <div class="form-group mb-3 d-flex w-100 flex-column justify-content-start align-items-start">
          <label for="transaction_receipt" class="fw-bold mb-1">Bukti Pembayaran</label>
          <img src="${`/storage/${transactionConfirmation.transaction_receipt}`}" alt="Bukti Pembayaran" class="w-100" />
        </div>
      `,
      confirmButtonText: 'Tutup',
      confirmButtonColor: SWAL_STYLES.confirm
    })
  }, []);

  const columns: Column[] = useMemo(() => [
    {
      data: 'id',
      name: 'id',
      title: 'ID Tagihan',
      render: (value: string) => <strong>#{value}</strong>
    },
    {
      data: 'car_data',
      name: 'car_data',
      title: 'Kendaraan',
      render: (value: Database['CarData']) => (
        <span>{value.brand} {value.car_name}</span>
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
      render: (value: TransactionStatusEnum) => (
        <Badge bg={getTransactionStatusColor(value)}>
          {getTransactionStatusLabel(value)}
        </Badge>
      ),
    },
    {
      data: 'id',
      name: 'id',
      title: 'Aksi',
      render: (value: string, row: Database['Transaction'] & { transaction_confirmation: Database['TransactionConfirmation'] | null }) => (
        <ButtonGroup size="sm">
          {row.transaction_confirmation && (
            <Button
              variant="info"
              onClick={() => seeConfirmationData(row.transaction_confirmation!)}
              title="Lihat Bukti Pembayaran"
            >
              <FaFile />
            </Button>
          )}
          {row.status === TransactionStatusEnum.UNPAID && (
            <>
              <Button
                variant="danger"
                title="Batalkan Transaksi"
                onClick={() => updateTransactionStatus(value, TransactionStatusEnum.FAILED)}
              >
                <FaBan />
              </Button>
              <Button
                variant="success"
                onClick={() => updateTransactionStatus(
                  value,
                  TransactionStatusEnum.PAID,
                  !!row.transaction_confirmation
                )}
                title="Verifikasi Pembayaran"
              >
                <FaCheck />
              </Button>
            </>
          )}
          <Link
            title="Lihat Detail Tagihan"
            href={route('administrator.booking.show', value)}
            className="btn btn-primary"
          >
            <FaEye />
          </Link>
          <DeleteData
            url={route('v1.admin.booking.destroy', row.id)}
            onSuccess={refetch}
          />
        </ButtonGroup>
      ),
    },
  ], [updateTransactionStatus, seeConfirmationData, refetch]);

  return (
    <AuthenticatedAdmin
      header={
        <div className="d-flex justify-content-between">
          <div className="flex-column d-flex">
            <h3 className="h4 fw-semibold">Data Pemesanan</h3>
            <Breadcrumb className="m-0" bsPrefix="m-0 breadcrumb">
              <BreadcrumbItem linkAs={Link} href={route('administrator.home')}>
                Dasbor Beranda
              </BreadcrumbItem>
              <BreadcrumbItem active>Data Pemesanan</BreadcrumbItem>
            </Breadcrumb>
          </div>
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
  );
}
