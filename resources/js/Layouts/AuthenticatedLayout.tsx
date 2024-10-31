import { PropsWithChildren, ReactNode } from 'react';
import Sidebar from './parts/Admin/Sidebar';
import MainPage from './parts/Admin/MainPage';

type AuthenticatedProps = PropsWithChildren<{
  header?: ReactNode
}>;

export default function AuthenticatedUser({
  children,
  header
}: AuthenticatedProps) {
  return (
    <div className="min-vh-100 bg-light">
      <main className="container py-4">{children}</main>
    </div>
  );
};

export function AuthenticatedAdmin({
  children,
  header
}: AuthenticatedProps) {
  return (
    <>
      <Sidebar />

      <MainPage>{children}</MainPage>
    </>
  );
};
