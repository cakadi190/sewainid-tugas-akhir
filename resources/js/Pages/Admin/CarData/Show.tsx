import axios from "axios";
import SeparatorText from "@/Components/SeparatorText";
import ImageGallery from "@/Components/ImageGallery";
import Database from "@/types/database";
import { getCarModelLabel, getCarStatusLabel } from "@/Helpers/EnumHelper";
import { CarModelEnum, CarStatusEnum } from "@/types/enum";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "@inertiajs/react";
import { useState } from "react";
import { Button, Card, Form, Modal, Spinner } from "react-bootstrap";
import { createPortal } from "react-dom";
import { MediaLibrary } from "@/types/medialibrary";

export default function Show({ id }: { id: number }) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [galleryData, setGalleryData] = useState<MediaLibrary[] | null | undefined>(null);

  const onOpen = () => setShowModal(true);
  const onClose = () => setShowModal(false);

  const { data: formData, setData, processing, reset, clearErrors } = useForm<Omit<Database['CarData'], 'deleted_at' | 'created_at' | 'id' | 'updated_at'> & { gallery: File[]; _method: string }>({
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
    gps_imei: ''
  });

  const onCloseModal = () => {
    reset();
    onClose();
    clearErrors()
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
          gallery: [],
          gps_imei: data.gps_imei
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
            <Modal.Title as="h5">Data Kendaraan</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3 form-group">
              <Form.Floating>
                <Form.Control
                  type="text"
                  placeholder="Nama"
                  value={formData.car_name}
                  readOnly
                />
                <Form.Label>Nama</Form.Label>
              </Form.Floating>
            </div>

            <div className="mb-3 form-group">
              <Form.Floating>
                <Form.Control
                  type="text"
                  placeholder="Brand"
                  value={formData.brand}
                  readOnly
                />
                <Form.Label>Brand / Merk</Form.Label>
              </Form.Floating>
            </div>

            <div className="mb-3 form-group">
              <Form.Floating>
                <Form.Control
                  type="text"
                  placeholder="Nomor Rangka"
                  value={formData.frame_number}
                  readOnly
                />
                <Form.Label>Nomor Rangka</Form.Label>
              </Form.Floating>
            </div>

            <div className="mb-3 form-group">
              <Form.Floating>
                <Form.Control
                  type="text"
                  placeholder="Plat Nomor"
                  value={formData.license_plate}
                  readOnly
                />
                <Form.Label>Plat Nomor</Form.Label>
              </Form.Floating>
            </div>

            <div className="mb-3 form-group">
              <Form.Floating>
                <Form.Control
                  type="text"
                  placeholder="Warna"
                  value={formData.color}
                  readOnly
                />
                <Form.Label>Warna</Form.Label>
              </Form.Floating>
            </div>

            <div className="mb-3 form-group">
              <Form.Floating>
                <Form.Control
                  type="number"
                  placeholder="Tahun Pembuatan"
                  value={formData.year_of_manufacture}
                  readOnly
                />
                <Form.Label>Tahun Pembuatan</Form.Label>
              </Form.Floating>
            </div>

            <div className="mb-3 form-group">
              <Form.Floating>
                <Form.Select
                  value={formData.model}
                  disabled
                >
                  <option value="">Pilih Model Kendaraan</option>
                  {Object.values(CarModelEnum).map((model) => (
                    <option key={model} value={model}>
                      {getCarModelLabel(model as CarModelEnum)}
                    </option>
                  ))}
                </Form.Select>
                <Form.Label>Model</Form.Label>
              </Form.Floating>
            </div>

            <div className="mb-3 form-group">
              <Form.Floating>
                <Form.Select
                  value={formData.status}
                  disabled
                >
                  <option value="">Pilih Status Kendaraan</option>
                  {Object.values(CarStatusEnum).map((status) => (
                    <option key={status} value={status}>
                      {getCarStatusLabel(status as CarStatusEnum)}
                    </option>
                  ))}
                </Form.Select>
                <Form.Label>Status</Form.Label>
              </Form.Floating>
            </div>

            <div className="mb-3 form-group">
              <Form.Floating>
                <Form.Control
                  as="textarea"
                  placeholder="Deskripsi"
                  value={String(formData.description || '')}
                  readOnly
                />
                <Form.Label>Deskripsi</Form.Label>
              </Form.Floating>
            </div>

            <div className="mb-3 form-group">
              <Form.Floating>
                <Form.Control
                  type="number"
                  placeholder="Jumlah Pintu"
                  value={formData.doors}
                  readOnly
                />
                <Form.Label>Jumlah Pintu</Form.Label>
              </Form.Floating>
            </div>

            <div className="mb-3 form-group">
              <Form.Floating>
                <Form.Control
                  type="number"
                  placeholder="Jumlah Kursi"
                  value={formData.seats}
                  readOnly
                />
                <Form.Label>Jumlah Kursi</Form.Label>
              </Form.Floating>
            </div>

            <div className="mb-3 form-group">
              <Form.Floating>
                <Form.Control
                  type="number"
                  placeholder="Kecepatan Maksimal"
                  value={formData.max_speed}
                  readOnly
                />
                <Form.Label>Kecepatan Maksimal</Form.Label>
              </Form.Floating>
            </div>

            <div className="mb-3 form-group">
              <Form.Floating>
                <Form.Control
                  type="number"
                  placeholder="Kapasitas Bagasi Besar"
                  value={formData.big_luggage}
                  readOnly
                />
                <Form.Label>Kapasitas Bagasi Besar</Form.Label>
              </Form.Floating>
            </div>

            <div className="mb-3 form-group">
              <Form.Floating>
                <Form.Control
                  type="number"
                  placeholder="Kapasitas Bagasi Sedang"
                  value={formData.med_luggage}
                  readOnly
                />
                <Form.Label>Kapasitas Bagasi Sedang</Form.Label>
              </Form.Floating>
            </div>

            <div className="mb-3 form-group">
              <Form.Floating>
                <Form.Control
                  type="number"
                  placeholder="Kapasitas Bagasi Kecil"
                  value={formData.small_luggage}
                  readOnly
                />
                <Form.Label>Kapasitas Bagasi Kecil</Form.Label>
              </Form.Floating>
            </div>

            <SeparatorText align="start" label="Fitur Kendaraan" />

            <div className="pt-3 mb-3 form-group">
              <Form.Check
                type="checkbox"
                label="AC"
                checked={formData.ac}
                disabled
              />
            </div>

            <div className="mb-3 form-group">
              <Form.Check
                type="checkbox"
                label="Audio"
                checked={formData.audio}
                disabled
              />
            </div>

            <div className="mb-3 form-group">
              <Form.Check
                type="checkbox"
                label="ABS"
                checked={formData.abs}
                disabled
              />
            </div>

            <div className="mb-3 form-group">
              <Form.Check
                type="checkbox"
                label="Kunci Anak"
                checked={formData.child_lock}
                disabled
              />
            </div>

            <div className="mb-3 form-group">
              <Form.Check
                type="checkbox"
                label="Kontrol Traksi"
                checked={formData.traction_control}
                disabled
              />
            </div>

            <div className="mb-3 form-group">
              <Form.Check
                type="checkbox"
                label="Kursi Bayi"
                checked={formData.baby_seat}
                disabled
              />
            </div>

            <SeparatorText align="start" label="Data GPS" />

            <div className="pt-3 mb-3 form-group">
              <Form.Floating>
                <Form.Control
                  type="text"
                  placeholder="Nomor IMEI Pada GPS"
                  value={formData.gps_imei || ''}
                  readOnly
                  onChange={(e) => setData("gps_imei", e.target.value)}
                />
                <Form.Label>Nomor IMEI Pada GPS</Form.Label>
              </Form.Floating>
            </div>

            <div className="mb-3">
              <small className="fw-bold">Foto Kendaraan</small>

              {(galleryData && galleryData?.length > 0) ? (
                <Card body className="mb-3">
                  <h6>Yang Sudah Diunggah</h6>
                  <ImageGallery readOnly initialData={galleryData as unknown as MediaLibrary[]} />
                </Card>
              ) : (
                <span>Tidak Ada</span>
              )}
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
          </Modal.Footer>
        </Modal>
      ), document.body)}
    </>
  );
}
