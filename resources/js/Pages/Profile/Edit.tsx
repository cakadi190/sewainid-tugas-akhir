import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Container, Row, Col, Card } from 'react-bootstrap';

export default function Edit({
  mustVerifyEmail,
  status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-gray-800 h4">
          Profile
        </h2>
      }
    >
      <Head title="Profile" />

      <Container className="py-4">
        <Row className="justify-content-center">
          <Col md={8}>
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

            <Card className="mb-4">
              <Card.Body>
                <DeleteUserForm />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </AuthenticatedLayout>
  );
}
