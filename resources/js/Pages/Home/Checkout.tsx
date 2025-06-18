import AuthenticatedUser from "@/Layouts/AuthenticatedLayout";
import HeaderCheckout from "./Armada/Partials/HeaderCheckout";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { Card, Col, Row, Button, Form, ListGroup, Badge, Image, Modal } from "react-bootstrap";
import { MediaLibraryType, PageProps } from "@/types";
import { Alert } from "react-bootstrap";
import Database from "@/types/database";
import { createContext, useContext, useState, ReactNode, FormEvent, useEffect, useRef, FC } from "react";
import dayjs from "@/Helpers/dayjs";
import { wrapOptimizeUrl } from "@/Helpers/url";
import LabelValue from "@/Components/LabelValue";
import { FaPencil, FaMapPin, FaCreditCard } from "react-icons/fa6";
import styled from "@emotion/styled";
import { currencyFormat } from "@/Helpers/number";
import axios from "axios";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import { Indonesian } from "flatpickr/dist/l10n/id";
import { LeafletSingle } from "@/Components/LeafletMap";
import { twMerge } from "tailwind-merge";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

// Type definitions
interface CheckoutProps {
  carData: Pick<Database['CarData'], 'id' | 'car_name' | 'brand' | 'license_plate' | 'rent_price' | 'slug'>;
  order: {
    car_id: string;
    pickup_date: string;
    return_date: string;
    with_driver: boolean | null;
    pickup_location?: string;
    return_location?: string;
  };
  forbiddenDate?: string[];
  carThumbnail: MediaLibraryType;
}

interface Location {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  place_id: string;
}

interface PaymentChannel {
  group: string;
  code: string;
  name: string;
  type: string;
  fee_merchant: {
    flat: number;
    percent: number;
  };
  fee_customer: {
    flat: number;
    percent: number;
  };
  total_fee: {
    flat: number;
    percent: string;
  };
  minimum_fee: number | null;
  maximum_fee: number | null;
  minimum_amount: number;
  maximum_amount: number;
  icon_url: string;
  active: boolean;
}

interface FormData {
  car_id: number;
  pickup_date: string;
  return_date: string;
  with_driver: boolean | null;
  destination_latitude: number;
  destination_longitude: number;
  destination_name: string;
  destination_address: string;
  payment_method: string;
  agree_terms: boolean;
}

interface CheckoutContextType {
  order: {
    car_id: string;
    pickup_date: string;
    return_date: string;
    with_driver: boolean | null;
    pickup_location?: string;
    return_location?: string;
  };
  carData: CheckoutProps['carData'];
  carThumbnail: MediaLibraryType;
  formData: FormData;
  setFormData: (field: keyof FormData | Partial<FormData>, value?: any) => void;
  errors: Record<string, string>;
  processing: boolean;
  isLoading: boolean;
  isIdentityUnfilled: boolean;
  handleSubmit: (e: FormEvent) => void;
  rentalDuration: number;
  basePrice: number;
  driverPrice: number;
  serviceFee: number;
  taxAmount: number;
  paymentFee: number;
  totalPrice: number;
  formatRupiah: (amount: number) => string;
  selectedLocation: Location | null;
  setSelectedLocation: (location: Location | null) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  paymentChannels: Record<string, PaymentChannel>;
  setPaymentChannels: (channels: Record<string, PaymentChannel>) => void;
  selectedPaymentChannel: PaymentChannel | null;
  setSelectedPaymentChannel: (channel: PaymentChannel | null) => void;
  updateDates: (startDate: Date, endDate: Date) => void;
}

interface CheckoutProviderProps {
  children: ReactNode;
  carData: CheckoutProps['carData'];
  order: CheckoutProps['order'];
  carThumbnail: MediaLibraryType;
}

interface ModalProps {
  show: boolean;
  onHide: () => void;
  forbiddenDate?: string[];
}

// Styled components
const ButtonEdit = styled.button`
  aspect-ratio: 1/1;
  height: 100%;
  width: fit-content;
  background-color: transparent;
  border-color: transparent;
  padding: .5rem;
`;

const PaymentOption = styled.div`
  padding: 1rem;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #f8f9fa;
  }

  &.selected {
    border-color: #0d6efd;
    background-color: rgba(13, 110, 253, 0.1);
  }
`;

const PaymentIcon = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 1rem;
  object-fit: contain;
`;

const DateRangeContainer = styled.div`
  input {
    width: 100%;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #212529;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    appearance: none;
    border-radius: 0.25rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }
`;

// Create context
const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

// Tax rate constant
const TAX_RATE = 0.11; // 11% Indonesian tax

// Context provider component
const CheckoutProvider = ({ children, carData, order: initialOrder, carThumbnail }: CheckoutProviderProps) => {
  const { props: { auth } } = usePage<PageProps>();
  const isIdentityUnfilled = auth.isIdentityUnfilled === true; // Ensure boolean type
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("transfer");
  const [paymentChannels, setPaymentChannels] = useState<Record<string, PaymentChannel>>({});
  const [selectedPaymentChannel, setSelectedPaymentChannel] = useState<PaymentChannel | null>(null);

  // Use state for order to allow updates
  const [order, setOrder] = useState({
    ...initialOrder,
    pickup_date: initialOrder.pickup_date || dayjs().format('YYYY-MM-DD'),
    return_date: initialOrder.return_date || dayjs().add(1, 'day').format('YYYY-MM-DD')
  });

  // Calculate rental duration in days
  const pickupDate = dayjs(order.pickup_date);
  const returnDate = dayjs(order.return_date);
  const rentalDuration = Math.max(1, returnDate.diff(pickupDate, 'day')) + 1;

  // Calculate costs
  const basePrice = carData.rent_price * rentalDuration;
  const driverPrice = order.with_driver ? 250000 * rentalDuration : 0;
  const serviceFee = 50000;

  // Calculate tax (11% from subtotal)
  const counter = basePrice + driverPrice + serviceFee;
  const taxAmount = counter * TAX_RATE;
  const subtotal = counter + taxAmount;

  // Calculate payment fee based on selected payment channel
  const calculatePaymentFee = () => {
    if (!selectedPaymentChannel) return 0;

    const { fee_customer } = selectedPaymentChannel;

    // Calculate fee from flat rate and percentage
    const flatFee = fee_customer.flat;
    const percentFee = subtotal * (fee_customer.percent / 100);

    return flatFee + percentFee;
  };

  const paymentFee = calculatePaymentFee();

  // Updated total price calculation including tax and payment fee
  const totalPrice = subtotal + paymentFee;

  const { data: formData, setData, post, processing, errors } = useForm<FormData>({
    car_id: carData.id,
    pickup_date: order.pickup_date,
    return_date: order.return_date,
    with_driver: order.with_driver,
    destination_latitude: 0.0,
    destination_longitude: 0.0,
    destination_name: "",
    destination_address: "",
    payment_method: "",
    agree_terms: false,
  });

  // Enhanced setFormData to handle both single field updates and object updates
  const setFormData = (fieldOrObject: keyof FormData | Partial<FormData>, value?: any) => {
    if (typeof fieldOrObject === 'string') {
      // Properly typed now as keyof FormData
      setData(fieldOrObject, value);
    } else {
      Object.entries(fieldOrObject).forEach(([key, val]) => {
        // Cast key as keyof FormData to ensure type safety
        setData(key as keyof FormData, val);
      });
    }
  };

  // Function to update dates
  const updateDates = (startDate: Date, endDate: Date) => {
    const formattedStartDate = dayjs(startDate).format('YYYY-MM-DD');
    const formattedEndDate = dayjs(endDate).format('YYYY-MM-DD');

    // Update both order state and form data
    setOrder(prev => ({
      ...prev,
      pickup_date: formattedStartDate,
      return_date: formattedEndDate
    }));

    setFormData({
      pickup_date: formattedStartDate,
      return_date: formattedEndDate
    });
  };

  // Update form data when location changes
  useEffect(() => {
    if (selectedLocation) {
      setFormData({
        destination_latitude: selectedLocation.latitude,
        destination_longitude: selectedLocation.longitude,
        destination_name: selectedLocation.name,
        destination_address: selectedLocation.address
      });
    }
  }, [selectedLocation]);

  // Update form data when payment channel changes
  useEffect(() => {
    if (selectedPaymentChannel) {
      setFormData('payment_method', selectedPaymentChannel.code);
    } else {
      setFormData('payment_method', paymentMethod);
    }
  }, [selectedPaymentChannel, paymentMethod]);

  // Update form data when order changes
  useEffect(() => {
    setFormData({
      pickup_date: order.pickup_date,
      return_date: order.return_date
    });
  }, [order.pickup_date, order.return_date]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Prevent submission if terms are not agreed to or identity is unfilled
    if (!formData.agree_terms || isIdentityUnfilled) {
      setIsLoading(false);
      return;
    }

    // Ensure form data is up-to-date before submission
    const updatedFormData: Partial<FormData> = {
      pickup_date: order.pickup_date,
      return_date: order.return_date,
      destination_latitude: selectedLocation?.latitude || 0,
      destination_longitude: selectedLocation?.longitude || 0,
      destination_name: selectedLocation?.name || "",
      destination_address: selectedLocation?.address || "",
      payment_method: selectedPaymentChannel?.code || paymentMethod
    };

    // Update the form data with the latest values
    Object.entries(updatedFormData).forEach(([key, value]) => {
      setFormData(key as keyof FormData, value);
    });

    // Short delay to ensure state updates before submission
    setTimeout(() => {
      post(route('v1.home.checkout.checkout'), {
        onSuccess: (data: any) => {
          console.log(data)
          // Navigate to order confirmation page
        },
        onError: (error: any) => {
          console.error("Checkout error:", error);
        },
        onFinish: () => setIsLoading(false),
      });
    }, 100);
  };

  function formatRupiah(amount: number) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  }

  const value: CheckoutContextType = {
    order,
    carData,
    carThumbnail,
    formData,
    setFormData,
    errors,
    processing,
    isLoading,
    isIdentityUnfilled,
    handleSubmit,
    rentalDuration,
    basePrice,
    driverPrice,
    serviceFee,
    taxAmount,
    paymentFee,
    totalPrice,
    formatRupiah,
    selectedLocation,
    setSelectedLocation,
    paymentMethod,
    setPaymentMethod,
    paymentChannels,
    setPaymentChannels,
    selectedPaymentChannel,
    setSelectedPaymentChannel,
    updateDates
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};

// Custom hook to use the checkout context
const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
};

// Date Range Modal component
const DateRangeModal = ({ show, onHide, forbiddenDate }: ModalProps) => {
  const { order, updateDates } = useCheckout();
  const [dateRange, setDateRange] = useState<Date[]>([
    new Date(order.pickup_date),
    new Date(order.return_date)
  ]);
  const flatpickrRef = useRef<any>(null);

  // Reset dates when modal opens
  useEffect(() => {
    if (show) {
      try {
        setDateRange([new Date(order.pickup_date), new Date(order.return_date)]);

        // Reset the flatpickr input value
        if (flatpickrRef.current && flatpickrRef.current.flatpickr) {
          const fp = flatpickrRef.current.flatpickr;
          fp.setDate([new Date(order.pickup_date), new Date(order.return_date)]);
        }
      } catch (error) {
        console.error("Error setting date range:", error);
      }
    }
  }, [show, order.pickup_date, order.return_date]);

  const handleSave = () => {
    if (dateRange.length === 2) {
      // Ensure both dates are valid
      const startDate = dateRange[0] instanceof Date && !isNaN(dateRange[0].getTime())
        ? dateRange[0]
        : new Date();

      const endDate = dateRange[1] instanceof Date && !isNaN(dateRange[1].getTime())
        ? dateRange[1]
        : new Date(startDate.getTime() + 86400000); // Default to next day if invalid

      updateDates(startDate, endDate);
      onHide();
    }
  };

  // Process forbidden dates
  const disabledDates = (forbiddenDate || []).map(dateStr => {
    try {
      return new Date(dateStr);
    } catch (e) {
      console.error("Invalid date format:", dateStr);
      return null;
    }
  }).filter(date => date !== null) as Date[];

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton className="border-0">
        <Modal.Title>Edit Tanggal Peminjaman</Modal.Title>
      </Modal.Header>
      <Modal.Body className="border-0">
        <DateRangeContainer>
          <Flatpickr
            ref={flatpickrRef}
            value={dateRange}
            options={{
              mode: "range",
              dateFormat: "d F Y",
              minDate: "today",
              locale: Indonesian,
              showMonths: 1,
              disableMobile: true,
              disable: disabledDates,
            }}
            onChange={(dates) => {
              if (dates && dates.length > 0) {
                setDateRange(dates);
              }
            }}
            className="form-control"
          />
          <small className="mt-1 text-muted d-block">
            Silakan pilih tanggal pengambilan dan tanggal pengembalian.
          </small>
        </DateRangeContainer>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="secondary" onClick={onHide}>
          Batal
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Simpan
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// Component for the car details section
const CarDetails: FC<{ forbiddenDate?: string[] }> = ({ forbiddenDate }) => {
  const { carData, carThumbnail, order } = useCheckout();
  const [showDateModal, setShowDateModal] = useState(false);

  return (
    <Row className="mb-4 g-4">
      <Col md={4}>
        <Image
          src={wrapOptimizeUrl(carThumbnail.original_url) || "/images/car-placeholder.jpg"}
          alt={carData.car_name}
          className="rounded img-fluid"
        />
      </Col>
      <Col md={8}>
        <h4>{carData.brand} {carData.car_name}</h4>
        <p className="mb-2 text-muted">{carData.license_plate}</p>
        <div className="d-flex justify-content-between">
          <LabelValue
            label="Tanggal Peminjaman"
            value={dayjs(order.pickup_date).format('DD MMMM YYYY') + " s/d " + dayjs(order.return_date).format('DD MMMM YYYY')}
            noMarginBottom
            bottomBorder={false}
          />
          <ButtonEdit type="button" onClick={() => setShowDateModal(true)}>
            <FaPencil />
          </ButtonEdit>
        </div>
      </Col>

      <DateRangeModal
        show={showDateModal}
        forbiddenDate={forbiddenDate}
        onHide={() => setShowDateModal(false)}
      />
    </Row>
  );
};

// Location section component
const LocationSection = () => {
  const { selectedLocation } = useCheckout();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Card body className="mb-3 rounded-3">
        <div className="gap-2 pb-3 mb-3 d-flex align-items-center justify-content-between border-bottom">
          <Card.Title className="mb-0">Tujuan Peminjaman</Card.Title>
          <ButtonEdit type="button" onClick={() => setShowModal(true)}><FaPencil /></ButtonEdit>
        </div>
        <div className="d-flex">
          <div className="gap-1 d-flex flex-column">
            <strong className="mb-0">{selectedLocation?.name || "Pilih Lokasi Tujuan"}</strong>
            <p className="mb-0">{selectedLocation?.address || "Klik ikon pensil untuk memilih lokasi tujuan"}</p>
          </div>
        </div>

        {selectedLocation && (
          <div className="mt-4 overflow-hidden rounded-2">
            <LeafletSingle
              address={selectedLocation.address}
              name={selectedLocation.name}
              position={[selectedLocation?.latitude, selectedLocation?.longitude]}
            />
          </div>
        )}
      </Card>

      <LocationModal show={showModal} onHide={() => setShowModal(false)} />
    </>
  );
};

// Location Modal component
const LocationModal = ({ show, onHide }: ModalProps) => {
  const { setSelectedLocation } = useCheckout();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Reset search term and results when modal opens
  useEffect(() => {
    if (show) {
      setSearchTerm("");
      setSearchResults([]);
    }
  }, [show]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    try {
      const response = await axios.get(route("v1.global.gmaps-api"), {
        params: { query: searchTerm }
      });

      setSearchResults(response.data.results || []);
    } catch (error) {
      console.error("Error searching for locations:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectLocation = (location: Location) => {
    setSelectedLocation(location);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Pilih Lokasi Tujuan</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          <div className="input-group">
            <Form.Control
              type="text"
              placeholder="Cari lokasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button variant="primary" onClick={handleSearch} disabled={isSearching}>
              {isSearching ? "Mencari..." : "Cari"}
            </Button>
          </div>
        </div>

        <div className="mt-3">
          {searchResults.length === 0 ? (
            <div className="p-5 text-center">
              <FaMapPin size={48} className="mb-3 text-muted" />
              <p>Cari lokasi untuk mulai memilih tujuan peminjaman</p>
            </div>
          ) : (
            <ListGroup>
              {searchResults.map((location, index) => (
                <ListGroup.Item
                  key={index}
                  action
                  onClick={() => handleSelectLocation(location)}
                  className="d-flex flex-column align-items-start"
                >
                  <strong>{location.name}</strong>
                  <small className="text-muted">{location.address}</small>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Batal
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// Payment section component
const PaymentSection = () => {
  const { selectedPaymentChannel, paymentFee } = useCheckout();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Card body className="mb-3 rounded-3">
        <div className="gap-2 pb-3 mb-3 d-flex align-items-center justify-content-between border-bottom">
          <Card.Title className="mb-0">Metode Pembayaran</Card.Title>
          <ButtonEdit type="button" onClick={() => setShowModal(true)}><FaPencil /></ButtonEdit>
        </div>
        <div className="d-flex align-items-center justify-content-between">
          <div className="gap-1 d-flex flex-column">
            {selectedPaymentChannel ? (
              <>
                <strong className="mb-0">{selectedPaymentChannel.name}</strong>
                <p className="mb-0">{selectedPaymentChannel.group}</p>
              </>
            ) : (
              <>
                <strong className="mb-0">Pilih Metode Pembayaran</strong>
                <p className="mb-0">Klik ikon pensil untuk memilih metode pembayaran</p>
              </>
            )}
          </div>
          {selectedPaymentChannel && (
            <h5 className="mb-0 fw-bold text-primary">{paymentFee > 0 ? currencyFormat(paymentFee ?? 0) : 'Gratis'}</h5>
          )}
        </div>
      </Card>

      <PaymentModal show={showModal} onHide={() => setShowModal(false)} />
    </>
  );
};

// Payment Modal component
const PaymentModal = ({ show, onHide }: ModalProps) => {
  const { setPaymentChannels, setSelectedPaymentChannel, paymentChannels, totalPrice } = useCheckout();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentGroups, setPaymentGroups] = useState<Record<string, PaymentChannel[]>>({});

  const fetchPaymentChannels = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(route("v1.global.transaction.get-channels"));
      const channels = response.data;
      setPaymentChannels(channels);

      // Group payment channels by their group
      const groups: Record<string, PaymentChannel[]> = {};
      Object.keys(channels).forEach(id => {
        const channel = channels[id];
        if (!groups[channel.group]) {
          groups[channel.group] = [];
        }
        groups[channel.group].push({ ...channel, id });
      });

      setPaymentGroups(groups);
    } catch (error) {
      console.error("Error fetching payment channels:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch payment channels when modal is shown
  useEffect(() => {
    if (show && Object.keys(paymentChannels).length === 0) {
      fetchPaymentChannels();
    }
  }, [show, paymentChannels]);

  const handleSelectPaymentChannel = (channel: PaymentChannel) => {
    setSelectedPaymentChannel(channel);
    onHide();
  };

  // Calculate fee for a payment channel
  const calculateFeeForChannel = (channel: PaymentChannel) => {
    const flatFee = channel.fee_customer.flat;
    const percentFee = totalPrice * (channel.fee_customer.percent / 100);
    return flatFee + percentFee;
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Pilih Metode Pembayaran</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <div className="p-5 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Memuat metode pembayaran...</p>
          </div>
        ) : (
          <>
            {Object.keys(paymentGroups).length === 0 ? (
              <div className="p-5 text-center">
                <FaCreditCard size={48} className="mb-3 text-muted" />
                <p>Tidak ada metode pembayaran yang tersedia</p>
              </div>
            ) : (
              <>
                {Object.keys(paymentGroups).map(group => (
                  <div key={group} className="mb-4">
                    <h5>{group}</h5>
                    <Row className="g-3">
                      {paymentGroups[group].map((channel, index) => {
                        const fee = calculateFeeForChannel(channel);

                        return (
                          <Col md={6} key={index}>
                            <PaymentOption
                              className={channel.active ? '' : 'opacity-50'}
                              onClick={() => channel.active && handleSelectPaymentChannel(channel)}
                            >
                              <PaymentIcon src={channel.icon_url} alt={channel.name} />
                              <div>
                                <strong>{channel.name}</strong>
                                <div>
                                  <small>{fee > 0 ? currencyFormat(fee) : "Gratis"}</small>
                                </div>
                              </div>
                            </PaymentOption>
                          </Col>
                        );
                      })}
                    </Row>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Batal
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// Terms and conditions component
const TermsAndConditions = () => {
  const { formData, setFormData, errors } = useCheckout();

  return (
    <Form.Group>
      <Form.Check
        type="checkbox"
        id="agree-terms"
        label="Saya setuju dengan syarat dan ketentuan yang berlaku"
        checked={formData.agree_terms}
        onChange={(e) => setFormData('agree_terms', e.target.checked)}
        isInvalid={!!errors.agree_terms}
        required
      />
      {errors.agree_terms && <Form.Control.Feedback type="invalid">{errors.agree_terms}</Form.Control.Feedback>}
    </Form.Group>
  );
};

// Order summary component
const OrderSummary = () => {
  const {
    rentalDuration,
    basePrice,
    driverPrice,
    serviceFee,
    taxAmount,
    paymentFee,
    totalPrice,
    formatRupiah,
    formData,
    isLoading,
    processing,
    isIdentityUnfilled,
    handleSubmit,
    carData,
    selectedPaymentChannel,
    selectedLocation,
    order
  } = useCheckout();

  // Calculate if submit button should be disabled
  const disableSubmit =
    !formData.agree_terms ||
    isIdentityUnfilled ||
    processing ||
    isLoading ||
    rentalDuration <= 0 ||
    !selectedPaymentChannel ||
    !selectedLocation;

  return (
    <div className="sticky-top" style={{ top: "5rem" }}>
      <Card body className="rounded-4">
        <Card.Title className="pb-3 mb-3 border-bottom">Ringkasan Pembayaran</Card.Title>

        <ListGroup variant="flush" className="mb-3">
          <ListGroup.Item className="px-0 d-flex justify-content-between">
            <span>Sewa Mobil ({rentalDuration} hari)</span>
            <span>{formatRupiah(basePrice)}</span>
          </ListGroup.Item>

          {order.with_driver && (
            <ListGroup.Item className="px-0 d-flex justify-content-between">
              <span>Biaya Supir ({rentalDuration} hari)</span>
              <span>{formatRupiah(driverPrice)}</span>
            </ListGroup.Item>
          )}

          <ListGroup.Item className="px-0 d-flex justify-content-between">
            <span>Biaya Layanan</span>
            <span>{formatRupiah(serviceFee)}</span>
          </ListGroup.Item>

          <ListGroup.Item className="px-0 d-flex justify-content-between">
            <span>Pajak (11%)</span>
            <span>{formatRupiah(taxAmount)}</span>
          </ListGroup.Item>

          {selectedPaymentChannel && paymentFee > 0 && (
            <ListGroup.Item className="px-0 d-flex justify-content-between">
              <span>Biaya {selectedPaymentChannel.name}</span>
              <span>{formatRupiah(paymentFee)}</span>
            </ListGroup.Item>
          )}

          <ListGroup.Item className="px-0 pt-3 d-flex justify-content-between border-top-0">
            <strong>Total Pembayaran</strong>
            <strong className="text-primary">{formatRupiah(totalPrice)}</strong>
          </ListGroup.Item>
        </ListGroup>

        <Button
          variant="primary"
          size="lg"
          className="w-100"
          type="submit"
          disabled={disableSubmit}
          onClick={handleSubmit}
        >
          {isLoading || processing ? "Memproses..." : "Konfirmasi Pesanan"}
        </Button>

        <div className="mt-3 text-center">
          <Link href={route('armada.show', { slug: carData.slug })} className="text-muted text-decoration-none">
            Kembali ke Detail Mobil
          </Link>
        </div>
      </Card>

      <Card className="mt-4" body>
        <Card.Title className="pb-3 mb-3 border-bottom">Informasi Penting</Card.Title>
        <p className="mb-0">Silahkan membaca dan memahami syarat dan ketentuan yang berlaku sebelum melakukan pembayaran.</p>
      </Card>
    </div>
  );
};

const FormHandler = () => {
  const { handleSubmit } = useCheckout();

  return (
    <Form onSubmit={handleSubmit}>
      <LocationSection />
      <PaymentSection />
      <TermsAndConditions />
    </Form>
  )
}

// Main checkout component
export default function CheckoutPage({ carData, order, carThumbnail, forbiddenDate = [] }: CheckoutProps) {
  const { props: { auth } } = usePage<PageProps>();
  const isIdentityUnfilled = auth.isIdentityUnfilled === true;

  const handleCancelCart = () => {
    withReactContent(Swal).fire({
      title: 'Apakah kamu yakin?',
      text: "Apakah kamu yakin akan membatalkan transaksi ini? Jika iya, maka aksi ini tidak dapat dikembalikan.",
      showCancelButton: true,
      showConfirmButton: true,
      icon: 'warning',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#0d6efd',
      confirmButtonText: 'Batalkan Pesanan',
      cancelButtonText: 'Lanjutkan Pesanan',
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        router.post(route('v1.home.checkout.cancel'));
      }
    })
  }

  return (
    <CheckoutProvider carData={carData} order={order} carThumbnail={carThumbnail}>
      <AuthenticatedUser header={<HeaderCheckout />}>
        <Head title="Checkout" />

        <Row className="py-4 g-4">
          <Col md={8} className="relative">
            {isIdentityUnfilled && (
              <Alert variant="warning" className="mb-0" style={{ position: 'sticky', top: '5rem', zIndex: 750 }}>
                <Alert.Heading>Perhatian!</Alert.Heading>
                <p className="mb-0">
                  Silahkan isi data identitas Anda terlebih dahulu melalui{" "}
                  <Link className="fw-bold" style={{ color: "#ac8711" }} href={route("profile.edit")}>
                    tautan ini
                  </Link>{" "}
                  untuk melanjutkan transaksi dan pemesanan kendaraan rental dan untuk keamanan Anda.
                </p>
              </Alert>
            )}

            <Card body className={twMerge("rounded-4", isIdentityUnfilled ? "mt-4" : "")}>
              <div className="gap-2 pb-3 mb-3 d-flex justify-content-between border-bottom align-items-center">
                <Card.Title className="mb-0">Detail Pesanan</Card.Title>
                <Button variant="danger" onClick={handleCancelCart}>Batalkan</Button>
              </div>

              <CarDetails forbiddenDate={forbiddenDate} />
              <FormHandler />
            </Card>
          </Col>

          <Col md={4}>
            <OrderSummary />
          </Col>
        </Row>
      </AuthenticatedUser>
    </CheckoutProvider>
  );
}
