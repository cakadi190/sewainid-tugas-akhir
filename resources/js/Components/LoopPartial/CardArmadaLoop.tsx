import { FC, ReactNode, useMemo } from "react";
import { Card, Col } from "react-bootstrap";
import styled from "@emotion/styled";
import { FaHeart } from "react-icons/fa6";
import { FaTachometerAlt } from "react-icons/fa";
import { Link, router } from "@inertiajs/react";
import { mileageFormat, speedFormat } from "@/Helpers/number";
import RatingReview from "@/Components/StarRating";
import { getCarFuelTypeLabel, getCarModelLabel, getCarTransmissionLabel } from "@/Helpers/EnumHelper";
import { GiGearStickPattern } from "react-icons/gi";
import { BsFuelPump } from "react-icons/bs";
import { PiSeat, PiSpeedometer } from "react-icons/pi";
import { FaCarRear } from "react-icons/fa6";
import { BiTag } from "react-icons/bi";
import { wrapOptimizeUrl } from "@/Helpers/url";
import { CarModelEnum, CarTransmissionEnum, FuelEnum } from "@/Helpers/enum";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const CardMetaData = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  margin-top: .325rem;
  font-size: .875rem;
  border-bottom: 1px solid rgba(0, 0, 0, .125);
  padding-bottom: .75rem;
`;

const CarListDetailGroup = styled.ul`
  padding-bottom: .75rem;
  list-style: none;
  padding: 0;
  display: grid;
  font-size: .875rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-gap: 1rem;

  li {
    display: flex;
    gap: .325rem;
    align-items: center;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  overflow: hidden;
  border-radius: 0.5rem;
`;

const CardImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  z-index: 10;
`;

const FavouriteLink = styled.button<{ wishlisted?: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  background-color: ${({ wishlisted }) => (wishlisted ? 'var(--bs-primary)' : 'var(--bs-white)')};
  color: ${({ wishlisted }) => (wishlisted ? 'var(--bs-white)' : 'var(--bs-primary)')};
  border: none;
  border-radius: 0 0 0 var(--bs-border-radius-xl);
  width: 40px;
  height: 40px;
  display: flex;
  font-size: .925rem;
  align-items: center;
  justify-content: center;
  padding: 0;
  z-index: 20;
  transition: all .125s;
  cursor: pointer;

  &:hover {
    background-color: var(--bs-primary);
    color: var(--bs-white);
  }
`;

export type TypeOfCarData = {
  id: number;
  slug: string;
  car_name: string;
  brand: string;
  mileage: number;
  fuel_type: FuelEnum;
  year_of_manufacture: number;
  transmission: CarTransmissionEnum;
  model: CarModelEnum;
  seats: number;
  max_speed: number;
  preview_image?: string[] | string;
  average_rating?: number;
  total_reviews?: number;
};

export interface WishlistItem {
  id: number;
  car_data_id: number;
}

interface CarRatingProps {
  rating?: number;
  totalReviews?: number;
}

interface CarMileageProps {
  mileage?: number;
}

interface CarSpecificationItemProps {
  icon: ReactNode;
  label: string | number;
}

interface CarSpecificationsProps {
  car: TypeOfCarData;
}

interface CarCardImageProps {
  car: TypeOfCarData;
  wishlist: { status: boolean; id: number | null };
}

interface CarCardProps {
  car: TypeOfCarData;
  wishlist?: WishlistItem[];
  colSize?: number;
}

const CarRating: FC<CarRatingProps> = ({ rating, totalReviews }) => {
  return rating ? (
    <div className="gap-1 d-flex align-items-center">
      <RatingReview isReadonly withLabel rating={rating} />
      <span>{totalReviews} penilaian</span>
    </div>
  ) : <span>Belum Ada Penilaian</span>;
};

const CarMileage: FC<CarMileageProps> = ({ mileage }) => {
  return (
    <div className="gap-1 d-flex align-items-center">
      <FaTachometerAlt />
      <span>{mileageFormat(mileage || 0)}</span>
    </div>
  );
};

const CarSpecificationItem: FC<CarSpecificationItemProps> = ({ icon, label }) => {
  return (
    <li>
      {icon}
      <span className="text-truncate">{label}</span>
    </li>
  );
};

const CarSpecifications: FC<CarSpecificationsProps> = ({ car }) => {
  return (
    <CarListDetailGroup>
      <CarSpecificationItem
        icon={<GiGearStickPattern />}
        label={getCarTransmissionLabel(car.transmission)}
      />
      <CarSpecificationItem
        icon={<BsFuelPump />}
        label={getCarFuelTypeLabel(car.fuel_type)}
      />
      <CarSpecificationItem
        icon={<PiSeat />}
        label={`${car.seats} orang`}
      />
      <CarSpecificationItem
        icon={<FaCarRear />}
        label={car.year_of_manufacture}
      />
      <CarSpecificationItem
        icon={<BiTag />}
        label={getCarModelLabel(car.model)}
      />
      <CarSpecificationItem
        icon={<PiSpeedometer />}
        label={speedFormat(car.max_speed)}
      />
    </CarListDetailGroup>
  );
};

const CarCardImage: FC<CarCardImageProps> = ({ car, wishlist }) => {
  const onClickFavourite = () => {
    if (wishlist.status) {
      withReactContent(Swal).fire({
        title: 'Apakah Kamu Yakin?',
        text: "Apakah kamu yakin akan menghapus kendaraan ini dari daftar mobil favorit anda? Jika iya, maka aksi ini tidak dapat dikembalikan.",
        showCancelButton: true,
        showConfirmButton: true,
        reverseButtons: true,
        icon: 'warning',
        confirmButtonText: 'Hapus',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#d33',
        cancelButtonColor: "#838383",
      }).then(({ isConfirmed }) => {
        if (isConfirmed) {
          router.delete(route('v1.home.wishlist.destroy', { wishlist: wishlist.id }), {
            preserveScroll: true,
            onError: (error: any) => {
              console.log({ error });
            }
          });
        }
      })
    } else {
      router.post(route('v1.home.wishlist.index'), { car_id: car.id }, {
        preserveScroll: true,
        onError: (error: any) => {
          console.log({ error });
        }
      });
    }
  }

  const getPreviewImage = car.preview_image ? wrapOptimizeUrl(Array.isArray(car.preview_image) ? car.preview_image[0] : car.preview_image) : '';

  return (
    <ImageContainer>
      <FavouriteLink wishlisted={wishlist.status} onClick={onClickFavourite}>
        <FaHeart />
      </FavouriteLink>
      <CardImage
        src={car.preview_image ? getPreviewImage : ''}
        alt={car.car_name}
      />
    </ImageContainer>
  );
};

const CardArmadaLoop: FC<CarCardProps> = ({ car, wishlist = [], colSize = 4 }) => {
  const isWishlisted = wishlist?.some(item => item.car_data_id === car.id);
  const idWishlist = wishlist?.find(item => item.car_data_id === car.id);
  const wishlistState = useMemo<{ status: boolean; id: number | null }>(
    () => ({ status: isWishlisted ?? false, id: idWishlist?.id ?? null }),
    [isWishlisted, idWishlist]
  );

  return (
    <Col md={colSize}>
      <Card body className="rounded-4">
        <CarCardImage wishlist={wishlistState} car={car} />
        <Card.Title className="mt-3 mb-0 text-truncate fw-bold">
          {car.brand} {car.car_name}
        </Card.Title>

        <CardMetaData>
          <CarRating rating={car.average_rating} totalReviews={car.total_reviews} />
          <CarMileage mileage={car.mileage} />
        </CardMetaData>

        <CarSpecifications car={car} />

        <Link href={route('armada.show', car.slug)} className="w-100 btn stretched-link btn-primary btn-lg">
          Pilih Armada Ini
        </Link>
      </Card>
    </Col>
  );
};

export default CardArmadaLoop;
