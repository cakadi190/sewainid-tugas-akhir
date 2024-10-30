import { Button, Form, Modal } from 'react-bootstrap';
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
    <section className={`mb-4 ${className}`}>
      <header>
        <h2 className="h5">Delete Account</h2>
        <p className="small text-muted">
          Once your account is deleted, all of its resources and data
          will be permanently deleted. Before deleting your account,
          please download any data or information that you wish to
          retain.
        </p>
      </header>

      <Button variant="danger" onClick={confirmUserDeletion}>
        Delete Account
      </Button>

      <Modal show={confirmingUserDeletion} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete your account? Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm.
          </p>
          <Form.Group>
            <Form.Label htmlFor="password">Password</Form.Label>
            <Form.Control
              id="password"
              type="password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              ref={passwordInput}
              isInvalid={!!errors.password}
              placeholder="Password"
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteUser} disabled={processing}>
            Delete Account
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}
