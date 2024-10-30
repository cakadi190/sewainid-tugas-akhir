import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from 'react-bootstrap';

export default function VerifyEmail({ status }: { status?: string }) {
  const { post, processing } = useForm({});

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('verification.send'));
  };

  return (
    <GuestLayout>
      <Head title="Email Verification" />

      <div className="mb-4 text-sm text-gray-600">
        Thanks for signing up! Before getting started, could you verify
        your email address by clicking on the link we just emailed to
        you? If you didn't receive the email, we will gladly send you
        another.
      </div>

      {status === 'verification-link-sent' && (
        <div className="mb-4 text-sm font-medium text-success">
          A new verification link has been sent to the email address
          you provided during registration.
        </div>
      )}

      <form onSubmit={submit}>
        <div className="mt-4 d-flex justify-content-between">
          <Button
            type="submit"
            disabled={processing}
            className="me-2"
          >
            Resend Verification Email
          </Button>

          <Link
            href={route('logout')}
            method="post"
            as="button"
            className="btn btn-link text-gray-600 text-decoration-underline hover:text-gray-900"
          >
            Log Out
          </Link>
        </div>
      </form>
    </GuestLayout>
  );
}
