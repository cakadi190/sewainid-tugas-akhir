import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import SeparatorText from '@/Components/SeparatorText';

export default function Login({
  status,
  canResetPassword,
}: {
  status?: string;
  canResetPassword: boolean;
}) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <GuestLayout>
      <Head title="Masuk" />

      {status && (
        <Alert variant='success'>
          {status}
        </Alert>
      )}

      <div className="mb-4 text-center">
        <h1 className='h4 fw-bold'>Selamat Datang</h1>
        <p>
          Kami sangat senang Anda berada di sini. Untuk memulai pengalaman Anda,
          silakan masuk ke akun Anda sebelum melanjutkan untuk mengelola pesanan anda.
        </p>
      </div>

      <form onSubmit={submit}>
        <Form.Floating className="mb-3">
          <Form.Control
            id="floatingInputCustom"
            type="email"
            name="email"
            placeholder="nama@contoh.com"
            value={data.email}
            autoComplete="username"
            isInvalid={!!errors.email}
            onChange={(e) => setData('email', e.target.value)}
          />
          <label htmlFor="floatingInputCustom">Alamat Email</label>
          {errors.email && (
            <div className="mt-2 invalid-feedback d-block">{errors.email}</div>
          )}
        </Form.Floating>

        <Form.Floating className="mb-3">
          <Form.Control
            id="floatingPasswordCustom"
            type="password"
            name="password"
            placeholder="Kata Sandi"
            value={data.password}
            autoComplete="current-password"
            isInvalid={!!errors.password}
            onChange={(e) => setData('password', e.target.value)}
          />
          <label htmlFor="floatingPasswordCustom">Kata Sandi</label>
          {errors.password && (
            <div className="mt-2 invalid-feedback d-block">{errors.password}</div>
          )}
        </Form.Floating>

        <div className="my-4 justify-content-between d-flex">
          <Form.Check
            type="checkbox"
            label="Ingat saya"
            id="remember-me"
            checked={data.remember}
            onChange={(e) => setData('remember', e.target.checked)}
          />

          {canResetPassword && (
            <Link
              href={route('password.request')}
              className="text-sm text-muted text-decoration-underline"
            >
              Lupa kata sandi?
            </Link>
          )}
        </div>

        <div className="gap-2 d-grid">
          <Button size='lg' className="gap-2 justify-content-center d-flex align-items-center" type="submit" disabled={processing}>
            {processing ? <Spinner size='sm' /> : (
              <>
                <FontAwesomeIcon icon={faSignInAlt} />
                <span>Masuk</span>
              </>
            )}
          </Button>

          <SeparatorText label="Atau" wrapperClassName='mb-5 mt-3' />

          <a className="btn btn-danger btn-lg" href={route("auth.google.redirect")}>Masuk dengan Google</a>

          <Link className="btn btn-link" href="/register">Mendaftar Akun Baru</Link>
        </div>
      </form>
    </GuestLayout>
  );
}

