import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import GlobalHeader from '@/Components/GlobalPartial/HeaderComponent';
import DashboardImage from '@/Assets/Images/Cover-Dashboard.jpg';

export default function Dashboard() {
  return (
    <AuthenticatedLayout
      header={
        <GlobalHeader
          title="Beranda Dasbor"
          description="Selamat datang di dasbor! Disinilah Anda dapat melihat informasi tentang permintaan, riwayat, dan melihat tagihan sewa mobil Anda."
          backgroundImage={DashboardImage}
          breadcrumbItems={[
            { label: 'Beranda', url: route('home') },
            { label: 'Beranda Dasbor' },
          ]}
        />
      }
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
