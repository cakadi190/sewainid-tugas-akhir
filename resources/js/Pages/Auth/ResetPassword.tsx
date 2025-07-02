import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { Button, Form } from "react-bootstrap";

export default function ResetPassword({
  token,
  email,
}: {
  token: string;
  email: string;
}) {
  const { data, setData, post, processing, errors, reset } = useForm({
    token: token,
    email: email,
    password: "",
    password_confirmation: "",
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("password.store"), {
      onFinish: () => reset("password", "password_confirmation"),
    });
  };

  return (
    <GuestLayout>
      <Head title="Reset Password" />

      <form onSubmit={submit}>
        <div className="mb-3">
          <Form.Floating>
            <Form.Control
              id="email"
              type="email"
              name="email"
              value={data.email}
              placeholder="Email"
              autoComplete="username"
              isInvalid={!!errors.email}
              onChange={(e) => setData("email", e.target.value)}
            />
            <label htmlFor="email">Email</label>
            {errors.email && (
              <div className="mt-2 invalid-feedback d-block">
                {errors.email}
              </div>
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
              onChange={(e) => setData("password", e.target.value)}
            />
            <label htmlFor="password">Password</label>
            {errors.password && (
              <div className="mt-2 invalid-feedback d-block">
                {errors.password}
              </div>
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
              onChange={(e) => setData("password_confirmation", e.target.value)}
            />
            <label htmlFor="password_confirmation">Confirm Password</label>
            {errors.password_confirmation && (
              <div className="mt-2 invalid-feedback d-block">
                {errors.password_confirmation}
              </div>
            )}
          </Form.Floating>
        </div>

        <div className="flex items-center justify-end mt-4">
          <Button className="ms-4" type="submit" disabled={processing}>
            Reset Password
          </Button>
        </div>
      </form>
    </GuestLayout>
  );
}
