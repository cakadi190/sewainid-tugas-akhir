import axios from "axios";
import Database from "@/types/database";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "@inertiajs/react";
import { useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { createPortal } from "react-dom";
import { MediaLibrary } from "@/types/medialibrary";
import { CarRepairNoteStatusEnum } from "@/types/enum";

export default function Show({ id }: { id: string }) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [galleryData, setGalleryData] = useState<MediaLibrary[] | null | undefined>(null);
  const [carData, setCarData] = useState<{ car_name: string } | null>(null);

  const onOpen = () => setShowModal(true);
  const onClose = () => setShowModal(false);

  const { data: formData, setData, processing, reset, clearErrors } = useForm<Omit<Database['CarRepairNoteData'], 'created_at' | 'id' | 'updated_at'> & { gallery: File[]; _method: string }>({
    _method: 'put',
    repair_date: '',
    description: '',
    cost: 0,
    status: CarRepairNoteStatusEnum.PENDING,
    notes: '',
    car_data_id: 0,
    gallery: []
  });

  const onCloseModal = () => {
    reset();
    onClose();
    clearErrors()
  };

  const onClickModal = () => {
    setLoading(true);

    axios.get(route('v1.admin.car-repair.show', id))
      .then((result) => {
        const { data } = result.data;
        onOpen();

        setGalleryData(data.gallery);
        setCarData(data.car_data);

        setData({
          _method: 'PUT',
          repair_date: data.repair_date,
          description: data.description,
          cost: data.cost,
          status: data.status,
          notes: data.notes,
          car_data_id: data.car_data_id,
          gallery: []
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Button
        variant="primary"
        style={{ height: '32px', width: '32px' }}
        className="d-flex justify-content-center align-items-center"
        size="sm"
        onClick={onClickModal}
      >
        {(loading || processing) ? <Spinner size="sm" /> : <FontAwesomeIcon icon={faEye} />}
      </Button>

      {createPortal((
        <Modal show={showModal} size="lg" onHide={onCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title as="h5">Detail Catatan Perbaikan</Modal.Title>
          </Modal.Header>
          <Modal.Body></Modal.Body>
        </Modal>
      ), document.body)}
    </>
  );
}
