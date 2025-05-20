import { Link } from '@inertiajs/react';
import styled from '@emotion/styled';
import { Breadcrumb, Col, Container, Row } from "react-bootstrap";

interface BreadcrumbItem {
  label: string;
  url?: string;
}

interface GlobalHeaderProps {
  title: string;
  description?: string;
  backgroundImage: string;
  breadcrumbItems?: BreadcrumbItem[];
  overlay?: number; // Opacity value between 0-1
  children?: React.ReactNode;
  className?: string;
}

const StyledHeader = styled.header<{ backgroundImage: string; overlay: number }>`
  background-color: #000;
  background: url(${props => props.backgroundImage}) no-repeat center 50%;
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
    background: rgba(0, 0, 0, ${props => props.overlay});
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

  .description {
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

const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  title,
  description,
  backgroundImage,
  breadcrumbItems = [],
  overlay = 0.75,
  children,
  className = '',
}) => {
  return (
    <StyledHeader
      id="masthead"
      backgroundImage={backgroundImage}
      overlay={overlay}
      className={className}
    >
      <Container>
        <Row>
          <Col md={8}>
            <h1>{title}</h1>
            {description && (
              <p className="description">
                {description}
              </p>
            )}

            {breadcrumbItems.length > 0 && (
              <Breadcrumb>
                {breadcrumbItems.map((item, index) => (
                  item.url ? (
                    <li key={index} className="breadcrumb-item">
                      <Link href={item.url}>{item.label}</Link>
                    </li>
                  ) : (
                    <Breadcrumb.Item key={index} active>{item.label}</Breadcrumb.Item>
                  )
                ))}
              </Breadcrumb>
            )}
          </Col>
          <Col md={4}>
            {children}
          </Col>
        </Row>
      </Container>
    </StyledHeader>
  );
};

export default GlobalHeader;
