import styled from '@emotion/styled';
import { PropsWithChildren } from 'react';

const breakpoints = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
};

const StyledFlexbox = styled.div<{
  direction?: string;
  justify?: string;
  align?: string;
  gap?: number;
  className?: string;
  directionSm?: string;
  directionMd?: string;
  directionLg?: string;
  directionXl?: string;
  directionXxl?: string;
}>`
  display: flex;
  ${({ direction }) => direction && `flex-direction: ${direction};`}
  ${({ justify }) => justify && `justify-content: ${justify};`}
  ${({ align }) => align && `align-items: ${align};`}
  ${({ gap }) => gap && `gap: ${gap}px;`}

  ${({ directionSm }) =>
    directionSm &&
    `@media (min-width: ${breakpoints.sm}px) {
      flex-direction: ${directionSm};
    }`}
  ${({ directionMd }) =>
    directionMd &&
    `@media (min-width: ${breakpoints.md}px) {
      flex-direction: ${directionMd};
    }`}
  ${({ directionLg }) =>
    directionLg &&
    `@media (min-width: ${breakpoints.lg}px) {
      flex-direction: ${directionLg};
    }`}
  ${({ directionXl }) =>
    directionXl &&
    `@media (min-width: ${breakpoints.xl}px) {
      flex-direction: ${directionXl};
    }`}
  ${({ directionXxl }) =>
    directionXxl &&
    `@media (min-width: ${breakpoints.xxl}px) {
      flex-direction: ${directionXxl};
    }`}
`;

export default function Flexbox({
  children,
  direction,
  justify,
  align,
  gap,
  className,
  directionSm,
  directionMd,
  directionLg,
  directionXl,
  directionXxl,
}: PropsWithChildren<{
  direction?: string;
  justify?: string;
  align?: string;
  gap?: number;
  className?: string;
  directionSm?: string;
  directionMd?: string;
  directionLg?: string;
  directionXl?: string;
  directionXxl?: string;
}>) {
  return (
    <StyledFlexbox
      direction={direction}
      justify={justify}
      align={align}
      gap={gap}
      className={className}
      directionSm={directionSm}
      directionMd={directionMd}
      directionLg={directionLg}
      directionXl={directionXl}
      directionXxl={directionXxl}
    >
      {children}
    </StyledFlexbox>
  );
}
