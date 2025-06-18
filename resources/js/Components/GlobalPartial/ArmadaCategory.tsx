import { CarModelEnum } from "@/Helpers/enum";
import { CarModelIcon, getCarModelLabel } from "@/Helpers/EnumHelper";
import styled from "@emotion/styled";
import { Link } from "@inertiajs/react";
import { useRef } from "react";
import { Row, Col } from "react-bootstrap";
import { FaArrowRight } from "react-icons/fa6";

const Section = styled.section`
  background-color: #fff;
  padding: 3rem 0;
`;

const Title = styled.h5`
  font-size: 1.25rem;
  font-weight: 600;
`;

const CardSection = styled(Link)`
  background-color: #fff;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--bs-border-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #000;
  transition: all .2s;

  &:hover {
    background-color: rgba(var(--bs-primary-rgb), .125);
    text-decoration: none;
    border-color: var(--bs-primary);
    color: var(--bs-primary);
  }

  &:focus {
    border-color: var(--bs-primary);
    background-color: var(--bs-primary);
    color: #fff;
  }
`

export default function ArmadaCategorySection() {
  const categories = useRef(Object.values(CarModelEnum) as Array<CarModelEnum>);

  return (
    <Section>
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <h4 className="fw-bold">Kategori Armada</h4>
        <a href={route('armada.index')} className="gap-2 text-decoration-none d-flex flex-column flex-lg-row align-items-center text-dark fw-semibold">
          <span>Lihat Semua Armada</span>
          <FaArrowRight />
        </a>
      </div>

      <Row className="g-3">
        {categories.current.map((category: CarModelEnum) => (
          <Col key={category} xs={6} md={2} className="text-center">
            <CardSection href={route('armada.index', { model: category })}>
              <CarModelIcon height={48} model={category} />
              <Title>{getCarModelLabel(category)}</Title>
            </CardSection>
          </Col>
        ))}
      </Row>
    </Section>
  )
}
