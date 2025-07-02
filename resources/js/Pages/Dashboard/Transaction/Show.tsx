import { Head, usePage } from "@inertiajs/react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Collapse,
  ListGroup,
  Modal,
  Row,
} from "react-bootstrap";
import {
  FaArrowRight,
  FaCalendar,
  FaCheck,
  FaCopy,
  FaCreditCard,
  FaDownload,
  FaQrcode,
} from "react-icons/fa6";

import GlobalHeader from "@/Components/GlobalPartial/HeaderComponent";
import { GridContainer, GridItem } from "@/InternalBorderGrid";
import AuthenticatedUser from "@/Layouts/AuthenticatedLayout";

import DashboardImage from "@/Assets/Images/Cover-Dashboard.jpg";
import Database from "@/types/database";

import { formatDateToWIB } from "@/Helpers/dayjs";
import { TransactionStatusEnum } from "@/Helpers/enum";
import {
  getTransactionStatusColor,
  getTransactionStatusLabel,
} from "@/Helpers/EnumHelper";
import { currencyFormat } from "@/Helpers/number";
import useCopy from "@/Hooks/useCopy";
import { PageProps } from "@/types";

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

interface PaymentChannel {
  group: "Virtual Account" | "E-Wallet" | "Retail" | "Bank Transfer" | "Other";
  code: string;
  name: string;
  type: "direct" | "indirect";
  fee_merchant: FeeStructure;
  fee_customer: FeeStructure;
  total_fee: FeeStructure;
  minimum_fee: number | null;
  maximum_fee: number | null;
  minimum_amount: number;
  maximum_amount: number;
  icon_url: string;
  active: boolean;
}

interface FeeStructure {
  flat: number;
  percent: number | string;
}

type PaymentChannels = Record<string, PaymentChannel>;

interface TransactionPageDetailProps {
  transaction?: Database["Transaction"] & { user: Database["User"] };
  transactionDetail?: TripayDetail;
}

const QR_PAYMENT_CHANNELS = ["QRIS", "QRIS2", "QRISC", "OVO", "SHOPEEPAY"];
const PENDING_STATUSES = ["UNPAID", "PENDING"];

const TransactionHeader = memo(
  ({
    transaction,
  }: {
    transaction: TransactionPageDetailProps["transaction"];
  }) => (
    <Card body className="p-2 rounded-4">
      <div className="gap-3 d-flex align-items-stretch flex-column justify-content-between flex-lg-row">
        <div>
          <div className="mb-3">
            <h6 className="mb-1">Tagihan</h6>
            <h4 className="mb-0 fw-bold">#{transaction?.id}</h4>
          </div>
          <p className="gap-2 mb-0 d-flex align-items-center">
            <FaCalendar size={12} />
            <span>{formatDateToWIB(transaction?.updated_at || "")}</span>
          </p>
        </div>
        <div className="gap-2 d-flex flex-column flex-lg-fill">
          <div className="gap-2 d-flex justify-content-start justify-content-lg-end">
            <Badge
              color={getTransactionStatusColor(
                transaction?.status || ("UNPAID" as TransactionStatusEnum)
              )}
            >
              {getTransactionStatusLabel(
                transaction?.status || ("UNPAID" as TransactionStatusEnum)
              )}
            </Badge>
            {transaction?.status === "UNPAID" && (
              <Badge>Unggah Bukti Bayar</Badge>
            )}
          </div>
          <div className="gap-2 d-flex justify-content-end flex-column flex-lg-row">
            <Button
              className="gap-2 mt-2 d-flex align-items-center justify-content-center"
              variant="light"
            >
              <FaDownload />
              <span>Unduh Tagihan</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
);

const PaymentSummary = memo(
  ({
    transaction,
    transactionDetail,
    currentChannel,
  }: {
    transaction: TransactionPageDetailProps["transaction"];
    transactionDetail: TripayDetail | undefined;
    currentChannel: PaymentChannel | null;
  }) => {
    const isQRPayment = useMemo(
      () => QR_PAYMENT_CHANNELS.includes(transaction?.payment_channel || ""),
      [transaction?.payment_channel]
    );

    return (
      <Card body className="rounded-4 bg-light">
        <div className="mb-4">
          <h6>Total Tagihan</h6>
          <h4 className="mb-0 fw-bold">
            {currencyFormat(transaction?.total_pay || 0)}
          </h4>
        </div>
        <div className="gap-2 d-flex align-items-center">
          {isQRPayment ? <FaQrcode /> : <FaCreditCard />}
          <span>
            {currentChannel?.name || transaction?.payment_channel || "-"}
          </span>
        </div>
      </Card>
    );
  }
);

const BillingParties = memo(
  ({
    transaction,
  }: {
    transaction: TransactionPageDetailProps["transaction"];
  }) => (
    <GridContainer
      cols={2}
      className="pb-4 mb-4 border-bottom"
      textAlign="left"
    >
      <GridItem>
        <h5 className="mb-2 fw-bold">Ditagihkan Kepada</h5>
        <div>
          <p className="mb-0 fw-bold">{transaction?.user?.name}</p>
          <p className="mb-0">{transaction?.user?.address}</p>
          <p className="mb-0">{transaction?.user?.phone}</p>
          <p className="mb-0">{transaction?.user?.email}</p>
        </div>
      </GridItem>
      <GridItem>
        <h5 className="mb-2 fw-bold">Diterbitkan oleh</h5>
        <div>
          <p className="mb-0 fw-bold">Sewain by Kodinus</p>
          <p className="mb-0">Jl. Samben-Bringin, Samben, Karangjati, Ngawi</p>
          <p className="mb-0">+62 812-3456-7890</p>
          <p className="mb-0">admin@sewain.id</p>
        </div>
      </GridItem>
    </GridContainer>
  )
);

const TransactionInfo = memo(
  ({
    transaction,
  }: {
    transaction: TransactionPageDetailProps["transaction"];
  }) => {
    const transactionFields = useMemo(
      () => [
        { label: "ID Transaksi", value: `#${transaction?.id}` },
        {
          label: "Kode Referensi",
          value: transaction?.payment_references || "-",
        },
        {
          label: "Tanggal Dibuat",
          value: formatDateToWIB(transaction?.created_at || ""),
        },
        {
          label: "Terakhir Diupdate",
          value: formatDateToWIB(transaction?.updated_at || ""),
        },
        ...(transaction?.confirmed_at
          ? [
              {
                label: "Tanggal Pembayaran",
                value: formatDateToWIB(transaction.confirmed_at),
              },
            ]
          : []),
        ...(transaction?.expired_at
          ? [
              {
                label: "Tanggal Kedaluwarsa",
                value: formatDateToWIB(transaction.expired_at),
              },
            ]
          : []),
      ],
      [transaction]
    );

    return (
      <div>
        <h5 className="mb-3">Informasi Transaksi</h5>
        <div className="gap-3 d-flex flex-column">
          {transactionFields.map((field, index) => (
            <div
              key={field.label}
              className="pb-3 d-flex justify-content-between border-bottom"
            >
              <span className="text-muted">{field.label}</span>
              <span className="fw-medium text-end">{field.value}</span>
            </div>
          ))}

          <div className="pb-3 d-flex justify-content-between border-bottom">
            <span className="text-muted">Status</span>
            <div>
              <Badge
                color={getTransactionStatusColor(
                  transaction?.status || ("UNPAID" as TransactionStatusEnum)
                )}
              >
                {getTransactionStatusLabel(
                  transaction?.status || ("UNPAID" as TransactionStatusEnum)
                )}
              </Badge>
            </div>
          </div>

          <div className="d-flex fw-bold justify-content-between">
            <span className="text-muted">Total Bayar</span>
            <span>{currencyFormat(transaction?.total_pay || 0)}</span>
          </div>
        </div>
      </div>
    );
  }
);

const BillDetails = memo(
  ({
    transaction,
    transactionDetail,
  }: {
    transaction: TransactionPageDetailProps["transaction"];
    transactionDetail: TripayDetail | undefined;
  }) => (
    <div>
      <h5 className="mb-3">Rincian Tagihan</h5>

      <ListGroup variant="flush">
        {transactionDetail?.order_items?.map((item, index) => (
          <ListGroup.Item
            key={`${item.sku}-${index}`}
            className="px-0 d-flex justify-content-between"
          >
            <span className="text-muted">
              {item.name} x {item.quantity}
            </span>
            <span>{currencyFormat(item.price * item.quantity)}</span>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <Card body className="mt-1">
        <ListGroup.Item className="px-0 d-flex justify-content-between">
          <span className="mb-0 text-muted h4 fw-bold">Total Tagihan</span>
          <span className="mb-0 h4 fw-bold">
            {currencyFormat(transaction?.total_pay || 0)}
          </span>
        </ListGroup.Item>
      </Card>
    </div>
  )
);

const PaymentGuide = memo(
  ({ transactionStatus }: { transactionStatus?: TransactionStatusEnum }) => {
    const { transactionDetail } =
      usePage<PageProps<{ transactionDetail?: TripayDetail }>>().props;
    const [modalState, setModalState] = useState(false);
    const [openCollapse, setOpenCollapse] = useState<string | null>(null);

    const toggleCollapse = (instructionId: string) => {
      setOpenCollapse(openCollapse === instructionId ? null : instructionId);
    };

    const isPending = useMemo(
      () => PENDING_STATUSES.includes(transactionStatus || ""),
      [transactionStatus]
    );

    if (!isPending) return null;

    return (
      <div className="mt-2">
        <Button className="w-100" onClick={() => setModalState(true)}>
          Baca Panduan Cara Membayarnya
        </Button>

        <Modal show={modalState} onHide={() => setModalState(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Panduan Pembayaran</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {transactionDetail?.instructions &&
              transactionDetail.instructions.map((instruction, index) => (
                <div key={instruction.title || index} className="mb-3">
                  <Button
                    variant="outline-dark"
                    className="w-100 text-start"
                    onClick={() => toggleCollapse(`instruction-${index}`)}
                    aria-controls={`collapse-${index}`}
                    aria-expanded={openCollapse === `instruction-${index}`}
                  >
                    {instruction.title}
                    <i
                      className={`fas fa-chevron-${
                        openCollapse === `instruction-${index}` ? "up" : "down"
                      } float-end`}
                    ></i>
                  </Button>

                  <Collapse in={openCollapse === `instruction-${index}`}>
                    <div id={`collapse-${index}`}>
                      <div className="mt-2 card card-body">
                        {instruction.steps &&
                          instruction.steps.map((step, stepIndex) => (
                            <div key={stepIndex} className="mb-2">
                              <strong>{stepIndex + 1}. </strong>
                              <span
                                dangerouslySetInnerHTML={{ __html: step }}
                              ></span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </Collapse>
                </div>
              ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModalState(false)}>
              Tutup
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
);

const PaymentSection = memo(
  ({
    transaction,
    transactionDetail,
  }: {
    transaction: TransactionPageDetailProps["transaction"];
    transactionDetail: TripayDetail | undefined;
  }) => {
    const [status, copy] = useCopy();

    const isPending = useMemo(
      () => PENDING_STATUSES.includes(transaction?.status || ""),
      [transaction?.status]
    );

    if (!isPending) return null;

    if (transactionDetail?.qr_url) {
      return (
        <div className="gap-2 mt-4 d-flex align-items-center justify-content-between">
          <div>
            <strong>QR Code Pembayaran</strong>
            <div>
              <small className="mb-0">
                Silahkan pindai QR Code disamping dengan aplikasi yang mendukung
                QRIS Payment. Ketuk gambar untuk memperbesar gambar QRIS-nya.
              </small>
            </div>
          </div>
          <img
            src={transactionDetail.qr_url}
            style={{ height: "100px" }}
            alt="QR Code Pembayaran"
          />
        </div>
      );
    }

    if (transactionDetail?.pay_code) {
      return (
        <div className="mt-4 d-flex justify-content-between align-items-center">
          <div>
            <div className="gap-2 d-flex">
              <h4 className="fw-bold">{transactionDetail.pay_code}</h4>
            </div>
            <p>{transactionDetail.payment_name}</p>
          </div>

          <div>
            <Button
              size="sm"
              onClick={() => copy(String(transactionDetail.pay_code || "-"))}
              variant="secondary"
            >
              {!status ? <FaCopy /> : <FaCheck />}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="gap-2 mt-4 d-flex align-items-center justify-content-between">
        <div>
          <strong>Lanjutkan Pembayaran</strong>
          <div>
            <small className="mb-0">
              Silahkan klik tombol disamping/dibawah ini untuk melanjutkan
              pembayaran ke pihak ketiga kami.
            </small>
          </div>
        </div>
        <div className="flex-shrink-0">
          <a href={transactionDetail?.pay_url} className="btn btn-primary">
            Bayar <FaArrowRight />
          </a>
        </div>
      </div>
    );
  }
);

export default function TransactionPageDetail({
  transaction,
  transactionDetail,
}: TransactionPageDetailProps) {
  const [currentChannel, setCurrentChannel] = useState<PaymentChannel | null>(
    null
  );

  const fetchChannelName = useCallback(async () => {
    if (!transaction?.payment_channel) return;

    try {
      const response = await fetch(
        route("v1.global.transaction.get-channels", {
          search: transaction.payment_channel,
        })
      );
      const data: PaymentChannels = await response.json();

      const matchingChannel = Object.values(data).find(
        (channel) => channel.code === transaction.payment_channel
      );

      if (matchingChannel) {
        setCurrentChannel(matchingChannel);
      }
    } catch (error) {
      console.error("Error fetching payment channel data:", error);
    }
  }, [transaction?.payment_channel]);

  useEffect(() => {
    fetchChannelName();
  }, [fetchChannelName]);

  const breadcrumbItems = useMemo(
    () => [
      { label: "Beranda", url: route("home") },
      { label: "Dasbor", url: route("dashboard") },
      { label: "Semua Transaksi", url: route("dashboard.transaction.index") },
      { label: `#${transaction?.id}` },
    ],
    [transaction?.id]
  );

  return (
    <AuthenticatedUser
      header={
        <GlobalHeader
          title={`Transaksi #${transaction?.id}`}
          backgroundImage={DashboardImage}
          breadcrumbItems={breadcrumbItems}
        />
      }
    >
      <Head title={`Transaksi #${transaction?.id}`} />

      <div className="pt-3 pb-4">
        <Row className="g-4">
          <Col md={8}>
            <TransactionHeader transaction={transaction} />
          </Col>

          <Col md={4}>
            <PaymentSummary
              transaction={transaction}
              transactionDetail={transactionDetail}
              currentChannel={currentChannel}
            />
          </Col>

          <Col md={12}>
            <Card body className="p-2 rounded-4">
              <BillingParties transaction={transaction} />

              <Row className="g-5">
                <Col md={6}>
                  <TransactionInfo transaction={transaction} />
                </Col>

                <Col md={6} className="flex-column d-flex">
                  <BillDetails
                    transaction={transaction}
                    transactionDetail={transactionDetail}
                  />
                  <div className="mt-auto">
                    <PaymentSection
                      transaction={transaction}
                      transactionDetail={transactionDetail}
                    />

                    <PaymentGuide transactionStatus={transaction?.status} />
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </AuthenticatedUser>
  );
}
