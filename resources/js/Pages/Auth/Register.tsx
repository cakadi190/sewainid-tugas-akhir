import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Form, Button } from 'react-bootstrap';

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route('register'), {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  return (
    <GuestLayout>
      <Head title="Register" />

      <form onSubmit={submit}>
        <div className="mb-3">
          <Form.Floating>
            <Form.Control
              id="name"
              name="name"
              value={data.name}
              placeholder="Name"
              autoComplete="name"
              isInvalid={!!errors.name}
              onChange={(e) => setData('name', e.target.value)}
              required
            />
            <label htmlFor="name">Name</label>
            {errors.name && (
              <div className="mt-2 invalid-feedback d-block">{errors.name}</div>
            )}
          </Form.Floating>
        </div>

        <div className="mt-4 mb-3">
          <Form.Floating>
            <Form.Control
              id="email"
              type="email"
              name="email"
              value={data.email}
              placeholder="Email"
              autoComplete="username"
              isInvalid={!!errors.email}
              onChange={(e) => setData('email', e.target.value)}
              required
            />
            <label htmlFor="email">Email</label>
            {errors.email && (
              <div className="mt-2 invalid-feedback d-block">{errors.email}</div>
            )}
          </Form.Floating>
        </div>

        <div className="mt-4 mb-3">
          <Form.Floating>
            <Form.Control
              id="password"
              type="password"
              name="password"
              value={data.password}
              placeholder="Password"
              autoComplete="new-password"
              isInvalid={!!errors.password}
              onChange={(e) => setData('password', e.target.value)}
              required
            />
            <label htmlFor="password">Password</label>
            {errors.password && (
              <div className="mt-2 invalid-feedback d-block">{errors.password}</div>
            )}
          </Form.Floating>
        </div>

        <div className="mt-4 mb-3">
          <Form.Floating>
            <Form.Control
              id="password_confirmation"
              type="password"
              name="password_confirmation"
              value={data.password_confirmation}
              placeholder="Confirm Password"
              autoComplete="new-password"
              isInvalid={!!errors.password_confirmation}
              onChange={(e) => setData('password_confirmation', e.target.value)}
              required
            />
            <label htmlFor="password_confirmation">Confirm Password</label>
            {errors.password_confirmation && (
              <div className="mt-2 invalid-feedback d-block">{errors.password_confirmation}</div>
            )}
          </Form.Floating>
        </div>

        <div className="flex items-center justify-end mt-4">
          <Link
            href={route('login')}
            className="text-sm text-gray-600 underline rounded-md hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Already registered?
          </Link>

          <Button className="ms-4" type="submit" disabled={processing}>
            Register
          </Button>
        </div>
      </form>
    </GuestLayout>
  );
}
