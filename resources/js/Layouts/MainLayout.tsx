import { ReactNode } from 'react';
import Authenticated, { AuthenticatedAdmin } from './AuthenticatedLayout';

type MainProps = {
  children: ReactNode;
  header?: ReactNode;
  isAdmin: boolean;
};

export default function MainComponent({ children, header, isAdmin }: MainProps) {
  return (
    <>
      {isAdmin ? (
        <AuthenticatedAdmin header={header}>
          {children}
        </AuthenticatedAdmin>
      ) : (
        <Authenticated header={header}>
          {children}
        </Authenticated>
      )}
    </>
  );
}
