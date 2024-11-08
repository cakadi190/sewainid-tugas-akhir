import axios from "axios";
import Database from "@/types/database";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "@inertiajs/react";
import { FormEvent, useState } from "react";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { createPortal } from "react-dom";
import { renderSwalModal } from "@/Helpers/swal";

export default function EditData({ id, onSuccess: onSuccessAction }: { id: number; onSuccess?: () => void }) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onOpen = () => setShowModal(true);
  const onClose = () => setShowModal(false);

  const { post, data: formData, setData, processing, reset, errors, clearErrors } = useForm<Omit<Database['RepairShopData'], 'deleted_at' | 'created_at' | 'id' | 'updated_at'> & { _method: string }>({
    _method: 'put',
    repair_shop_name: '',
    address: '',
    coordinate: '',
    phone: '',
    opening_time: '',
    closing_time: '',
    is_active: true,
    description: '',
  });

  const onCloseModal = () => {
    reset();
    onClose();
    clearErrors()
  };

  const submitData = (e: FormEvent) => {
    e.preventDefault();

    post(route('v1.admin.repair-shop-data.update', id), {
      forceFormData: true,
      onSuccess() {
        reset();
        onClose();
        onSuccessAction?.();
      },
      onError(error) {
        // Display error message using SweetAlert
        renderSwalModal('error', {
          title: 'Kesalahan!',
          // @ts-ignore
          text: error.response?.data?.error || 'Terjadi kesalahan!',
        })
      }
    });
  };

  const onClickModal = () => {
    setLoading(true);

    axios.get(route('v1.admin.repair-shop-data.show', id))
      .then((result) => {
        const { data } = result.data;
        onOpen();

        setData({
          _method: 'put',
          repair_shop_name: data.repair_shop_name,
          address: data.address,
          coordinate: data.coordinate,
          phone: data.phone,
          opening_time: data.opening_time,
          closing_time: data.closing_time,
          is_active: data.is_active,
          description: data.description,
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Button
        variant="success"
        style={{ height: '32px', width: '32px' }}
        className="d-flex justify-content-center align-items-center"
        size="sm"
        onClick={onClickModal}
      >
        {(loading || processing) ? <Spinner size="sm" /> : <FontAwesomeIcon icon={faPencilAlt} />}
      </Button>

      {createPortal((
        <Modal show={showModal} size="lg" onHide={onCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title as="h5">Edit Data</Modal.Title>
        </Modal.Header>
          <Modal.Body>
            <form onSubmit={submitData}>
              <div className="mb-3 form-group">
                <Form.Floating>
                  <Form.Control
                    type="text"
                    placeholder="Nama"
                    value={formData.repair_shop_name}
                    onChange={(e) => setData("repair_shop_name", e.target.value)}
                    isInvalid={!!errors.repair_shop_name}
                  />
                  <Form.Label>Nama</Form.Label>
                  <Form.Text>Untuk identifikasi bengkelnya biar mudah dicari.</Form.Text>
                  <Form.Control.Feedback type="invalid">{errors.repair_shop_name}</Form.Control.Feedback>
                </Form.Floating>
              </div>

              <div className="mb-3 form-group">
                <Form.Floating>
                  <Form.Control
                    type="text"
                    placeholder="Alamat"
                    value={formData.address}
                    onChange={(e) => setData("address", e.target.value)}
                    isInvalid={!!errors.address}
                  />
                  <Form.Label>Alamat</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                </Form.Floating>
              </div>

              <div className="mb-3 form-group">
                <Form.Floating>
                  <Form.Control
                    type="text"
                    placeholder="Koordinat"
                    value={formData.coordinate}
                    onChange={(e) => setData("coordinate", e.target.value)}
                    isInvalid={!!errors.coordinate}
                  />
                  <Form.Label>Koordinat</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.coordinate}</Form.Control.Feedback>
                </Form.Floating>
              </div>

              <div className="mb-3 form-group">
                <Form.Floating>
                  <Form.Control
                    type="text"
                    placeholder="Telepon"
                    value={formData.phone}
                    onChange={(e) => setData("phone", e.target.value)}
                    isInvalid={!!errors.phone}
                  />
                  <Form.Label>Telepon</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                </Form.Floating>
              </div>

              <Row className="mb-3">
                <Col md="6">
                  <Form.Floating>
                    <Form.Control
                      type="time"
                      placeholder="Waktu Buka"
                      value={formData.opening_time}
                      onChange={(e) => setData("opening_time", e.target.value)}
                      isInvalid={!!errors.opening_time}
                    />
                    <Form.Label>Waktu Buka</Form.Label>
                    <Form.Control.Feedback type="invalid">{errors.opening_time}</Form.Control.Feedback>
                  </Form.Floating>
                </Col>

                <Col md="6">
                  <Form.Floating>
                    <Form.Control
                      type="time"
                      placeholder="Waktu Tutup"
                      value={formData.closing_time}
                      onChange={(e) => setData("closing_time", e.target.value)}
                      isInvalid={!!errors.closing_time}
                    />
                    <Form.Label>Waktu Tutup</Form.Label>
                    <Form.Control.Feedback type="invalid">{errors.closing_time}</Form.Control.Feedback>
                  </Form.Floating>
                </Col>
              </Row>

              <div className="mb-3 form-group">
                <Form.Check
                  type="switch"
                  label="Aktif"
                  checked={formData.is_active}
                  onChange={(e) => setData("is_active", e.target.checked)}
                />
              </div>

              <div className="mb-3 form-group">
                <Form.Floating>
                  <Form.Control
                    as="textarea"
                    placeholder="Deskripsi"
                    value={String(formData.description || '')}
                    onChange={(e) => setData("description", e.target.value)}
                    style={{ height: '100px' }}
                    isInvalid={!!errors.description}
                  />
                  <Form.Label>Deskripsi</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                </Form.Floating>
              </div>

              <Button variant="primary" className="d-none" disabled={processing} onClick={submitData}>
                {processing ? <Spinner size="sm" /> : "Tambah"}
              </Button>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" disabled={processing} onClick={onCloseModal}>
              Tutup
            </Button>
            <Button variant="primary" disabled={processing} onClick={submitData}>
              {processing ? <Spinner size="sm" /> : "Perbarui"}
            </Button>
          </Modal.Footer>
        </Modal>
      ), document.body)}
    </>
  );
}
