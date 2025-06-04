import { useEffect, useMemo, useState, useCallback, FC } from "react";
import { Modal, Nav, Row, Col } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useShowModalTrack } from "@/Context/TrackingModalContext";
import CarImage from '@/Assets/Icon/car.png';
import { FaSync } from "react-icons/fa";
import Database from "@/types/database";

interface CurrentGPSData {
  device: {
    id: number;
    deviceName: string;
    deviceImei: string;
    deviceId: string;
    createdAt: string;
    updatedAt: string;
  };
  currentPosition: {
    id: string;
    longitude: number;
    latitude: number;
    speed: number;
    altitude: number;
    direction: number;
    timestamp: string;
    createdAt: string;
  };
  meta: {
    requestedAt: string;
    positionAge: {
      milliseconds: number;
      minutes: number;
      isRecent: boolean;
    };
  };
}

interface HistoryRecord {
  id: string;
  longitude: number;
  latitude: number;
  speed: number;
  altitude: number;
  direction: number;
  timestamp: string;
  createdAt: string;
}

interface HistoryGPSData {
  device: {
    id: number;
    deviceName: string;
    deviceImei: string;
    deviceId: string;
    createdAt: string;
    updatedAt: string;
  };
  histories: HistoryRecord[];
  summary: {
    totalRecords: number;
    recordsReturned: number;
    timeRange: {
      hours: number;
      startDate: string;
      endDate: string;
      timezone: string;
    };
    dataRange: {
      firstTimestamp: string;
      lastTimestamp: string;
    };
  };
  meta: {
    requestedAt: string;
    limit: number;
    hasMoreData: boolean;
  };
}

const DEFAULT_POSITION: [number, number] = [-7.63978, 111.523638];
const REFRESH_INTERVAL = 60000;

const ModalTrackingMap: FC<{ carData: Database['CarData'] }> = ({ carData }) => {
  const { showModalTrack, setShowModalTrack } = useShowModalTrack();
  const [loading, setLoading] = useState<boolean>(false);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [currentData, setCurrentData] = useState<CurrentGPSData | null>(null);
  const [historyData, setHistoryData] = useState<HistoryGPSData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createCarIcon = useCallback((rotation: number = 0) => {
    return L.divIcon({
      html: `
        <div style="
          transform: rotate(${rotation - 90}deg);
          transform-origin: center;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <img src="${CarImage}" style="width: 48px; height: 48px;" alt="${carData.brand} ${carData.car_name}" />
        </div>
      `,
      className: 'custom-car-icon',
      iconSize: [48, 48],
      iconAnchor: [24, 48],
      popupAnchor: [0, -48],
    });
  }, []);

  const startMarkerIcon = useMemo(() =>
    L.divIcon({
      html: '<div style="background-color: #28a745; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>',
      className: 'custom-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    }), []
  );

  const fetchCurrentData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://gps.kodinus.web.id/api/gps-history/${carData.gps_imei}/current`);
      if (!response.ok) throw new Error('Failed to fetch current data');
      const data: CurrentGPSData = await response.json();
      setCurrentData(data);
    } catch (error) {
      console.error('Error fetching GPS data:', error);
      setError('Gagal memuat data lokasi terkini');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHistoryData = useCallback(async () => {
    setHistoryLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://gps.kodinus.web.id/api/gps-history/${carData.gps_imei}/latest?limit=1000`);
      if (!response.ok) throw new Error('Failed to fetch history data');
      const data: HistoryGPSData = await response.json();
      setHistoryData(data);
    } catch (error) {
      console.error('Error fetching GPS history data:', error);
      setError('Gagal memuat data riwayat');
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!showModalTrack) return;

    if (activeTab === 'current') fetchCurrentData();
    else if (activeTab === 'history') fetchHistoryData();

    const interval = setInterval(() => {
      if (activeTab === 'current') fetchCurrentData();
      else if (activeTab === 'history') fetchHistoryData();
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [showModalTrack, activeTab, fetchCurrentData, fetchHistoryData]);

  const centerPosition: [number, number] = useMemo(() => {
    if (activeTab === 'current' && currentData?.currentPosition) {
      return [currentData.currentPosition.latitude, currentData.currentPosition.longitude];
    } else if (activeTab === 'history' && historyData && historyData.histories.length > 0) {
      const firstRecord = historyData.histories[0];
      return [firstRecord.latitude, firstRecord.longitude];
    }
    return DEFAULT_POSITION;
  }, [currentData, historyData, activeTab]);

  const historyPath = useMemo(() => {
    if (historyData && historyData.histories.length > 1) {
      return historyData.histories
        .slice()
        .reverse()
        .map(record => [record.latitude, record.longitude] as [number, number]);
    }
    return [];
  }, [historyData]);

  const LoadingSpinner = ({ text = "Memuat..." }: { text?: string }) => (
    <div className="d-flex flex-column justify-content-center align-items-center h-100">
      <div className="mb-3 spinner-border text-primary" role="status" style={{ width: 60, height: 60 }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted">{text}</p>
    </div>
  );

  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="d-flex justify-content-center align-items-center h-100">
      <div className="text-center alert alert-danger" role="alert">
        <h5>Terjadi Kesalahan</h5>
        <p className="mb-0">{message}</p>
      </div>
    </div>
  );

  const RefreshButton = ({ onClick, isLoading }: { onClick: () => void; isLoading: boolean }) => (
    <button
      className="btn btn-primary position-absolute"
      style={{ top: 16, right: 16, zIndex: 1000 }}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Memuat...
        </>
      ) : (
        <>
          <FaSync className="me-2" />
          Muat Ulang
        </>
      )}
    </button>
  );

  const renderCurrentLocationTab = () => {
    if (error) return <ErrorMessage message={error} />;
    if (loading && !currentData) return <LoadingSpinner text="Memuat lokasi terkini..." />;
    if (!currentData) return <ErrorMessage message="Data lokasi tidak tersedia" />;

    return (
      <div className="position-relative" style={{ height: 'calc(100vh - 140px)' }}>
        <RefreshButton onClick={fetchCurrentData} isLoading={loading} />
        <MapContainer
          center={centerPosition}
          zoom={18}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={centerPosition}
            icon={createCarIcon(currentData.currentPosition.direction)}
          >
            <Popup>
              <div>
                <strong>{currentData.device.deviceName}</strong><br />
                Waktu: {new Date(currentData.currentPosition.timestamp).toLocaleString('id-ID')}<br />
                Kecepatan: {currentData.currentPosition.speed} km/h<br />
                Altitude: {currentData.currentPosition.altitude} m<br />
                Arah: {currentData.currentPosition.direction}&deg;<br />
                Status: {currentData.meta.positionAge.isRecent ? 'Terbaru' : 'Lama'}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    );
  };

  const renderHistoryTab = () => {
    if (error) return <ErrorMessage message={error} />;
    if (historyLoading && !historyData) return <LoadingSpinner text="Memuat riwayat perjalanan..." />;
    if (!historyData?.histories?.length) return <ErrorMessage message="Data riwayat tidak tersedia" />;

    return (
      <div style={{ height: '100%' }}>
        <div className="p-3 mb-3 rounded bg-light">
          <Row>
            <Col md={3}>
              <small className="text-muted">Total Rekaman</small>
              <div className="fw-bold">{historyData.summary.totalRecords.toLocaleString('id-ID')}</div>
            </Col>
            <Col md={3}>
              <small className="text-muted">Periode</small>
              <div className="fw-bold">{historyData.summary.timeRange.hours} jam terakhir</div>
            </Col>
            <Col md={3}>
              <small className="text-muted">Waktu Mulai</small>
              <div className="fw-bold">
                {new Date(historyData.summary.dataRange.firstTimestamp).toLocaleString('id-ID')}
              </div>
            </Col>
            <Col md={3}>
              <small className="text-muted">Waktu Akhir</small>
              <div className="fw-bold">
                {new Date(historyData.summary.dataRange.lastTimestamp).toLocaleString('id-ID')}
              </div>
            </Col>
          </Row>
        </div>
        <div className="position-relative" style={{ height: 'calc(100vh - 260px)' }}>
          <RefreshButton onClick={fetchHistoryData} isLoading={historyLoading} />
          <MapContainer
            center={centerPosition}
            zoom={15}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {historyPath.length > 1 && (
              <Polyline
                positions={historyPath}
                color="#007bff"
                weight={3}
                opacity={0.7}
              />
            )}
            <Marker
              position={[
                historyData.histories[historyData.histories.length - 1].latitude,
                historyData.histories[historyData.histories.length - 1].longitude,
              ]}
              icon={startMarkerIcon}
            >
              <Popup>
                <div>
                  <strong>Titik Mulai</strong><br />
                  Waktu: {new Date(historyData.histories[historyData.histories.length - 1].timestamp).toLocaleString('id-ID')}<br />
                  Kecepatan: {historyData.histories[historyData.histories.length - 1].speed} km/h
                </div>
              </Popup>
            </Marker>
            <Marker
              position={[
                historyData.histories[0].latitude,
                historyData.histories[0].longitude,
              ]}
              icon={createCarIcon(historyData.histories[0].direction)}
            >
              <Popup>
                <div>
                  <strong>Posisi Terakhir</strong><br />
                  Waktu: {new Date(historyData.histories[0].timestamp).toLocaleString('id-ID')}<br />
                  Kecepatan: {historyData.histories[0].speed} km/h<br />
                  Altitude: {historyData.histories[0].altitude} m<br />
                  Arah: {historyData.histories[0].direction}&deg;
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    );
  };

  const handleTabChange = useCallback((tab: 'current' | 'history') => {
    setActiveTab(tab);
    setError(null);
  }, []);

  return (
    <Modal
      show={showModalTrack}
      onHide={() => setShowModalTrack(false)}
      fullscreen
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Posisi Kendaraan "{carData.brand} {carData.car_name}"</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        <div className="px-3 pt-3">
          <Nav variant="pills" className="gap-2 mb-3">
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'current'}
                onClick={() => handleTabChange('current')}
                style={{ cursor: 'pointer' }}
              >
                Lokasi Terkini
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'history'}
                onClick={() => handleTabChange('history')}
                style={{ cursor: 'pointer' }}
              >
                Riwayat Jelajah
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
        <div className="px-3" style={{ height: 'calc(100vh - 140px)' }}>
          {activeTab === 'current' ? renderCurrentLocationTab() : renderHistoryTab()}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalTrackingMap;
