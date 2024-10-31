import styled from '@emotion/styled';
import { FC, useEffect, useState } from 'react';
import { Navbar, Nav, Container, NavDropdown, NavItem } from 'react-bootstrap';

const NavbarWrapperStyle = styled(Navbar)`
position: fixed;
min-height: 64px;
top: 1rem;
margin-right: 1rem;
background: var(--bs-body-bg);
z-index: 1020;
border-bottom: 1px solid var(--bs-light);
width: calc(100% - 24rem);
left: 24rem;
padding-top: 2rem;
padding-bottom: 1.75rem;
top: 0;
right: 0;

@media (992px <= width <= 1400px) {
  width: calc(100% - 22rem);
  left: 22rem;
}

@media (width <= 992px) {
  width: 100%;
  left: 0;
  margin: 0;
  top: 0;
  right: 0;
}
`;

const ClockItemStyle = styled(NavItem)`
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
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return <ClockItemStyle className="font-mono">{formatTime(date)}</ClockItemStyle>;
};

function MainAdminNav() {
  return (
    <NavbarWrapperStyle variant="light" expand="lg">
      <Container fluid>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <ClockItem />
          </Nav>
          <Nav className="ms-auto">
          </Nav>
        </Navbar.Collapse>
      </Container>
    </NavbarWrapperStyle>
  );
}

export default MainAdminNav;
