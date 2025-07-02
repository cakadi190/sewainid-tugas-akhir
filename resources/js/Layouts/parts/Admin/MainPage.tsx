import { useSidebar } from "@/Hooks/useSidebar";
import styled from "@emotion/styled";
import { PropsWithChildren } from "react";
import { Container } from "react-bootstrap";
import Footer from "./Footer";

const MainPageStyled = styled.main<{ isToggled: boolean }>`
  margin-left: 20rem;
  width: calc(100% - 20rem);
  min-height: calc(100svh - 0.5rem);
  transition: all 0.2s;
  padding-top: 6.5rem;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;

  ${({ isToggled }) =>
    !isToggled &&
    `
  margin-left: 0;
  width: 100%;
`}

  @media (992px <= width <= 1400px) {
    margin-left: 18rem;
    width: calc(100% - 18rem);

    ${({ isToggled }) =>
      !isToggled &&
      `
    margin-left: 0;
    width: 100%;
  `}
  }

  @media (width <= 992px) {
    width: 100%;
    left: 0;
    margin: 0;
    top: 0;
    right: 0;
  }
`;

const MainPageInnerStyled = styled.div`
  margin-bottom: 1rem;
`;

export default function MainPage({ children }: PropsWithChildren) {
  const { isOpen } = useSidebar();

  return (
    <MainPageStyled isToggled={isOpen}>
      <MainPageInnerStyled>
        <Container fluid>{children}</Container>
      </MainPageInnerStyled>

      <Footer />
    </MainPageStyled>
  );
}
