import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Card } from 'react-bootstrap';
import MainLayout from '@/Layouts/MainLayout';

/**
 * Komponen ini digunakan untuk mengedit profil pengguna.
 * Ini termasuk dalam halaman profil.
 *
 * @param {Object} props - Properti yang diterima oleh komponen ini.
 * @param {boolean} props.mustVerifyEmail - Menentukan apakah email harus diverifikasi.
 * @param {string} props.status - Status pengguna.
 * @returns {JSX.Element} - Komponen halaman edit profil.
 */
export default function Edit({
  mustVerifyEmail,
  status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
  const { auth } = usePage<PageProps>().props;

  return (
    <MainLayout
      isAdmin={auth.user.role === 'admin'}
      header={
        <h2 className="text-gray-800 h4">
          Profile
        </h2>
      }
    >
      <Head title="Profile" />

      <div className="pt-4">
        <Card className="mb-4">
          <Card.Body>
            <UpdateProfileInformationForm
              mustVerifyEmail={mustVerifyEmail}
              status={status}
            />
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Body>
            <UpdatePasswordForm />
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <DeleteUserForm />
          </Card.Body>
        </Card>
      </div>
    </MainLayout>
  );
}
