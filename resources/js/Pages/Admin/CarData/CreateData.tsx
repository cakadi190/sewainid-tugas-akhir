import { useState, FormEvent } from "react";
import { Button, Modal, Form, Spinner } from "react-bootstrap";
import { useForm } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { createPortal } from "react-dom";
import { CarModelEnum, CarStatusEnum } from "@/types/enum";
import { getCarModelLabel, getCarStatusLabel } from "@/Helpers/EnumHelper";
import { renderSwalModal } from "@/Helpers/swal";
import ImageUploader from "@/Components/Dropzone";
import Database from "@/types/database";
import SeparatorText from "@/Components/SeparatorText";

export default function CreateData({ onSuccess: onSuccessAction }: { onSuccess?: () => void }) {
  const [showModal, setShowModal] = useState<boolean>(false);

  const { data: formData, setData, post, processing, reset, errors, clearErrors } = useForm<Omit<Database['CarData'], 'deleted_at' | 'created_at' | 'id' | 'updated_at'> & { gallery: File[] }>({
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
                    placeholder="Nomor Mesin"
                    value={formData.engine_number}
                    onChange={(e) => setData("engine_number", e.target.value)}
                    isInvalid={!!errors.engine_number}
                  />
                  <Form.Label>Nomor Mesin</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.engine_number}</Form.Control.Feedback>
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
                    type="date"
                    placeholder="Tanggal Kadaluarsa Plat Nomor"
                    value={formData.license_plate_expiration}
                    onChange={(e) => setData("license_plate_expiration", e.target.value)}
                    isInvalid={!!errors.license_plate_expiration}
                  />
                  <Form.Label>Tanggal Kadaluarsa Plat Nomor</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.license_plate_expiration}</Form.Control.Feedback>
                </Form.Floating>
              </div>

              <div className="mb-3 form-group">
                <Form.Floating>
                  <Form.Control
                    type="text"
                    placeholder="Nomor STNK"
                    value={formData.vehicle_registration_cert_number}
                    onChange={(e) => setData("vehicle_registration_cert_number", e.target.value)}
                    isInvalid={!!errors.vehicle_registration_cert_number}
                  />
                  <Form.Label>Nomor STNK</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.vehicle_registration_cert_number}</Form.Control.Feedback>
                </Form.Floating>
              </div>

              <div className="mb-3 form-group">
                <Form.Floating>
                  <Form.Control
                    type="date"
                    placeholder="Tanggal Kadaluarsa Sertifikat Registrasi Kendaraan"
                    value={formData.vehicle_registration_cert_expiration}
                    onChange={(e) => setData("vehicle_registration_cert_expiration", e.target.value)}
                    isInvalid={!!errors.vehicle_registration_cert_expiration}
                  />
                  <Form.Label>Tanggal Kadaluarsa Sertifikat Registrasi Kendaraan</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.vehicle_registration_cert_expiration}</Form.Control.Feedback>
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
                    value={formData.transmission}
                    onChange={(e) => setData("transmission", e.target.value)}
                    isInvalid={!!errors.transmission}
                  >
                    <option disabled value="">Pilih Salah Satu</option>
                    <option value="manual">Transmisi Manual</option>
                    <option value="automatic">Transmisi Otomatis</option>
                  </Form.Select>
                  <Form.Label>Transmisi</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.transmission}</Form.Control.Feedback>
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
                    value={String(formData.description || '')}
                    onChange={(e) => setData("description", e.target.value)}
                    style={{ height: '100px' }}
                    isInvalid={!!errors.description}
                  />
                  <Form.Label>Deskripsi</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                </Form.Floating>
              </div>

              <SeparatorText align="start" wrapperClassName="pt-0 mb-5" label="Fitur Kendaraan" />

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
