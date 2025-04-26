export const getCarRepairStatusLabel = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'Belum Dikerjakan';
    case 'in_progress':
      return 'Dalam Proses';
    case 'completed':
      return 'Selesai';
    case 'canceled':
      return 'Dibatalkan';
    default:
      return '';
  }
};

export const getCarRepairStatusColor = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'bg-warning';
    case 'in_progress':
      return 'bg-primary';
    case 'completed':
      return 'bg-success';
    case 'canceled':
      return 'bg-danger';
    default:
      return '';
  }
};
