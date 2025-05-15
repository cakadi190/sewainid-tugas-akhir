import AuthenticatedUser from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import HeaderArmadaList from "./Partials/HeaderArmadaList";
import { Col, Row, Spinner, Alert } from "react-bootstrap";
import { FC, useEffect, useState, useCallback, memo } from "react";
import { extractQueryParams } from "@/Helpers/url";
import axios from "axios";
import CardArmadaLoop, { TypeOfCarData, WishlistItem } from "@/Components/LoopPartial/CardArmadaLoop";
import { FetchSuccess, PageProps } from "@/types";
import FilterSidebar, { FilterState } from "./Partials/Sidebar";
import { useDebounce } from "@/Hooks/useDebounce";
import EmptyState from "@/Components/EmptyState";

const DEFAULT_FILTERS: FilterState = {
  model: '',
  year_from: '',
  year_to: '',
  fuel_type: '',
  transmission: '',
  status: '',
  condition: '',
  price_min: 0,
  price_max: 0,
  seats: '',
  search: '',
};

const ArmadaListPage: FC = () => {
  const { props: { auth: { user } } } = usePage<PageProps>();

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [cars, setCars] = useState<TypeOfCarData[] | null>(null);
  const [wishlist, setWishlist] = useState<WishlistItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState(0);

  const fetchCarsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(route("v1.home.car-listing.all-cars", { ...filters }));
      setCars(response.data.data || []);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError("Gagal memuat data armada.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const debouncedFetchCars = useDebounce(fetchCarsData, 500);

  const fetchWishlist = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch(route('v1.home.wishlist.index', { only_id: 'true' }));
      const data: FetchSuccess<WishlistItem[]> = await response.json();
      setWishlist(data.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  }, [user]);

  const fetchParams = useCallback(() => {
    const rawParams = extractQueryParams(window.location.href);

    const normalizedParams = {
      ...DEFAULT_FILTERS,
      ...rawParams,
      price_min: rawParams.price_min ? parseInt(rawParams.price_min as string) : 0,
      price_max: rawParams.price_max ? parseInt(rawParams.price_max as string) : 0,
      year_from: rawParams.year_from ?? '',
      year_to: rawParams.year_to ?? '',
    };

    setFilters(normalizedParams);
  }, []);

  useEffect(() => {
    const count = Object.entries(filters).reduce((acc, [key, value]) => {
      return value && key !== 'search' ? acc + 1 : acc;
    }, 0);

    setActiveFilters(count);
  }, [filters]);

  useEffect(() => {
    fetchParams();
    fetchWishlist();
  }, [fetchParams, fetchWishlist]);

  useEffect(() => {
    debouncedFetchCars();
  }, [filters, debouncedFetchCars]);

  const CarList = memo(() => {
    if (loading) return (
      <div className="my-5 text-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );

    if (error) return <Alert variant="danger">{error}</Alert>;

    if (!cars || cars.length === 0) return (
      <EmptyState
        title="Armada Tidak Ditemukan"
        errorCode="404"
        link={{
          label: 'Cari Armada Lainnya Yuk!',
          href: route('armada.index')
        }}
        message="Maaf, tidak ada armada yang sesuai dengan kriteria pencarian Anda. Silakan coba filter lainnya."
      />
    );

    return (
      <div>
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <h5>Total {cars.length} Armada Ditemukan</h5>
          {activeFilters > 0 && (
            <span className="badge bg-primary">{activeFilters} Filter Aktif</span>
          )}
        </div>
        <Row className="g-3">
          {cars.map(car => (
            <CardArmadaLoop
              wishlist={wishlist || []}
              key={car.slug}
              car={car}
              colSize={4}
            />
          ))}
        </Row>
      </div>
    );
  });

  CarList.displayName = 'CarList';

  return (
    <AuthenticatedUser header={<HeaderArmadaList />}>
      <Head title="Daftar Armada Kami" />

      <Row className="py-3">
        <Col md={3} className="mb-4 mb-md-0 position-relative">
          <FilterSidebar filters={filters} setFilters={setFilters} />
        </Col>
        <Col md={9}>
          <CarList />
        </Col>
      </Row>
    </AuthenticatedUser>
  );
};

export default ArmadaListPage;
