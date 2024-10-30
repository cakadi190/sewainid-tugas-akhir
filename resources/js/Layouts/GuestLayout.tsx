import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

export default function Guest({ children }: PropsWithChildren) {
  return (
    <Container fluid className="min-vh-100 bg-light d-flex align-items-center">
      <Row className="py-4 justify-content-center w-100">
        <Col xs={12} sm={6} md={4} lg={3}>
          <div className="mb-4 text-center">
            <Link href="/">
              <ApplicationLogo height={64} />
            </Link>
          </div>

          <Card body>
            {children}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
