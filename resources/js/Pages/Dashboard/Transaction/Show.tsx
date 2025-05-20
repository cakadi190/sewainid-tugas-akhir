import GlobalHeader from "@/Components/GlobalPartial/HeaderComponent";
import AuthenticatedUser from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import DashboardImage from '@/Assets/Images/Cover-Dashboard.jpg';

export default function TransactionPageDetail() {
  return (
    <AuthenticatedUser
      header={
        <GlobalHeader
          title="Detail Transaksi"
          description="Halaman ini menampilkan daftar semua transaksi yang Anda lakukan, termasuk transaksi yang sedang berlangsung dan yang sudah selesai. Anda dapat melihat detail transaksi dan statusnya di sini."
          backgroundImage={DashboardImage}
          breadcrumbItems={[
            { label: 'Beranda', url: route('home') },
            { label: 'Dasbor', url: route('dashboard') },
            { label: 'Semua Transaksi', url: route('dashboard.transaction') },
            { label: 'Detail Transaksi' },
          ]}
        />
      }>
      <Head title="Detail Transaksi" />
    </AuthenticatedUser>
  )
}
