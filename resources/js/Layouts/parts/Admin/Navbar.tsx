import { windowIsWidthGreaterThan } from '@/Helpers/windowBreakpoint';
import { useSidebar } from '@/Hooks/useSidebar';
import { PageProps } from '@/types';
import { faBarsStaggered, faClock, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, usePage } from '@inertiajs/react';
import { FC, useEffect, useState } from 'react';
import { Navbar, Nav, Container, NavItem, NavDropdown } from 'react-bootstrap';
import useWindowSize from '@/Hooks/useWindowSize';
import LogoutConfirmationModal from '@/Components/Modal/LogoutModal';
import styled from '@emotion/styled';
import Gravatar from 'react-gravatar';

const NavbarWrapperStyle = styled(Navbar, {
  shouldForwardProp: (prop) => !['isToggled'].includes(prop),
}) <{ isToggled: boolean; }>`
  position: fixed;
  min-height: 64px;
  margin-right: 1rem;
  background: rgba(var(--bs-body-bg-rgb), .75);
  backdrop-filter: blur(1rem);
  z-index: 1020;
  width: calc(100% - 20rem);
  left: 20rem;
  padding-top: 1.75rem;
  padding-bottom: 1.5rem;
  transition: all .2s;
  right: 0;

  ${({ isToggled }) => !isToggled && `
    width: 100%;
    left: 0;
  `}

  @media (width <= 992px) {
    width: 100%;
    left: 0;
    margin: 0;
    top: 0;
    right: 0;
  }
`;

const NavDropdownStyled = styled(NavDropdown)`
  padding: 0;

  .nav-link {
    padding: 0;
    &:after {
      display: none;
    }
  }

  img {
    height: 32px;
    width: 32px;
    border-radius: 50%;
  }
`;

const ClockItemStyle = styled(NavItem)`
  display: flex;
  align-items: center;
  gap: .5rem;
  font-family: 'JetBrains Mono', monospace;
`;

const ClockItem: FC = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <ClockItemStyle className="font-mono">
      <FontAwesomeIcon icon={faClock} />
      {formatTime(date)}
    </ClockItemStyle>
  );
};

const UserDropdown: FC = () => {
  const { auth: { user } } = usePage<PageProps>().props;
  const [showModal, setShowModal] = useState<boolean>(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <Nav.Item className="nav-item dropdown">
      <NavDropdownStyled
        title={<Gravatar email={user.email} />}
        id="basic-nav-dropdown"
        align="end"
      >
        <NavDropdown.Item as={Link} href={route('profile.edit') + '#profile-update'}>Profilku</NavDropdown.Item>
        <NavDropdown.Item as={Link} href={route('profile.edit') + '#password-update'}>Ganti Kata Sandi</NavDropdown.Item>
        <NavDropdown.Item as={Link} href={route('profile.edit') + '#social-media-update'}>Akun Sosial Media</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item onClick={openModal} href="#">Keluar Sesi</NavDropdown.Item>
      </NavDropdownStyled>

      <LogoutConfirmationModal show={showModal} onClose={closeModal} />
    </Nav.Item>
  );
};

function MainAdminNav() {
  const { toggle, isOpen } = useSidebar();
  const { width } = useWindowSize();

  return (
    <NavbarWrapperStyle isToggled={isOpen} variant="light" expand>
      <Container fluid>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="gap-2 me-auto align-items-center">
            {!isOpen && windowIsWidthGreaterThan(992, width) && (
              <Nav.Item>
                <Nav.Link className='p-0 m-0 ps-1 pe-2' onClick={toggle}>
                  <FontAwesomeIcon icon={faBarsStaggered} />
                </Nav.Link>
              </Nav.Item>
            )}

            <Nav.Link className='p-0 m-0 ps-1 pe-2 d-lg-none' onClick={toggle}>
              <FontAwesomeIcon icon={faBarsStaggered} />
            </Nav.Link>

            <ClockItem />
          </Nav>
          <Nav className="ms-auto">
            <UserDropdown />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </NavbarWrapperStyle>
  );
}

export default MainAdminNav;
