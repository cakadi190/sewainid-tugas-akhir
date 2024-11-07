import axios from "axios";
import Database from "@/types/database";
import GarageIcon from "@/Assets/Icon/garage.png";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { createPortal } from "react-dom";
import { LeafletSingle } from "@/Components/LeafletMap";

export default function Show({ id }: { id: number }) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [position, setPosition] = useState<[number, number]>([0, 0]);

  const onOpen = () => setShowModal(true);
  const onClose = () => setShowModal(false);

  const { data: formData, setData, processing, reset, errors, clearErrors } = useForm<Omit<Database['GarageData'], 'deleted_at' | 'created_at' | 'id' | 'updated_at'>>({
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

  useEffect(() => {
    if (formData.coordinate) {
      const [lat, lng] = formData.coordinate.split(',').map(Number);
      setPosition([lat, lng]);
    }
  }, [formData.coordinate]);

  const onCloseModal = () => {
    reset();
    onClose();
    clearErrors();
  };

  const onClickModal = () => {
    setLoading(true);

    axios.get(route('v1.admin.garage-data.show', id))
      .then((result) => {
        const { data } = result.data;
        onOpen();

        setData({
          garage_name: data.garage_name,
          address: data.address,
          coordinate: data.coordinate,
          capacity: data.capacity,
          phone: data.phone,
          opening_time: data.opening_time,
          closing_time: data.closing_time,
          is_active: data.is_active,
          description: data.description,
        });

        if (data.coordinate) {
          const [lat, lng] = data.coordinate.split(',').map(Number);
          setPosition([lat, lng]);
        }
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
            <Modal.Title as="h5">Lihat Data</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-3 form-group">
                <Form.Floating>
                  <Form.Control
                    type="text"
                    placeholder="Nama"
                    readOnly
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
                <Form.Floating className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Alamat"
                    readOnly
                    value={formData.address}
                    onChange={(e) => setData("address", e.target.value)}
                    isInvalid={!!errors.address}
                  />
                  <Form.Label>Alamat</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                </Form.Floating>

                <LeafletSingle
                  iconUrl={GarageIcon}
                  iconRetinaUrl={GarageIcon}
                  shadowUrl=""
                  position={position}
                  name={formData.garage_name}
                  address={formData.address}
                />
              </div>

              <div className="mb-3 form-group">
                <Form.Floating>
                  <Form.Control
                    type="number"
                    placeholder="Kapasitas Kendaraan"
                    readOnly
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
                    readOnly
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
                      readOnly
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
                      readOnly
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
                    readOnly
                    value={formData.description}
                    onChange={(e) => setData("description", e.target.value)}
                    style={{ height: '100px' }}
                    isInvalid={!!errors.description}
                  />
                  <Form.Label>Deskripsi</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                </Form.Floating>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" disabled={processing} onClick={onCloseModal}>
              Tutup
            </Button>
          </Modal.Footer>
        </Modal>
      ), document.body)}
    </>
  );
}
