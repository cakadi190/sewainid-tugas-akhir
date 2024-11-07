import { FC, useState } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { router } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashRestore, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';

const ButtonComponent = styled(Button)`
  width: fit-content;
  margin: 0;

  @media (width <= 992px) {
    width: 100%;
  }
`;

/**
 * Komponen untuk menampilkan konfirmasi pemulihan data
 *
 * @component
 * @param {Object} props - Props komponen
 * @param {boolean} props.isRestoring - Status proses pemulihan sedang berlangsung
 * @param {() => void} props.onConfirm - Handler ketika konfirmasi diterima
 * @param {() => void} props.onCancel - Handler ketika konfirmasi dibatalkan
 * @returns {JSX.Element} Komponen konfirmasi pemulihan
 */
const RestoreConfirmation: FC<{
  isRestoring: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ isRestoring, onConfirm, onCancel }) => (
  <>
    <Modal.Body className="gap-4 p-4 flex-column flex-lg-row d-flex">
      <div className="mx-auto mx-lg-0">
        <div className="p-3 bg-opacity-25 text-warning bg-warning rounded-circle">
          <FontAwesomeIcon icon={faExclamationTriangle} className="fa-2x" />
        </div>
      </div>
      <div className="text-center flex-column text-lg-start d-flex">
        <h2 className="fs-4">Konfirmasi Pemulihan</h2>
        <p className="m-0">Apakah Anda yakin akan mengembalikan data ini? Aksi ini akan memulihkan data yang dihapus.</p>
      </div>
    </Modal.Body>
    <Modal.Footer className="gap-2 flex-column-reverse flex-lg-row">
      <ButtonComponent variant="secondary" onClick={onCancel}>Batal</ButtonComponent>
      <ButtonComponent variant="success" onClick={onConfirm} disabled={isRestoring}>
        {isRestoring ? <Spinner animation="border" size="sm" /> : 'Kembalikan'}
      </ButtonComponent>
    </Modal.Footer>
  </>
);

/**
 * Komponen modal untuk proses pemulihan data
 *
 * @component
 * @param {Object} props - Props komponen
 * @param {boolean} props.show - Status tampilan modal
 * @param {string} props.url - URL endpoint untuk pemulihan data
 * @param {() => void} props.onClose - Handler ketika modal ditutup
 * @param {() => void} [props.onSuccess] - Handler opsional ketika pemulihan berhasil
 * @param {() => void} [props.onError] - Handler opsional ketika pemulihan gagal
 * @returns {JSX.Element} Komponen modal pemulihan
 */
const RestoreModal: FC<{
  show: boolean;
  url: string;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: () => void;
}> = ({ show, url, onClose, onSuccess, onError }) => {
  const [isRestoring, setIsRestoring] = useState(false);

  const handleRestore = () => {
    setIsRestoring(true);
    router.patch(url, { restore: true }, {
      onFinish: () => {
        setIsRestoring(false);
        onClose();
        if (onSuccess) onSuccess();
      },
      onError: () => {
        setIsRestoring(false);
        if (onError) onError();
      },
    });
  };

  return (
    <Modal backdrop="static" keyboard={false} show={show} onHide={onClose} centered>
      <RestoreConfirmation
        isRestoring={isRestoring}
        onConfirm={handleRestore}
        onCancel={onClose}
      />
    </Modal>
  );
};

/**
 * Komponen utama untuk menampilkan tombol dan modal pemulihan data
 *
 * @component
 * @param {Object} props - Props komponen
 * @param {string} props.url - URL endpoint untuk pemulihan data
 * @param {() => void} [props.onSuccess] - Handler opsional ketika pemulihan berhasil
 * @param {() => void} [props.onError] - Handler opsional ketika pemulihan gagal
 * @returns {JSX.Element} Komponen pemulihan data
 */
const RestoreData: FC<{
  url: string;
  onSuccess?: () => void;
  onError?: () => void;
}> = ({ url, onSuccess, onError }) => {
  const [show, setShow] = useState(false);

  const toggleModal = () => setShow(!show);

  return (
    <>
      <Button variant="success" size="sm" onClick={toggleModal}>
        <FontAwesomeIcon icon={faTrashRestore} />
      </Button>

      <RestoreModal
        show={show}
        onClose={() => setShow(false)}
        url={url}
        onSuccess={onSuccess}
        onError={onError}
      />
    </>
  );
};

export default RestoreData;
