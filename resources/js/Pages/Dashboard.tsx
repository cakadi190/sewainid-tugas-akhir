import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

export default function Dashboard() {
  return (
    <AuthenticatedLayout
      // header={
      //   <h2 className="mb-0 h4 text-dark">Dashboard</h2> // Use Bootstrap text classes
      // }
    >
      <Head title="Dashboard" />

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Card className="shadow-sm">
              <Card.Body className="text-dark">
                <p>You're logged in!</p>

                <Link method="post" href={route('logout')} as="button" type="button" className="btn btn-primary">Keluar</Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </AuthenticatedLayout>
  );
}
