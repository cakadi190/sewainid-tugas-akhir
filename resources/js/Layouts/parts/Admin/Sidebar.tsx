import styled from '@emotion/styled';

const SidebarStyle = styled.aside`
position: fixed;
top: 0;
bottom: 0;
left: 0;
width: 24rem;
height: 100vh;
`;

export default function Sidebar() {
  return (
    <SidebarStyle id="sidebar"></SidebarStyle>
  )
};
