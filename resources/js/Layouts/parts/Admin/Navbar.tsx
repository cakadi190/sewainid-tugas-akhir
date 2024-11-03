import { useSidebar } from '@/Hooks/useSidebar';
import styled from '@emotion/styled';
import { faBars, faBarsStaggered } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useEffect, useState } from 'react';
import { Navbar, Nav, Container, NavItem } from 'react-bootstrap';

const NavbarWrapperStyle = styled(Navbar, {
  shouldForwardProp: (prop) => !['isToggled'].includes(prop),
})<{ isToggled: boolean; }>`
position: fixed;
min-height: 64px;
top: 1rem;
margin-right: 1rem;
background: var(--bs-body-bg);
z-index: 1020;
border-bottom: 1px solid var(--bs-light);
width: calc(100% - 20rem);
left: 20rem;
padding-top: 2rem;
padding-bottom: 1.75rem;
top: 0;
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
    return `${hours}:${minutes}`;
  };

  return <ClockItemStyle className="font-mono">{formatTime(date)}</ClockItemStyle>;
};

function MainAdminNav() {
  const { toggle, isOpen } = useSidebar();

  return (
    <NavbarWrapperStyle isToggled={isOpen} variant="light" expand>
      <Container fluid>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="gap-2 me-auto align-items-center">
            {!isOpen && (
              <Nav.Item>
                <Nav.Link className='p-0 m-0 ps-1 pe-2' onClick={toggle}>
                  <FontAwesomeIcon icon={faBarsStaggered} />
                </Nav.Link>
              </Nav.Item>
            )}

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
