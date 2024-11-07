import ApplicationLogo from '@/Components/ApplicationLogo';
import styled from '@emotion/styled';
import ImageBg from '@/Assets/Images/Cover-Login.jpg';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

/**
 * Komponen ColBackground digunakan untuk mengatur gaya background untuk kolom.
 * Gaya ini termasuk mengatur gambar background, posisi, dan ukuran.
 */
const ColBackground = styled(Col)`
  background: url(${ImageBg}) no-repeat right center;
  background-size: cover;
`;

/**
 * Komponen GuestLayout digunakan untuk mengatur tata letak utama untuk tamu.
 *
 * @param {PropsWithChildren} props - Props yang diterima oleh komponen GuestLayout.
 * @param {React.ReactNode} props.children - Konten yang akan ditampilkan dalam layout.
 *
 * @returns {JSX.Element} - Komponen JSX yang merepresentasikan layout untuk tamu.
 */
export default function Guest({ children }: PropsWithChildren) {
  return (
    <Container fluid className="bg-white min-vh-100">
      <Row className="min-vh-100">
        <ColBackground xs={0} md={4} className="p-0 bg-primary d-none d-md-block" />
        <Col xs={12} md={8} className="p-0">
          <Row className="py-4 mx-0 min-vh-100">
            <Col xs={12} className="px-4 d-flex flex-column justify-content-center">
              <div className="w-100" style={{ maxWidth: '400px', margin: '0 auto' }}>
                <div className="mb-4 text-center">
                  <Link href="/">
                    <ApplicationLogo height={64} />
                  </Link>
                </div>
                {children}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
