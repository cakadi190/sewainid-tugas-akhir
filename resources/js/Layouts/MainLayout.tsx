import { ReactNode } from "react";
import Authenticated, { AuthenticatedAdmin } from "./AuthenticatedLayout";

/**
 * Tipe props untuk komponen MainLayout.
 *
 * @property {ReactNode} children - Konten yang akan ditampilkan dalam layout.
 * @property {ReactNode} [header] - Header yang akan ditampilkan dalam layout. Opsional.
 * @property {boolean} isAdmin - Status admin untuk menentukan layout mana yang akan digunakan.
 */
type MainProps = {
  children: ReactNode;
  header?: ReactNode;
  isAdmin: boolean;
};

/**
 * Komponen MainLayout digunakan untuk mengatur tata letak utama aplikasi.
 * Komponen ini dapat digunakan untuk menampilkan konten yang berbeda berdasarkan
 * status admin atau non-admin.
 *
 * @param {MainProps} props - Props yang diterima oleh komponen MainLayout.
 * @param {ReactNode} props.children - Konten yang akan ditampilkan dalam layout.
 * @param {ReactNode} [props.header] - Header yang akan ditampilkan dalam layout. Opsional.
 * @param {boolean} props.isAdmin - Status admin untuk menentukan layout mana yang akan digunakan.
 *
 * @returns {JSX.Element} - Komponen JSX yang merepresentasikan layout utama.
 */
export default function MainLayout({ children, header, isAdmin }: MainProps) {
  return (
    <>
      {isAdmin ? (
        <AuthenticatedAdmin header={header}>{children}</AuthenticatedAdmin>
      ) : (
        <Authenticated header={header}>{children}</Authenticated>
      )}
    </>
  );
}
