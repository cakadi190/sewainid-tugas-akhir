import { CarModelEnum, CarStatusEnum } from "@/types/enum";

/**
 * Objek yang memetakan nilai enum CarModelEnum ke label yang sesuai dalam bahasa Indonesia
 * Digunakan untuk menampilkan label yang mudah dibaca untuk setiap jenis model mobil
 */
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

/**
 * Objek yang memetakan nilai enum CarStatusEnum ke label yang sesuai dalam bahasa Indonesia
 * Digunakan untuk menampilkan status mobil dalam format yang mudah dibaca
 */
const carStatusLabels: { [key in CarStatusEnum]: string } = {
  [CarStatusEnum.READY]: 'Siap Dipinjamkan',
  [CarStatusEnum.BORROWED]: 'Sudah Disewakan',
  [CarStatusEnum.CRASH]: 'Rusak',
  [CarStatusEnum.REPAIR]: 'Direparasi',
  [CarStatusEnum.MISSING]: 'Hilang',
  [CarStatusEnum.SOLD]: 'Terjual'
};

/**
 * Mengambil label yang sesuai untuk model mobil tertentu
 * @param model - Nilai enum CarModelEnum yang akan dikonversi ke label
 * @returns Label string yang sesuai untuk model mobil tersebut, atau 'Unknown Model' jika tidak ditemukan
 */
export function getCarModelLabel(model: CarModelEnum): string {
  return carModelLabels[model] || 'Unknown Model';
}

/**
 * Mengambil label yang sesuai untuk status mobil tertentu
 * @param status - Nilai enum CarStatusEnum yang akan dikonversi ke label
 * @returns Label string yang sesuai untuk status mobil tersebut, atau 'Unknown Status' jika tidak ditemukan
 */
export function getCarStatusLabel(status: CarStatusEnum): string {
  return carStatusLabels[status] || 'Unknown Status';
}
