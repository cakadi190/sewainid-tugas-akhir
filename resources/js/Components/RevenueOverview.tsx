import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { compactCurrencyFormat, currencyFormat } from '@/Helpers/number';

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

interface RevenueOverviewProps {
  revenueData: RevenueData;
}

const RevenueOverview: React.FC<RevenueOverviewProps> = ({ revenueData }) => {
  const monthlyRevenueOptions: ApexOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: ['#6366f1', '#10b981'],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        type: 'vertical',
        colorStops: [
          {
            offset: 0,
            color: '#6366f1',
            opacity: 0.3,
          },
          {
            offset: 100,
            color: '#6366f1',
            opacity: 0.05,
          },
        ],
      },
    },
    grid: {
      borderColor: '#f1f5f9',
      strokeDashArray: 3,
    },
    xaxis: {
      categories: revenueData.monthlyData.map(item => item.month),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px',
        },
        formatter: (value: number) => {
          return compactCurrencyFormat(value);
        },
      },
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (value: number) => currencyFormat(value),
      },
    },
    legend: {
      show: false,
    },
  };

  const monthlyRevenueSeries = [
    {
      name: 'Revenue',
      data: revenueData.monthlyData.map(item => item.revenue),
    },
  ];

  const topCarsOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 300,
      toolbar: {
        show: false,
      },
    },
    colors: ['#f59e0b'],
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetX: 30,
      style: {
        fontSize: '12px',
        colors: ['#1f2937'],
      },
      formatter: (value: number) => compactCurrencyFormat(value),
    },
    grid: {
      show: false,
    },
    xaxis: {
      categories: revenueData.topCars.map(car => car.name),
      labels: {
        formatter: (value: string) => compactCurrencyFormat(parseInt(value)),
        style: {
          colors: '#64748b',
          fontSize: '11px',
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '11px',
        },
        maxWidth: 120,
      },
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (value: number) => currencyFormat(value),
      },
    },
  };

  const topCarsSeries = [
    {
      name: 'Revenue',
      data: revenueData.topCars.map(car => car.revenue),
    },
  ];

  return (
    <Row className="mb-4">
      <Col md="8">
        <Card className="overflow-hidden h-100 rounded-4">
          <Card.Header className="px-4 pt-4 bg-white border-bottom-0">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <Card.Title className="mb-1 h5">Ikhtisar Pendapatan</Card.Title>
                <Card.Subtitle className="text-muted small">
                  Pendapatan bulanan untuk 12 bulan terakhir
                </Card.Subtitle>
              </div>
              <div className="text-end">
                <div className="fs-4 fw-bold text-primary">
                  {currencyFormat(revenueData.currentMonthRevenue)}
                </div>
                <div className="small">
                  <span
                    className={`badge ${
                      revenueData.growthPercentage >= 0
                        ? 'bg-success-subtle text-success'
                        : 'bg-danger-subtle text-danger'
                    }`}
                  >
                    {revenueData.growthPercentage >= 0 ? '+' : ''}
                    {revenueData.growthPercentage}%
                  </span>
                  <span className="text-muted ms-1">dengan bulan sebelumnya</span>
                </div>
              </div>
            </div>
          </Card.Header>
          <Card.Body className="px-4 pb-4">
            <ReactApexChart
              options={monthlyRevenueOptions}
              series={monthlyRevenueSeries}
              type="area"
              height={300}
            />
          </Card.Body>
        </Card>
      </Col>

      <Col md="4">
        <Card className="overflow-hidden h-100 rounded-4">
          <Card.Header className="px-4 pt-4 bg-white border-bottom-0">
            <Card.Title className="mb-1 h6">Top Cars</Card.Title>
            <Card.Subtitle className="text-muted small">
              5 Kendaraan teratas dari pendapatan
            </Card.Subtitle>
          </Card.Header>
          <Card.Body className="px-4 pb-4">
            <ReactApexChart
              options={topCarsOptions}
              series={topCarsSeries}
              type="bar"
              height={250}
            />

            <div className="pt-3 mt-3 border-top">
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted small">Total Revenue</span>
                <span className="fw-bold">
                  {currencyFormat(revenueData.totalRevenue)}
                </span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default RevenueOverview;
