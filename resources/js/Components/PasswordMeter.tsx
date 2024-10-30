import React, { useState, useRef } from 'react';
import { ProgressBar, Overlay, Popover } from 'react-bootstrap';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

const TeksKekuatan = styled.div<{ strength: number }>`
  color: ${(props) => {
    if (props.strength === 0) return 'var(--bs-danger)';
    if (props.strength === 1) return 'var(--bs-yellow)';
    if (props.strength === 2) return 'var(--bs-info)';
    return 'var(--bs-success)';
  }};
  font-weight: bold;
  margin-left: 10px;
`;

const BatangProgresKekuatanSandi: React.FC<{ strength: number }> = ({ strength }) => {
  return (
    <ProgressBar
      className="flex-grow-1"
      now={strength * 25}
      variant={strength === 0 ? 'danger' : strength === 1 ? 'warning' : strength === 2 ? 'info' : 'success'}
    />
  );
};

const PopoverKekuatanSandi: React.FC<{ strength: number; show: boolean; target: React.RefObject<SVGSVGElement>; setShow: (show: boolean) => void }> = ({ strength, show, target, setShow }) => {
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
          <Popover.Header as="h3">Detail Kekuatan Sandi</Popover.Header>
          <Popover.Body>
            {strength === 0 && <div>Sangat Lemah: <strong>Kurang dari 6 karakter</strong>.</div>}
            {strength === 1 && <div>Lemah: <strong>Setidaknya 7 karakter</strong>, namun kurang kompleks.</div>}
            {strength === 2 && <div>Moderat: <strong>Mengandung huruf dan angka</strong>, namun bisa lebih kuat.</div>}
          </Popover.Body>
        </Popover>
      </Overlay>
    </>
  );
};

const PengukurSandi: React.FC<{ password: string }> = ({ password }) => {
  const [show, setShow] = useState(false);
  const target = useRef(null);

  const hitungKekuatan = (password: string) => {
    let strength = 0;
    if (password.length > 6) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[\W_]/)) strength++;
    return strength;
  };

  const strength = hitungKekuatan(password);

  return (
    <div className="gap-2 mt-3 d-flex align-items-center w-100">
      <BatangProgresKekuatanSandi strength={strength} />
      <TeksKekuatan strength={strength}>
        {strength === 0 ? 'Sangat Lemah' : strength === 1 ? 'Lemah' : strength === 2 ? 'Moderat' : 'Kuat'}
      </TeksKekuatan>
      {strength < 3 && (
        <PopoverKekuatanSandi strength={strength} show={show} target={target} setShow={setShow} />
      )}
    </div>
  );
};

export default PengukurSandi;
