import { compactCurrencyFormat, currencyFormat, mileageFormat, speedFormat } from "@/Helpers/number";
import { AuthenticatedAdmin } from "@/Layouts/AuthenticatedLayout";
import Database from "@/types/database";
import { Head, Link } from "@inertiajs/react";
import { Badge, Breadcrumb, BreadcrumbItem, Button, Card, Col, Modal, Nav, Row, Tab } from "react-bootstrap";
import { FaChevronRight, FaExclamationTriangle, FaMapPin, FaUser } from "react-icons/fa";
import { FaArrowLeft, FaCalendar, FaClock, FaGasPump, FaTag } from "react-icons/fa6";
import dayjs from "@/Helpers/dayjs";
import { parseAntiXss } from "@/Helpers/string";
import { MediaLibrary } from "@/types/medialibrary";
import ImageGallery from "@/Components/ImageGallery";
import { GridContainer, GridItem } from "@/InternalBorderGrid";
import { PiBabyCarriage, PiCarProfileDuotone, PiLock, PiMusicNote, PiPalette, PiSeat, PiShield, PiSnowflake, PiSpeedometer, PiTag, PiTire } from "react-icons/pi";
import { getCarConditionLabel, getCarFuelTypeLabel, getCarModelLabel, getCarStatusColor, getCarStatusIcon, getCarStatusLabel, getCarTransmissionLabel } from "@/Helpers/EnumHelper";
import { GiGearStickPattern } from "react-icons/gi";
import LabelValue from "@/Components/LabelValue";
import EditData from "./EditData";
import { twMerge } from "tailwind-merge";
import { CarConditionEnum, CarModelEnum, CarStatusEnum, CarTransmissionEnum, FuelEnum } from "@/Helpers/enum";
import { ShowModalTrackProvider, useShowModalTrack } from "@/Context/TrackingModalContext";

interface ShowProps {
  car_data: Database['CarData'];
}

const ModalTrackingMap = () => {
  const { showModalTrack, setShowModalTrack } = useShowModalTrack();

  return (
    <Modal show={showModalTrack} onHide={() => setShowModalTrack(false)} fullscreen centered>
      <Modal.Header closeButton>
        <Modal.Title>Lacak Posisi Kendaraan</Modal.Title>
      </Modal.Header>
      <Modal.Body></Modal.Body>
    </Modal>
  )
}

const CarDetailHeader: React.FC<{ carData: Database['CarData'] }> = ({ carData }) => {
  return (
    <div className="gap-2 d-flex flex-column flex-lg-row justify-content-between position-relative" style={{ zIndex: 500 }}>
      <div className="gap-2 d-flex flex-column flex-lg-row">
        <div>
          <Link href={route('administrator.car-data.index')} className="gap-2 btn btn-light d-flex align-items-center"><FaArrowLeft /><span className="d-lg-none">Kembali Ke Beranda</span></Link>
        </div>

        <div className="flex-column d-flex">
          <h3 className="h4 fw-semibold">{carData.brand} {carData.car_name}</h3>
          <Breadcrumb className="m-0" bsPrefix="m-0 breadcrumb">
            <BreadcrumbItem linkAs={Link} href={route('administrator.home')}>Dasbor Beranda</BreadcrumbItem>
            <BreadcrumbItem linkAs={Link} href={route('administrator.car-data.index')}>Data Kendaraan</BreadcrumbItem>
            <BreadcrumbItem active>Detail Kendaraan <strong>{carData.brand} {carData.car_name}</strong></BreadcrumbItem>
          </Breadcrumb>
        </div>
      </div>

      <div className="gap-2 d-flex align-items-center">
        <div className={'text-' + getCarStatusColor(carData.status as CarStatusEnum)}>{getCarStatusIcon(carData.status as CarStatusEnum)}</div>
        <Card.Title className="mb-0">{getCarStatusLabel(carData.status as CarStatusEnum)}</Card.Title>
      </div>
    </div>
  );
};

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
        <EditData id={carData.id} label="Ubah Data" />
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
  const { showModalTrack, setShowModalTrack } = useShowModalTrack();

  return (
    <Card body className="rounded-4">
      <div className="p-4 rounded-3 bg-light d-flex justify-content-center align-items-center" style={{ width: '100%', height: '300px' }}>
        <Button variant="dark" onClick={() => setShowModalTrack(!showModalTrack)}>Lacak Posisi Kendaraan</Button>
      </div>

      {(carData.media && carData.media?.length > 0) && (
        <div className="py-3 my-3 border-top border-bottom">
          <h6>Galeri Foto Kendaraan</h6>
          <ImageGallery readOnly initialData={carData.media as unknown as MediaLibrary[]} />
        </div>
      )}

      <CarInfoCards carData={carData} />

      <Card body className="mb-4">
        <strong>Deskripsi</strong>
        <p className="mt-2 mb-0" dangerouslySetInnerHTML={{ __html: parseAntiXss(carData.description || '-') }} />
      </Card>

      <PricingInfo carData={carData} />
    </Card>
  );
};

const CarStatus: React.FC<{ carData: Database['CarData'] }> = ({ carData }) => {
  const plateDaysRemaining = dayjs(carData.license_plate_expiration).diff(dayjs(), 'day');
  const certDaysRemaining = dayjs(carData.vehicle_registration_cert_expiration).diff(dayjs(), 'day');
  const lastUsage = dayjs().diff('2025-04-01', 'day');

  return (
    <Card body className="rounded-4">
      <Card.Title>Status Kendaraan</Card.Title>

      <div className="pt-4 pb-3 mb-4 justify-content-between d-flex border-bottom">
        <div className="gap-2 d-flex align-items-center">
          <div className={'text-' + getCarStatusColor(carData.status as CarStatusEnum)}>{getCarStatusIcon(carData.status as CarStatusEnum)}</div>
          <Card.Title className="mb-0">{getCarStatusLabel(carData.status as CarStatusEnum)}</Card.Title>
        </div>

        <div>
          <EditData id={carData.id} label="Ubah Status" />
        </div>
      </div>

      <div className="gap-2 pb-3 mb-2 d-flex flex-column">
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

      <div className="py-4 mb-3 border-top border-bottom">
        <Card.Title className="mb-3">Dokumen Penting</Card.Title>

        {/* Nomor Polisi */}
        <Card className="mb-3 bg-light">
          <Card.Body className="flex-wrap d-flex justify-content-between">
            <div className="gap-1 d-flex flex-column">
              <Card.Title className="mb-0 fw-bold h6">{carData.license_plate}</Card.Title>
              <Card.Text className="mb-0">Nomor Polisi</Card.Text>
            </div>
            <div className="d-flex align-items-end flex-column">
              <small className="mb-1 d-flex">Masa Berlaku</small>
              <Badge bg="light" text="dark" className="border">
                {dayjs(carData.license_plate_expiration).format('DD MMM YYYY')}
              </Badge>
            </div>
            {((plateDaysRemaining <= 31 && plateDaysRemaining >= 0) || plateDaysRemaining < 0) && (
              <div className="mt-1 flex-grow-1" style={{ flexBasis: '100%' }}>
                {plateDaysRemaining <= 31 && plateDaysRemaining >= 0 && (
                  <small className="gap-1 text-danger">
                    <FaExclamationTriangle />&nbsp;&nbsp;Segera diperpanjang karena masa berlaku akan habis!
                  </small>
                )}
                {plateDaysRemaining < 0 && (
                  <small className="gap-1 text-danger">
                    <FaExclamationTriangle />&nbsp;&nbsp;Sudah kadaluarsa! Segera perpanjang.
                  </small>
                )}
              </div>
            )}
          </Card.Body>
        </Card>

        {/* TNKB */}
        <Card className="bg-light">
          <Card.Body className="flex-wrap d-flex justify-content-between">
            <div className="gap-1 d-flex flex-column">
              <Card.Title className="mb-0 fw-bold h6">{carData.vehicle_registration_cert_number}</Card.Title>
              <Card.Text className="mb-0">Nomor STNK</Card.Text>
            </div>
            <div className="d-flex align-items-end flex-column">
              <small className="mb-1 d-flex">Masa Berlaku</small>
              <Badge bg="light" text="dark" className="border">
                {dayjs(carData.vehicle_registration_cert_expiration).format('DD MMM YYYY')}
              </Badge>
            </div>
            {((certDaysRemaining <= 31 && certDaysRemaining >= 0) || certDaysRemaining < 0) && (
              <div className="mt-1 flex-grow-1" style={{ flexBasis: '100%' }}>
                {certDaysRemaining <= 31 && certDaysRemaining >= 0 && (
                  <small className="gap-1 text-danger">
                    <FaExclamationTriangle />&nbsp;&nbsp;Segera diperpanjang karena masa berlaku akan habis!
                  </small>
                )}
                {certDaysRemaining < 0 && (
                  <small className="gap-1 text-danger">
                    <FaExclamationTriangle />&nbsp;&nbsp;Sudah kadaluarsa! Segera perpanjang.
                  </small>
                )}
              </div>
            )}
          </Card.Body>
        </Card>
      </div>

      {/* Jadwal Reservasi */}
      <div className="mb-0">
        <Card.Title className="mb-3">Jadwal Reservasi</Card.Title>

        <div className="gap-3 d-flex flex-column">
          <Card className="bg-light">
            <Card.Body className="d-flex justify-content-between align-items-start">
              <div className="gap-1 d-flex flex-column">
                <Card.Title className="mb-0 fw-bold h6">{dayjs('2025-07-15').format('DD MMM YYYY')}</Card.Title>
                <Card.Text className="mb-0">Penyewa: Agus Dwi Setyawan</Card.Text>
              </div>
              <Badge as="div" bg="light" text="dark" className="border">Akan Datang</Badge>
            </Card.Body>
          </Card>

          <Card className="bg-light">
            <Card.Body className="d-flex justify-content-between align-items-start">
              <div className="gap-1 d-flex flex-column">
                <Card.Title className="mb-0 fw-bold h6">{dayjs('2025-07-01').format('DD MMM YYYY')}</Card.Title>
                <Card.Text className="mb-0">Penyewa: Rudi Wicaksono</Card.Text>
              </div>
              <Badge as="div" bg="light" text="dark" className="border">Akan Datang</Badge>
            </Card.Body>
          </Card>

          <Card className="bg-light">
            <Card.Body className="d-flex justify-content-between align-items-start">
              <div className="gap-1 d-flex flex-column">
                <Card.Title className="mb-0 fw-bold h6">{dayjs('2025-04-01').format('DD MMM YYYY')}</Card.Title>
                <Card.Text className="mb-0">Penyewa: Ahmad Syariffuddin</Card.Text>
              </div>
              <Badge as="div" bg="success">Selesai</Badge>
            </Card.Body>
          </Card>
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

const CarRegistration = ({ carData }: { carData: Database['CarData'] }) => {
  const { showModalTrack, setShowModalTrack } = useShowModalTrack();

  return (
    <>
      <h4 className="mb-1 fw-bold">Data Registrasi</h4>
      <p>Informasi registrasi dan dokumen kendaraan</p>

      <Row className="g-1">
        <Col md="6" xxl="4">
          <LabelValue label="Nomor Rangka" value={<span className="font-mono">{carData.frame_number}</span>} bottomBorder={false} />
        </Col>
        <Col md="6" xxl="4">
          <LabelValue label="Nomor Mesin" value={<span className="font-mono">{carData.engine_number}</span>} bottomBorder={false} />
        </Col>
        <Col md="6" xxl="4">
          <LabelValue label="Nomor Polisi / TNKB" value={<span className="font-mono">{carData.license_plate || '-'}</span>} bottomBorder={false} />
        </Col>
        <Col md="6" xxl="4">
          <LabelValue
            label="Masa Berlaku Nomor Polisi"
            value={dayjs(carData.license_plate_expiration).format('DD MMMM YYYY')}
            bottomBorder={false}
          />
        </Col>
        <Col md="6" xxl="4">
          <LabelValue
            label="Nomor STNK"
            value={<span className="font-mono">{carData.vehicle_registration_cert_number}</span>}
            bottomBorder={false}
          />
        </Col>
        <Col md="6" xxl="4">
          <LabelValue
            label="Masa Berlaku Nomor STNK"
            value={dayjs(carData.vehicle_registration_cert_expiration).format('DD MMMM YYYY')}
            bottomBorder={false}
          />
        </Col>
      </Row>

      <Row className="g-0">
        <Col md={12}>
          <Card bg="light">
            <Card.Body className="w-full">
              <div className="w-full d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title className="fw-bold">IMEI GPS</Card.Title>
                  <Card.Text>{carData.gps_imei ?? 'Belum diatur'}</Card.Text>
                </div>
                <div><Button variant="dark" onClick={() => setShowModalTrack(!showModalTrack)}>Lacak</Button></div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

const CarHistory = () => {
  return (
    <div>
      <div className="gap-3 d-flex flex-column">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="mb-0">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <div className="gap-3 d-flex align-items-center">
                <div className="overflow-hidden rounded-circle" style={{ width: '40px', height: '40px' }}>
                  <img
                    src={`https://placehold.co/40/6c757d/ffffff?text=U${i}`}
                    alt="User"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://placehold.co/40/6c757d/ffffff?text=U${i}`;
                    }}
                    width={40}
                    height={40}
                  />
                </div>
                <div>
                  <p className="mb-0 fw-semibold">Budi Santoso</p>
                  <p className="mb-0 text-muted small">ID: RS-2023-{1000 + i}</p>
                </div>
              </div>
              <Badge bg="light" text="dark" className="border">Selesai</Badge>
            </Card.Header>

            <Card.Body>
              <Row>
                <Col xs={12} sm={4} className="mb-3 mb-sm-0">
                  <div className="gap-2 d-flex">
                    <FaCalendar size={16} className="mt-1 text-muted" />
                    <div>
                      <p className="mb-0 text-muted small fw-medium">Periode Sewa</p>
                      <p className="mb-0 small">12 Apr - 15 Apr 2023</p>
                      <p className="mb-0 text-muted small">3 hari</p>
                    </div>
                  </div>
                </Col>
                <Col xs={12} sm={4} className="mb-3 mb-sm-0">
                  <div className="gap-2 d-flex">
                    <FaMapPin size={16} className="mt-1 text-muted" />
                    <div>
                      <p className="mb-0 text-muted small fw-medium">Lokasi</p>
                      <p className="mb-0 small">Kota Surakarta</p>
                    </div>
                  </div>
                </Col>
                <Col xs={12} sm={4}>
                  <div className="gap-2 d-flex">
                    <FaUser size={16} className="mt-1 text-muted" />
                    <div>
                      <p className="mb-0 text-muted small fw-medium">Pengemudi</p>
                      <p className="mb-0 small">Dengan Pengemudi</p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>

            <Card.Footer className="bg-white d-flex justify-content-between align-items-center">
              <div>
                <p className="mb-0 small fw-medium">Total Pembayaran</p>
                <p className="mb-0 fw-bold">{currencyFormat(1050000)}</p>
              </div>
              <Button variant="light" size="sm" className="gap-1 d-flex align-items-center">
                Detail
                <FaChevronRight size={16} />
              </Button>
            </Card.Footer>
          </Card>
        ))}
      </div>
    </div>
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

export default function Show({ car_data }: ShowProps) {
  return (
    <AuthenticatedAdmin header={<CarDetailHeader carData={car_data} />}>
      <Head title={`Detail Kendaraan ${car_data.brand} ${car_data.car_name}`} />

      <ShowModalTrackProvider>
        <Row className="py-4 position-relative gy-4">
          <Col md={8}>
            <CarMainDetails carData={car_data} />
          </Col>
          <Col md={4} className="position-relative">
            <CarStatus carData={car_data} />
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
                  <Nav.Link eventKey="registrasi">Registrasi Kendaraan</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="riwayat">Riwayat Sewa</Nav.Link>
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
                <Tab.Pane eventKey="registrasi">
                  <CarRegistration carData={car_data} />
                </Tab.Pane>
                <Tab.Pane eventKey="riwayat">
                  <CarHistory />
                </Tab.Pane>
                <Tab.Pane eventKey="komentar">
                  <CarComments />
                </Tab.Pane>
              </Tab.Content>
            </Card.Body>
          </Card>
        </Tab.Container>

        <ModalTrackingMap />
      </ShowModalTrackProvider>
    </AuthenticatedAdmin>
  );
}
