import dayjs from "@/Helpers/dayjs";
import { getRentalStatusColor, getRentalStatusLabel } from "@/Helpers/EnumHelper";
import { currencyFormat } from "@/Helpers/number";
import { AuthenticatedAdmin } from "@/Layouts/AuthenticatedLayout";
import Database from "@/types/database";
import {
  faArrowRight,
  faCar,
  faCarOn,
  faStar,
  faUsers,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Head, Link } from "@inertiajs/react";
import { FC } from "react";
import { Badge, Card, Col, Row } from "react-bootstrap";
import { FaCheckCircle } from "react-icons/fa";
import RevenueOverview from "@/Components/RevenueOverview";

type UnifiedTransactionData = Database['Transaction'] & {
  user: Database['User'];
  car_data: Pick<Database['CarData'], 'id' | 'car_name' | 'brand'>
}

interface RevenueData {
  monthlyData: Array<{
    month: string;
    revenue: number;
    transactions: number;
  }>;
  currentMonthRevenue: number;
  previousMonthRevenue: number;
  growthPercentage: number;
  topCars: Array<{
    name: string;
    revenue: number;
    bookings: number;
  }>;
  totalRevenue: number;
}

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

const SummaryCards = ({
  summary,
}: {
  summary: {
    carsTotal: number;
    rentActive: number;
    users: number;
    ratingAvg: number;
  };
}) => {
  return (
    <Row className="py-2 pt-4">
      <DashboardCard
        title="Total Kendaraan"
        value={summary.carsTotal}
        icon={faCar}
        color="primary"
        link={route("administrator.car-data.index")}
      />
      <DashboardCard
        title="Pinjaman Aktif"
        value={summary.rentActive}
        icon={faCarOn}
        color="info"
        link={route('administrator.car-data.index')}
      />
      <DashboardCard
        title="Pengguna"
        value={summary.users}
        icon={faUsers}
        color="success"
        link="#"
      />
      <DashboardCard
        title="Rata-Rata Penilaian"
        value={summary.ratingAvg || 0}
        icon={faStar}
        color="warning"
        link="#"
      />
    </Row>
  );
};

function RecentTransactions({
  recentTransactions: transactions,
}: {
  recentTransactions: UnifiedTransactionData[];
}) {
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
              <p className="mb-0 fw-medium">{transaction.user.name}</p>
              <p className="mb-0 small text-muted">{transaction.car_data.brand} {transaction.car_data.car_name}</p>
            </div>
          </div>
          <div className="ms-auto text-end">
            <div className="fw-medium">
              {currencyFormat(transaction.total_pay)}
            </div>
            <div className="gap-1 d-flex align-items-center small">
              <Badge
                bg={getRentalStatusColor(transaction.rental_status)}
                className="rounded-pill"
              >
                {getRentalStatusLabel(transaction.rental_status)}
              </Badge>
              <span className="text-muted">
                {dayjs(transaction.created_at).format("DD MMM YYYY")}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const RecentTransactionsCard = ({
  recentTransactions,
}: {
  recentTransactions: UnifiedTransactionData[];
}) => {
  return (
    <Row className="mb-4">
      <Col md="12">
        <Card className="h-100 rounded-4">
          <Card.Header className="px-4 pt-4 bg-white rounded-4 border-bottom-0">
            <Card.Title className="mb-1 h5">Recent Transactions</Card.Title>
            <Card.Subtitle className="mt-1 text-muted">
              Latest rental transactions
            </Card.Subtitle>
          </Card.Header>
          <Card.Body className="px-4 pb-4">
            <RecentTransactions recentTransactions={recentTransactions} />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default function Dashboard({
  summary,
  revenueOverview,
  recentTransactions,
}: {
  summary: {
    carsTotal: number;
    rentActive: number;
    users: number;
    ratingAvg: number;
  };
  revenueOverview: RevenueData;
  recentTransactions: UnifiedTransactionData[];
}) {
  return (
    <AuthenticatedAdmin header={<h2 className="mb-0 h4 text-dark">Beranda</h2>}>
      <Head title="Beranda Admin" />

      <SummaryCards summary={summary} />
      <RevenueOverview revenueData={revenueOverview} />
      <RecentTransactionsCard recentTransactions={recentTransactions} />
    </AuthenticatedAdmin>
  );
}
