/**
 * @fileoverview Komponen untuk menangani aksi keamanan dengan konfirmasi kata sandi
 * @module SecurityAction
 */

import { ChangeEvent, FC, useState } from 'react';
import { Button, Modal, Spinner, Form } from 'react-bootstrap';
import { useForm } from '@inertiajs/react';

/**
 * Komponen modal konfirmasi untuk meminta kata sandi
 * @component
 * @param {Object} props - Props komponen
 * @param {boolean} props.isOpen - Status tampilan modal
 * @param {Function} props.onClose - Handler ketika modal ditutup
 * @param {Function} props.onConfirm - Handler ketika konfirmasi diterima
 * @param {boolean} [props.isLoading=false] - Status loading
 * @returns {JSX.Element} Komponen modal konfirmasi
 */
const ConfirmationModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
  isLoading?: boolean;
}> = ({ isOpen, onClose, onConfirm, isLoading = false }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  return (
    <Modal backdrop="static" keyboard={false} show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Konfirmasikan Aksi</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="password">
          <Form.Label>Masukkan Kata Sandi</Form.Label>
          <Form.Control
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handlePasswordChange}
            placeholder="Kata sandi"
          />
          <Button variant="link" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? 'Sembunyikan' : 'Lihat'} Kata Sandi
          </Button>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Batal</Button>
        <Button variant="danger" onClick={() => onConfirm(password)} disabled={isLoading}>
          {isLoading ? <Spinner animation="border" size="sm" /> : 'Konfirmasi'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

/**
 * Komponen utama untuk membuka aksi yang memerlukan keamanan
 * @component
 * @param {Object} props - Props komponen
 * @param {number} props.id - ID data yang akan diproses
 * @param {string} props.dataTarget - Target data yang akan diproses
 * @param {Function} [props.onSuccess] - Handler ketika aksi berhasil
 * @param {Function} [props.onError] - Handler ketika terjadi kesalahan
 * @returns {JSX.Element} Komponen SecurityOpen
 */
const SecurityOpen: FC<{
  id: number;
  dataTarget: string;
  onSuccess?: () => void;
  onError?: () => void;
}> = ({ id, dataTarget, onSuccess, onError }) => {
  const { reset, setData, post, processing, errors } = useForm({
    password: '',
    dataId: id,
    dataTarget,
  });
  const [modalOpen, setModalOpen] = useState(false);

  const handleConfirm = (password: string) => {
    setData('password', password);
    post(route('v1.dashboard.security.open'), {
      onSuccess: () => {
        setModalOpen(false);
        reset();
        if (onSuccess) onSuccess();
      },
      onError: () => {
        if (onError) onError();
        alert('Gagal melakukan aksi, periksa kembali kata sandi Anda.');
      },
    });
  };

  return (
    <>
      <Button variant="link" onClick={() => setModalOpen(true)}>
        <i className="fas fa-eye" />
      </Button>

      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
        isLoading={processing}
      />
    </>
  );
};

export default SecurityOpen;
