import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';
import { Alert, Button, FloatingLabel, Form } from 'react-bootstrap';

export default function UpdatePasswordForm({
  className = '',
}: {
  className?: string;
}) {
  const passwordInput = useRef<HTMLInputElement>(null);
  const currentPasswordInput = useRef<HTMLInputElement>(null);

  const {
    data,
    setData,
    errors,
    put,
    reset,
    processing,
    recentlySuccessful,
  } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const updatePassword: FormEventHandler = (e) => {
    e.preventDefault();

    put(route('password.update'), {
      preserveScroll: true,
      onSuccess: () => reset(),
      onError: (errors) => {
        if (errors.password) {
          reset('password', 'password_confirmation');
          passwordInput.current?.focus();
        }

        if (errors.current_password) {
          reset('current_password');
          currentPasswordInput.current?.focus();
        }
      },
    });
  };

  return (
    <section className={className}>
      <header>
        <h2 className="h5">Perbarui Kata Sandi</h2>
        <p className="small text-muted">
          Pastikan akun Anda menggunakan kata sandi yang panjang dan acak untuk tetap aman.
        </p>
      </header>

      <Form onSubmit={updatePassword} className="mt-4">
        <FloatingLabel className="mb-3" controlId="current_password" label="Kata Sandi Saat Ini">
          <Form.Control
            type="password"
            ref={currentPasswordInput}
            value={data.current_password}
            onChange={(e) => setData('current_password', e.target.value)}
            isInvalid={!!errors.current_password}
            placeholder="Kata Sandi Saat Ini"
            autoComplete="current-password"
          />
          <Form.Control.Feedback type="invalid">
            {errors.current_password}
          </Form.Control.Feedback>
        </FloatingLabel>

        <FloatingLabel className="mb-3" controlId="password" label="Kata Sandi Baru">
          <Form.Control
            type="password"
            ref={passwordInput}
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            isInvalid={!!errors.password}
            placeholder="Kata Sandi Baru"
            autoComplete="new-password"
          />
          <Form.Control.Feedback type="invalid">
            {errors.password}
          </Form.Control.Feedback>
        </FloatingLabel>

        <FloatingLabel className="mb-3" controlId="password_confirmation" label="Konfirmasi Kata Sandi">
          <Form.Control
            type="password"
            value={data.password_confirmation}
            onChange={(e) => setData('password_confirmation', e.target.value)}
            isInvalid={!!errors.password_confirmation}
            placeholder="Konfirmasi Kata Sandi"
            autoComplete="new-password"
          />
          <Form.Control.Feedback type="invalid">
            {errors.password_confirmation}
          </Form.Control.Feedback>
        </FloatingLabel>

        <div className="gap-3 d-flex align-items-center">
          <Button type="submit" variant="primary" disabled={processing}>
            Simpan
          </Button>

          {recentlySuccessful && (
            <Alert variant="success" className="mb-0">
              Tersimpan.
            </Alert>
          )}
        </div>
      </Form>
    </section>
  );
}

