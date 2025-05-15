import { FC, useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import styled from "@emotion/styled";
import { FaArrowRight } from "react-icons/fa";
import { usePage } from "@inertiajs/react";
import CardArmadaLoop, { TypeOfCarData, WishlistItem } from "@/Components/LoopPartial/CardArmadaLoop";
import { FetchSuccess, PageProps } from "@/types";

const Section = styled.section`
  background-color: #fff;
  padding: 3rem 0;
`;

interface SectionHeaderProps {
  title?: string;
  showMoreUrl?: string;
  showMoreText?: string;
}

interface ErrorStateProps {
  error: string | null;
}

interface CarListProps {
  cars: TypeOfCarData[] | null;
  loading: boolean;
  error: string | null;
  wishlist?: WishlistItem[];
  colSize?: number;
}

interface UsePopularCarsReturn {
  popularCars: TypeOfCarData[] | null;
  error: string | null;
  loading: boolean;
  favourites: WishlistItem[] | null;
}

// Component Functions
const SectionHeader: FC<SectionHeaderProps> = ({
  title = "Armada Populer",
  showMoreUrl = route('armada.index'),
  showMoreText = "Lihat Semua Armada"
}) => {
  return (
    <div className="mb-4 d-flex justify-content-between align-items-center">
      <h4 className="fw-bold">{title}</h4>
      <a href={showMoreUrl} className="gap-2 text-decoration-none d-flex flex-column flex-lg-row align-items-center text-dark fw-semibold">
        <span>{showMoreText}</span>
        <FaArrowRight />
      </a>
    </div>
  );
};

const LoadingState: FC = () => <div>Loading...</div>;

const ErrorState: FC<ErrorStateProps> = ({ error }) => <div>Error: {error}</div>;

const CarList: FC<CarListProps> = ({ cars, loading, wishlist, error, colSize }) => {
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <Row className="g-3">
      {cars && cars.map(car => (
        <CardArmadaLoop
          wishlist={wishlist}
          key={car.slug}
          car={car}
          colSize={colSize}
        />
      ))}
    </Row>
  );
};

const usePopularCars = (): UsePopularCarsReturn => {
  const [popularCars, setPopularCars] = useState<TypeOfCarData[] | null>(null);
  const [favourites, setFavourites] = useState<WishlistItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { props: { auth: { user } } } = usePage<PageProps>();

  useEffect(() => {
    const fetchPopularCars = async () => {
      try {
        const response = await fetch(route('v1.home.car-listing.popular-cars'));
        const data: FetchSuccess<TypeOfCarData[]> = await response.json();
        setPopularCars(data.data);
      } catch (error) {
        console.error('Error fetching popular cars:', error);
        setError('Terjadi kesalahan saat mengambil data armada populer');
      } finally {
        setLoading(false);
      }
    }

    const fetchFavourites = async () => {
      try {
        const response = await fetch(route('v1.home.wishlist.index', { only_id: 'true' }));
        const data: FetchSuccess<WishlistItem[]> = await response.json();
        setFavourites(data.data);
      } catch (error) {
        console.error('Error fetching favourites:', error);
        setError('Terjadi kesalahan saat mengambil data favorit');
      } finally {
        setLoading(false);
      }
    }

    fetchPopularCars();

    if (user) {
      fetchFavourites();
    } else {
      setLoading(false);
    }
  }, [user]);

  return { popularCars, error, loading, favourites };
};

const ArmadaList: FC<{
  title?: string;
  showMoreUrl?: string;
  showMoreText?: string;
  customCars?: TypeOfCarData[];
  customWishlist?: WishlistItem[];
  colSize?: number;
}> = ({
  title,
  showMoreUrl,
  showMoreText,
  customCars,
  customWishlist,
  colSize = 4
}) => {
    const { popularCars, error, loading, favourites } = usePopularCars();

    const cars = customCars || popularCars;
    const wishlist = customWishlist || favourites || [];

    return (
      <Section>
        <SectionHeader
          title={title}
          showMoreUrl={showMoreUrl}
          showMoreText={showMoreText}
        />
        <CarList
          cars={cars}
          wishlist={wishlist}
          loading={loading}
          error={error}
          colSize={colSize}
        />
      </Section>
    );
  };

export default ArmadaList;
