import { useState, FormEvent } from "react";
import { Button, Modal, Form, Spinner, Row, Col } from "react-bootstrap";
import { useForm } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { createPortal } from "react-dom";
import { renderSwalModal } from "@/Helpers/swal";
import Database from "@/types/database";

export default function CreateGarageData({ onSuccess: onSuccessAction }: { onSuccess?: () => void }) {
  const [showModal, setShowModal] = useState<boolean>(false);

  const { data: formData, setData, post, processing, reset, errors, clearErrors } = useForm<Omit<Database['GarageData'], 'deleted_at' | 'created_at' | 'id' | 'updated_at'>>({
    garage_name: '',
    address: '',
    coordinate: '',
    capacity: 0,
    phone: '',
    opening_time: '',
    closing_time: '',
    is_active: true,
    description: '',
  });

  const onOpen = () => setShowModal(true);
  const onClose = () => {
    setShowModal(false);
    reset();
    clearErrors();
  };

  const submitData = (e: FormEvent) => {
    e.preventDefault();

    post(route('v1.admin.garage-data.store'), {
      forceFormData: true,
      onSuccess() {
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

  return (
    <div className="my-auto">
      <Button className="gap-2 align-items-center d-flex" onClick={onOpen}>
        <FontAwesomeIcon icon={faPlusCircle} />
        <span className="d-none d-md-none d-lg-inline-flex">Tambah Data</span>
      </Button>

      {createPortal((
        <Modal show={showModal} size="lg" onHide={onClose}>
          <Modal.Header closeButton>
            <Modal.Title as="h5">Tambah Data Baru</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={submitData}>
              <div className="mb-3 form-group">
                <Form.Floating>
                  <Form.Control
                    type="text"
                    placeholder="Nama"
                    value={formData.garage_name}
                    onChange={(e) => setData("garage_name", e.target.value)}
                    isInvalid={!!errors.garage_name}
                  />
                  <Form.Label>Nama</Form.Label>
                  <Form.Text>Untuk identifikasi garasinya biar mudah dicari.</Form.Text>
                  <Form.Control.Feedback type="invalid">{errors.garage_name}</Form.Control.Feedback>
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
                    type="number"
                    placeholder="Kapasitas Kendaraan"
                    value={formData.capacity || ''}
                    onChange={(e) => setData("capacity", e.target.value ? parseInt(e.target.value) : 0)}
                    isInvalid={!!errors.capacity}
                  />
                  <Form.Label>Kapasitas Kendaraan</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.capacity}</Form.Control.Feedback>
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
                  readOnly
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
                    value={formData.description}
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
            <Button variant="secondary" disabled={processing} onClick={onClose}>
              Tutup
            </Button>
            <Button variant="primary" disabled={processing} onClick={submitData}>
              {processing ? <Spinner size="sm" /> : "Tambah"}
            </Button>
          </Modal.Footer>
        </Modal>
      ), document.body)}
    </div>
  );
}
