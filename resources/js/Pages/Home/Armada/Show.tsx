import { compactCurrencyFormat, currencyFormat, mileageFormat, speedFormat } from "@/Helpers/number";
import AuthenticatedUser from "@/Layouts/AuthenticatedLayout";
import Database from "@/types/database";
import { Head, router, useForm } from "@inertiajs/react";
import { Badge, Button, Card, Col, Form, InputGroup, ListGroup, Nav, Row, Tab } from "react-bootstrap";
import { FaCalendar, FaClock, FaGasPump, FaTag } from "react-icons/fa6";
import dayjs from "@/Helpers/dayjs";
import { parseAntiXss } from "@/Helpers/string";
import { MediaLibrary } from "@/types/medialibrary";
import ImageGallery from "@/Components/ImageGallery";
import { GridContainer, GridItem } from "@/InternalBorderGrid";
import { PiBabyCarriage, PiCarProfileDuotone, PiLock, PiMusicNote, PiPalette, PiSeat, PiShield, PiSnowflake, PiSpeedometer, PiTag, PiTire } from "react-icons/pi";
import { getCarConditionLabel, getCarFuelTypeLabel, getCarModelLabel, getCarStatusColor, getCarStatusIcon, getCarStatusLabel, getCarTransmissionLabel } from "@/Helpers/EnumHelper";
import { GiGearStickPattern } from "react-icons/gi";
import Flatpickr from "react-flatpickr";
import { Indonesian } from "flatpickr/dist/l10n/id";
import { twMerge } from "tailwind-merge";
import { CarConditionEnum, CarModelEnum, CarStatusEnum, CarTransmissionEnum, FuelEnum } from "@/Helpers/enum";
import HeaderArmadaDetail from "./Partials/HeaderArmadaDetail";
import { FaTimes } from "react-icons/fa";
import { calculateRent } from "@/Helpers/rent";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const InfoCard: React.FC<{ icon: React.ReactNode, title: string, value: string }> = ({ icon, title, value }) => {
  return (
    <GridItem>
      {icon}
      <Card.Text className="mt-2 mb-1">{title}</Card.Text>
      <Card.Title className="mb-0 fw-bold">{value}</Card.Title>
    </GridItem>
  );
};

const CarInfoCards: React.FC<{ carData: Database['CarData'] }> = ({ carData }) => {
  return (
    <div className="mt-4">
      {/* Tampilan untuk ukuran layar extra small hingga large */}
      <div className="d-block d-xxl-none">
        <GridContainer cols={2} textAlign="center">
          <InfoCard
            icon={<FaTag size={"32"} />}
            title="Nomor Polisi"
            value={carData.license_plate}
          />
          <InfoCard
            icon={<FaCalendar size={"32"} />}
            title="Tahun Pembuatan"
            value={carData.year_of_manufacture.toString()}
          />
          <InfoCard
            icon={<FaClock size={"32"} />}
            title="Kilometer Berjalan"
            value={mileageFormat(carData.mileage || 0)}
          />
          <InfoCard
            icon={<FaGasPump size={"32"} />}
            title="Bahan Bakar"
            value={getCarFuelTypeLabel(carData.fuel_type as FuelEnum)}
          />
        </GridContainer>
      </div>

      {/* Tampilan untuk ukuran layar extra large ke atas */}
      <div className="d-none d-xxl-block">
        <GridContainer cols={4} textAlign="center">
          <InfoCard
            icon={<FaTag size={"32"} />}
            title="Nomor Polisi"
            value={carData.license_plate}
          />
          <InfoCard
            icon={<FaCalendar size={"32"} />}
            title="Tahun Pembuatan"
            value={carData.year_of_manufacture.toString()}
          />
          <InfoCard
            icon={<FaClock size={"32"} />}
            title="Kilometer Berjalan"
            value={mileageFormat(carData.mileage || 0)}
          />
          <InfoCard
            icon={<FaGasPump size={"32"} />}
            title="Bahan Bakar"
            value={getCarFuelTypeLabel(carData.fuel_type as FuelEnum)}
          />
        </GridContainer>
      </div>
    </div>
  );
};

const PriceCard: React.FC<{ label: string, price: number }> = ({ label, price }) => {
  return (
    <Col md="4">
      <Card body className="text-center bg-light">
        <Card.Title className="mb-0 fw-bold">{compactCurrencyFormat(price)}</Card.Title>
        <Card.Text className="mb-0">{label}</Card.Text>
      </Card>
    </Col>
  );
};

const PricingInfo: React.FC<{ carData: Database['CarData'] }> = ({ carData }) => {
  return (
    <Card body>
      <div className="mb-3 d-flex justify-content-between">
        <Card.Title className="mb-0">Informasi Harga Sewa</Card.Title>
      </div>

      <Row className="g-3">
        <PriceCard label="Harian" price={carData.rent_price} />
        <PriceCard label="Mingguan" price={carData.rent_price * 7} />
        <PriceCard label="Bulanan" price={carData.rent_price * 30} />
      </Row>
    </Card>
  );
};

const CarMainDetails: React.FC<{ carData: Database['CarData'] & { media?: MediaLibrary[] } }> = ({ carData }) => {
  return (
    <Card body className="rounded-4">
      {(carData.media && carData.media?.length > 0) &&
        <ImageGallery readOnly initialData={carData.media as unknown as MediaLibrary[]} />}

      <CarInfoCards carData={carData} />

      <Card body className="mb-4">
        <strong>Deskripsi</strong>
        <p className="mt-2 mb-0" dangerouslySetInnerHTML={{ __html: parseAntiXss(carData.description || '-') }} />
      </Card>

      <PricingInfo carData={carData} />
    </Card>
  );
};

const CarStatus: React.FC<{ carData: Database['CarData']; disabledCalendar?: string[] }> = ({ carData, disabledCalendar = [] }) => {
  const lastUsage = dayjs().diff('2025-04-01', 'day');

  const { data, post, processing, setData } = useForm<{
    pickup_date: string | null;
    car_id: number;
    return_date: string | null;
    with_driver: boolean;
  }>({
    car_id: carData.id,
    pickup_date: null,
    return_date: null,
    with_driver: false,
  });

  const onSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    post(route('v1.home.checkout.addOrUpdate'), {
      onError: (errors: any) => {
        const textMessage = Object.values(errors).join(', ');

        withReactContent(Swal).fire({
          title: 'Kesalahan!',
          text: textMessage,
          icon: 'error',
        }).then(() => {
          if (textMessage.includes('ERR_ALREADY_HAVE_ORDER')) {
            router.visit('/checkout');
          }
        })
      }
    });
  }

  let flatpickrInstance: any = null;

  const clearSelector = () => {
    if (flatpickrInstance) {
      flatpickrInstance.clear();
      setData({
        car_id: carData.id,
        pickup_date: null,
        return_date: null,
        with_driver: false,
      });
    }
  };

  const { duration, carRentTotal, tax, driverRentTotal, subtotal, total } = calculateRent({
    pickDate: data.pickup_date || null,
    returnDate: data.return_date || null,
    rentPrice: carData.rent_price,
    withDriver: data.with_driver,
  });

  return (
    <Card body className="rounded-4" style={{ position: 'sticky', top: '5rem' }}>
      <InputGroup>
        <Form.FloatingLabel label="Tanggal Pengambilan dan Pengembalian">
          <Flatpickr
            options={{
              mode: 'range',
              locale: Indonesian,
              dateFormat: 'Y-m-d',
              minDate: 'today',
              closeOnSelect: false,
              disable: disabledCalendar ?? []
            }}
            className="form-control"
            onChange={(selectedDates: Date[]) => {
              if (selectedDates && selectedDates.length > 0) {
                setData('pickup_date', selectedDates[0]?.toISOString() || null);
                if (selectedDates.length > 1) {
                  setData('return_date', selectedDates[1]?.toISOString() || null);
                }
              }
            }}
            onReady={(_, __, fp) => {
              flatpickrInstance = fp;
            }}
            name="dateRange"
          />
        </Form.FloatingLabel>
        {(data.pickup_date || data.return_date) && (
          <Button variant="outline-secondary" onClick={clearSelector} id="button-addon2">
            <FaTimes />
          </Button>
        )}
      </InputGroup>

      <Form.Group className="gap-2 my-3 d-flex flex-column flex-lg-row justify-content-between">
        <Form.Switch
          id="with_driver"
          name="with_driver"
          className="flex-grow flex-shrink-0"
          label="Dengan Driver"
          checked={data.with_driver}
          onChange={(e) => setData('with_driver', e.target.checked)}
        />
        <div className="text-end">Tambahan biaya driver: {currencyFormat(250000)}</div>
      </Form.Group>

      {duration > 0 && (
        <>
          <Card body className="mb-4">
            <ListGroup className="gap-2 d-flex flex-column" variant="flush">
              <ListGroup.Item className="px-0 pt-0 d-flex justify-content-between">
                <div className="text-muted">Durasi Sewa</div>
                <div className="fw-bold">{duration} Hari</div>
              </ListGroup.Item>
              <ListGroup.Item className="px-0 d-flex justify-content-between">
                <div className="text-muted">Harga Sewa</div>
                <div className="fw-bold">{compactCurrencyFormat(carRentTotal)} / Hari</div>
              </ListGroup.Item>
              {data.with_driver && (
                <ListGroup.Item className="px-0 d-flex justify-content-between">
                  <div className="text-muted">Harga Sewa Driver</div>
                  <div className="fw-bold">{compactCurrencyFormat(driverRentTotal)} / Hari</div>
                </ListGroup.Item>
              )}
              <ListGroup.Item className="px-0 d-flex justify-content-between">
                <div className="text-muted">Subtotal</div>
                <div className="fw-bold">{compactCurrencyFormat(subtotal)}</div>
              </ListGroup.Item>
              <ListGroup.Item className="px-0 d-flex justify-content-between">
                <div className="text-muted">Pajak</div>
                <div className="fw-bold">{compactCurrencyFormat(tax)}</div>
              </ListGroup.Item>
              <ListGroup.Item className="px-0 pb-0 d-flex justify-content-between">
                <div className="text-muted fw-bold">Total</div>
                <div className="fw-bold">{compactCurrencyFormat(total)}</div>
              </ListGroup.Item>
            </ListGroup>
          </Card>

          <Button onClick={onSubmit} disabled={processing} className="w-100" size="lg">Pinjam Sekarang!</Button>
        </>
      )}


      <div className="py-4 my-4 border-top justify-content-between align-items-center d-flex border-bottom">
        <Card.Title className="mb-0">Status Kendaraan</Card.Title>
        <div className="gap-2 d-flex align-items-center">
          <div className={'text-' + getCarStatusColor(carData.status as CarStatusEnum)}>
            {getCarStatusIcon(carData.status as CarStatusEnum)}
          </div>
          <Card.Title className="mb-0">{getCarStatusLabel(carData.status as CarStatusEnum)}</Card.Title>
        </div>
      </div>

      <div className="gap-2 d-flex flex-column">
        <div className="d-flex justify-content-between">
          <div className="text-muted">Posisi Saat Ini</div>
          <div className="fw-bold">{(() => {
            switch (carData.status) {
              case CarStatusEnum.BORROWED:
                return 'Dipinjam';
              case CarStatusEnum.READY:
                return 'Diam Di Garasi';
              case CarStatusEnum.SOLD:
                return 'Sudah Dijual';
              case CarStatusEnum.MISSING:
                return 'Sedang Dicari';
              case CarStatusEnum.REPAIR:
                return 'Di Bengkel';
              case CarStatusEnum.CRASH:
                return 'Diam Di Garasi';
              default:
                return '-';
            }
          })()}</div>
        </div>
        <div className="d-flex justify-content-between">
          <div className="text-muted">Kondisi Kendaraan</div>
          <div className="fw-bold">{getCarConditionLabel(carData.condition as CarConditionEnum)}</div>
        </div>
        <div className="d-flex justify-content-between">
          <div className="text-muted">Terakhir Digunakan</div>
          <div className="fw-bold">{lastUsage} hari yang lalu</div>
        </div>
      </div>
    </Card>
  );
};

const CarSpecification = ({ carData }: { carData: Database['CarData'] }) => {
  return (
    <>
      <h4 className="mb-1 fw-bold">Spesifikasi Kendaraan</h4>
      <p>Detail teknis dan fitur kendaraan</p>

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
                <p className="mb-0">{getCarModelLabel(carData.model as CarModelEnum)}</p>
              </div>
            </div>
          </GridItem>
          <GridItem>
            <div className="gap-3 d-flex">
              <GiGearStickPattern size={24} />
              <div>
                <h6 className="mb-0 fw-bold">Transmisi</h6>
                <p className="mb-0">{getCarTransmissionLabel(carData.transmission as CarTransmissionEnum)}</p>
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

const CarComments = () => {
  return (
    <Row className="g-0">
      <Col md={12}>
        <Card bg="light">
          <Card.Body>
            <Card.Title>Komentar</Card.Title>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

interface ShowProps {
  car_data: Database['CarData'] & { review: Database['Review'] };
  disabledCalendar?: string[];
}

export default function Show({ car_data, disabledCalendar }: ShowProps) {
  return (
    <AuthenticatedUser header={<HeaderArmadaDetail carData={car_data} />}>
      <Head title={`Detail Kendaraan ${car_data.brand} ${car_data.car_name}`} />

      <Row className="py-4 position-relative gy-4">
        <Col md={8}>
          <CarMainDetails carData={car_data} />
        </Col>
        <Col md={4} className="position-relative">
          <CarStatus carData={car_data} disabledCalendar={disabledCalendar} />
        </Col>
      </Row>

      <Tab.Container defaultActiveKey="spesifikasi">
        <Card>
          <Card.Header className="bg-white">
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="spesifikasi">Spesifikasi</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="komentar">Komentar dan Penilaian</Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>
          <Card.Body>
            <Tab.Content>
              <Tab.Pane eventKey="spesifikasi">
                <CarSpecification carData={car_data} />
              </Tab.Pane>
              <Tab.Pane eventKey="komentar">
                <CarComments />
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Card>
      </Tab.Container>
    </AuthenticatedUser>
  );
}
