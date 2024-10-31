import ApplicationLogo from '@/Components/ApplicationLogo';
import styled from '@emotion/styled';
import React, { useState } from 'react';
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
  faBuilding
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, usePage } from '@inertiajs/react';
import { Button } from 'react-bootstrap';
import { PageProps } from '@/types';

// Types
type MenuList = {
  label: string;
  href?: string;
  type?: 'menu' | 'heading';
  icon?: IconDefinition | JSX.Element | string;
  child?: MenuList[];
};

const SidebarStyle = styled.aside`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 24rem;
  height: 100vh;
  overflow: hidden;
  overflow-y: auto;
  transition: all 0.3s ease;
  z-index: 1030;

  @media (width <= 1400px) {
    width: 22rem;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
`;

const InnerSidebar = styled.div`
  transition: all 0.3s ease;
  min-height: 100svh;
  background: var(--bs-dark);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const HeaderSidebar = styled.div`
  display: flex;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
  opacity: 0.6;
  padding: 1rem 1.5rem 0.5rem;
  display: flex;
  color: #fff;

  &:not(:first-of-type) {
    margin-top: 0.5rem;
  }
`;

const MenuItem = styled.li`
  position: relative;
`;

const MenuLink = styled(Link)<{ $hassubmenu?: boolean; $isActive?: boolean }>`
  padding: 0.75rem 1.5rem;
  color: ${({ $isActive }) => ($isActive ? '#fff' : 'rgba(255, 255, 255, 0.8)')};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s ease;
  ${({ $hassubmenu }) => $hassubmenu && `justify-content: space-between;`}
  ${({ $isActive }) =>
    $isActive && `
    background: rgba(var(--bs-white-rgb), .125);
  `}

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
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

const SubmenuIcon = styled(FontAwesomeIcon)<{ $isopen: boolean }>`
  transition: transform 0.2s ease;
  opacity: 0.5;
  min-width: 1.25rem;

  ${({ $isopen }) =>
    $isopen &&
    `
    transform: rotate(180deg);
  `}
`;

const Submenu = styled.ul<{ $isopen: boolean }>`
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
  background: rgba(0, 0, 0, 0.2);
  list-style: none;
  padding: 0;

  ${({ $isopen }) =>
    $isopen &&
    `
    max-height: 500px;
    transition: max-height 0.5s ease-in;
  `}
`;

const SubmenuItem = styled.li``;

const SubmenuLink = styled(Link)<{ $isActive?: boolean }>`
  padding: 0.5rem 1rem 0.5rem 3.5rem;
  color: ${({ $isActive }) =>
    $isActive ? '#fff' : 'rgba(255, 255, 255, 0.7)'};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  ${({ $isActive }) =>
    $isActive && `
    background: rgba(var(--bs-white-rgb), .125);
  `}

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
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
  setActiveMenu: () => {},
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
  const isopen = activeMenu === menuId;
  const isActive = menu.href === props.urlPath.url;
  const isAnySubActive = menu.child?.some(sub => sub.href === props.urlPath.url);

  // Jika submenu aktif, buka parent menu
  React.useEffect(() => {
    if (isAnySubActive) {
      setActiveMenu(menuId);
    }
  }, [isAnySubActive]);

  return (
    <MenuItem>
      <MenuLink
        href={menu.href ?? '#'}
        $hassubmenu={!!menu.child}
        $isActive={isActive || isAnySubActive}
        onClick={(e) => {
          if (menu.child) {
            e.preventDefault();
            setActiveMenu(isopen ? null : menuId);
          }
        }}
      >
        <MenuIconWrapper>
          {menu.icon && <FontAwesomeIcon icon={menu.icon as IconDefinition} />}
          {menu.label}
        </MenuIconWrapper>
        {menu.child && (
          <SubmenuIcon icon={faChevronDown} size="sm" $isopen={isopen} />
        )}
      </MenuLink>
      {menu.child && (
        <Submenu $isopen={isopen}>
          {menu.child.map((subMenu, subIndex) => {
            const isSubActive = subMenu.href === props.urlPath.url;
            return (
              <SubmenuItem key={subIndex}>
                <SubmenuLink href={subMenu.href ?? '#'} $isActive={isSubActive}>
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

const SidebarHeader = () => (
  <HeaderSidebar>
    <LogoLink href={'#'}>
      <ApplicationLogo fill="#fff" height={36} />
    </LogoLink>
    <Button variant="link" className="p-0">
      <FontAwesomeIcon icon={faBars} size="lg" className="text-white" />
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
      label: 'Manajemen Mobil',
      type: 'menu',
      href: '#',
      icon: faCar,
      child: [
        {
          label: 'Daftar Mobil',
          href: route('administrator.car-data.index'),
        },
        {
          label: 'Kategori Mobil',
          href: '#',
        },
      ],
    },
    {
      label: 'Lokasi Garasi',
      href: "#",
      type: 'menu',
      icon: faBuilding,
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
      <SidebarStyle id="sidebar" className="sidebar">
        <InnerSidebar>
          <SidebarHeader />
          <MenuListComponent items={menuList} />
        </InnerSidebar>
      </SidebarStyle>
    </MenuContext.Provider>
  );
}
