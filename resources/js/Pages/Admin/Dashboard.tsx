import dayjs from "@/Helpers/dayjs";
import { currencyFormat } from "@/Helpers/number";
import { AuthenticatedAdmin } from "@/Layouts/AuthenticatedLayout";
import {
  faArrowRight,
  faCar,
  faCarOn,
  faStar,
  faUsers,
  IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Head, Link } from "@inertiajs/react";
import { FC } from "react";
import { Badge, Card, Col, Row } from "react-bootstrap";
import { FaCheckCircle } from "react-icons/fa";

const DashboardCard: FC<{
  title: string;
  value: number;
  icon: IconDefinition;
  color: string;
  link: string;
}> = ({ title, value, icon, color, link }) => {
  return (
    <Col xl={3} md={6} className="mb-4">
      <Card border={color} className="h-100">
        <Card.Body className="d-flex justify-content-between align-items-center">
          <div className="d-flex flex-column">
            <h6 className={`text-${color} fw-bold`}>{title}</h6>
            <h1 className="mb-0 font-weight-bold h3 lh-1">{value}</h1>
          </div>
          <FontAwesomeIcon className={`text-${color}`} icon={icon} size="2xl" />
        </Card.Body>
        <Card.Footer
          className={`border-${color} bg-${color} text-white d-flex justify-content-between`}
          as={Link}
          href={link}
        >
          <span className="small fw-bold">Lihat Detail</span>
          <FontAwesomeIcon icon={faArrowRight} />
        </Card.Footer>
      </Card>
    </Col>
  );
};

const SummaryCards = () => {
  return (
    <Row className="py-2 pt-4">
      <DashboardCard
        title="Total Kendaraan"
        value={0}
        icon={faCar}
        color="primary"
        link={route("administrator.car-data.index")}
      />
      <DashboardCard
        title="Pinjaman Aktif"
        value={0}
        icon={faCarOn}
        color="info"
        link="#"
      />
      <DashboardCard
        title="Pengguna"
        value={0}
        icon={faUsers}
        color="success"
        link="#"
      />
      <DashboardCard
        title="Rata-Rata Penilaian"
        value={0}
        icon={faStar}
        color="warning"
        link="#"
      />
    </Row>
  );
};

function RecentTransactions() {
  const transactions = [
    {
      id: "TX-1234",
      user: "John Doe",
      car: "Toyota Camry",
      status: "Active",
      date: "2023-05-01",
      amount: "1740000",
    },
    {
      id: "TX-1235",
      user: "Jane Smith",
      car: "Honda Civic",
      status: "Completed",
      date: "2023-04-29",
      amount: "1377500",
    },
    {
      id: "TX-1236",
      user: "Robert Johnson",
      car: "Ford Mustang",
      status: "Active",
      date: "2023-04-28",
      amount: "2665000",
    },
  ];

  return (
    <div className="gap-3 flex-column transaction-list d-flex">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="p-3 bg-white border rounded d-flex align-items-center"
        >
          <div className="gap-3 d-flex align-items-center">
            <div className="p-2 bg-purple-100 rounded-circle text-purple">
              <FaCheckCircle size={24} />
            </div>
            <div>
              <p className="mb-0 fw-medium">{transaction.user}</p>
              <p className="mb-0 small text-muted">{transaction.car}</p>
            </div>
          </div>
          <div className="ms-auto text-end">
            <div className="fw-medium">
              {currencyFormat(parseInt(transaction.amount))}
            </div>
            <div className="gap-1 d-flex align-items-center small">
              <Badge
                bg={transaction.status === "Active" ? "success" : "secondary"}
                className="rounded-pill"
              >
                {transaction.status}
              </Badge>
              <span className="text-muted">
                {dayjs(transaction.date).format("DD MMM YYYY")}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const SummaryOverview = () => {
  return (
    <Row className="mb-4">
      <Col md="7">
        <Card body className="rounded-4">
          <h5>Revenue Overview</h5>
        </Card>
      </Col>
      <Col md="5">
        <Card className="h-100 rounded-4">
          <Card.Header className="pt-3 bg-white rounded-4 border-bottom-0">
            <Card.Title className="mb-0">Recent Transactions</Card.Title>
            <Card.Subtitle className="mt-1 text-muted">
              Latest rental transactions
            </Card.Subtitle>
          </Card.Header>
          <Card.Body>
            <RecentTransactions />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default function Dashboard() {
  return (
    <AuthenticatedAdmin header={<h2 className="mb-0 h4 text-dark">Beranda</h2>}>
      <Head title="Beranda Admin" />

      <SummaryCards />
      <SummaryOverview />
    </AuthenticatedAdmin>
  );
}
