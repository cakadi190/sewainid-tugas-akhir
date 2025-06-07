import { useEffect, useMemo, useState, useCallback, FC } from "react";
import {
  Badge,
  FloatingLabel,
  InputGroup,
  Modal,
  Nav,
  Pagination,
} from "react-bootstrap";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import { Indonesian } from "flatpickr/dist/l10n/id.js";
import { useShowModalTrack } from "@/Context/TrackingModalContext";
import CarImage from "@/Assets/Icon/car.png";
import { FaSync, FaCalendarAlt, FaTimes } from "react-icons/fa";
import Database from "@/types/database";
import MarkerClusterGroup from "react-leaflet-cluster";

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
  filters: {
    startDate: string | null;
    endDate: string | null;
    timezone: string;
  };
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

const DEFAULT_POSITION: [number, number] = [-7.63978, 111.523638];
const REFRESH_INTERVAL = 60000;
const DEFAULT_PER_PAGE = 250;

const ModalTrackingMap: FC<{ carData: Database["CarData"] }> = ({
  carData,
}) => {
  const { showModalTrack, setShowModalTrack } = useShowModalTrack();
  const [loading, setLoading] = useState<boolean>(false);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"current" | "history">("current");
  const [currentData, setCurrentData] = useState<CurrentGPSData | null>(null);
  const [historyData, setHistoryData] = useState<HistoryGPSData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(DEFAULT_PER_PAGE);
  const [dateRange, setDateRange] = useState<Date[]>([]);

  // Helper function to determine if identifier is IMEI or deviceId
  const isImei = useCallback((identifier: string): boolean => {
    // IMEI typically has 15 digits and contains only numbers
    return /^\d{15}$/.test(identifier);
  }, []);

  // Helper function to build API endpoint
  const buildApiEndpoint = useCallback(
    (identifier: string, endpoint: string): string => {
      const baseUrl = "https://gps.kodinus.web.id/api/gps-history";

      if (isImei(identifier)) {
        return `${baseUrl}/imei/${identifier}${endpoint}`;
      } else {
        return `${baseUrl}/device/${identifier}${endpoint}`;
      }
    },
    [isImei]
  );

  const createCarIcon = useCallback(
    (rotation: number = 0) => {
      return L.divIcon({
        html: `
        <div style="
          transform: rotate(${rotation}deg);
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
        className: "custom-car-icon",
        iconSize: [48, 48],
        iconAnchor: [24, 48],
        popupAnchor: [0, -48],
      });
    },
    [carData.brand, carData.car_name]
  );

  const startMarkerIcon = useMemo(
    () =>
      L.divIcon({
        html: '<div style="background-color: #28a745; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>',
        className: "custom-marker",
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      }),
    []
  );

  const fetchCurrentData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = buildApiEndpoint(carData.gps_imei || "", "/current");
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error("Failed to fetch current data");
      const data: CurrentGPSData = await response.json();
      setCurrentData(data);
    } catch (error) {
      console.error("Error fetching GPS data:", error);
      setError("Gagal memuat data lokasi terkini");
    } finally {
      setLoading(false);
    }
  }, [carData.gps_imei, buildApiEndpoint]);

  const fetchHistoryData = useCallback(
    async (
      page: number = 1,
      limit: number = DEFAULT_PER_PAGE,
      startDate?: Date,
      endDate?: Date
    ) => {
      setHistoryLoading(true);
      setError(null);
      try {
        let queryParams = `page=${page}&perPage=${limit}`;

        if (startDate && endDate) {
          const startISO = startDate.toISOString();
          const endISO = endDate.toISOString();
          queryParams += `&startDate=${encodeURIComponent(
            startISO
          )}&endDate=${encodeURIComponent(endISO)}`;
        }

        const endpoint = buildApiEndpoint(
          carData.gps_imei || "",
          `?${queryParams}`
        );
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Failed to fetch history data");
        const data: HistoryGPSData = await response.json();
        setHistoryData(data);
        setCurrentPage(page);
      } catch (error) {
        console.error("Error fetching GPS history data:", error);
        setError("Gagal memuat data riwayat");
      } finally {
        setHistoryLoading(false);
      }
    },
    [carData.gps_imei, buildApiEndpoint]
  );

  useEffect(() => {
    if (!showModalTrack) return;

    if (activeTab === "current") {
      fetchCurrentData();
    } else if (activeTab === "history") {
      const startDate = dateRange.length >= 1 ? dateRange[0] : undefined;
      const endDate = dateRange.length >= 2 ? dateRange[1] : undefined;
      fetchHistoryData(currentPage, perPage, startDate, endDate);
    }

    const interval = setInterval(() => {
      if (activeTab === "current") {
        fetchCurrentData();
      } else if (activeTab === "history") {
        const startDate = dateRange.length >= 1 ? dateRange[0] : undefined;
        const endDate = dateRange.length >= 2 ? dateRange[1] : undefined;
        fetchHistoryData(currentPage, perPage, startDate, endDate);
      }
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [
    showModalTrack,
    activeTab,
    currentPage,
    perPage,
    dateRange,
    fetchCurrentData,
    fetchHistoryData,
  ]);

  const centerPosition: [number, number] = useMemo(() => {
    if (activeTab === "current" && currentData?.currentPosition) {
      return [
        currentData.currentPosition.latitude,
        currentData.currentPosition.longitude,
      ];
    } else if (
      activeTab === "history" &&
      historyData &&
      historyData.histories.length > 0
    ) {
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
        .map(
          (record) => [record.latitude, record.longitude] as [number, number]
        );
    }
    return [];
  }, [historyData]);

  const handlePageChange = useCallback(
    (page: number) => {
      if (
        page !== currentPage &&
        page >= 1 &&
        historyData &&
        page <= historyData.pagination.totalPages
      ) {
        const startDate = dateRange.length >= 1 ? dateRange[0] : undefined;
        const endDate = dateRange.length >= 2 ? dateRange[1] : undefined;
        fetchHistoryData(page, perPage, startDate, endDate);
      }
    },
    [currentPage, historyData, perPage, dateRange, fetchHistoryData]
  );

  const handlePerPageChange = useCallback(
    (newPerPage: number) => {
      setPerPage(newPerPage);
      setCurrentPage(1);
      const startDate = dateRange.length >= 1 ? dateRange[0] : undefined;
      const endDate = dateRange.length >= 2 ? dateRange[1] : undefined;
      fetchHistoryData(1, newPerPage, startDate, endDate);
    },
    [dateRange, fetchHistoryData]
  );

  const handleDateRangeChange = useCallback(
    (selectedDates: Date[]) => {
      setDateRange(selectedDates);
      setCurrentPage(1);

      if (selectedDates.length === 2) {
        const startDate = selectedDates[0];
        const endDate = selectedDates[1];
        fetchHistoryData(1, perPage, startDate, endDate);
      } else if (selectedDates.length === 0) {
        // Reset to show all data
        fetchHistoryData(1, perPage);
      }
    },
    [perPage, fetchHistoryData]
  );

  const clearDateFilter = useCallback(() => {
    setDateRange([]);
    setCurrentPage(1);
    fetchHistoryData(1, perPage);
  }, [perPage, fetchHistoryData]);

  const LoadingSpinner = ({ text = "Memuat..." }: { text?: string }) => (
    <div className="d-flex flex-column justify-content-center align-items-center h-100">
      <div
        className="mb-3 spinner-border text-primary"
        role="status"
        style={{ width: 60, height: 60 }}
      >
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

  const RefreshButton = ({
    onClick,
    isLoading,
  }: {
    onClick: () => void;
    isLoading: boolean;
  }) => (
    <button
      className="btn btn-primary position-absolute"
      style={{ top: 16, right: 16, zIndex: 1000 }}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <span
            className="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
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

  // Simplified Pagination Controls
  const PaginationControls = () => {
    if (!historyData?.pagination) return null;

    const { page, totalPages, hasNextPage, hasPrevPage, total } =
      historyData.pagination;

    return (
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div className="text-muted small">
          Halaman {page} dari {totalPages} | Total:{" "}
          {total.toLocaleString("id-ID")} data
        </div>

        {totalPages > 1 && (
          <Pagination size="sm" className="mb-0">
            {totalPages > 5 && page > 2 && (
              <Pagination.First
                onClick={() => handlePageChange(1)}
                disabled={page === 1 || loading}
              />
            )}
            <Pagination.Prev
              disabled={!hasPrevPage || loading}
              onClick={() => handlePageChange(page - 1)}
            />
            <Pagination.Item active>{page}</Pagination.Item>
            <Pagination.Next
              disabled={!hasNextPage || loading}
              onClick={() => handlePageChange(page + 1)}
            />
          </Pagination>
        )}
      </div>
    );
  };

  const DateRangeFilter = () => (
    <div className="mb-3">
      <InputGroup className="mb-3">
        <InputGroup.Text>
          <FaCalendarAlt />
        </InputGroup.Text>

        <FloatingLabel label="Pilih rentang tanggal...">
          <Flatpickr
            options={{
              mode: "range",
              dateFormat: "d/m/Y",
              locale: Indonesian,
              maxDate: "today",
              allowInput: true,
              clickOpens: true,
            }}
            value={dateRange}
            onChange={handleDateRangeChange}
            className="form-control form-control-sm"
            placeholder="Pilih rentang tanggal..."
          />
        </FloatingLabel>

        {dateRange.length > 0 && (
          <button
            className="btn btn-secondary"
            onClick={clearDateFilter}
            title="Hapus filter tanggal"
          >
            <FaTimes />
          </button>
        )}
      </InputGroup>

      <div className="flex-wrap gap-1 d-flex align-items-center">
        <Badge
          onClick={() => {
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            handleDateRangeChange([yesterday, today]);
          }}
          className="cursor-pointer"
          bg="primary"
        >
          Kemarin
        </Badge>
        <Badge
          onClick={() => {
            const today = new Date();
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            handleDateRangeChange([weekAgo, today]);
          }}
          className="cursor-pointer"
          bg="primary"
        >
          7 Hari
        </Badge>
        <Badge
          onClick={() => {
            const today = new Date();
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            handleDateRangeChange([monthAgo, today]);
          }}
          className="cursor-pointer"
          bg="primary"
        >
          30 Hari
        </Badge>

        {dateRange.length === 2 && (
          <div>
            <small className="text-success">
              <strong>Filter aktif:</strong>{" "}
              {dateRange[0].toLocaleDateString("id-ID")} -{" "}
              {dateRange[1].toLocaleDateString("id-ID")}
            </small>
          </div>
        )}
      </div>
    </div>
  );

  const renderCurrentLocationTab = () => {
    if (error) return <ErrorMessage message={error} />;
    if (loading && !currentData)
      return <LoadingSpinner text="Memuat lokasi terkini..." />;
    if (!currentData)
      return <ErrorMessage message="Data lokasi tidak tersedia" />;

    return (
      <div
        className="position-relative"
        style={{ height: "calc(100vh - 140px)" }}
      >
        <RefreshButton onClick={fetchCurrentData} isLoading={loading} />
        <MapContainer
          center={centerPosition}
          zoom={18}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
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
                <strong>{currentData.device.deviceName}</strong>
                <br />
                Waktu:{" "}
                {new Date(currentData.currentPosition.timestamp).toLocaleString(
                  "id-ID"
                )}
                <br />
                Kecepatan: {currentData.currentPosition.speed} km/h
                <br />
                Altitude: {currentData.currentPosition.altitude} m<br />
                Arah: {currentData.currentPosition.direction}&deg;
                <br />
                Status:{" "}
                {currentData.meta.positionAge.isRecent ? "Terbaru" : "Lama"}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    );
  };

  const renderHistoryTab = () => {
    if (error) return <ErrorMessage message={error} />;
    if (historyLoading && !historyData)
      return <LoadingSpinner text="Memuat riwayat perjalanan..." />;
    if (!historyData?.histories?.length)
      return <ErrorMessage message="Data riwayat tidak tersedia" />;

    return (
      <div style={{ height: "100%" }}>
        <DateRangeFilter />
        <PaginationControls />

        <div
          className="position-relative"
          style={{ height: "calc(100vh - 320px)" }}
        >
          <RefreshButton
            onClick={() => {
              const startDate =
                dateRange.length >= 1 ? dateRange[0] : undefined;
              const endDate = dateRange.length >= 2 ? dateRange[1] : undefined;
              fetchHistoryData(currentPage, perPage, startDate, endDate);
            }}
            isLoading={historyLoading}
          />
          <MapContainer
            center={centerPosition}
            zoom={15}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
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

            <MarkerClusterGroup chunkedLoading>
              {historyData.histories.map((record, index) => (
                <Marker
                  key={record.id}
                  position={[record.latitude, record.longitude]}
                  icon={
                    index === 0
                      ? createCarIcon(record.direction) // titik terakhir
                      : index === historyData.histories.length - 1
                      ? startMarkerIcon // titik pertama
                      : L.icon({
                          iconUrl:
                            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
                          iconSize: [25, 41],
                          iconAnchor: [12, 41],
                          popupAnchor: [1, -34],
                          shadowUrl:
                            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
                          shadowSize: [41, 41],
                        })
                  }
                >
                  <Popup>
                    <div>
                      <strong>{index === 0 ? "Posisi Terakhir" : index === historyData.histories.length - 1 ? "Titik Awal" : `Titik ${index + 1}`}</strong>
                      <br />
                      Waktu: {new Date(record.timestamp).toLocaleString("id-ID")}
                      <br />
                      Kecepatan: {record.speed} km/h
                      <br />
                      Arah: {record.direction}&deg;
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          </MapContainer>
        </div>
      </div>
    );
  };

  const handleTabChange = useCallback((tab: "current" | "history") => {
    setActiveTab(tab);
    setError(null);
    if (tab === "history") {
      setCurrentPage(1);
      setDateRange([]);
    }
  }, []);

  return (
    <Modal
      show={showModalTrack}
      onHide={() => setShowModalTrack(false)}
      fullscreen
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Posisi Kendaraan "{carData.brand} {carData.car_name}"
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        <div className="px-3 pt-3">
          <Nav variant="pills" className="gap-2 mb-3">
            <Nav.Item>
              <Nav.Link
                active={activeTab === "current"}
                onClick={() => handleTabChange("current")}
                style={{ cursor: "pointer" }}
              >
                Lokasi Terkini
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === "history"}
                onClick={() => handleTabChange("history")}
                style={{ cursor: "pointer" }}
              >
                Riwayat Jelajah
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
        <div className="px-3" style={{ height: "calc(100vh - 140px)" }}>
          {activeTab === "current"
            ? renderCurrentLocationTab()
            : renderHistoryTab()}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalTrackingMap;
