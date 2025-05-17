import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Card, Tab, Tabs } from 'react-bootstrap';
import MainLayout from '@/Layouts/MainLayout';
import HeaderDashboardProfile from './Partials/Header';

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
      header={<HeaderDashboardProfile />}
    >
      <Head title="Profil Saya" />

      <div className="pt-4">
        <Card className="mb-4">
          <Card.Body>
            <Tabs defaultActiveKey="profile" id="profile-tabs" className="mb-3">
              {auth.user.role !== 'admin' && (
                <Tab eventKey="profile" title="Profil">
                  <UpdateProfileInformationForm
                    mustVerifyEmail={mustVerifyEmail}
                    status={status}
                  />
                </Tab>
              )}
              <Tab eventKey="password" title="Kata Sandi">
                <UpdatePasswordForm />
              </Tab>
              <Tab eventKey="delete" title="Hapus Akun">
                <DeleteUserForm />
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      </div>
    </MainLayout>
  );
}

