import { PropsWithChildren } from "react";
import styled from '@emotion/styled';

const MainPageStyled = styled.main`
margin-left: 24rem;
min-height: 100svh;
width: calc(100svw - 24rem);
transition: all .2s;
padding-top: 5rem;

@media (width <= 1400px) {
  width: calc(100svw - 22rem);
  width: 22rem;
}
`;

export default function MainPage({ children }: PropsWithChildren) {
  return (
    <MainPageStyled>
      {children}
    </MainPageStyled>
  )
};
