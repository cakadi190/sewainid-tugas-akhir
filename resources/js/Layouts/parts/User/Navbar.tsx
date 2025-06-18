import { useState, useEffect, FC } from "react";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link, router, usePage } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { FaHeart, FaBell } from "react-icons/fa6";
import { PageProps } from "@/types";
import styled from "@emotion/styled";
import Database from "@/types/database";
import { RoleUser } from "@/Helpers/enum";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

interface ScrolledProps {
  scrolled: boolean;
}

interface UserDropdownProps extends ScrolledProps {
  user: Database["User"];
}

interface NotificationType {
  id: number;
  message: string;
  time: string;
}

interface NavItem {
  label: string;
  href: string;
}

const NavItemNotification = styled(NavDropdown.Item)`
  display: flex;
  align-items: center;

  small {
    opacity: .5;
  }
`;

const NavHeaderNotification = styled.div`
  padding: .5rem 1rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--bs-dropdown-divider-bg);
`;

const NavbarLogout = styled.button`
  --bs-dropdown-link-color: var(--bs-danger);
  --bs-dropdown-link-hover-color: var(--bs-white);
  --bs-dropdown-link-hover-bg: var(--bs-danger);
  --bs-dropdown-link-focus-color: var(--bs-danger);
  --bs-dropdown-link-focus-bg: var(--bs-light);
  --bs-dropdown-link-active-color: var(--bs-danger);
  --bs-dropdown-link-active-bg: var(--bs-light);
`;

const MainNavItems: FC<ScrolledProps> = ({ scrolled }) => {
  const { url } = usePage();
  const textClass = scrolled ? "" : "text-light";

  const navItems: NavItem[] = [
    { label: "Beranda", href: "/" },
    { label: "Armada", href: "/armada" },
    { label: "Jenis Kendaraan", href: "/categories" },
    { label: "Tentang Kami", href: "/about-us" },
    { label: "Testimoni", href: "/about-us#testimonials" },
  ];

  return (
    <Nav className="me-auto">
      {navItems.map((item, index) => {
        const isActive = url.startsWith(item.href) &&
          (item.href !== "/" || url === "/");

        return (
          <Link
            key={index}
            className={`nav-link fw-medium ${textClass} ${isActive ? 'active fw-bold' : ''}`}
            href={item.href}
          >
            {item.label}
          </Link>
        );
      })}
    </Nav>
  );
};

const NotificationDropdown: FC<ScrolledProps> = ({ scrolled }) => {
  const textClass = scrolled ? "" : "text-light";
  const notifications: NotificationType[] = [
    { id: 1, message: "Pembayaran Anda telah dikonfirmasi", time: "5 menit yang lalu" },
    { id: 2, message: "Kendaraan siap diambil", time: "1 jam yang lalu" },
    { id: 3, message: "Promo akhir pekan tersedia!", time: "3 jam yang lalu" }
  ];

  return (
    <NavDropdown
      title={<FaBell className={textClass} />}
      id="notification-dropdown"
      align="end"
      className="me-2"
    >
      <NavHeaderNotification className="notification-header">
        <span className="fw-bold">Notifikasi</span>
      </NavHeaderNotification>
      {notifications.length > 0 ? (
        <>
          {notifications.map(notification => (
            <NavItemNotification key={notification.id} className="notification-item">
              <div className="d-flex flex-column">
                <span>{notification.message}</span>
                <small>{notification.time}</small>
              </div>
            </NavItemNotification>
          ))}
          <NavDropdown.Divider />
          <NavDropdown.Item className="text-center">
            <small>Lihat semua notifikasi</small>
          </NavDropdown.Item>
        </>
      ) : (
        <NavDropdown.Item>Tidak ada notifikasi baru</NavDropdown.Item>
      )}
    </NavDropdown>
  );
};

const UserDropdown: FC<UserDropdownProps> = ({ user, scrolled }) => {
  const { url } = usePage();

  const userItems: NavItem[] = [
    { label: "Dasbor", href: user.role === RoleUser.ADMIN ? "/administrator" : "/dashboard" },
    { label: "Pesanan", href: route('checkout') },
    { label: "Keinginan", href: route('wishlist') },
    { label: "Riwayat Sewa", href: route('dashboard.transaction.index') },
    { label: "Profil", href: "/profile" },
  ];

  const confirmLogout = () => {
    withReactContent(Swal).fire({
      title: "Keluar",
      text: "Anda yakin ingin keluar? Pastikan Anda telah menyimpan semua perubahan yang anda lakukan saat ini.",
      icon: "warning",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#838383",
      confirmButtonText: "Keluar",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.value) {
        router.post(route('logout'));
      }
    })
  };

  return (
    <NavDropdown
      title={
        <div className="d-inline-flex align-items-center">
          <div className="bg-primary rounded-circle d-flex justify-content-center align-items-center me-2"
            style={{ width: "32px", height: "32px" }}>
            <span className="text-white">{user.name.charAt(0).toUpperCase()}</span>
          </div>
          <span className={scrolled ? "text-dark" : "text-light"}>{user.name}</span>
        </div>
      }
      id="user-dropdown"
      align="end"
    >
      {userItems.map((item, index) => {
        const isActive = url === item.href;
        return (
          <NavDropdown.Item
            key={index}
            as={Link}
            href={item.href}
            className={isActive ? 'active fw-bold' : ''}
          >
            {item.label}
          </NavDropdown.Item>
        );
      })}
      <NavDropdown.Divider />
      <NavbarLogout
        className="dropdown-item"
        onClick={confirmLogout}
      >
        Keluar Sesi
      </NavbarLogout>
    </NavDropdown>
  );
};

const AuthButtons: FC<ScrolledProps> = ({ scrolled }) => {
  const { url } = usePage();
  const textClass = scrolled ? "" : "text-light";

  return (
    <>
      <Link
        className={`nav-link fw-medium me-2 ${textClass} ${url === "/login" ? 'active fw-bold' : ''}`}
        href="/login"
      >
        Masuk
      </Link>
      <Link
        className={`px-4 btn ${url === "/register" ? 'btn-secondary' : 'btn-primary'} rounded-pill`}
        href="/register"
      >
        Daftar
      </Link>
    </>
  );
};

const NavbarUserMain: FC = () => {
  const { auth } = usePage<PageProps>().props;
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Navbar
      bg={scrolled ? "light" : "transparent"}
      variant={scrolled ? "light" : "dark"}
      expand="lg"
      fixed="top"
      style={{ transition: 'all .2s ease' }}
      className={`${scrolled ? "shadow py-2" : "py-3"}`}
    >
      <Container>
        <Link className="navbar-brand d-flex align-items-center" href="/">
          <ApplicationLogo fill={scrolled ? "#000" : "#fff"} height={36} />
          <span className={`ms-2 fw-bold ${scrolled ? "text-dark" : "text-white"}`}>
            Sewain by Kodinus
          </span>
        </Link>

        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <MainNavItems scrolled={scrolled} />

          <Nav className="ms-auto align-items-center">
            {auth.user ? (
              <>
                <NotificationDropdown scrolled={scrolled} />
                <UserDropdown user={auth.user} scrolled={scrolled} />
              </>
            ) : (
              <AuthButtons scrolled={scrolled} />
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarUserMain;
