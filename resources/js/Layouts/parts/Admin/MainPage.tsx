import { PropsWithChildren } from "react";
import styled from '@emotion/styled';
import Footer from "./Footer";
import { Container } from "react-bootstrap";
import { useSidebar } from "@/Hooks/useSidebar";

const MainPageStyled = styled.main<{ isToggled: boolean }>`
margin-left: 20rem;
width: calc(100% - 20rem);
min-height: 100svh;
transition: all .2s;
padding-top: 6.5rem;
display: flex;
flex-direction: column;
overflow-x: hidden;

${({ isToggled }) => !isToggled && `
margin-left: 0;
width: 100%;
`}

@media (width <= 992px) {
  width: 100%;
  left: 0;
  margin: 0;
  top: 0;
  right: 0;
}
`;

const MainPageInnerStyled = styled.div`
margin-bottom: 1rem;`;

export default function MainPage({ children }: PropsWithChildren) {
  const { isOpen } = useSidebar();

  return (
    <MainPageStyled isToggled={isOpen}>
      <MainPageInnerStyled>
        <Container fluid>
          {children}
        </Container>
      </MainPageInnerStyled>

      <Footer />
    </MainPageStyled>
  )
};
