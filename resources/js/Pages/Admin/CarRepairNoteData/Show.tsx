import axios from "axios";
import SeparatorText from "@/Components/SeparatorText";
import Database from "@/types/database";
import { getCarRepairStatusLabel } from "@/Helpers/EnumHelper";
import { CarRepairNoteStatusEnum } from "@/types/enum";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "@inertiajs/react";
import { useState } from "react";
import { Button, Card, Form, Modal, Spinner } from "react-bootstrap";
import { createPortal } from "react-dom";
import dayjs from "dayjs";
import { parseAntiXss } from "@/Helpers/string";
import { MediaLibrary } from "@/types/medialibrary";
import ImageGallery from "@/Components/ImageGallery";

export default function RepairShow({ id }: { id: number }) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [galleryData, setGalleryData] = useState<MediaLibrary[] | null | undefined>(null);

  const onOpen = () => setShowModal(true);
  const onClose = () => setShowModal(false);

  const { data: formData, setData, processing, reset, clearErrors } = useForm<Omit<Database['CarRepairNoteData'], 'id' | 'deleted_at' | 'created_at' | 'id' | 'updated_at'> & { car_data?: Database['CarData'] | undefined; _method: string }>({
    _method: 'put',
    repair_date: '',
    description: '',
    last_mileage: 0,
    current_mileage: 0,
    cost: 0,
    status: CarRepairNoteStatusEnum.PENDING,
    notes: '',
    car_data_id: 0,
    car_data: undefined
  });

  const onCloseModal = () => {
    reset();
    onClose();
    clearErrors();
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
          last_mileage: data.last_mileage,
          current_mileage: data.current_mileage,
          cost: data.cost,
          status: data.status,
          notes: data.notes,
          car_data_id: data.car_data_id,
          car_data: data.car_data
        });
      })
      .finally(() => setLoading(false));
  };

  // Format currency to IDR
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
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
            <Modal.Title as="h5">Data Perbaikan Kendaraan</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3 border-bottom ">
              <div className="mb-2"><small className="fw-bold">Kendaraan Yang Diperbaiki</small></div>
              {formData.car_data ? (
                <p>{formData.car_data?.brand} {formData.car_data?.car_name} ({formData.car_data?.license_plate})</p>
              ) : '-'}
            </div>

            <div className="mb-3 border-bottom ">
              <div className="mb-2"><small className="fw-bold">Tanggal Perbaikan</small></div>
              <p>{dayjs(formData.repair_date).format('DD MMMM YYYY')}</p>
            </div>

            <div className="mb-3">
              <div className="mb-2"><small className="fw-bold">Deskripsi Perbaikan</small></div>
              <p dangerouslySetInnerHTML={{ __html: parseAntiXss(formData.description) }} />
            </div>

            <SeparatorText align="start" label="Informasi Kilometer" />

            <div className="pt-3 mb-3 border-bottom">
              <div className="mb-2"><small className="fw-bold">Kilometer Terakhir</small></div>
              <p dangerouslySetInnerHTML={{ __html: parseAntiXss(String(formData.last_mileage ?? 'Tidak Diisi')) }} />
            </div>

            <div className="mb-3">
              <div className="mb-2"><small className="fw-bold">Kilometer Sekarang</small></div>
              <p dangerouslySetInnerHTML={{ __html: parseAntiXss(String(formData.current_mileage ?? 'Tidak Diisi')) }} />
            </div>

            <SeparatorText align="start" label="Biaya dan Status" />

            <div className="pt-3 mb-3 border-bottom">
              <div className="mb-2"><small className="fw-bold">Biaya</small></div>
              <p dangerouslySetInnerHTML={{ __html: parseAntiXss(formatCurrency(formData.cost)) }} />
            </div>

            <div className="mb-3 border-bottom">
              <div className="mb-2"><small className="fw-bold">Status Pengerjaan</small></div>
              <p dangerouslySetInnerHTML={{ __html: parseAntiXss(String(getCarRepairStatusLabel(formData.status as CarRepairNoteStatusEnum))) }} />
            </div>

            <div className="mb-3 border-bottom">
              <div className="mb-2"><small className="fw-bold">Catatan Perbaikan Tambahan</small></div>
              <p dangerouslySetInnerHTML={{ __html: parseAntiXss(formData.notes || 'Tidak Ada') }} />
            </div>

            <div className="mb-3">
              <div className="mb-2"><small className="fw-bold">Foto Laporan</small></div>

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
