import GlobalHeader from "@/Components/GlobalPartial/HeaderComponent";
import AuthenticatedUser from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import DashboardImage from '@/Assets/Images/Cover-Dashboard.jpg';
import Database from "@/types/database";
import { Badge, Button, Card, Col, ListGroup, Nav, Row, Tab, Table } from "react-bootstrap";
import { FaCalendar, FaCreditCard, FaDownload, FaQrcode, FaHistory, FaInfoCircle, FaArrowRight, FaTripadvisor } from "react-icons/fa";
import { formatDateToWIB } from "@/Helpers/dayjs";
import { getTransactionStatusColor, getTransactionStatusLabel } from "@/Helpers/EnumHelper";
import { TransactionStatusEnum } from "@/Helpers/enum";
import { currencyFormat } from "@/Helpers/number";
import { useEffect, useState } from "react";
import LabelValue from "@/Components/LabelValue";
import { GridContainer, GridItem } from "@/InternalBorderGrid";

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
  order_items: {
    sku: string | null;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
    product_url: string | null;
    image_url: string | null;
  }[];
  instructions: {
    title: string;
    steps: string[];
  }[];
}

interface TransactionPageDetailProps {
  transaction?: Database['Transaction'] & { user: Database['User'] };
  transactionDetail?: TripayDetail;
}

export interface PaymentChannel {
  group: 'Virtual Account' | 'E-Wallet' | 'Retail' | 'Bank Transfer' | 'Other';
  code: string;
  name: string;
  type: 'direct' | 'indirect';
  fee_merchant: {
    flat: number;
    percent: number | string;
  };
  fee_customer: {
    flat: number;
    percent: number | string;
  };
  total_fee: {
    flat: number;
    percent: number | string;
  };
  minimum_fee: number | null;
  maximum_fee: number | null;
  minimum_amount: number;
  maximum_amount: number;
  icon_url: string;
  active: boolean;
}

export type PaymentChannels = { [key: string]: PaymentChannel };

export default function TransactionPageDetail({ transaction, transactionDetail }: TransactionPageDetailProps) {
  console.log({ transaction, transactionDetail })

  const [channelData, setChannelData] = useState<PaymentChannels | null>(null);
  const [currentChannel, setCurrentChannel] = useState<PaymentChannel | null>(null);
  const [activeKey, setActiveKey] = useState<string>("detail");

  const fetchChannelName = async () => {
    try {
      const response = await fetch(route('v1.global.transaction.get-channels', { search: transaction?.payment_channel || '' }));
      const data = await response.json();
      setChannelData(data);

      // Find the channel with matching code
      if (data && transaction?.payment_channel) {
        // Look through all keys in the object
        for (const key in data) {
          if (data[key].code === transaction.payment_channel) {
            setCurrentChannel(data[key]);
            break;
          }
        }
      }
    } catch (error) {
      console.error("Error fetching payment channel data:", error);
    }
  }

  useEffect(() => {
    fetchChannelName();
  }, [transaction?.payment_channel, transaction?.id]);

  return (
    <AuthenticatedUser
      header={
        <GlobalHeader
          title={`Transaksi #${transaction?.id}`}
          backgroundImage={DashboardImage}
          breadcrumbItems={[
            { label: 'Beranda', url: route('home') },
            { label: 'Dasbor', url: route('dashboard') },
            { label: 'Semua Transaksi', url: route('dashboard.transaction.index') },
            { label: `#${transaction?.id}` },
          ]}
        />
      }>
      <Head title={`Transaksi #${transaction?.id}`} />

      <div className="pt-3 pb-4">
        <Row className="g-4">
          <Col md={8}>
            <Card body className="p-2 rounded-4">
              <div className="gap-3 d-flex align-items-start align-items-lg-center flex-column justify-content-between flex-lg-row">
                <div>
                  <div className="mb-3">
                    <h6 className="mb-1">Tagihan</h6>
                    <h4 className="fw-bold">#{transaction?.id}</h4>
                  </div>
                  <p className="gap-2 mb-0 d-flex align-items-center">
                    <FaCalendar />
                    <span>{formatDateToWIB(transaction?.updated_at || '')}</span>
                  </p>
                </div>
                <div className="gap-2 d-flex flex-column align-items-end">
                  <Badge color={getTransactionStatusColor(transaction?.status || 'UNPAID' as TransactionStatusEnum)}>
                    {getTransactionStatusLabel(transaction?.status || 'UNPAID' as TransactionStatusEnum)}
                  </Badge>
                  <Button className="gap-2 mt-2 d-flex align-items-center" variant="light">
                    <FaDownload />
                    <span>Unduh Tagihan</span>
                  </Button>
                </div>
              </div>
            </Card>
          </Col>
          <Col md={4}>
            <Card body className="rounded-4 bg-light">
              <div className="mb-4">
                <h6>Total Tagihan</h6>
                <h4 className="mb-0 fw-bold">{currencyFormat(transaction?.total_pay || 0)}</h4>
              </div>
              <div className="gap-2 d-flex align-items-center">
                {['QRIS', 'QRIS2', 'QRISC', 'OVO', 'SHOPEEPAY'].includes(transaction?.payment_channel || '') ? <FaQrcode /> : <FaCreditCard />}
                <span>{currentChannel?.name || transaction?.payment_channel || '-'}</span>
                {transaction?.confirmed_at ? (
                  <span className="ms-auto">{formatDateToWIB(transaction?.confirmed_at)}</span>
                ) : (
                  <a href={transactionDetail?.pay_url} className="ms-auto">Lanjutkan Pembayaran &rarr;</a>
                )}
              </div>
            </Card>
          </Col>

          <Col md={12}>
            <Card body className="p-2 rounded-4">
              <GridContainer cols={2} className="pb-4 mb-4 border-bottom" textAlign="left">
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

              <Row className="g-5">
                <Col md={6}>
                  <h5 className="mb-3">Informasi Transaksi</h5>
                  <div className="gap-3 d-flex flex-column">
                    <div className="pb-3 d-flex justify-content-between border-bottom">
                      <span className="text-muted">ID Transaksi</span>
                      <span className="fw-medium">#{transaction?.id}</span>
                    </div>
                    <div className="pb-3 d-flex justify-content-between border-bottom">
                      <span className="text-muted">Kode Referensi</span>
                      <span className="fw-medium">{transaction?.payment_references || '-'}</span>
                    </div>
                    <div className="pb-3 d-flex justify-content-between border-bottom">
                      <span className="text-muted">Status</span>
                      <div>
                        <Badge color={getTransactionStatusColor(transaction?.status || 'UNPAID' as TransactionStatusEnum)}>
                          {getTransactionStatusLabel(transaction?.status || 'UNPAID' as TransactionStatusEnum)}
                        </Badge>
                      </div>
                    </div>
                    <div className="pb-3 d-flex justify-content-between border-bottom">
                      <span className="text-muted">Tanggal Dibuat</span>
                      <span>{formatDateToWIB(transaction?.created_at || '')}</span>
                    </div>
                    <div className="pb-3 d-flex justify-content-between border-bottom">
                      <span className="text-muted">Terakhir Diupdate</span>
                      <span>{formatDateToWIB(transaction?.updated_at || '')}</span>
                    </div>
                    {transaction?.confirmed_at && (
                      <div className="pb-3 d-flex justify-content-between border-bottom">
                        <span className="text-muted">Tanggal Pembayaran</span>
                        <span>{formatDateToWIB(transaction?.confirmed_at)}</span>
                      </div>
                    )}
                    {transaction?.expired_at && (
                      <div className="pb-3 d-flex border-bottom justify-content-between">
                        <span className="text-muted">Tanggal Kedaluwarsa</span>
                        <span>{formatDateToWIB(transaction?.expired_at)}</span>
                      </div>
                    )}
                    <div className="d-flex fw-bold justify-content-between">
                      <span className="text-muted">Total Bayar</span>
                      <span>{currencyFormat(transaction?.total_pay || 0)}</span>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <h5 className="mb-3">Rincian Tagihan</h5>

                  <ListGroup variant="flush">
                    {transactionDetail?.order_items?.map((item, index) => (
                      <ListGroup.Item key={index} className="px-0 d-flex justify-content-between">
                        <span className="text-muted">{item.name}</span>
                        <span>{currencyFormat(item.price)}</span>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>

                  <Card body className="mt-1">
                    <ListGroup.Item className="px-0 d-flex justify-content-between">
                      <span className="mb-0 text-muted h4 fw-bold">Total Tagihan</span>
                      <span className="mb-0 h4 fw-bold">{currencyFormat(transaction?.total_pay || 0)}</span>
                    </ListGroup.Item>
                  </Card>

                  {["UNPAID", "PENDING"].includes(transaction?.status || '') && (
                    <div className="gap-2 mt-4 d-flex align-items-center justify-content-between">
                      {transactionDetail?.qr_url ? (
                        <>
                          <div>
                            <strong>QR Code Pembayaran</strong>
                            <div><small className="mb-0">Silahkan pindai QR Code disamping dengan aplikasi yang mendukung QRIS Payment. Ketuk gambar untuk memperbesar gambar QRIS-nya.</small></div>
                          </div>
                          <img src={transactionDetail.qr_url} style={{ height: '100px' }} alt="QR Code URL" />
                        </>
                      ) : (
                        <>
                          <div>
                            <strong>Lanjutkan Pembayaran</strong>
                            <div><small className="mb-0">Silahkan klik tombol disamping/dibawah ini untuk melanjutkan pembayaran ke pihak ketiga kami.</small></div>
                          </div>
                          <div className="flex-shrink-0">
                            <a href={transactionDetail?.pay_url} className="btn btn-primary">Bayar <FaArrowRight /></a>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </AuthenticatedUser>
  )
}
