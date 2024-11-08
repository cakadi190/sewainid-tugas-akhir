import axios from "axios";
import Database from "@/types/database";
import { getCarModelLabel, getCarStatusLabel } from "@/Helpers/EnumHelper";
import { CarModelEnum, CarStatusEnum } from "@/types/enum";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "@inertiajs/react";
import { FormEvent, useEffect, useState } from "react";
import { Alert, Button, Card, Form, Modal, Spinner } from "react-bootstrap";
import ImageUploader from "@/Components/Dropzone";
import { createPortal } from "react-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ImageGallery from "@/Components/ImageGallery";
import { MediaLibrary } from "@/types/medialibrary";
import SeparatorText from "@/Components/SeparatorText";

export default function EditData({ id, onSuccess: onSuccessAction }: { id: number; onSuccess?: () => void }) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [galleryData, setGalleryData] = useState<MediaLibrary[] | null | undefined>(null);

  const onOpen = () => setShowModal(true);
  const onClose = () => setShowModal(false);

  const { post, data: formData, setData, processing, reset, errors, clearErrors } = useForm<Omit<Database['CarData'], 'deleted_at' | 'created_at' | 'id' | 'updated_at'> & { gallery: File[]; _method: string }>({
    _method: 'put',
    car_name: '',
    brand: '',
    frame_number: '',
    engine_number: '',
    license_plate: '',
    license_plate_expiration: '',
    vehicle_registration_cert_number: '',
    vehicle_registration_cert_expiration: '',
    color: '',
    year_of_manufacture: 0,
    transmission: undefined,
    model: undefined,
    status: undefined,
    description: '',
    doors: 0,
    seats: 0,
    max_speed: 0,
    big_luggage: 0,
    med_luggage: 0,
    small_luggage: 0,
    ac: true,
    audio: true,
    abs: true,
    child_lock: true,
    traction_control: true,
    baby_seat: true,
    gallery: [],
  });

  const onCloseModal = () => {
    reset();
    onClose();
    clearErrors()
  };

  const submitData = (e: FormEvent) => {
    e.preventDefault();

    post(route('v1.admin.car-data.update', id), {
      forceFormData: true,
      onSuccess() {
        reset();
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

  const onClickModal = () => {
    setLoading(true);

    axios.get(route('v1.admin.car-data.show', id))
      .then((result) => {
        const { data } = result.data;
        onOpen();

        setGalleryData(data.gallery);

        setData({
          _method: 'PUT',
          car_name: data.car_name,
          brand: data.brand,
          frame_number: data.frame_number,
          engine_number: data.engine_number,
          license_plate: data.license_plate,
          license_plate_expiration: data.license_plate_expiration,
          vehicle_registration_cert_number: data.vehicle_registration_cert_number,
          vehicle_registration_cert_expiration: data.vehicle_registration_cert_expiration,
          color: data.color,
          year_of_manufacture: data.year_of_manufacture,
          transmission: data.transmission,
          model: data.model,
          status: data.status,
          description: data.description,
          doors: data.doors,
          seats: data.seats,
          max_speed: data.max_speed,
          big_luggage: data.big_luggage,
          med_luggage: data.med_luggage,
          small_luggage: data.small_luggage,
          ac: data.ac,
          audio: data.audio,
          abs: data.abs,
          child_lock: data.child_lock,
          traction_control: data.traction_control,
          baby_seat: data.baby_seat,
          gallery: []
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
          <form onSubmit={submitData} encType="multipart/form-data">
            <Modal.Header closeButton>
              <Modal.Title as="h5">Ubah Data Kendaraan</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-3 form-group">
                <Form.Floating>
                  <Form.Control
                    type="text"
                    placeholder="Nama"
                    value={formData.car_name}
                    onChange={(e) => setData("car_name", e.target.value)}
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
                    <option value="">Pilih Model Kendaraan</option>
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
                    <option value="">Pilih Status Kendaraan</option>
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

              <div className="mb-3 form-group">
                <Form.Floating>
                  <Form.Control
                    type="number"
                    placeholder="Jumlah Pintu"
                    value={formData.doors}
                    onChange={(e) => setData("doors", parseInt(e.target.value))}
                    isInvalid={!!errors.doors}
                  />
                  <Form.Label>Jumlah Pintu</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.doors}</Form.Control.Feedback>
                </Form.Floating>
              </div>

              <div className="mb-3 form-group">
                <Form.Floating>
                  <Form.Control
                    type="number"
                    placeholder="Jumlah Kursi"
                    value={formData.seats}
                    onChange={(e) => setData("seats", parseInt(e.target.value))}
                    isInvalid={!!errors.seats}
                  />
                  <Form.Label>Jumlah Kursi</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.seats}</Form.Control.Feedback>
                </Form.Floating>
              </div>

              <div className="mb-3 form-group">
                <Form.Floating>
                  <Form.Control
                    type="number"
                    placeholder="Kecepatan Maksimal"
                    value={formData.max_speed}
                    onChange={(e) => setData("max_speed", parseInt(e.target.value))}
                    isInvalid={!!errors.max_speed}
                  />
                  <Form.Label>Kecepatan Maksimal</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.max_speed}</Form.Control.Feedback>
                </Form.Floating>
              </div>

              <div className="mb-3 form-group">
                <Form.Floating>
                  <Form.Control
                    type="number"
                    placeholder="Kapasitas Bagasi Besar"
                    value={formData.big_luggage}
                    onChange={(e) => setData("big_luggage", parseInt(e.target.value))}
                    isInvalid={!!errors.big_luggage}
                  />
                  <Form.Label>Kapasitas Bagasi Besar</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.big_luggage}</Form.Control.Feedback>
                </Form.Floating>
              </div>

              <div className="mb-3 form-group">
                <Form.Floating>
                  <Form.Control
                    type="number"
                    placeholder="Kapasitas Bagasi Sedang"
                    value={formData.med_luggage}
                    onChange={(e) => setData("med_luggage", parseInt(e.target.value))}
                    isInvalid={!!errors.med_luggage}
                  />
                  <Form.Label>Kapasitas Bagasi Sedang</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.med_luggage}</Form.Control.Feedback>
                </Form.Floating>
              </div>

              <div className="mb-3 form-group">
                <Form.Floating>
                  <Form.Control
                    type="number"
                    placeholder="Kapasitas Bagasi Kecil"
                    value={formData.small_luggage}
                    onChange={(e) => setData("small_luggage", parseInt(e.target.value))}
                    isInvalid={!!errors.small_luggage}
                  />
                  <Form.Label>Kapasitas Bagasi Kecil</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.small_luggage}</Form.Control.Feedback>
                </Form.Floating>
              </div>

              <SeparatorText align="start" label="Fitur Kendaraan" />

              <div className="pt-3 mb-3 form-group">
                <Form.Check
                  type="checkbox"
                  label="AC"
                  checked={formData.ac}
                  onChange={(e) => setData("ac", e.target.checked)}
                  id="ac-checkbox"
                />
              </div>

              <div className="mb-3 form-group">
                <Form.Check
                  type="checkbox"
                  label="Audio"
                  checked={formData.audio}
                  onChange={(e) => setData("audio", e.target.checked)}
                  id="audio-checkbox"
                />
              </div>

              <div className="mb-3 form-group">
                <Form.Check
                  type="checkbox"
                  label="ABS"
                  checked={formData.abs}
                  onChange={(e) => setData("abs", e.target.checked)}
                  id="abs-checkbox"
                />
              </div>

              <div className="mb-3 form-group">
                <Form.Check
                  type="checkbox"
                  label="Kunci Anak"
                  checked={formData.child_lock}
                  onChange={(e) => setData("child_lock", e.target.checked)}
                  id="child-lock-checkbox"
                />
              </div>

              <div className="mb-3 form-group">
                <Form.Check
                  type="checkbox"
                  label="Kontrol Traksi"
                  checked={formData.traction_control}
                  onChange={(e) => setData("traction_control", e.target.checked)}
                  id="traction-control-checkbox"
                />
              </div>

              <div className="mb-3 form-group">
                <Form.Check
                  type="checkbox"
                  label="Kursi Bayi"
                  checked={formData.baby_seat}
                  onChange={(e) => setData("baby_seat", e.target.checked)}
                  id="baby-seat-checkbox"
                />
              </div>

              <div className="mb-3">
                <Form.Label htmlFor={`upload-edit-${id}`}>Unggah Foto Kendaraan</Form.Label>

                {(galleryData && galleryData?.length > 0) && (
                  <Card body className="mb-3">
                    <h6>Yang Sudah Diunggah</h6>
                    <ImageGallery initialData={galleryData as unknown as MediaLibrary[]} />
                  </Card>
                )}

                <ImageUploader
                  name="gallery"
                  id={`upload-edit-${id}`}
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
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                type="button"
                disabled={processing}
                onClick={onCloseModal}
              >
                Tutup
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Perubahan"
                )}
              </Button>
            </Modal.Footer>
          </form>
        </Modal>
      ), document.body)}
    </>
  );
}
