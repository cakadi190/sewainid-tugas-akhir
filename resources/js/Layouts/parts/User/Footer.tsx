import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import { Col, Container, Row } from "react-bootstrap";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="px-3 mt-auto text-center text-lg-start">
      <Container className="py-4">
        <Row className="gy-3">
          <Col lg={6} className="text-muted">
            &copy; {currentYear} <Link href="/">Sewain</Link> oleh <a href="https://www.kodinus.id" className="text-decoration-none">PT Kodingin Digital Nusantara</a>. Semua hak dilindungi.
          </Col>

          <Col lg={6} className="text-lg-end">
            <div className="gap-3 mb-3 d-flex justify-content-lg-end justify-content-center">
              <a href="https://facebook.com" className="text-decoration-none text-muted" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" className="text-decoration-none text-muted" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" className="text-decoration-none text-muted" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://youtube.com" className="text-decoration-none text-muted" aria-label="Youtube">
                <Youtube size={20} />
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
