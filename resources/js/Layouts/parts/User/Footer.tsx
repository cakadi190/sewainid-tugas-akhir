import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import { Col, Container, Row } from "react-bootstrap";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="px-3 mt-auto text-center text-lg-start">
      {/* Section 1: Logo dan Info Kontak */}
      <Container className="py-4 border-bottom border-top">
        <Row className="gy-4">
          <Col lg={4} md={6}>
            <div className="gap-2 mb-3 d-flex align-items-center">
              <ApplicationLogo height={48} />
              <h1 className="mb-0 h4">Sewain</h1>
            </div>
            <p className="text-muted">
              Layanan rental mobil terpercaya dengan armada berkualitas dan harga terjangkau.
              Kami menyediakan berbagai pilihan kendaraan untuk kebutuhan perjalanan Anda.
            </p>
          </Col>

          <Col lg={4} md={6}>
            <h5 className="mb-3">Hubungi Kami</h5>
            <ul className="list-unstyled">
              <li className="mb-2 d-flex align-items-center">
                <MapPin size={18} className="me-2" />
                <span>Jl. Samben-Bringin, Samben, Karangjati, Ngawi</span>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <Phone size={18} className="me-2" />
                <span>+62 812-3456-7890</span>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <Mail size={18} className="me-2" />
                <span>info@sewainmobilku.id</span>
              </li>
              <li className="d-flex align-items-center">
                <Clock size={18} className="me-2" />
                <span>Senin - Minggu: 08.00 - 20.00 WIB</span>
              </li>
            </ul>
          </Col>

          <Col lg={4} md={12}>
            <h5 className="mb-3">Area Layanan</h5>
            <Row>
              <Col xs={6}>
                <ul className="list-unstyled">
                  <li className="mb-2">Ngawi</li>
                  <li className="mb-2">Madiun</li>
                  <li className="mb-2">Surabaya</li>
                  <li className="mb-2">Yogyakarta</li>
                </ul>
              </Col>
              <Col xs={6}>
                <ul className="list-unstyled">
                  <li className="mb-2">Jakarta</li>
                  <li className="mb-2">Surakarta</li>
                  <li className="mb-2">Malang</li>
                  <li className="mb-2">Semarang</li>
                </ul>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      {/* Section 2: Informasi Layanan */}
      <Container className="py-4 border-bottom">
        <Row className="gy-4">
          <Col lg={3} md={6}>
            <h5 className="mb-3">Layanan Kami</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link href="/rental-harian" className="text-decoration-none">Rental Harian</Link></li>
              <li className="mb-2"><Link href="/rental-mingguan" className="text-decoration-none">Rental Mingguan</Link></li>
              <li className="mb-2"><Link href="/rental-bulanan" className="text-decoration-none">Rental Bulanan</Link></li>
              <li className="mb-2"><Link href="/rental-dengan-sopir" className="text-decoration-none">Rental Dengan Sopir</Link></li>
              <li className="mb-2"><Link href="/rental-lepas-kunci" className="text-decoration-none">Rental Lepas Kunci</Link></li>
            </ul>
          </Col>

          <Col lg={3} md={6}>
            <h5 className="mb-3">Kategori Mobil</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link href="/kategori/city-car" className="text-decoration-none">City Car</Link></li>
              <li className="mb-2"><Link href="/kategori/mpv" className="text-decoration-none">MPV / Family Car</Link></li>
              <li className="mb-2"><Link href="/kategori/suv" className="text-decoration-none">SUV</Link></li>
              <li className="mb-2"><Link href="/kategori/luxury" className="text-decoration-none">Luxury Car</Link></li>
              <li className="mb-2"><Link href="/kategori/bus-minibus" className="text-decoration-none">Bus & Minibus</Link></li>
            </ul>
          </Col>

          <Col lg={3} md={6}>
            <h5 className="mb-3">Informasi</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link href="/tentang-kami" className="text-decoration-none">Tentang Kami</Link></li>
              <li className="mb-2"><Link href="/syarat-ketentuan" className="text-decoration-none">Syarat & Ketentuan</Link></li>
              <li className="mb-2"><Link href="/kebijakan-privasi" className="text-decoration-none">Kebijakan Privasi</Link></li>
              <li className="mb-2"><Link href="/cara-booking" className="text-decoration-none">Cara Booking</Link></li>
              <li className="mb-2"><Link href="/faq" className="text-decoration-none">FAQ</Link></li>
            </ul>
          </Col>

          <Col lg={3} md={6}>
            <h5 className="mb-3">Pembayaran</h5>
            <p className="mb-3">Kami menerima berbagai metode pembayaran:</p>
            <div className="flex-wrap gap-2 d-flex">
              <div className="px-2 py-1 rounded bg-light">BCA</div>
              <div className="px-2 py-1 rounded bg-light">Mandiri</div>
              <div className="px-2 py-1 rounded bg-light">BNI</div>
              <div className="px-2 py-1 rounded bg-light">BRI</div>
              <div className="px-2 py-1 rounded bg-light">DANA</div>
              <div className="px-2 py-1 rounded bg-light">GoPay</div>
              <div className="px-2 py-1 rounded bg-light">OVO</div>
              <div className="px-2 py-1 rounded bg-light">QRIS</div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Section 3: Copyright dan Social Media */}
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
