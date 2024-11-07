import styled from '@emotion/styled';
import { FC } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Komponen styled untuk membungkus separator text
 * Menampilkan garis pemisah dengan teks di tengahnya
 */
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

/**
 * Komponen styled untuk bagian dalam separator text
 * Menampilkan teks dengan latar belakang yang sesuai tema
 */
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

/**
 * Interface untuk props komponen SeparatorText
 * @interface SeparatorTextInterface
 * @property {string} [wrapperClassName] - Kelas CSS tambahan untuk wrapper
 * @property {string} [innerClassName] - Kelas CSS tambahan untuk inner div
 * @property {string} [label] - Teks yang akan ditampilkan
 * @property {'sm' | 'lg'} [size] - Ukuran teks ('sm' atau 'lg')
 */
interface SeparatorTextInterface {
  wrapperClassName?: string;
  innerClassName?: string;
  label?: string;
  size?: 'sm' | 'lg';
}

/**
 * Komponen untuk menampilkan teks dengan garis pemisah horizontal
 *
 * @component
 * @param {SeparatorTextInterface} props - Props komponen
 * @param {string} [props.label] - Teks yang akan ditampilkan
 * @param {string} [props.wrapperClassName] - Kelas CSS tambahan untuk wrapper
 * @param {'sm' | 'lg'} [props.size='md'] - Ukuran teks
 * @param {string} [props.innerClassName] - Kelas CSS tambahan untuk inner div
 * @returns {JSX.Element} Komponen SeparatorText
 */
const SeparatorText: FC<SeparatorTextInterface> = ({ label, wrapperClassName, size = 'md', innerClassName }) => (
  <WrapperDiv className={wrapperClassName}>
    <InnerDiv className={twMerge(innerClassName, size ? `text-${size}` : '')}>
      {label}
    </InnerDiv>
  </WrapperDiv>
);

export default SeparatorText;
