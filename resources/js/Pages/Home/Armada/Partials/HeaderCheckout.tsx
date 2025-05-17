import { Link } from '@inertiajs/react';
import styled from '@emotion/styled';
import ImageHeader from '@/Assets/Images/Cover-Dashboard.jpg';
import { Breadcrumb, BreadcrumbItem, Col, Container, Row } from "react-bootstrap";
import { FC } from 'react';

const HeaderCheckoutStyled = styled.header`
  background-color: #000;
  background: url(${ImageHeader}) no-repeat center 50%;
  background-size: cover;
  background-blend-mode: darken;
  position: relative;
  padding-top: 7.5rem;
  padding-bottom: 5rem;
  color: white;

  &::after {
    content: '';
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
    opacity: .75;
    font-weight: normal;
    line-height: 1.5;
    margin-bottom: 1rem;

    @media (max-width: 768px) {
      font-size: 1.125rem;
    }

    @media (max-width: 576px) {
      font-size: 1rem;
    }
  }

  .breadcrumb {
    background-color: transparent;
    padding: 0;
    margin-bottom: 0;

    .breadcrumb-item,
    .breadcrumb-item::before,
    .breadcrumb-item a {
      color: rgba(var(--bs-white-rgb), .75);
    }

    .breadcrumb-item {
      color: rgba(var(--bs-white-rgb), 1);
    }
  }
`;

const HeaderCheckout: FC = () => {
  return (
    <HeaderCheckoutStyled id="masthead">
      <Container>
        <Row>
          <Col md={8}>
            <h1>Pembayaran</h1>
            <h2 className="leading">
              Lihat detail transaksi dan lanjutkan proses pembayaran Anda
            </h2>

            <Breadcrumb className="m-0" bsPrefix="m-0 breadcrumb">
              <BreadcrumbItem linkAs={Link} href={route('home')}>Beranda</BreadcrumbItem>
              <BreadcrumbItem active>Pembayaran</BreadcrumbItem>
            </Breadcrumb>
          </Col>
        </Row>
      </Container>
    </HeaderCheckoutStyled>
  );
};

export default HeaderCheckout;

