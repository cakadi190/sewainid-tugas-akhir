import ApplicationLogo from '@/Components/ApplicationLogo';
import styled from '@emotion/styled';
import ImageBg from '@/Assets/Images/Cover-Login.jpg';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const ColBackground = styled(Col)`
  background: url(${ImageBg}) no-repeat right center;
  background-size: cover;
`;

export default function Guest({ children }: PropsWithChildren) {
  return (
    <Container fluid className="bg-white min-vh-100">
      <Row className="min-vh-100">
        {/* Left blue sidebar - hidden on mobile */}
        <ColBackground xs={0} md={4} className="p-0 bg-primary d-none d-md-block" />

        {/* Main content area */}
        <Col xs={12} md={8} className="p-0">
          <Row className="py-4 mx-0 min-vh-100">
            <Col xs={12} className="px-4 d-flex flex-column justify-content-center">
              <div className="w-100" style={{ maxWidth: '400px', margin: '0 auto' }}>
                {/* Logo */}
                <div className="mb-4 text-center">
                  <Link href="/">
                    <ApplicationLogo height={64} />
                  </Link>
                </div>

                {/* Content */}
                {children}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
