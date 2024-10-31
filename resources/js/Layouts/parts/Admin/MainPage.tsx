import { PropsWithChildren } from "react";
import styled from '@emotion/styled';
import Footer from "./Footer";
import { Container } from "react-bootstrap";

const MainPageStyled = styled.main`
margin-left: 24rem;
min-height: 100svh;
width: calc(100% - 24rem);
transition: all .2s;
padding-top: 7.5rem;
display: flex;
flex-direction: column;
overflow-x: hidden;

@media (992px <= width <= 1400px) {
  width: calc(100% - 22rem);
  margin-left: 22rem;
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
margin-bottom: 1rem;`;

export default function MainPage({ children }: PropsWithChildren) {
  return (
    <MainPageStyled>
      <MainPageInnerStyled>
        <Container fluid>
          {children}
        </Container>
      </MainPageInnerStyled>

      <Footer />
    </MainPageStyled>
  )
};
