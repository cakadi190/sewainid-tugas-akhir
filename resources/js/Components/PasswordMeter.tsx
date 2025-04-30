import React, { useState, useRef } from 'react';
import { ProgressBar, Overlay, Popover } from 'react-bootstrap';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

/**
 * Komponen styled untuk menampilkan teks kekuatan kata sandi
 * Warna berubah berdasarkan tingkat kekuatan kata sandi
 */
const StrengthText = styled.div<{ strength: number }>`
  color: ${(props) => {
    if (props.strength === 0) return 'var(--bs-danger)';
    if (props.strength === 1) return 'var(--bs-yellow)';
    if (props.strength === 2) return 'var(--bs-info)';
    return 'var(--bs-success)';
  }};
  font-weight: bold;
  margin-left: 10px;
`;

/**
 * Komponen untuk menampilkan progress bar kekuatan kata sandi
 * @param {Object} props - Props komponen
 * @param {number} props.strength - Tingkat kekuatan kata sandi (0-3)
 * @returns {JSX.Element} Progress bar dengan warna berdasarkan kekuatan
 */
const PasswordStrengthBar: React.FC<{ strength: number }> = ({ strength }) => {
  return (
    <ProgressBar
      className="flex-grow-1"
      now={strength * 25}
      variant={strength === 0 ? 'danger' : strength === 1 ? 'warning' : strength === 2 ? 'info' : 'success'}
    />
  );
};

/**
 * Komponen untuk menampilkan detail kekuatan kata sandi dalam popover
 * @param {Object} props - Props komponen
 * @param {number} props.strength - Tingkat kekuatan kata sandi (0-3)
 * @param {boolean} props.show - Apakah popover ditampilkan
 * @param {React.RefObject<SVGSVGElement>} props.target - Referensi ke elemen pemicu
 * @param {Function} props.setShow - Fungsi untuk mengalihkan visibilitas popover
 * @returns {JSX.Element} Ikon dengan popover yang menampilkan detail kekuatan
 */
const PasswordStrengthPopover: React.FC<{ strength: number; show: boolean; target: React.RefObject<SVGSVGElement>; setShow: (show: boolean) => void }> = ({ strength, show, target, setShow }) => {
  return (
    <>
      <FontAwesomeIcon
        icon={faQuestionCircle}
        ref={target as React.RefObject<SVGSVGElement>}
        onMouseOver={() => setShow(true)}
        onMouseOut={() => setShow(false)}
      />
      <Overlay target={target.current} show={show} placement="bottom">
        <Popover id="popover-basic">
          <Popover.Header as="h3">Detail Kekuatan Kata Sandi</Popover.Header>
          <Popover.Body>
            {strength === 0 && <div>Sangat Lemah: <strong>Kurang dari 6 karakter</strong>.</div>}
            {strength === 1 && <div>Lemah: <strong>Minimal 7 karakter</strong>, tetapi tidak cukup kompleks.</div>}
            {strength === 2 && <div>Sedang: <strong>Berisi huruf dan angka</strong>, tetapi bisa lebih kuat.</div>}
          </Popover.Body>
        </Popover>
      </Overlay>
    </>
  );
};

/**
 * Komponen utama untuk mengukur dan menampilkan kekuatan kata sandi
 * @param {Object} props - Props komponen
 * @param {string} props.password - String kata sandi untuk dievaluasi
 * @returns {JSX.Element} Pengukur kekuatan kata sandi dengan progress bar dan detail
 */
const PasswordMeter: React.FC<{ password: string }> = ({ password }) => {
  const [show, setShow] = useState(false);
  const target = useRef(null);

  /**
   * Menghitung kekuatan kata sandi berdasarkan berbagai kriteria
   * @param {string} password - Kata sandi untuk dievaluasi
   * @returns {number} Tingkat kekuatan dari 0-3
   */
  const calculateStrength = (password: string) => {
    let strength = 0;
    if (password.length > 6) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[\W_]/)) strength++;
    return strength;
  };

  const strength = calculateStrength(password);

  return (
    <div className="gap-2 mt-3 d-flex align-items-center w-100">
      <PasswordStrengthBar strength={strength} />
      <StrengthText strength={strength}>
        {strength === 0 ? 'Sangat Lemah' : strength === 1 ? 'Lemah' : strength === 2 ? 'Sedang' : 'Kuat'}
      </StrengthText>
      {strength < 3 && (
        <PasswordStrengthPopover strength={strength} show={show} target={target} setShow={setShow} />
      )}
    </div>
  );
};

export default PasswordMeter;
