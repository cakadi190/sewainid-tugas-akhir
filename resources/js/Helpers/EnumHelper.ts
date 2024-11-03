import { CarModelEnum, CarStatusEnum } from "@/types/enum";

// Array untuk label CarModelEnum
const carModelLabels: { [key in CarModelEnum]: string } = {
  [CarModelEnum.MINI_VAN]: 'Mini Van',
  [CarModelEnum.VAN]: 'Van',
  [CarModelEnum.CITY_CAR]: 'City Car',
  [CarModelEnum.HATCHBACK]: 'Hatchback',
  [CarModelEnum.SEDAN]: 'Sedan',
  [CarModelEnum.SUV]: 'SUV',
  [CarModelEnum.MPV]: 'MPV',
  [CarModelEnum.PICKUP]: 'Pickup',
  [CarModelEnum.LUXURY_CAR]: 'Luxury Car'
};

// Array untuk label CarStatusEnum
const carStatusLabels: { [key in CarStatusEnum]: string } = {
  [CarStatusEnum.READY]: 'Siap Dipinjamkan',
  [CarStatusEnum.BORROWED]: 'Sudah Disewakan',
  [CarStatusEnum.CRASH]: 'Rusak',
  [CarStatusEnum.REPAIR]: 'Direparasi',
  [CarStatusEnum.MISSING]: 'Hilang',
  [CarStatusEnum.SOLD]: 'Terjual'
};

// Fungsi untuk mendapatkan label dari CarModelEnum
export function getCarModelLabel(model: CarModelEnum): string {
  return carModelLabels[model] || 'Unknown Model';
}

// Fungsi untuk mendapatkan label dari CarStatusEnum
export function getCarStatusLabel(status: CarStatusEnum): string {
  return carStatusLabels[status] || 'Unknown Status';
}
