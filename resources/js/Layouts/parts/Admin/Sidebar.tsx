import ApplicationLogo from '@/Components/ApplicationLogo';
import styled from '@emotion/styled';
import React, { FC, useState } from 'react';
import {
  faBars,
  faTachometerAlt,
  faUsers,
  faCalendarAlt,
  faMoneyBillWave,
  faClipboardList,
  faChartLine,
  faCog,
  faUserShield,
  faFileContract,
  faChevronDown,
  IconDefinition,
  faCar,
  faBuilding,
  faWrench
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, usePage } from '@inertiajs/react';
import { Button } from 'react-bootstrap';
import { PageProps } from '@/types';
import { useSidebar } from '@/Hooks/useSidebar';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

// Types
type MenuList = {
  label: string;
  href?: string;
  type?: 'menu' | 'heading';
  icon?: IconDefinition | JSX.Element | string;
  child?: MenuList[];
};

const SidebarStyle = styled.aside<{ isToggled: boolean }>`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 20rem;
  height: 100vh;
  overflow-y: auto;
  transition: all 0.3s ease;
  z-index: 1030;
  margin-left: -20rem;
  background: linear-gradient(45deg, rgba(var(--bs-body-bg-rgb), .5) 75%, rgba(var(--bs-primary-rgb), .125) 100%);
  backdrop-filter: blur(1rem);
  border-right: 1px solid var(--bs-border-color);

  @media (width <= 992px) {
    margin-left: 0;
  }

  ${({ isToggled }) => isToggled && `
    margin-left: 0;

    @media (width <= 992px) {
      margin-left: -20rem;
    }
  `}

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(var(--bs-dark-rgb), 0.2);
    border-radius: 3px;
  }
`;

const InnerSidebar = styled.div`
  transition: all 0.3s ease;
  overflow: hidden;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(var(--bs-dark-rgb), 0.1),
    0 2px 4px -1px rgba(var(--bs-dark-rgb), 0.06);
`;

const HeaderSidebar = styled.div`
  display: flex;
  padding: 1.5rem;
`;

const LogoLink = styled(Link)`
  flex-grow: 1;
`;

const MenusSidebar = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuHeading = styled.li`
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  opacity: 0.8;
  padding: 1rem 1.5rem 0.5rem;
  display: flex;
  color: var(--bs-dark);

  &:not(:first-of-type) {
    margin-top: 0.5rem;
  }
`;

const MenuItem = styled.li`
  position: relative;
`;

// Modify styled components to properly handle custom props
const MenuLink = styled(Link, {
  shouldForwardProp: (prop) => !['hasSubmenu', 'isActive'].includes(prop as string),
}) <{ hasSubmenu?: boolean; isActive?: boolean }>`
  padding: 0.75rem 1.5rem;
  color: ${({ isActive }) => (isActive ? 'rgba(var(--bs-primary-rgb), 1)' : 'rgba(var(--bs-dark-rgb), 0.7)')};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s ease;
  ${({ hasSubmenu }) => hasSubmenu && `justify-content: space-between;`}
  ${({ isActive }) =>
    isActive && `
    background: rgba(var(--bs-primary-rgb), 0.05);
  `}

  &:hover {
    background: ${({ isActive }) => isActive ? `rgba(var(--bs-primary-rgb), 0.1)` : `rgba(var(--bs-dark-rgb), 0.05)`};
    color: ${({ isActive }) => isActive ? `rgba(var(--bs-primary-rgb), 1)` : `rgba(var(--bs-dark-rgb), 0.7)`};
  }
`;

const MenuIconWrapper = styled.span`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    min-width: 1.25rem;
  }
`;

const SubmenuIcon = styled(FontAwesomeIcon, {
  shouldForwardProp: (prop) => prop !== 'isOpen',
}) <{ isOpen: boolean }>`
  transition: transform 0.2s ease;
  opacity: 0.5;
  min-width: 1.25rem;

  ${({ isOpen }) =>
    isOpen &&
    `
    transform: rotate(180deg);
  `}
`;

const Submenu = styled.ul<{ isOpen: boolean }>`
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
  list-style: none;
  padding: 0;

  ${({ isOpen }) =>
    isOpen &&
    `
    max-height: 500px;
    transition: max-height 0.5s ease-in;
  `}
`;

const SubmenuItem = styled.li``;

const SubmenuLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== 'isActive',
}) <{ isActive?: boolean }>`
  padding: 0.5rem 1rem 0.5rem 3.5rem;
  color: rgba(var(--bs-dark-rgb), 0.5);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    left: 1.875rem;
    top: 50%;
    transform: translateY(-50%);
    width: 0.25rem;
    height: 0.25rem;
    background: rgba(var(--bs-dark-rgb), 0.125);
    border-radius: 50%;
  }

  ${({ isActive }) =>
    isActive && `
    color: rgba(var(--bs-dark-rgb), 1);
    background: rgba(var(--bs-dark-rgb), 0.05);

    &:before {
      background: rgba(var(--bs-dark-rgb), 0.25);
      left: 1.875rem;
      width: 6px;
      height: 6px;
    }
  `}

  &:hover {
    background: ${({ isActive }) => isActive ? `rgba(var(--bs-dark-rgb), 0.1)` : `rgba(var(--bs-dark-rgb), 0.05)`};
    color: ${({ isActive }) => isActive ? `rgba(var(--bs-dark-rgb), 1)` : `rgba(var(--bs-dark-rgb), 0.7)`};
  }

  svg {
    font-size: 0.875rem;
  }
`;

// Context for managing active menu
const MenuContext = React.createContext<{
  activeMenu: string | null;
  setActiveMenu: (menuId: string | null) => void;
}>({
  activeMenu: null,
  setActiveMenu: () => { },
});

const MenuItemComponent = ({
  menu,
  menuId,
}: {
  menu: MenuList;
  menuId: string;
}) => {
  const { activeMenu, setActiveMenu } = React.useContext(MenuContext);
  const { props } = usePage<PageProps>();
  const isOpen = activeMenu === menuId;
  const isActive = menu.href === props.urlPath.url;
  const isAnySubActive = menu.child?.some(sub => sub.href === props.urlPath.url);

  React.useEffect(() => {
    if (isAnySubActive) {
      setActiveMenu(menuId);
    }
  }, [isAnySubActive]);

  return (
    <MenuItem>
      <MenuLink
        href={menu.href ?? '#'}
        hasSubmenu={!!menu.child}
        isActive={isActive || isAnySubActive}
        onClick={(e) => {
          if (menu.child) {
            e.preventDefault();
            setActiveMenu(isOpen ? null : menuId);
          }
        }}
      >
        <MenuIconWrapper>
          {menu.icon && <FontAwesomeIcon icon={menu.icon as IconDefinition} />}
          {menu.label}
        </MenuIconWrapper>
        {menu.child && (
          <SubmenuIcon icon={faChevronDown} size="sm" isOpen={isOpen} />
        )}
      </MenuLink>
      {menu.child && (
        <Submenu isOpen={isOpen}>
          {menu.child.map((subMenu, subIndex) => {
            const isSubActive = subMenu.href === props.urlPath.url;
            return (
              <SubmenuItem key={subIndex}>
                <SubmenuLink href={subMenu.href ?? '#'} isActive={isSubActive}>
                  {subMenu.icon && (
                    <FontAwesomeIcon icon={subMenu.icon as IconDefinition} />
                  )}
                  {subMenu.label}
                </SubmenuLink>
              </SubmenuItem>
            );
          })}
        </Submenu>
      )}
    </MenuItem>
  );
};

const SidebarHeader: FC<{ toggle: () => void }> = ({ toggle }) => (
  <HeaderSidebar>
    <LogoLink href={'#'}>
      <ApplicationLogo fill="#000" height={36} />
    </LogoLink>
    <Button variant="link" className="p-0" onClick={toggle}>
      <FontAwesomeIcon icon={faBars} size="lg" />
    </Button>
  </HeaderSidebar>
);

const MenuListComponent = ({ items }: { items: MenuList[] }) => (
  <MenusSidebar>
    {items.map((menu, index) =>
      menu.type === 'heading' ? (
        <MenuHeading key={index}>{menu.label}</MenuHeading>
      ) : (
        <MenuItemComponent key={index} menu={menu} menuId={`menu-${index}`} />
      )
    )}
  </MenusSidebar>
);


export default function Sidebar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { toggle, isOpen } = useSidebar();

  const menuList: MenuList[] = [
    { label: 'Dashboard', type: 'heading' },
    {
      label: 'Beranda',
      href: route('administrator.home'),
      type: 'menu',
      icon: faTachometerAlt,
    },

    { label: 'Master Data', type: 'heading' },
    {
      label: 'Lokasi Pool / Garasi',
      href: route('administrator.garage-data.index'),
      type: 'menu',
      icon: faBuilding,
    },
    {
      label: 'Lokasi Bengkel',
      href: route('administrator.repair-shop-data.index'),
      type: 'menu',
      icon: faWrench,
    },
    {
      label: 'Manajemen Kendaraan',
      type: 'menu',
      href: '#',
      icon: faCar,
      child: [
        {
          label: 'Data Fitur Kendaraan',
          href: route('administrator.car-feature-data.index'),
        },
        {
          label: 'Data Kendaraan',
          href: route('administrator.car-data.index'),
        },
        {
          label: 'Penempatan Garasi',
          href: '#',
        },
        {
          label: 'Reparasi Kendaraan',
          href: '#',
        },
      ]
    },
    {
      label: 'Manajemen Pengguna',
      type: 'menu',
      href: '#',
      icon: faUsers,
      child: [
        {
          label: 'Pelanggan',
          href: '#',
        },
        {
          label: 'Staff Keuangan',
          href: '#',
        },
        {
          label: 'Staff Pengemudi',
          href: '#',
        },
        {
          label: 'Administrator',
          href: '#',
        },
      ],
    },
    { label: 'Transaksi', type: 'heading' },
    {
      label: 'Pemesanan',
      type: 'menu',
      href: '#',
      icon: faCalendarAlt,
      child: [
        {
          label: 'Daftar Pemesanan',
          href: '#',
        },
        {
          label: 'Jadwal Sewa',
          href: '#',
        },
        {
          label: 'Konfirmasi Pemesanan',
          href: '#',
        },
      ],
    },
    {
      label: 'Pembayaran',
      type: 'menu',
      href: '#',
      icon: faMoneyBillWave,
      child: [
        {
          label: 'Daftar Pembayaran',
          href: '#',
        },
        {
          label: 'Konfirmasi Pembayaran',
          href: '#',
        },
        {
          label: 'Riwayat Pembayaran',
          href: '#',
        },
      ],
    },
    { label: 'Laporan', type: 'heading' },
    {
      label: 'Laporan Transaksi',
      type: 'menu',
      href: '#',
      icon: faClipboardList,
    },
    {
      label: 'Laporan Keuangan',
      type: 'menu',
      href: '#',
      icon: faChartLine,
    },
    { label: 'Pengaturan', type: 'heading' },
    {
      label: 'Persyaratan & Ketentuan',
      type: 'menu',
      href: '#',
      icon: faFileContract,
    },
    {
      label: 'Keamanan',
      type: 'menu',
      href: '#',
      icon: faUserShield,
    },
    {
      label: 'Pengaturan Sistem',
      type: 'menu',
      href: '#',
      icon: faCog,
    },
  ];

  return (
    <MenuContext.Provider value={{ activeMenu, setActiveMenu }}>
      <SidebarStyle isToggled={isOpen} id="sidebar" className="sidebar">
        <PerfectScrollbar>
          <InnerSidebar>
            <SidebarHeader toggle={toggle} />
            <MenuListComponent items={menuList} />
          </InnerSidebar>
        </PerfectScrollbar>
      </SidebarStyle>
    </MenuContext.Provider >
  );
}
