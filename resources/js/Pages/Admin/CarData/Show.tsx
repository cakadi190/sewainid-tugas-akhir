import { AuthenticatedAdmin } from "@/Layouts/AuthenticatedLayout";
import Database from "@/types/database";
import { MediaLibrary } from "@/types/medialibrary";
import { Head, Link, router } from "@inertiajs/react";
import { Badge, Breadcrumb, Col, Overlay, OverlayTrigger, Row, Table, Tabs, Tab, Tooltip, Nav } from "react-bootstrap";
import EditData from "./EditData";
import DeleteData from "@/Components/crud/DeleteData";
import GalleryViewer from "@/Components/GalleryViewer";
import { FaChair, FaCog, FaGasPump, FaTachometerAlt } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

export default function Show({ carDatum }: { carDatum: Database['CarData'] & { statusEnum: { label: string; color: string }; modelEnum: { label: string; color: string }; gallery: MediaLibrary[] } }) {
  return (
    <AuthenticatedAdmin
      header={
        <div className="d-flex justify-content-between">
          <div className="flex-column d-flex">
            <h3 className="h4 fw-semibold">Data Kendaraan</h3>
            <Breadcrumb className="m-0" bsPrefix="m-0 breadcrumb">
              <Breadcrumb.Item linkAs={Link} href={route('administrator.home')}>Dasbor Beranda</Breadcrumb.Item>
              <Breadcrumb.Item linkAs={Link} href={route('administrator.car-data.index')}>Data Kendaraan</Breadcrumb.Item>
              <Breadcrumb.Item active>{carDatum.name}</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
      }
    >
      <Head title={`Rincian Kendaraan "${carDatum.brand} ${carDatum.name}"`} />

      <Tab.Container id="left-tabs-example" defaultActiveKey="first">
        <div className="px-4 pt-4 mt-4 rounded-5 bg-light">
          <GalleryViewer data={carDatum.gallery} wrap={false} />

          <div className="pt-4 pb-1">
            <Row>
              <Col md="4">
                <h6 className="mb-0">{carDatum.brand}</h6>
                <h1 className="mb-0">{carDatum.name}</h1>
              </Col>
              <Col md="8">
                <Row>
                  <Col md="3" xs="6">
                    <div className="gap-3 p-3 text-center rounded-4 d-flex flex-column justify-content-center bg-primary-subtle">
                      <FaChair size="32px" className="mx-auto" />
                      <div>
                        <h5 className="mb-0">6</h5>
                        <p className="mb-0">Kursi + Sopir</p>
                      </div>
                    </div>
                  </Col>
                  <Col md="3" xs="6">
                    <div className="gap-3 p-3 text-center rounded-4 d-flex flex-column justify-content-center bg-primary-subtle">
                      <FaCog size="32px" className="mx-auto" />
                      <div>
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id="overlay-tooltip">
                              Transmisi Otomatis
                            </Tooltip>
                          }
                        >
                          <h5 className="mb-0">AT <FontAwesomeIcon size="xs" icon={faQuestionCircle} /></h5>
                        </OverlayTrigger>
                        <p className="mb-0">Transmisi</p>
                      </div>
                    </div>
                  </Col>
                  <Col md="3" xs="6">
                    <div className="gap-3 p-3 text-center rounded-4 d-flex flex-column justify-content-center bg-primary-subtle">
                      <FaGasPump size="32px" className="mx-auto" />
                      <div>
                        <h5 className="mb-0">45 Liter</h5>
                        <p className="mb-0">Kapasitas Bahan Bakar</p>
                      </div>
                    </div>
                  </Col>
                  <Col md="3" xs="6">
                    <div className="gap-3 p-3 text-center rounded-4 d-flex flex-column justify-content-center bg-primary-subtle">
                      <FaTachometerAlt size="32px" className="mx-auto" />
                      <div>
                        <h5 className="mb-0">150KM/H</h5>
                        <p className="mb-0">Kecepatan Max</p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>

          <div className="pt-4">
            <Nav variant="pills">
              <Nav.Item>
                <Nav.Link eventKey="first">Tab 1</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="second">Tab 2</Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
        </div>

        <div className="pt-4">
          <Tab.Content>
            <Tab.Pane eventKey="first">First tab content</Tab.Pane>
            <Tab.Pane eventKey="second">Second tab content</Tab.Pane>
          </Tab.Content>
        </div>
      </Tab.Container>
    </AuthenticatedAdmin>
  )
};
