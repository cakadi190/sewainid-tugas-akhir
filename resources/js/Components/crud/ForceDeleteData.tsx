/**
 * @fileoverview Komponen untuk menangani penghapusan data secara paksa (force delete)
 * @module ForceDeleteData
 */

import { FC, useState } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { router } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';

/**
 * Komponen Button yang telah di-style dengan emotion
 * @component
 */
const ButtonComponent = styled(Button)`
  width: fit-content;
  margin: 0;

  @media (width <= 992px) {
    width: 100%;
  }
`

/**
 * Komponen untuk menampilkan konfirmasi penghapusan
 * @component
 * @param {Object} props - Props komponen
 * @param {boolean} props.isDeleting - Status proses penghapusan
 * @param {Function} props.onConfirm - Handler ketika konfirmasi diterima
 * @param {Function} props.onCancel - Handler ketika konfirmasi dibatalkan
 */
const ForceDeleteConfirmation: FC<{
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ isDeleting, onConfirm, onCancel }) => (
  <>
    <Modal.Body className="gap-4 p-4 flex-column flex-lg-row d-flex">
      <div className="mx-auto mx-lg-0">
        <div className="p-3 bg-opacity-25 text-danger bg-danger rounded-circle">
          <FontAwesomeIcon icon={faExclamationTriangle} className="fa-2x" />
        </div>
      </div>
      <div className="text-center flex-column text-lg-start d-flex">
        <h2 className="fs-4">Konfirmasi Penghapusan Paksa</h2>
        <p className="m-0">Apakah Anda yakin akan menghapus data ini secara permanen? Aksi ini tidak dapat dibatalkan.</p>
      </div>
    </Modal.Body>
    <Modal.Footer className="gap-2 flex-column-reverse flex-lg-row">
      <ButtonComponent variant="secondary" onClick={onCancel}>Batal</ButtonComponent>
      <ButtonComponent variant="danger" onClick={onConfirm} disabled={isDeleting}>
        {isDeleting ? <Spinner animation="border" size="sm" /> : 'Hapus'}
      </ButtonComponent>
    </Modal.Footer>
  </>
);

/**
 * Komponen modal untuk proses penghapusan paksa
 * @component
 * @param {Object} props - Props komponen
 * @param {boolean} props.show - Status tampilan modal
 * @param {string} props.url - URL endpoint untuk penghapusan
 * @param {Function} props.onClose - Handler ketika modal ditutup
 * @param {Function} [props.onSuccess] - Handler opsional ketika penghapusan berhasil
 * @param {Function} [props.onError] - Handler opsional ketika penghapusan gagal
 */
const ForceDeleteModal: FC<{
  show: boolean;
  url: string;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: () => void;
}> = ({ show, url, onClose, onSuccess, onError }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    router.delete(`${url}?forceDelete=true`, {
      onFinish: () => {
        setIsDeleting(false);
        onClose();
        if (onSuccess) onSuccess();
      },
      onError: () => {
        setIsDeleting(false);
        if (onError) onError();
      },
    });
  };

  return (
    <Modal backdrop="static" keyboard={false} show={show} onHide={onClose} centered>
      <ForceDeleteConfirmation
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onCancel={onClose}
      />
    </Modal>
  );
};

/**
 * Komponen utama untuk menangani penghapusan data secara paksa
 * @component
 * @param {Object} props - Props komponen
 * @param {string} props.url - URL endpoint untuk penghapusan
 * @param {Function} [props.onSuccess] - Handler opsional ketika penghapusan berhasil
 * @param {Function} [props.onError] - Handler opsional ketika penghapusan gagal
 */
const ForceDeleteData: FC<{
  url: string;
  onSuccess?: () => void;
  onError?: () => void;
}> = ({ url, onSuccess, onError }) => {
  const [show, setShow] = useState(false);

  const toggleModal = () => setShow(!show);

  return (
    <>
      <Button variant="danger" size="sm" onClick={toggleModal}>
        <FontAwesomeIcon icon={faExclamationTriangle} />
      </Button>

      <ForceDeleteModal
        show={show}
        onClose={() => setShow(false)}
        url={url}
        onSuccess={onSuccess}
        onError={onError}
      />
    </>
  );
};

export default ForceDeleteData;
