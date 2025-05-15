import { PropsWithChildren, ReactNode } from 'react';
import Sidebar from './parts/Admin/Sidebar';
import MainPage from './parts/Admin/MainPage';
import Navbar from './parts/Admin/Navbar';
import NavbarUserMain from './parts/User/Navbar';
import Footer from './parts/User/Footer';

/**
 * Tipe props untuk komponen Authenticated.
 *
 * @property {ReactNode} children - Konten yang akan ditampilkan dalam layout.
 * @property {ReactNode} [header] - Header yang akan ditampilkan dalam layout.
 */
type AuthenticatedProps = PropsWithChildren<{
  header?: ReactNode
}>;

/**
 * Komponen AuthenticatedUser digunakan untuk mengatur tata letak utama untuk pengguna yang telah terautentikasi.
 * Komponen ini tidak termasuk sidebar dan navbar, sehingga cocok untuk pengguna yang tidak memerlukan akses ke menu admin.
 *
 * @param {AuthenticatedProps} props - Props yang diterima oleh komponen AuthenticatedUser.
 * @param {ReactNode} props.children - Konten yang akan ditampilkan dalam layout.
 * @param {ReactNode} [props.header] - Header yang akan ditampilkan dalam layout. Opsional.
 *
 * @returns {JSX.Element} - Komponen JSX yang merepresentasikan layout untuk pengguna yang telah terautentikasi.
 */
export default function AuthenticatedUser({
  children,
  header
}: AuthenticatedProps) {
  return (
    <div className="min-vh-100">
      <NavbarUserMain />
      {header}
      <main className="container py-4">{children}</main>
      <Footer />
    </div>
  );
};

/**
 * Komponen AuthenticatedAdmin digunakan untuk mengatur tata letak utama untuk admin yang telah terautentikasi.
 * Komponen ini termasuk sidebar dan navbar, sehingga cocok untuk admin yang memerlukan akses ke menu admin.
 *
 * @param {AuthenticatedProps} props - Props yang diterima oleh komponen AuthenticatedAdmin.
 * @param {ReactNode} props.children - Konten yang akan ditampilkan dalam layout.
 * @param {ReactNode} [props.header] - Header yang akan ditampilkan dalam layout. Opsional.
 *
 * @returns {JSX.Element} - Komponen JSX yang merepresentasikan layout untuk admin yang telah terautentikasi.
 */
export function AuthenticatedAdmin({
  children,
  header
}: AuthenticatedProps) {
  return (
    <>
      <Sidebar />
      <Navbar />

      <MainPage>
        {header}
        {children}
      </MainPage>
    </>
  );
};
