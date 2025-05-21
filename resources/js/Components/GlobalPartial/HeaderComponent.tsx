import { Link, usePage } from '@inertiajs/react';
import styled from '@emotion/styled';
import { Breadcrumb, Col, Container, Row } from "react-bootstrap";
import { FaCalendar, FaHeart, FaHome, FaUser, FaWallet } from 'react-icons/fa';

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

interface StyledMenuItemProps {
  active: boolean;
}

const StyledMenuItem = styled(Link) <StyledMenuItemProps>`
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  flex-direction: column;
  border: 1px solid ${props => props.active ? 'var(--bs-white)' : 'var(--bs-border-color)'};
  border-radius: .5rem;
  background: ${props => props.active ? 'var(--bs-primary)' : 'var(--bs-light)'};
  transition: all .2s;
  height: 100%;
  width: 100%;
  text-align: center;
  align-content: center;
  justify-content: center;
  text-decoration: none;
  color: ${props => props.active ? 'var(--bs-white)' : 'var(--bs-body-color)'};

  svg {
    margin-bottom: 0.5rem;
    color: ${props => props.active ? 'var(--bs-white)' : 'inherit'};
  }

  &:hover {
    background: var(--bs-white);
    border-color: var(--bs-primary);
    color: var(--bs-primary);

    svg {
      color: var(--bs-primary);
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
  // Get current route from Inertia
  const { url } = usePage();

  // Function to check if a route is active
  const isActive = (path: string): boolean => {
    return url.startsWith(path);
  };

  return (
    <>
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

      <div className="py-4 bg-white border-bottom d-none d-lg-flex d-md-none">
        <Container>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            gap: '1rem',
          }}>
            <StyledMenuItem
              href={route('dashboard')}
              active={isActive('/dashboard') && !isActive('/dashboard/transaction')}
            >
              <FaHome size={24} />
              <span>Dasbor</span>
            </StyledMenuItem>
            <StyledMenuItem
              href={route('dashboard.transaction.index')}
              active={isActive('/dashboard/transaction')}
            >
              <FaWallet size={24} />
              <span>Transaksi</span>
            </StyledMenuItem>
            <StyledMenuItem
              href={route('wishlist')}
              active={isActive('/wishlist')}
            >
              <FaHeart size={24} />
              <span>Wishlist</span>
            </StyledMenuItem>
            {/* <StyledMenuItem
              href={route('booking')}
              active={isActive('/booking')}
            >
              <FaCalendar size={24} />
              <span>Pemesanan</span>
            </StyledMenuItem> */}
            <StyledMenuItem
              href={route('profile.edit')}
              active={isActive('/profile')}
            >
              <FaUser size={24} />
              <span>Profil</span>
            </StyledMenuItem>
          </div>
        </Container>
      </div>
    </>
  );
};

export default GlobalHeader;
