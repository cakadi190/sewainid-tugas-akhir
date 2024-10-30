import { Button, Form, Alert } from 'react-bootstrap';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { PageProps } from '@/types';

export default function UpdateProfileInformation({
  mustVerifyEmail,
  status,
  className = '',
}: {
  mustVerifyEmail: boolean;
  status?: string;
  className?: string;
}) {
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
        <h2 className="h5">Profile Information</h2>
        <p className="small text-muted">
          Update your account's profile information and email address.
        </p>
      </header>

      <Form onSubmit={submit} className="mt-4">
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            required
            isInvalid={!!errors.name}
            placeholder="Name"
            autoComplete="name"
          />
          <Form.Control.Feedback type="invalid">
            {errors.name}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
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
        </Form.Group>

        {mustVerifyEmail && user.email_verified_at === null && (
          <div className="mt-2">
            <p className="small text-muted">
              Your email address is unverified.
              <Link
                href={route('verification.send')}
                method="post"
                as="button"
                className="p-0 btn btn-link text-muted"
              >
                Click here to re-send the verification email.
              </Link>
            </p>

            {status === 'verification-link-sent' && (
              <Alert variant="success" className="mt-2">
                A new verification link has been sent to your email address.
              </Alert>
            )}
          </div>
        )}

        <div className="gap-3 mt-4 d-flex align-items-center">
          <Button type="submit" variant="primary" disabled={processing}>
            Save
          </Button>

          {recentlySuccessful && (
            <Alert variant="success" className="mb-0">
              Saved.
            </Alert>
          )}
        </div>
      </Form>
    </section>
  );
}
