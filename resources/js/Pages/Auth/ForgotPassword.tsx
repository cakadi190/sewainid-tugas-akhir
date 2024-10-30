import GuestLayout from '@/Layouts/GuestLayout';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';

export default function ForgotPassword({ status }: { status?: string }) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('password.email'));
  };

  return (
    <GuestLayout>
      <Head title="Forgot Password" />

      <div className="mb-4 text-center">
        <h1 className="h4 fw-bold">Lupa Kata Sandi?</h1>
        <p>
          Tidak masalah. Cukup beri tahu kami alamat email Anda, dan
          kami akan mengirimi Anda tautan reset kata sandi yang akan
          memungkinkan Anda memilih yang baru.
        </p>
      </div>

      {status && (
        <div className="mb-4 text-sm font-medium text-success">
          {status}
        </div>
      )}

      <form onSubmit={submit}>
        <Form.Floating className="mb-3">
          <Form.Control
            id="floatingInputCustom"
            type="email"
            name="email"
            placeholder="name@example.com"
            value={data.email}
            autoComplete="username"
            isInvalid={!!errors.email}
            onChange={(e) => setData('email', e.target.value)}
          />
          <label htmlFor="floatingInputCustom">Email address</label>
          {errors.email && (
            <div className="mt-2 invalid-feedback d-block">{errors.email}</div>
          )}
        </Form.Floating>

        <div className="gap-2 d-grid">
          <Button size='lg' className="gap-2 justify-content-center d-flex align-items-center" type="submit" disabled={processing}>
            {processing ? <Spinner size='sm' /> : (
              <>
                <FontAwesomeIcon icon={faPaperPlane} />
                <span>Kirimkan Tautannya</span>
              </>
            )}
          </Button>

          <Link className="btn btn-link" href="/login">Kembali</Link>
        </div>
      </form>
    </GuestLayout>
  );
}
