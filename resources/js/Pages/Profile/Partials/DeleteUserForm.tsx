import { Button, Form, Modal, FormFloating } from 'react-bootstrap';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

export default function DeleteUserForm({
  className = '',
}: {
  className?: string;
}) {
  const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
  const passwordInput = useRef<HTMLInputElement>(null);

  const {
    data,
    setData,
    delete: destroy,
    processing,
    reset,
    errors,
    clearErrors,
  } = useForm({
    password: '',
  });

  const confirmUserDeletion = () => {
    setConfirmingUserDeletion(true);
  };

  const deleteUser: FormEventHandler = (e) => {
    e.preventDefault();

    destroy(route('profile.destroy'), {
      preserveScroll: true,
      onSuccess: () => closeModal(),
      onError: () => passwordInput.current?.focus(),
      onFinish: () => reset(),
    });
  };

  const closeModal = () => {
    setConfirmingUserDeletion(false);
    clearErrors();
    reset();
  };

  return (
    <section className={`${className}`}>
      <header>
        <h2 className="h5">Hapus Akun</h2>
        <p className="small text-muted">
          Setelah akun Anda dihapus, semua sumber daya dan data
          akan dihapus secara permanen. Sebelum menghapus akun Anda,
          silakan unduh data atau informasi yang Anda ingin simpan.
        </p>
      </header>

      <Button variant="danger" onClick={confirmUserDeletion}>
        Hapus Akun
      </Button>

      <Modal show={confirmingUserDeletion} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Penghapusan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Apakah Anda yakin ingin menghapus akun Anda? Setelah akun Anda dihapus, semua sumber daya dan data akan dihapus secara permanen. Silakan masukkan kata sandi Anda untuk mengonfirmasi.
          </p>
          <FormFloating className="mb-3">
            <Form.Control
              id="password"
              type="password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              ref={passwordInput}
              isInvalid={!!errors.password}
              placeholder="Kata Sandi"
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
            <Form.Label>Kata Sandi</Form.Label>
          </FormFloating>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Batal
          </Button>
          <Button variant="danger" onClick={deleteUser} disabled={processing}>
            Hapus Akun
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}

