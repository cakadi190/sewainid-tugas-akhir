import { FC, useState } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { router } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';

const ButtonComponent = styled(Button)`
  width: fit-content;
  margin: 0;

  @media (width <= 992px) {
    width: 100%;
  }
`;

const LogoutConfirmationContent: FC<{
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ isLoading, onConfirm, onCancel }) => (
  <>
    <Modal.Body className="gap-4 p-4 flex-column flex-lg-row d-flex">
      <div className="mx-auto mx-lg-0">
        <div className="p-3 bg-opacity-25 text-warning bg-warning rounded-circle">
          <FontAwesomeIcon icon={faExclamationTriangle} className="fa-2x" />
        </div>
      </div>
      <div className="text-center flex-column text-lg-start d-flex">
        <h2 className="fs-4">Konfirmasi Keluar</h2>
        <p className="m-0">Apakah Anda yakin ingin keluar? Anda perlu masuk lagi untuk mengakses akun Anda.</p>
      </div>
    </Modal.Body>
    <Modal.Footer className="gap-2 flex-column-reverse flex-lg-row">
      <ButtonComponent variant="light" onClick={onCancel}>Batal</ButtonComponent>
      <ButtonComponent variant="danger" onClick={onConfirm} disabled={isLoading}>
        {isLoading ? <Spinner animation="border" size="sm" /> : 'Keluar'}
      </ButtonComponent>
    </Modal.Footer>
  </>
);

const LogoutConfirmationModal: FC<{
  show: boolean;
  onClose: () => void;
}> = ({ show, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    setIsLoading(true);
    router.post('/logout', {}, {
      onFinish: () => {
        setIsLoading(false);
        onClose();
      },
    });
  };

  return (
    <Modal show={show} backdrop="static" keyboard={false} onHide={onClose} centered>
      <LogoutConfirmationContent
        isLoading={isLoading}
        onConfirm={handleLogout}
        onCancel={onClose}
      />
    </Modal>
  );
};

export default LogoutConfirmationModal;
