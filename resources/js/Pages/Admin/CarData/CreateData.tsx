import { useState, FormEvent } from "react";
import { Button, Modal, Form, Spinner, Alert } from "react-bootstrap";
import { useForm } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { createPortal } from "react-dom";
import { CarModelEnum, CarStatusEnum } from "@/types/enum";
import { getCarModelLabel, getCarStatusLabel } from "@/Helpers/EnumHelper";
import ImageUploader from "@/Components/Dropzone";
import Database from "@/types/database";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

export default function CreateData({ onSuccess: onSuccessAction }: { onSuccess?: () => void }) {
  const [showModal, setShowModal] = useState<boolean>(false);

  const { data: formData, setData, post, processing, reset, errors, clearErrors } = useForm<Omit<Database['CarData'], 'deleted_at' | 'created_at' | 'id' | 'updated_at'> & { gallery: File[] }>({
    car_name: '',
    brand: '',
    frame_number: '',
    license_plate: '',
    color: '',
    year_of_manufacture: 0,
    model: undefined,
    status: undefined,
    description: '',
    gallery: [],
  });

  const onOpen = () => setShowModal(true);
  const onClose = () => {
    setShowModal(false);
    reset();
    clearErrors();
  };

  const submitData = (e: FormEvent) => {
    e.preventDefault();

    post(route('v1.admin.car-data.store'), {
      forceFormData: true,
      onSuccess() {
        onClose();
        onSuccessAction?.();
      },
      onError(error) {
        // Display error message using SweetAlert
        withReactContent(Swal).fire({
          title: 'Error!',
          // @ts-ignore
          text: error.response?.data?.error || 'Something went wrong!',
          icon: 'error',
          confirmButtonText: 'OK'
        });
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
                    value={formData.car_name}
                    onChange={(e) => setData("name", e.target.value)}
                    isInvalid={!!errors.car_name}
                  />
                  <Form.Label>Nama</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.car_name}</Form.Control.Feedback>
                </Form.Floating>
              </div>

              <div className="mb-3 form-group">
                <Form.Floating>
                  <Form.Control
                    type="text"
                    placeholder="Brand"
                    value={formData.brand}
                    onChange={(e) => setData("brand", e.target.value)}
                    isInvalid={!!errors.brand}
                  />
                  <Form.Label>Brand / Merk</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.brand}</Form.Control.Feedback>
                </Form.Floating>
              </div>

              <div className="mb-3 form-group">
                <Form.Floating>
                  <Form.Control
                    type="text"
                    placeholder="Nomor Rangka"
                    value={formData.frame_number}
                    onChange={(e) => setData("frame_number", e.target.value)}
                    isInvalid={!!errors.frame_number}
                  />
                  <Form.Label>Nomor Rangka</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.frame_number}</Form.Control.Feedback>
                </Form.Floating>
              </div>

              <div className="mb-3 form-group">
                <Form.Floating>
                  <Form.Control
                    type="text"
                    placeholder="Plat Nomor"
                    value={formData.license_plate}
                    onChange={(e) => setData("license_plate", e.target.value)}
                    isInvalid={!!errors.license_plate}
                  />
                  <Form.Label>Plat Nomor</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.license_plate}</Form.Control.Feedback>
                </Form.Floating>
              </div>

              <div className="mb-3 form-group">
                <Form.Floating>
                  <Form.Control
                    type="text"
                    placeholder="Warna"
                    value={formData.color}
                    onChange={(e) => setData("color", e.target.value)}
                    isInvalid={!!errors.color}
                  />
                  <Form.Label>Warna</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.color}</Form.Control.Feedback>
                </Form.Floating>
              </div>

              <div className="mb-3 form-group">
                <Form.Floating>
                  <Form.Control
                    type="number"
                    placeholder="Tahun Pembuatan"
                    value={formData.year_of_manufacture}
                    onChange={(e) => setData("year_of_manufacture", parseInt(e.target.value))}
                    isInvalid={!!errors.year_of_manufacture}
                  />
                  <Form.Label>Tahun Pembuatan</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.year_of_manufacture}</Form.Control.Feedback>
                </Form.Floating>
              </div>

              <div className="mb-3 form-group">
                <Form.Floating>
                  <Form.Select
                    value={formData.model}
                    onChange={(e) => setData("model", e.target.value as CarModelEnum)}
                    isInvalid={!!errors.model}
                  >
                    <option disabled value="">Pilih Salah Satu</option>
                    {Object.values(CarModelEnum).map((model) => (
                      <option key={model} value={model}>
                        {getCarModelLabel(model as CarModelEnum)}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Label>Model</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.model}</Form.Control.Feedback>
                </Form.Floating>
              </div>

              <div className="mb-3 form-group">
                <Form.Floating>
                  <Form.Select
                    value={formData.status}
                    onChange={(e) => setData("status", e.target.value as CarStatusEnum)}
                    isInvalid={!!errors.status}
                  >
                    <option disabled value="">Pilih Salah Satu</option>
                    {Object.values(CarStatusEnum).map((status) => (
                      <option key={status} value={status}>
                        {getCarStatusLabel(status as CarStatusEnum)}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Label>Status</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.status}</Form.Control.Feedback>
                </Form.Floating>
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

              <div>
                <Form.Label>Unggah Berkas</Form.Label>
                <ImageUploader
                  name="gallery"
                  id="upload-create"
                  form={{
                    data: formData,
                    setData,
                    errors
                  }}
                  maxFileSize={10}
                  maxTotalFileSize={50}
                  maxFiles={3}
                  acceptedFileTypes={['image/jpeg', 'image/png']}
                />
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
