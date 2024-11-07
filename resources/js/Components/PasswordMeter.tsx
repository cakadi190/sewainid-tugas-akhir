import React, { useState, useRef } from 'react';
import { ProgressBar, Overlay, Popover } from 'react-bootstrap';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

/**
 * Styled component for displaying password strength text
 * Color changes based on password strength level
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
 * Component to display password strength progress bar
 * @param {Object} props - Component props
 * @param {number} props.strength - Password strength level (0-3)
 * @returns {JSX.Element} Progress bar with color based on strength
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
 * Component to display password strength details in a popover
 * @param {Object} props - Component props
 * @param {number} props.strength - Password strength level (0-3)
 * @param {boolean} props.show - Whether to show the popover
 * @param {React.RefObject<SVGSVGElement>} props.target - Reference to the trigger element
 * @param {Function} props.setShow - Function to toggle popover visibility
 * @returns {JSX.Element} Icon with popover showing strength details
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
          <Popover.Header as="h3">Password Strength Details</Popover.Header>
          <Popover.Body>
            {strength === 0 && <div>Very Weak: <strong>Less than 6 characters</strong>.</div>}
            {strength === 1 && <div>Weak: <strong>At least 7 characters</strong>, but not complex enough.</div>}
            {strength === 2 && <div>Moderate: <strong>Contains letters and numbers</strong>, but could be stronger.</div>}
          </Popover.Body>
        </Popover>
      </Overlay>
    </>
  );
};

/**
 * Main component for measuring and displaying password strength
 * @param {Object} props - Component props
 * @param {string} props.password - Password string to evaluate
 * @returns {JSX.Element} Password strength meter with progress bar and details
 */
const PasswordMeter: React.FC<{ password: string }> = ({ password }) => {
  const [show, setShow] = useState(false);
  const target = useRef(null);

  /**
   * Calculate password strength based on various criteria
   * @param {string} password - Password to evaluate
   * @returns {number} Strength level from 0-3
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
        {strength === 0 ? 'Very Weak' : strength === 1 ? 'Weak' : strength === 2 ? 'Moderate' : 'Strong'}
      </StrengthText>
      {strength < 3 && (
        <PasswordStrengthPopover strength={strength} show={show} target={target} setShow={setShow} />
      )}
    </div>
  );
};

export default PasswordMeter;
