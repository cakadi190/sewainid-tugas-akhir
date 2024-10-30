import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import SeparatorText from '@/Components/SeparatorText';

export default function VerifikasiEmail({ status }: { status?: string }) {
  const { post, processing } = useForm({});

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('verification.send'));
  };

  return (
    <GuestLayout>
      <Head title="Verifikasi Email" />

      <Row>
        <Col>
          <div className="mb-3 text-sm text-gray-600">
            Terima kasih telah mendaftar! Sebelum memulai, bisakah Anda
            memverifikasi alamat email Anda dengan mengklik tautan yang baru
            saja kami kirimkan ke email Anda? Jika Anda tidak menerima email
            tersebut, kami dengan senang hati akan mengirimkan yang baru.
          </div>

          {status === 'verification-link-sent' && (
            <Alert variant="success" className="mb-3">
              Tautan verifikasi baru telah dikirimkan ke alamat email
              yang Anda berikan saat pendaftaran.
            </Alert>
          )}

          <form onSubmit={submit}>
            <div className="mt-4 d-flex justify-content-between">
              <Button
                type="submit"
                disabled={processing}
                className="gap-2 justify-content-center d-flex align-items-center me-2"
              >
                {processing ? <Spinner size='sm' /> : (
                  <>
                    <FontAwesomeIcon icon={faSignInAlt} />
                    <span>Kirim Ulang</span>
                  </>
                )}
              </Button>

              <Link
                href={route('logout')}
                method="post"
                as="button"
                className="btn btn-link"
              >
                Keluar
              </Link>
            </div>
          </form>
        </Col>
      </Row>
    </GuestLayout>
  );
}
