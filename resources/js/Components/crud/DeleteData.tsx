import { useState, useCallback, useEffect, FC, ChangeEvent } from 'react';
import { router } from '@inertiajs/react';
import { Modal, Button, Spinner, Form } from 'react-bootstrap';
import { buildQueryString } from '@/Helpers/url';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';

/**
 * A custom hook that manages a URL with query parameters.
 */
const useUrlWithParams = (baseUrl: string) => {
  const [params, setParams] = useState<Record<string, string | boolean>>({});

  const updateParam = useCallback((key: string, value: string | boolean) => {
    setParams((prevParams) => ({
      ...prevParams,
      [key]: value,
    }));
  }, []);

  const [fullUrl, setFullUrl] = useState(baseUrl);

  useEffect(() => {
    const queryString = buildQueryString(params);
    setFullUrl(`${baseUrl}${queryString}`);
  }, [baseUrl, params]);

  return { fullUrl, updateParam };
};

const ButtonComponent = styled(Button)`
width: fit-content;
margin: 0;

@media (width <= 992px) {
  width: 100%;
}`

/**
 * DeleteConfirmation component - A confirmation dialog for delete actions.
 */
const DeleteConfirmation: FC<{
  isDeleting: boolean;
  withForceDeleteCheckbox?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  forceDeleteAction: (event: ChangeEvent<HTMLInputElement>) => void;
}> = ({
  isDeleting,
  onConfirm,
  onCancel,
  forceDeleteAction,
  withForceDeleteCheckbox,
}) => (
    <>
      <Modal.Body>
        <div className="gap-4 flex-column flex-lg-row d-flex">
          <div className="mx-auto mx-lg-0">
            <div className="flex-shrink-0 bg-opacity-25 text-danger bg-danger rounded-circle d-flex align-items-center justify-content-center" style={{ width: '5rem', height: '5rem' }}>
              <FontAwesomeIcon icon={faTrash} size='2x' />
            </div>
          </div>
          <div className="text-center flex-column text-lg-start d-flex">
            <h5>Konfirmasi Penghapusan</h5>
            <p className="mb-0">
              Apakah Anda yakin akan menghapus data ini?
              {withForceDeleteCheckbox
                ? ' Anda dapat mengembalikan datanya pada bagian tempat sampah.'
                : ' Aksi ini tidak dapat dibatalkan.'}
            </p>

            {withForceDeleteCheckbox && (
              <Form.Check
                type="checkbox"
                id="force-delete"
                label="Lewati Tong Sampah"
                onChange={forceDeleteAction}
                className="mx-auto mt-2 mx-lg-0"
              />
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="gap-2 flex-column-reverse flex-lg-row">
        <ButtonComponent variant="secondary" onClick={onCancel}>
          Batal
        </ButtonComponent>
        <ButtonComponent variant="danger" onClick={onConfirm} disabled={isDeleting}>
          {isDeleting ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="me-2"
            />
          ) : (
            'Hapus'
          )}
        </ButtonComponent>
      </Modal.Footer>
    </>
  );

/**
 * DeleteModal component - A modal dialog for delete confirmations.
 */
const DeleteModal: FC<{
  show: boolean;
  url: string;
  onClose: () => void;
  withForceDeleteCheckbox?: boolean;
  onSuccess?: () => void;
  onError?: () => void;
}> = ({ show, url, onClose, onSuccess, onError, withForceDeleteCheckbox }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { fullUrl, updateParam } = useUrlWithParams(url);

  const handleForceDeleteChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateParam('forceDelete', event.target.checked);
  };

  const handleDelete = () => {
    setIsDeleting(true);
    router.delete(fullUrl, {
      onFinish: () => {
        setIsDeleting(false);
        if (onSuccess) onSuccess();
        onClose();
      },
      onError: (errors) => {
        setIsDeleting(false);
        console.error('Error occurred while deleting:', errors);
        if (onError) onError();
      },
    });
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <DeleteConfirmation
        withForceDeleteCheckbox={withForceDeleteCheckbox}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onCancel={onClose}
        forceDeleteAction={handleForceDeleteChange}
      />
    </Modal>
  );
};

/**
 * DeleteData component - A button that triggers the delete modal.
 */
const DeleteData: FC<{
  url: string;
  onSuccess?: () => void;
  onError?: () => void;
  withForceDeleteCheckbox?: boolean;
}> = ({ url, onSuccess, onError, withForceDeleteCheckbox }): JSX.Element => {
  const [show, setShow] = useState(false);

  const toggleModal = () => setShow(!show);
  const closeModal = () => setShow(false);

  return (
    <>
      <Button
        variant="danger"
        className="p-2 d-flex align-items-center justify-content-center"
        style={{ aspectRatio: '1/1' }}
        size="sm"
        onClick={toggleModal}
      >
        <FontAwesomeIcon icon={faTrash} />
      </Button>

      <DeleteModal
        show={show}
        withForceDeleteCheckbox={withForceDeleteCheckbox}
        onClose={closeModal}
        url={url}
        onSuccess={onSuccess}
        onError={onError}
      />
    </>
  );
};

DeleteData.displayName = 'DeleteData';

export default DeleteData;
