import axios from "axios";
import ImageUploader from "@/Components/Dropzone";
import SeparatorText from "@/Components/SeparatorText";
import ImageGallery from "@/Components/ImageGallery";
import Database from "@/types/database";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "@inertiajs/react";
import { FormEvent, useState, useEffect } from "react";
import { Button, Card, Form, Modal, Spinner } from "react-bootstrap";
import { createPortal } from "react-dom";
import { MediaLibrary } from "@/types/medialibrary";
import { renderSwalModal } from "@/Helpers/swal";
import { getCarRepairStatusLabel } from "@/Helpers/enums/carRepairStatusLabel";
import { CarRepairNoteStatusEnum } from "@/Helpers/enum";

interface CarData {
  value: number;
  label: string;
}

export default function EditData({ id, onSuccess: onSuccessAction }: { id: number; onSuccess?: () => void }) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [galleryData, setGalleryData] = useState<MediaLibrary[] | null | undefined>(null);
  const [carOptions, setCarOptions] = useState<CarData[]>([]);
  const [isLoadingCars, setIsLoadingCars] = useState<boolean>(false);

  const onOpen = () => setShowModal(true);
  const onClose = () => setShowModal(false);

  const { post, data: formData, setData, processing, reset, errors, clearErrors } = useForm<Omit<Database['CarRepairNoteData'], 'created_at' | 'id' | 'updated_at'> & { gallery: File[]; _method: string }>({
    _method: 'put',
    repair_date: '',
    description: '',
    cost: 0,
    last_mileage: 0,
    current_mileage: 0,
    status: CarRepairNoteStatusEnum.PENDING,
    notes: '',
    car_data_id: 0,
    gallery: []
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

  const onCloseModal = () => {
    reset();
    onClose();
    clearErrors()
  };

  const submitData = (e: FormEvent) => {
    e.preventDefault();

    post(route('v1.admin.car-repair.update', id), {
      forceFormData: true,
      onSuccess(result: any) {
        console.log(result)
        reset();
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

  const onClickModal = () => {
    setLoading(true);

    axios.get(route('v1.admin.car-repair.show', id))
      .then((result) => {
        const { data } = result.data;
        onOpen();

        setGalleryData(data['repair-gallery']);

        setData({
          _method: 'PUT',
          repair_date: data.repair_date,
          description: data.description,
          cost: data.cost,
          current_mileage: data.current_mileage,
          last_mileage: data.last_mileage,
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
              <Modal.Title as="h5">Ubah Catatan Perbaikan</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-3 form-group">
                <Form.Floating>
                  <Form.Select
                    value={formData.car_data_id}
                    onChange={(e) => setData("car_data_id", Number(e.target.value || 0))}
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
                    value={formData.cost}
                    onChange={(e) => setData("cost", parseFloat(e.target.value))}
                    isInvalid={!!errors.cost}
                  />
                  <Form.Label>Biaya Perbaikan</Form.Label>
                  <Form.Control.Feedback type="invalid">{errors.cost}</Form.Control.Feedback>
                </Form.Floating>
              </div>

              <div className="mb-3 form-group">
                <Form.Floating>
                  <Form.Select
                    value={formData.status}
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

              <div className="mb-3">
                <Form.Label htmlFor={`upload-edit-${id}`}>Unggah Foto Perbaikan</Form.Label>

                {(galleryData && galleryData?.length > 0) && (
                  <div className="mb-3">
                    <SeparatorText align="start" label="Foto Perbaikan" />
                    <Card body className="mb-3">
                      <h6>Foto Yang Sudah Diunggah</h6>
                      <ImageGallery initialData={galleryData as unknown as MediaLibrary[]} />
                    </Card>
                  </div>
                )}

                <ImageUploader
                  name="repair-gallery"
                  id={`upload-edit-${id}`}
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

