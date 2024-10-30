import styled from '@emotion/styled';
import { FC } from 'react';
import { twMerge } from 'tailwind-merge';

const WrapperDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  padding-top: 1rem;
  border-bottom: 1px solid rgba(var(--bs-dark-rgb), .125);

  [data-bs-theme='dark'] &,
  &[data-bs-theme='dark'] {
    border-color: rgba(var(--bs-white-rgb), .125);
  }
`;
const InnerDiv = styled.div`
  margin-bottom: -.75rem;
  background: var(--bs-white);
  padding: 0 1rem;

  [data-bs-theme='dark'] &,
  &[data-bs-theme='dark'] {
    background: var(--bs-dark);
    color: var(--bs-white);
  }
`;

interface SeparatorTextInterface {
  wrapperClassName?: string;
  innerClassName?: string;
  label?: string;
  size?: 'sm' | 'lg';
}

const SeparatorText: FC<SeparatorTextInterface> = ({ label, wrapperClassName, size = 'md', innerClassName }) => (
  <WrapperDiv className={wrapperClassName}>
    <InnerDiv className={twMerge(innerClassName, size ? `text-${size}` : '')}>
      {label}
    </InnerDiv>
  </WrapperDiv>
);

export default SeparatorText;
