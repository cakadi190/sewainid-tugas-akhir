import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Form, Button } from 'react-bootstrap';

export default function ConfirmPassword() {
  const { data, setData, post, processing, errors, reset } = useForm({
    password: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route('password.confirm'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <GuestLayout>
      <Head title="Confirm Password" />

      <div className="mb-4 text-center">
        <h1 className="h4">Konfirmasi Kata Sandi</h1>
        <p className="text-sm text-gray-600">
          Ini adalah area yang aman dari aplikasi. Silakan konfirmasi kata sandi Anda sebelum melanjutkan.
        </p>
      </div>

      <form onSubmit={submit}>
        <Form.Floating className="mb-3">
          <Form.Control
            id="floatingPasswordCustom"
            type="password"
            name="password"
            placeholder="Password"
            value={data.password}
            autoComplete="current-password"
            isInvalid={!!errors.password}
            onChange={(e) => setData('password', e.target.value)}
          />
          <label htmlFor="floatingPasswordCustom">Password</label>
          {errors.password && (
            <div className="mt-2 invalid-feedback d-block">{errors.password}</div>
          )}
        </Form.Floating>

        <div className="d-grid">
          <Button type="submit" disabled={processing}>
            Konfirmasi
          </Button>
        </div>
      </form>
    </GuestLayout>
  );
}
