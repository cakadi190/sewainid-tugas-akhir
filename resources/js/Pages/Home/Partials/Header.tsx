import ImageHeader from "@/Assets/Images/Cover-Home.jpg";
import Flexbox from "@/Components/Flexbox";
import { CarModelEnum } from "@/Helpers/enum";
import { getCarModelLabel } from "@/Helpers/EnumHelper";
import styled from "@emotion/styled";
import { Link, router } from "@inertiajs/react";
import { Indonesian } from "flatpickr/dist/l10n/id";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
} from "react-bootstrap";
import Flatpickr from "react-flatpickr";
import { FaThumbsUp } from "react-icons/fa";
import { FaCar } from "react-icons/fa6";

const formatDate = (date: Date) => date.toISOString().split("T")[0];

const HeaderHomeStyled = styled.header`
  background-color: #000;
  background: url(${ImageHeader}) no-repeat center 65%;
  background-size: cover;
  background-blend-mode: darken;
  position: relative;
  padding-top: 7.5rem;
  padding-bottom: 0;
  color: white;

  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 10;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.75);
  }

  .container {
    position: relative;
    z-index: 20;
  }

  h1 {
    font-size: 2.5rem;
    font-weight: bold;

    @media (max-width: 768px) {
      font-size: 2rem;
    }

    @media (max-width: 576px) {
      font-size: 1.75rem;
    }
  }

  h2.leading {
    font-size: 1.25rem;
    opacity: 0.75;
    font-weight: normal;
    line-height: 1.5;

    @media (max-width: 768px) {
      font-size: 1.125rem;
    }

    @media (max-width: 576px) {
      font-size: 1rem;
    }
  }
`;

const HeadingBadge = styled.div`
  border-radius: 5rem;
  padding: 0.5rem 1rem;
  background: var(--bs-white);
  color: var(--bs-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-inline-start: 0.5rem;
  padding-inline-end: 1.25rem;
  width: fit-content;

  .icon {
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: var(--bs-primary);
    color: var(--bs-white);
  }
`;

const HeaderHome = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const [vehicleCategory, setVehicleCategory] = useState("");
  const [pickupDate, setPickupDate] = useState(formatDate(today));
  const [returnDate, setReturnDate] = useState(formatDate(tomorrow));

  useEffect(() => {
    const pickup = new Date(pickupDate);
    const currentReturn = new Date(returnDate);

    if (pickup >= currentReturn) {
      const newReturn = new Date(pickup);
      newReturn.setDate(pickup.getDate() + 1);
      setReturnDate(formatDate(newReturn));
    }
  }, [pickupDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(route("armada.index"), {
      model: vehicleCategory,
      pickupDate,
      returnDate,
    });
  };

  return (
    <HeaderHomeStyled id="masthead">
      <Container>
        <Row>
          <Col md={8}>
            <HeadingBadge>
              <span className="flex-shrink-0 icon">
                <FaThumbsUp />
              </span>
              <span>Rental Mobil Terpercaya di Kabupaten Ngawi.</span>
            </HeadingBadge>

            <h1>Rental Mobil Terbaik untuk Perjalanan Anda</h1>
            <h2 className="leading">
              Temukan berbagai kualitas mobil sewa dengan harga terjangkau untuk
              kebutuhan perjalanan Anda.
            </h2>
          </Col>
          <Col md={12} className="pt-4 mb-n5">
            <Card body className="shadow form-card">
              <Flexbox justify="space-between" align="center">
                <div>
                  <h3 className="mb-0 fw-bold h5">Cari Armada</h3>
                  <p className="mb-0">
                    Temukan Armada yang sesuai dengan kebutuhan Anda
                  </p>
                </div>

                <Link href={"/armada"}>Cari Armada Lainnya</Link>
              </Flexbox>

              <Form onSubmit={handleSubmit} className="mt-3">
                <Row className="g-3">
                  <Col md={4}>
                    <FloatingLabel label="Kategori Mobil">
                      <Form.Select
                        value={vehicleCategory}
                        onChange={(e) => setVehicleCategory(e.target.value)}
                        required
                      >
                        <option value="" disabled selected>
                          Pilih Kategori Mobil
                        </option>
                        {Object.values(CarModelEnum).map((model) => (
                          <option key={model} value={model}>
                            {getCarModelLabel(model)}
                          </option>
                        ))}
                      </Form.Select>
                    </FloatingLabel>
                  </Col>

                  <Col md={3}>
                    <FloatingLabel label="Tanggal Ambil">
                      <Flatpickr
                        className="form-control"
                        options={{
                          locale: Indonesian,
                          dateFormat: "Y-m-d",
                          minDate: "today",
                        }}
                        value={pickupDate}
                        onChange={([date]) => setPickupDate(formatDate(date))}
                      />
                    </FloatingLabel>
                  </Col>

                  <Col md={3}>
                    <FloatingLabel label="Tanggal Kembali">
                      <Flatpickr
                        className="form-control"
                        options={{
                          locale: Indonesian,
                          dateFormat: "Y-m-d",
                          minDate: pickupDate,
                        }}
                        value={returnDate}
                        onChange={([date]) => setReturnDate(formatDate(date))}
                      />
                    </FloatingLabel>
                  </Col>

                  <Col md={2} className="d-grid">
                    <Button variant="primary" type="submit">
                      <Flexbox gap={8} justify="center" align="center">
                        <span>Cari Armada</span>
                        <FaCar />
                      </Flexbox>
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </HeaderHomeStyled>
  );
};

export default HeaderHome;
