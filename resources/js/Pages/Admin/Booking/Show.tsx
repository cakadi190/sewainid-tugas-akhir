import { AuthenticatedAdmin } from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Badge, Breadcrumb, BreadcrumbItem, Button, Card, Col, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import Database, { User, CarData, Transaction, Media } from "@/types/database";
import { CarModelEnum, CarTransmissionEnum, TransactionStatusEnum } from "@/Helpers/enum";
import dayjs from "@/Helpers/dayjs";
import { currencyFormat, speedFormat } from "@/Helpers/number";
import { getCarModelLabel, getCarTransmissionLabel, getTransactionStatusColor, getTransactionStatusLabel } from "@/Helpers/EnumHelper";
import { Mail, Phone, Pin } from "lucide-react";
import { FaCheckCircle, FaDownload, FaEnvelope } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { PiBabyCarriage, PiCarProfileDuotone, PiLock, PiMusicNote, PiPalette, PiSeat, PiShield, PiSnowflake, PiSpeedometer, PiTag, PiTire } from "react-icons/pi";
import { twMerge } from "tailwind-merge";
import { GridContainer, GridItem } from "@/InternalBorderGrid";
import { GiGearStickPattern } from "react-icons/gi";
import { useCallback } from "react";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

interface OrderItem {
  sku: string | null;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  product_url: string | null;
  image_url: string | null;
}

interface PaymentInstruction {
  title: string;
  steps: string[];
}

interface TripayDetail {
  reference: string;
  merchant_ref: string;
  payment_selection_type: string;
  payment_method: string;
  payment_name: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  callback_url: string | null;
  return_url: string;
  amount: number;
  fee_merchant: number;
  fee_customer: number;
  total_fee: number;
  amount_received: number;
  pay_code: string | null;
  pay_url: string;
  checkout_url: string;
  status: TransactionStatusEnum;
  paid_at: string | null;
  expired_time: number;
  qr_url?: string;
  order_items: OrderItem[];
  instructions: PaymentInstruction[];
}

interface BookingWithRelations extends Transaction {
  user: User;
  transactionDetail: TripayDetail;
  car_data: CarData & {
    media: Media[];
    transaction: (Transaction & { user: User })[];
  };
  transaction_confirmation: Database['TransactionConfirmation'] & { user: User };
}

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

const SwalInit = withReactContent(Swal);

const CarSpecification = ({ carData }: { carData: Database['CarData'] }) => {
  return (
    <>
      <div className="pb-4 mb-4 border-bottom">
        <GridContainer textAlign="left" cols={3}>
          <GridItem>
            <div className="gap-3 d-flex">
              <PiCarProfileDuotone size={24} />
              <div>
                <h6 className="mb-0 fw-bold">Jenama</h6>
                <p className="mb-0">{carData.brand}</p>
              </div>
            </div>
          </GridItem>
          <GridItem>
            <div className="gap-3 d-flex">
              <PiTag size={24} />
              <div>
                <h6 className="mb-0 fw-bold">Model</h6>
                <p className="mb-0">{getCarModelLabel(carData.model as unknown as CarModelEnum)}</p>
              </div>
            </div>
          </GridItem>
          <GridItem>
            <div className="gap-3 d-flex">
              <GiGearStickPattern size={24} />
              <div>
                <h6 className="mb-0 fw-bold">Transmisi</h6>
                <p className="mb-0">{getCarTransmissionLabel(carData.transmission as unknown as CarTransmissionEnum)}</p>
              </div>
            </div>
          </GridItem>
          <GridItem>
            <div className="gap-3 d-flex">
              <PiPalette size={24} />
              <div>
                <h6 className="mb-0 fw-bold">Warna</h6>
                <p className="mb-0">{carData.color}</p>
              </div>
            </div>
          </GridItem>
          <GridItem>
            <div className="gap-3 d-flex">
              <PiSeat size={24} />
              <div>
                <h6 className="mb-0 fw-bold">Penumpang</h6>
                <p className="mb-0">{carData.seats} Penumpang</p>
              </div>
            </div>
          </GridItem>
          <GridItem>
            <div className="gap-3 d-flex">
              <PiSpeedometer size={24} />
              <div>
                <h6 className="mb-0 fw-bold">Kecepatan Maksimum</h6>
                <p className="mb-0">{speedFormat(carData.max_speed)}</p>
              </div>
            </div>
          </GridItem>
        </GridContainer>
      </div>

      <div className="pb-4 mb-4 border-bottom">
        <h5 className="mb-4 fw-bold">Kapasitas Bagasi</h5>
        <Row>
          <Col>
            <Card body className="text-center">
              <Card.Text className="mb-1">Bagasi Besar</Card.Text>
              <h4 className="mb-0 fw-bold">{carData.big_luggage}</h4>
            </Card>
          </Col>
          <Col>
            <Card body className="text-center">
              <Card.Text className="mb-1">Bagasi Sedang</Card.Text>
              <h4 className="mb-0 fw-bold">{carData.med_luggage}</h4>
            </Card>
          </Col>
          <Col>
            <Card body className="text-center">
              <Card.Text className="mb-1">Bagasi Kecil</Card.Text>
              <h4 className="mb-0 fw-bold">{carData.small_luggage}</h4>
            </Card>
          </Col>
        </Row>
      </div>

      <div>
        <h5 className="mb-4 fw-bold">Fitur Kendaraan</h5>
        <Row className="g-3">
          <Col md={4}>
            <Card>
              <Card.Body className="flex-row gap-2 align-items-center d-flex">
                <PiSnowflake size={24} />
                <strong className="mb-0 fw-bold">Air Conditioner (AC)</strong>
                <Badge className={twMerge("ms-auto border", carData.ac ? 'text-white' : 'text-dark')} bg={carData.ac ? 'dark' : 'white'}>{carData.ac ? 'Ada' : 'Tidak Ada'}</Badge>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body className="flex-row gap-2 align-items-center d-flex">
                <PiMusicNote size={24} />
                <strong className="mb-0 fw-bold">Audio Entertainment</strong>
                <Badge className={twMerge("ms-auto border", carData.audio ? 'text-white' : 'text-dark')} bg={carData.audio ? 'dark' : 'white'}>{carData.audio ? 'Ada' : 'Tidak Ada'}</Badge>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body className="flex-row gap-2 align-items-center d-flex">
                <PiShield size={24} />
                <strong className="mb-0 fw-bold">ABS</strong>
                <Badge className={twMerge("ms-auto border", carData.abs ? 'text-white' : 'text-dark')} bg={carData.abs ? 'dark' : 'white'}>{carData.abs ? 'Ada' : 'Tidak Ada'}</Badge>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body className="flex-row gap-2 align-items-center d-flex">
                <PiLock size={24} />
                <strong className="mb-0 fw-bold">Child-Lock</strong>
                <Badge className={twMerge("ms-auto border", carData.child_lock ? 'text-white' : 'text-dark')} bg={carData.child_lock ? 'dark' : 'white'}>{carData.child_lock ? 'Ada' : 'Tidak Ada'}</Badge>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body className="flex-row gap-2 align-items-center d-flex">
                <PiTire size={24} />
                <strong className="mb-0 fw-bold">Traction Control</strong>
                <Badge className={twMerge("ms-auto border", carData.traction_control ? 'text-white' : 'text-dark')} bg={carData.traction_control ? 'dark' : 'white'}>{carData.traction_control ? 'Ada' : 'Tidak Ada'}</Badge>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body className="flex-row gap-2 align-items-center d-flex">
                <PiBabyCarriage size={24} />
                <strong className="mb-0 fw-bold">Kursi Bayi</strong>
                <Badge className={twMerge("ms-auto border", carData.baby_seat ? 'text-white' : 'text-dark')} bg={carData.baby_seat ? 'dark' : 'white'}>{carData.baby_seat ? 'Ada' : 'Tidak Ada'}</Badge>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default function Show({ booking, transactionDetail }: {
  booking: BookingWithRelations;
  transactionDetail?: TripayDetail;
}) {
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
      },
      onError: () => {
        SwalInit.fire({
          title: 'Gagal!',
          text: 'Terjadi kesalahan saat memperbarui status',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      },
    });
  }, []);

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

  return (
    <AuthenticatedAdmin
      header={
        <div className="d-flex justify-content-between">
          <div className="flex-column d-flex">
            <h3 className="h4 fw-semibold">Tagihan #{booking.id}</h3>
            <Breadcrumb className="m-0" bsPrefix="m-0 breadcrumb">
              <BreadcrumbItem linkAs={Link} href={route('administrator.home')}>
                Dasbor Beranda
              </BreadcrumbItem>
              <BreadcrumbItem linkAs={Link} href={route('administrator.booking.index')}>
                Data Pemesanan
              </BreadcrumbItem>
              <BreadcrumbItem active>#{booking.id}</BreadcrumbItem>
            </Breadcrumb>
          </div>

          <div><Link href={route('administrator.booking.show', booking.id)} className="btn btn-primary">Perbarui</Link></div>
        </div>
      }
    >
      <Head title={`Detail Tagihan #${booking.id}`} />

      <Row className="mt-3">
        <Col md="8">
          <Card body className="p-2 mb-3 bg-light rounded-4">
            <div className="d-flex flex-column align-items-center flex-lg-row justify-content-between">
              <div>
                <h3 className="fw-bold">#{booking.id}</h3>
                <div className="mt-2">Dibuat pada {dayjs(booking.created_at).format("LLLL")}</div>
              </div>
              <div className="text-start text-lg-end">
                <h4>{currencyFormat(booking.total_pay)}</h4>
                <Badge bg={getTransactionStatusColor(booking.status)}>{getTransactionStatusLabel(booking.status)}</Badge>
              </div>
            </div>
          </Card>

          <Card body className="p-2 mb-3 rounded-4">
            <div className="pb-4 mb-3 border-bottom">
              <h5>Detail Pelanggan</h5>

              <div className="gap-3 pt-3 d-flex align-items-center">
                <img src={booking.user.avatar} alt={booking.user.name} className="rounded-circle" width={96} height={96} />
                <div className="gap-2 d-flex flex-column">
                  <h4 className="mb-0 fw-bold">{booking.user.name}</h4>
                  <div className="flex-wrap gap-2 d-flex align-items-center">
                    <div className="gap-2 d-flex align-items-center">
                      <Mail size={16} />
                      {booking.user.email}
                    </div>
                    <div className="gap-2 d-flex align-items-center">
                      <Phone size={16} />
                      {booking.user.phone}
                    </div>
                    <div className="gap-2 d-flex align-items-center">
                      <Pin size={16} />
                      {booking.user.address}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3">
              <h5 className="mb-3">Rincian Tagihan</h5>

              <ListGroup variant="flush">
                {transactionDetail?.order_items?.map((item, index) => (
                  <ListGroup.Item key={`${item.sku}-${index}`} className="px-0 d-flex justify-content-between">
                    <span className="text-muted">{item.name} x {item.quantity}</span>
                    <span>{currencyFormat(item.price * item.quantity)}</span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </Card>

          <Card body className="p-2 mb-3 rounded-4">
            <h3>{booking.car_data.brand} {booking.car_data.car_name}</h3>

            <CarSpecification carData={booking.car_data} />
          </Card>
        </Col>
        <Col md="4">
          <Card body className="p-2 pb-0 mb-3 rounded-4">
            <h3>Ringkasan</h3>

            <ListGroup className="px-0 mt-3" variant="flush">
              <ListGroupItem className="px-0 d-flex justify-content-between align-items-center">
                <strong>Jatuh Tempo</strong>
                <span>{dayjs(booking.expired_at).format("LLL")}</span>
              </ListGroupItem>
              <ListGroupItem className="px-0 d-flex justify-content-between align-items-center">
                <strong>Status</strong>
                <span><Badge bg={getTransactionStatusColor(booking.status)}>{getTransactionStatusLabel(booking.status)}</Badge></span>
              </ListGroupItem>
              <ListGroupItem className="px-0 d-flex justify-content-between align-items-center">
                <strong>Total Tagihan</strong>
                <span>{currencyFormat(booking.total_pay)}</span>
              </ListGroupItem>
              <ListGroupItem className="px-0 d-flex justify-content-between align-items-center">
                <strong>Metode Pembayaran</strong>
                <span>{transactionDetail?.payment_name}</span>
              </ListGroupItem>
            </ListGroup>
          </Card>

          <Card body className="p-2 mb-3 rounded-4">
            <h3 className="pb-2">Aksi</h3>

            <div className="gap-2 d-grid">
              <Button className="gap-2 d-flex justify-content-center align-items-center" variant="light">
                <FaDownload />
                <span>Unduh Tagihan</span>
              </Button>
              {booking.status === 'UNPAID' && (
                <>
                  <Button className="gap-2 d-flex justify-content-center align-items-center" variant="light">
                    <FaEnvelope />
                    <span>Kirim Pengingat</span>
                  </Button>
                  <Button onClick={() => updateTransactionStatus(booking.id, TransactionStatusEnum.PAID, !!booking.transaction_confirmation)} className="gap-2 d-flex justify-content-center align-items-center" variant="success">
                    <FaCheckCircle />
                    <span>Verifikasi Pesanan</span>
                  </Button>
                  <Button onClick={() => updateTransactionStatus(booking.id, TransactionStatusEnum.FAILED)} className="gap-2 d-flex justify-content-center align-items-center" variant="danger">
                    <FaXmark />
                    <span>Batalkan Pesanan</span>
                  </Button>
                </>
              )}
            </div>
          </Card>

          {booking.transaction_confirmation && (
            <Card body className="p-2 mb-3 rounded-4">
              <h3 className="pb-2">Bukti Pembayaran</h3>
              <img src={`/storage/${booking.transaction_confirmation.transaction_receipt}`} alt="Bukti Pembayaran" className="w-100" />
            </Card>
          )}
        </Col>
      </Row>
    </AuthenticatedAdmin>
  )
}
