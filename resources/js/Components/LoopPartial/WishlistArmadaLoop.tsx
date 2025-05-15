import { FC, ReactNode } from "react";
import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import { Link, router } from "@inertiajs/react";
import { wrapOptimizeUrl } from "@/Helpers/url";
import Flexbox from "@/Components/Flexbox";
import { getCarFuelTypeLabel, getCarModelColor, getCarModelLabel, getCarTransmissionLabel } from "@/Helpers/EnumHelper";
import { compactCurrencyFormat } from "@/Helpers/number";
import styled from "@emotion/styled";
import { TypeOfCarData } from "@/Components/LoopPartial/CardArmadaLoop";
import RatingReview from "@/Components/StarRating";
import { GiGearStickPattern } from "react-icons/gi";
import { BsFuelPump } from "react-icons/bs";
import { PiSeat, PiSpeedometer } from "react-icons/pi";
import { FaCarRear } from "react-icons/fa6";
import { BiTag } from "react-icons/bi";
import { speedFormat } from "@/Helpers/number";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

export type IntrinsicTypeData = (TypeOfCarData & { rent_price: number; average_rating: number; total_reviews: number; car_data_id: number; id: number; onDelete?: () => void; });

interface CarRatingProps {
  rating?: number;
  totalReviews?: number;
}

interface CarSpecificationItemProps {
  icon: ReactNode;
  label: string | number;
}

interface CarSpecificationsProps {
  wishlist: TypeOfCarData;
}

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
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

export const CarRating: FC<CarRatingProps> = ({ rating, totalReviews }) => {
  return rating ? (
    <div className="gap-1 d-flex align-items-center">
      <RatingReview isReadonly withLabel rating={rating} />
      <span>{totalReviews} penilaian</span>
    </div>
  ) : <span>Belum Ada Penilaian</span>;
};

const CarListDetailGroup = styled.ul`
  padding: .5rem 1rem;
  border-radius: var(--bs-border-radius);
  background: var(--bs-light);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: .5rem;

  li {
    display: flex;
    gap: .325rem;
    align-items: center;
  }
`;

export const CarSpecificationItem: FC<CarSpecificationItemProps> = ({ icon, label }) => {
  return (
    <li>
      {icon}
      <span>{label}</span>
    </li>
  );
};

export const CarSpecifications: FC<CarSpecificationsProps> = ({ wishlist }) => {
  return (
    <CarListDetailGroup>
      <CarSpecificationItem
        icon={<GiGearStickPattern />}
        label={getCarTransmissionLabel(wishlist.transmission)}
      />
      <CarSpecificationItem
        icon={<BsFuelPump />}
        label={getCarFuelTypeLabel(wishlist.fuel_type)}
      />
      <CarSpecificationItem
        icon={<PiSeat />}
        label={`${wishlist.seats} orang`}
      />
      <CarSpecificationItem
        icon={<FaCarRear />}
        label={wishlist.year_of_manufacture}
      />
      <CarSpecificationItem
        icon={<BiTag />}
        label={getCarModelLabel(wishlist.model)}
      />
      <CarSpecificationItem
        icon={<PiSpeedometer />}
        label={speedFormat(wishlist.max_speed)}
      />
    </CarListDetailGroup>
  );
};

const WishlistCard: FC<IntrinsicTypeData> = (wishlist) => {
  const getPreviewImage = wishlist.preview_image ? wrapOptimizeUrl(Array.isArray(wishlist.preview_image) ? wishlist.preview_image[0] : wishlist.preview_image) : '';

  const deleteWishlist = () => {
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
      cancelButtonColor: '#b3b3b3'
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        router.delete(route('v1.home.wishlist.destroy', { wishlist: wishlist.id }), {
          preserveScroll: true,
          onSuccess: () => {
            wishlist?.onDelete?.();
          },
          onError: (error: any) => {
            console.log({ error });
          }
        });
      }
    })
  }

  return (
    <Card key={wishlist.id} body>
      <Row className="gy-3">
        <Col md={2}>
          <ImageContainer>
            <CardImage src={getPreviewImage} alt="Car Image" />
          </ImageContainer>
        </Col>
        <Col md={10}>
          <Flexbox justify="space-between" direction="column" directionLg="row" className="mb-3 mb-lg-0">
            <Card.Title as="h3" className="fw-bold">{wishlist.brand} {wishlist.car_name}</Card.Title>
            <div className="gap-2 d-flex align-items-center">
              <CarRating rating={wishlist.average_rating} totalReviews={wishlist.total_reviews} />
              <Badge bg={getCarModelColor(wishlist.model)}>{getCarModelLabel(wishlist.model)}</Badge>
            </div>
          </Flexbox>

          <CarSpecifications wishlist={wishlist} />

          <Flexbox justify="space-between" directionLg="row" className="mt-3" gap={12} direction="column" align="center">
            <Card.Title as="h4" className="mb-0 fw-bold">{compactCurrencyFormat(wishlist.rent_price)} / Hari</Card.Title>
            <div className="gap-2 w-100 d-flex flex-column-reverse d-lg-none">
              <Button onClick={deleteWishlist} className="w-100" style={{ zIndex: 20, position: 'relative' }} variant="danger">Hapus</Button>
              <Link className="w-100 btn btn-primary stretched-link" href={route('armada.show', wishlist.slug)}>Pesan Armada Ini</Link>
            </div>
            <div className="gap-2 d-none d-md-none d-lg-flex">
              <Button onClick={deleteWishlist} variant="danger" style={{ zIndex: 20, position: 'relative' }}>Hapus</Button>
              <Link className="btn btn-primary stretched-link" href={route('armada.show', wishlist.slug)}>Pesan Armada Ini</Link>
            </div>
          </Flexbox>
        </Col>
      </Row>
    </Card>
  );
};

export default WishlistCard;

