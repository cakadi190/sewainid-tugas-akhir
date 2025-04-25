import { Button, Form, Alert, FormFloating } from 'react-bootstrap';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { PageProps } from '@/types';

type UpdateProfileInformationTypes = {
  mustVerifyEmail: boolean;
  status?: string;
  className?: string;
};

export default function UpdateProfileInformation({
  mustVerifyEmail,
  status,
  className = '',
}: UpdateProfileInformationTypes) {
  const user = usePage<PageProps>().props.auth.user;

  const { data, setData, patch, errors, processing, recentlySuccessful } =
    useForm({
      name: user.name,
      email: user.email,
    });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    patch(route('profile.update'));
  };

  return (
    <section className={className}>
      <header>
        <h2 className="h5">Informasi Profil</h2>
        <p className="small text-muted">
          Perbarui informasi profil dan alamat email Anda.
        </p>
      </header>

      <Form onSubmit={submit} className="mt-4">
        <FormFloating className="mb-3">
          <Form.Control
            type="text"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            required
            isInvalid={!!errors.name}
            placeholder="name"
            autoComplete="name"
          />
          <Form.Control.Feedback type="invalid">
            {errors.name}
          </Form.Control.Feedback>
          <Form.Label>Nama Lengkap</Form.Label>
        </FormFloating>

        <FormFloating className="mb-3">
          <Form.Control
            type="email"
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
            required
            isInvalid={!!errors.email}
            placeholder="Email"
            autoComplete="username"
          />
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
          <Form.Label>Email</Form.Label>
        </FormFloating>

        {mustVerifyEmail && user.email_verified_at === null && (
          <div className="mt-2">
            <p className="small text-muted">
              Alamat email Anda belum diverifikasi.
              <Link
                href={route('verification.send')}
                method="post"
                as="button"
                className="p-0 btn btn-link text-muted"
              >
                Klik disini untuk mengirimkan email verifikasi lagi.
              </Link>
            </p>

            {status === 'verification-link-sent' && (
              <Alert variant="success" className="mt-2">
                Tautan verifikasi baru telah dikirimkan ke alamat email Anda.
              </Alert>
            )}
          </div>
        )}

        <div className="gap-3 mt-4 d-flex align-items-center">
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

