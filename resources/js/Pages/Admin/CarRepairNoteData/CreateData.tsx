import { useState, FormEvent, useEffect } from "react";
import { Button, Modal, Form, Spinner } from "react-bootstrap";
import { useForm } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { createPortal } from "react-dom";
import { renderSwalModal } from "@/Helpers/swal";
import Database from "@/types/database";
import SeparatorText from "@/Components/SeparatorText";
import ImageUploader from "@/Components/Dropzone";
import axios from "axios";
import { getCarRepairStatusLabel } from "@/Helpers/enums/carRepairStatusLabel";
import { formatDateForInput } from "@/Helpers/dayjs";
import { CarRepairNoteStatusEnum } from "@/Helpers/enum";

interface CarData {
  value: number;
  label: string;
}

export default function CreateData({ onSuccess: onSuccessAction }: { onSuccess?: () => void }) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [carOptions, setCarOptions] = useState<CarData[]>([]);
  const [isLoadingCars, setIsLoadingCars] = useState<boolean>(false);

  const { data: formData, setData, post, processing, reset, errors, clearErrors } = useForm<Omit<Database['CarRepairNoteData'], 'id' | 'created_at' | 'updated_at'> & { gallery: File[] }>({
    repair_date: formatDateForInput(new Date()),
    description: '',
    cost: 0,
    status: CarRepairNoteStatusEnum.PENDING,
    notes: '',
    last_mileage: 0,
    current_mileage: 0,
    car_data_id: 0,
    gallery: [],
  });

  useEffect(() => {
    if (showModal) {
      fetchCarOptions();
    }
  }, [showModal]);

  const fetchCarOptions = () => {
    setIsLoadingCars(true);
    axios.get(route('v1.admin.options.car-data'))
      .then((response) => {
        setCarOptions(response.data.data);
      })
      .catch(() => {
        renderSwalModal('error', {
          title: 'Kesalahan!',
          text: 'Gagal memuat data kendaraan!',
        });
      })
      .finally(() => {
        setIsLoadingCars(false);
      });
  };

  const onOpen = () => setShowModal(true);
  const onClose = () => {
    setShowModal(false);
    reset();
    clearErrors();
  };

  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === '') {
      setData('cost', 0);
    } else {
      const parsedValue = parseFloat(inputValue);
      setData('cost', isNaN(parsedValue) ? 0 : parsedValue);
    }
  };

  const submitData = (e: FormEvent) => {
    e.preventDefault();

    post(route('v1.admin.car-repair.store'), {
      forceFormData: true,
      onSuccess() {
        onClose();
        onSuccessAction?.();
      },
      onError(error) {
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
        <span className="d-none d-md-none d-lg-inline-flex">Tambah Catatan Perbaikan</span>
      </Button>

      {createPortal((
        <Modal show={showModal} size="lg" onHide={onClose}>
          <Modal.Header closeButton>
            <Modal.Title as="h5">Tambah Catatan Perbaikan Baru</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={submitData}>
              <div className="mb-3 form-group">
                <Form.Floating>
                <Form.Select
                  value={formData.car_data_id || ''}
                  onChange={(e) => setData("car_data_id", parseInt(e.target.value) || 0)}
                  isInvalid={!!errors.car_data_id}
                  disabled={isLoadingCars}
                >
                  <option value="">Pilih Kendaraan</option>
                  {carOptions.map((car) => (
                    <option key={car.value} value={car.value}>
                      {car.label}
                    </option>
                  ))}
                </Form.Select>
                  <Form.Label>Kendaraan</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.car_data_id}</Form.Control.Feedback>
                </Form.Floating>
              </div>

              <div className="mb-3 form-group">
                <Form.Floating>
                  <Form.Control
                    type="date"
                    placeholder="Tanggal Perbaikan"
                    value={formData.repair_date}
                    onChange={(e) => setData("repair_date", e.target.value)}
                    isInvalid={!!errors.repair_date}
                  />
                  <Form.Label>Tanggal Perbaikan</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.repair_date}</Form.Control.Feedback>
                </Form.Floating>
              </div>

              <div className="mb-3 form-group">
                <Form.Floating>
                  <Form.Control
                    as="textarea"
                    placeholder="Deskripsi Perbaikan"
                    value={formData.description}
                    onChange={(e) => setData("description", e.target.value)}
                    style={{ height: '100px' }}
                    isInvalid={!!errors.description}
                  />
                  <Form.Label>Deskripsi Perbaikan</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                </Form.Floating>
              </div>

              <div className="mb-3 form-group">
                <Form.Floating>
                  <Form.Control
                    type="number"
                    placeholder="Kilometer Terakhir"
                    value={formData.last_mileage}
                    onChange={(e) => setData("last_mileage", parseInt(e.target.value) || 0)}
                    isInvalid={!!errors.last_mileage}
                  />
                  <Form.Label>Kilometer Terakhir</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.last_mileage}</Form.Control.Feedback>
                </Form.Floating>
              </div>

              <div className="mb-3 form-group">
                <Form.Floating>
                  <Form.Control
                    type="number"
                    placeholder="Kilometer Saat Ini"
                    value={formData.current_mileage}
                    onChange={(e) => setData("current_mileage", parseInt(e.target.value) || 0)}
                    isInvalid={!!errors.current_mileage}
                  />
                  <Form.Label>Kilometer Saat Ini</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.current_mileage}</Form.Control.Feedback>
                </Form.Floating>
              </div>

              <div className="mb-3 form-group">
                <Form.Floating>
                  <Form.Control
                    type="number"
                    step="0.01"
                    placeholder="Biaya Perbaikan"
                    value={formData.cost === 0 && document.activeElement === document.getElementById('cost-input') ? '' : formData.cost}
                    onChange={handleCostChange}
                    id="cost-input"
                    isInvalid={!!errors.cost}
                  />
                  <Form.Label>Biaya Perbaikan</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.cost}</Form.Control.Feedback>
                </Form.Floating>
              </div>

              <div className="mb-3 form-group">
                <Form.Floating>
                  <Form.Select
                    value={formData.status || ''}
                    onChange={(e) => setData("status", e.target.value as CarRepairNoteStatusEnum)}
                    isInvalid={!!errors.status}
                  >
                    <option value="">Pilih Status</option>
                    {Object.values(CarRepairNoteStatusEnum).map((status) => (
                      <option key={status} value={status}>
                        {getCarRepairStatusLabel(status as CarRepairNoteStatusEnum)}
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
                    placeholder="Catatan"
                    value={formData.notes || ''}
                    onChange={(e) => setData("notes", e.target.value)}
                    style={{ height: '100px' }}
                    isInvalid={!!errors.notes}
                  />
                  <Form.Label>Catatan Tambahan</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.notes}</Form.Control.Feedback>
                </Form.Floating>
              </div>

              <SeparatorText align="start" label="Dokumentasi Perbaikan" />

              <div className="mb-3">
                <Form.Label>Unggah Foto Perbaikan</Form.Label>
                <ImageUploader
                  name="repair-gallery"
                  id="upload-create"
                  form={{
                    data: formData,
                    setData,
                    errors
                  }}
                  maxFileSize={10}
                  maxTotalFileSize={50}
                  maxFiles={5}
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
