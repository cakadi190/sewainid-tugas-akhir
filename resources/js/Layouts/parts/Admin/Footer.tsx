import { Link } from "@inertiajs/react";
import { Col, Container, Row } from "react-bootstrap";

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto text-center text-lg-start">
      <Container fluid className="py-3">
        <Row>
          <Col lg={6} className="text-muted">
            &copy; {new Date().getFullYear()} <Link href="/">Sewain.id</Link> oleh <a href="https://www.kodinus.id">PT Kodingin Digital Nusantara</a>. Semua hak dilindungi.
          </Col>
          <Col lg={6} className="text-lg-end">
            <a href="#home" className="text-decoration-none me-3">Beranda</a>
            <a href="#about" className="text-decoration-none me-3">Tentang</a>
            <a href="#services" className="text-decoration-none me-3">Layanan</a>
            <a href="#contact" className="text-decoration-none">Kontak</a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
