import PasswordMeter from "@/Components/PasswordMeter";
import SeparatorText from "@/Components/SeparatorText";
import GuestLayout from "@/Layouts/GuestLayout";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    gender: "",
    pbirth: "",
    dbirth: "",
    email: "",
    password: "",
    nik: "",
    kk: "",
    sim: "",
    password_confirmation: "",
    accept_terms_condition: false,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("register"), {
      onFinish: () => reset("password", "password_confirmation"),
    });
  };

  return (
    <GuestLayout>
      <Head title="Daftar" />

      <div className="mb-4 text-center">
        <h1 className="h4 fw-bold">Mendaftar</h1>
        <p>
          Kami sangat senang Anda berada di sini. Untuk memulai pengalaman Anda,
          silakan buat akun Anda untuk melanjutkan pengelolaan pesanan Anda.
        </p>
      </div>

      <div className="d-grid">
        <a
          className="btn btn-danger btn-lg"
          href={route("auth.social.redirect", "google")}
        >
          Daftar dengan Google
        </a>
      </div>

      <SeparatorText label="Atau" wrapperClassName="mb-5 mt-3" />

      <form onSubmit={submit}>
        {/* Step 1 - Personal Details */}
        <div className="mb-3">
          <Form.Floating>
            <Form.Control
              id="name"
              name="name"
              value={data.name}
              placeholder="Nama"
              autoComplete="name"
              isInvalid={!!errors.name}
              onChange={(e) => setData("name", e.target.value)}
              required
            />
            <label htmlFor="name">Nama</label>
            {errors.name && (
              <div className="mt-2 invalid-feedback d-block">{errors.name}</div>
            )}
          </Form.Floating>
        </div>

        <Row>
          <Col md="4" className="mb-3">
            <Form.Floating>
              <Form.Control
                id="pbirth"
                name="pbirth"
                value={data.pbirth}
                placeholder="Tanggal Lahir"
                autoComplete="pbirth"
                isInvalid={!!errors.pbirth}
                onChange={(e) => setData("pbirth", e.target.value)}
                required
              />
              <label htmlFor="pbirth">Tempat Lahir</label>
              {errors.pbirth && (
                <div className="mt-2 invalid-feedback d-block">
                  {errors.pbirth}
                </div>
              )}
            </Form.Floating>
          </Col>

          <Col md="8" className="mb-3">
            <Form.Floating>
              <Form.Control
                id="dbirth"
                name="dbirth"
                value={data.dbirth}
                placeholder="Tanggal Lahir"
                autoComplete="dbirth"
                isInvalid={!!errors.dbirth}
                onChange={(e) => setData("dbirth", e.target.value)}
                required
                type="date"
              />
              <label htmlFor="dbirth">Tanggal Lahir</label>
              {errors.dbirth && (
                <div className="mt-2 invalid-feedback d-block">
                  {errors.dbirth}
                </div>
              )}
            </Form.Floating>
          </Col>
        </Row>

        <div className="mb-3">
          <Form.Floating>
            <Form.Select
              id="gender"
              name="gender"
              value={data.gender}
              autoComplete="gender"
              isInvalid={!!errors.gender}
              onChange={(e) => setData("gender", e.target.value)}
              required
            >
              <option value="">Pilih Salah Satu</option>
              <option value="male">Pria</option>
              <option value="female">Wanita</option>
            </Form.Select>
            <label htmlFor="gender">Jenis Kelamin</label>
            {errors.gender && (
              <div className="mt-2 invalid-feedback d-block">
                {errors.gender}
              </div>
            )}
          </Form.Floating>
        </div>

        {/* Step 2 - Identification */}
        <div className="mt-4 mb-3">
          <Form.Floating>
            <Form.Control
              id="nik"
              name="nik"
              value={data.nik}
              placeholder="NIK"
              autoComplete="nik"
              isInvalid={!!errors.nik}
              onChange={(e) => setData("nik", e.target.value)}
              required
            />
            <label htmlFor="nik">NIK Anda</label>
            {errors.nik && (
              <div className="mt-2 invalid-feedback d-block">{errors.nik}</div>
            )}
          </Form.Floating>

          <Form.Text>Data anda akan aman kok, tenang.</Form.Text>
        </div>

        <div className="mt-4 mb-3">
          <Form.Floating>
            <Form.Control
              id="kk"
              name="kk"
              value={data.kk}
              placeholder="Nomor Kartu Keluarga"
              autoComplete="kk"
              isInvalid={!!errors.kk}
              onChange={(e) => setData("kk", e.target.value)}
              required
            />
            <label htmlFor="kk">Nomor KK Anda</label>
            {errors.kk && (
              <div className="mt-2 invalid-feedback d-block">{errors.kk}</div>
            )}
          </Form.Floating>

          <Form.Text>Data anda akan aman kok, tenang.</Form.Text>
        </div>

        <div className="mt-4 mb-3">
          <Form.Floating>
            <Form.Control
              id="sim"
              name="sim"
              value={data.sim}
              placeholder="Nomor SIM Anda"
              autoComplete="sim"
              isInvalid={!!errors.sim}
              onChange={(e) => setData("sim", e.target.value)}
              required
            />
            <label htmlFor="sim">Nomor SIM Anda</label>
            {errors.sim && (
              <div className="mt-2 invalid-feedback d-block">{errors.sim}</div>
            )}
          </Form.Floating>

          <Form.Text>Data anda akan aman kok, tenang.</Form.Text>
        </div>

        {/* Step 3 - Account Security */}
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
              onChange={(e) => setData("email", e.target.value)}
              required
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
              placeholder="Kata Sandi"
              autoComplete="new-password"
              isInvalid={!!errors.password}
              onChange={(e) => setData("password", e.target.value)}
              required
            />
            <label htmlFor="password">Kata Sandi</label>
            {errors.password && (
              <div className="mt-2 invalid-feedback d-block">
                {errors.password}
              </div>
            )}
          </Form.Floating>

          <PasswordMeter password={data.password} />
        </div>

        <div className="mt-4 mb-3">
          <Form.Floating>
            <Form.Control
              id="password_confirmation"
              type="password"
              name="password_confirmation"
              value={data.password_confirmation}
              placeholder="Konfirmasi Kata Sandi"
              autoComplete="new-password"
              isInvalid={
                !!errors.password_confirmation ||
                data.password_confirmation !== data.password
              }
              onChange={(e) => setData("password_confirmation", e.target.value)}
              required
            />
            <label htmlFor="password_confirmation">Konfirmasi Kata Sandi</label>
            {errors.password_confirmation && (
              <div className="mt-2 invalid-feedback d-block">
                {errors.password_confirmation}
              </div>
            )}
            {data.password_confirmation !== data.password &&
              data.password_confirmation && (
                <div className="mt-2 invalid-feedback d-block">
                  Kata sandi anda tidak cocok!
                </div>
              )}
          </Form.Floating>
        </div>

        <div className="mt-4 mb-3">
          <Form.Check
            type="checkbox"
            label={
              <span>
                Saya setuju dengan{" "}
                <Link href="/terms">syarat dan ketentuan</Link>
              </span>
            }
            id="accept_terms_condition"
            checked={data.accept_terms_condition}
            onChange={(e) =>
              setData("accept_terms_condition", e.target.checked)
            }
            required
          />
        </div>

        <div className="gap-2 mt-4 d-grid">
          <Button
            size="lg"
            className="gap-2 justify-content-center d-flex align-items-center"
            type="submit"
            disabled={processing}
          >
            {processing ? (
              <Spinner size="sm" />
            ) : (
              <>
                <FontAwesomeIcon icon={faUserPlus} />
                <span>Daftar</span>
              </>
            )}
          </Button>

          <Link href={route("login")} className="btn btn-link">
            Sudah terdaftar?
          </Link>
        </div>
      </form>
    </GuestLayout>
  );
}
