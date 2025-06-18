import { FaCircle, FaExclamation, FaMoneyBill, FaThumbsUp, FaWrench } from "react-icons/fa6";
import { CarConditionEnum, CarModelEnum, CarRepairNoteStatusEnum, CarStatusEnum, CarTransmissionEnum, FuelEnum, GenderUser, RentalStatusEnum, TransactionStatusEnum } from "./enum";

import MiniVanIcon from '@/Assets/Icon/car-type/camper-van.png';
import HatchbackIcon from '@/Assets/Icon/car-type/hatchback.png';
import VanIcon from '@/Assets/Icon/car-type/van.png';
import LuxuryIcon from '@/Assets/Icon/car-type/sport-car.png';
import SuvIcon from '@/Assets/Icon/car-type/suv.png';
import CityCarIcon from '@/Assets/Icon/car-type/city-car.png';
import SedanIcon from '@/Assets/Icon/car-type/sedan.png';
import MpvIcon from '@/Assets/Icon/car-type/mpv.png';
import PickupIcon from '@/Assets/Icon/car-type/pickup.png';
import { FaCheckCircle, FaExclamationTriangle, FaMinusCircle, FaQuestionCircle, FaTimesCircle, FaTools } from "react-icons/fa";

/**
 * Mapping of CarConditionEnum values to human-readable labels in Indonesian
 */
const carConditionLabels: { [key in CarConditionEnum]: string } = {
  [CarConditionEnum.EXCELLENT]: 'Sangat Baik',
  [CarConditionEnum.GOOD]: 'Baik',
  [CarConditionEnum.FAIR]: 'Cukup',
  [CarConditionEnum.POOR]: 'Kurang',
  [CarConditionEnum.DAMAGED]: 'Rusak',
  [CarConditionEnum.UNDER_REPAIR]: 'Sedang Diperbaiki',
};

/**
 * Mapping of CarConditionEnum values to Bootstrap 5 color classes
 */
const carConditionColors: { [key in CarConditionEnum]: string } = {
  [CarConditionEnum.EXCELLENT]: 'success',
  [CarConditionEnum.GOOD]: 'primary',
  [CarConditionEnum.FAIR]: 'warning',
  [CarConditionEnum.POOR]: 'secondary',
  [CarConditionEnum.DAMAGED]: 'danger',
  [CarConditionEnum.UNDER_REPAIR]: 'info',
};

/**
 * Mapping of CarConditionEnum values to icon elements
 */
const carConditionIcons: { [key in CarConditionEnum]: JSX.Element } = {
  [CarConditionEnum.EXCELLENT]: <FaCheckCircle />,
  [CarConditionEnum.GOOD]: <FaThumbsUp />,
  [CarConditionEnum.FAIR]: <FaMinusCircle />,
  [CarConditionEnum.POOR]: <FaExclamationTriangle />,
  [CarConditionEnum.DAMAGED]: <FaTimesCircle />,
  [CarConditionEnum.UNDER_REPAIR]: <FaTools />,
};

/**
 * Mapping of RentalStatusEnum values to human-readable labels in Indonesian
 */
const rentalStatusLabels: { [key in RentalStatusEnum]: string } = {
  [RentalStatusEnum.DRAFT]: 'Draft',
  [RentalStatusEnum.PENDING]: 'Menunggu',
  [RentalStatusEnum.IN_PROGRESS]: 'Sedang Berlangsung',
  [RentalStatusEnum.COMPLETED]: 'Selesai',
  [RentalStatusEnum.CANCELED]: 'Dibatalkan',
}

/**
 * Mapping of RentalStatusEnum values to Bootstrap 5 color classes
 */
const rentalStatusColors: { [key in RentalStatusEnum]: string } = {
  [RentalStatusEnum.DRAFT]: 'bg-secondary',
  [RentalStatusEnum.PENDING]: 'bg-warning',
  [RentalStatusEnum.IN_PROGRESS]: 'bg-primary',
  [RentalStatusEnum.COMPLETED]: 'bg-success',
  [RentalStatusEnum.CANCELED]: 'bg-danger',
}

/**
 * Mapping of CarModelEnum values to human-readable labels in Indonesian
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

const carModelIcons: { [key in CarModelEnum]: string } = {
  [CarModelEnum.MINI_VAN]: MiniVanIcon,
  [CarModelEnum.VAN]: VanIcon,
  [CarModelEnum.CITY_CAR]: CityCarIcon,
  [CarModelEnum.HATCHBACK]: HatchbackIcon,
  [CarModelEnum.SEDAN]: SedanIcon,
  [CarModelEnum.SUV]: SuvIcon,
  [CarModelEnum.MPV]: MpvIcon,
  [CarModelEnum.PICKUP]: PickupIcon,
  [CarModelEnum.LUXURY_CAR]: LuxuryIcon
}

/**
 * Mapping of CarModelEnum values to Bootstrap 5 color classes
 */
const carModelColors: { [key in CarModelEnum]: string } = {
  [CarModelEnum.MINI_VAN]: 'primary',
  [CarModelEnum.VAN]: 'info',
  [CarModelEnum.CITY_CAR]: 'success',
  [CarModelEnum.HATCHBACK]: 'warning',
  [CarModelEnum.SEDAN]: 'danger',
  [CarModelEnum.SUV]: 'secondary',
  [CarModelEnum.MPV]: 'dark',
  [CarModelEnum.PICKUP]: 'light',
  [CarModelEnum.LUXURY_CAR]: 'primary'
};

/**
 * Mapping of CarTransmissionEnum values to human-readable labels in Indonesian
 */
const carTransmissionLabels: { [key in CarTransmissionEnum]: string } = {
  [CarTransmissionEnum.MT]: 'Manual',
  [CarTransmissionEnum.AT]: 'Auto',
  [CarTransmissionEnum.SMT]: 'Semi-Auto',
};

/**
 * Mapping of CarTransmissionEnum values to Bootstrap 5 color classes
 */
const carTransmissionColors: { [key in CarTransmissionEnum]: string } = {
  [CarTransmissionEnum.MT]: 'primary',
  [CarTransmissionEnum.AT]: 'success',
  [CarTransmissionEnum.SMT]: 'secondary',
};

/**
 * Mapping of CarStatusEnum values to human-readable labels in Indonesian
 */
const carStatusLabels: { [key in CarStatusEnum]: string } = {
  [CarStatusEnum.READY]: 'Siap Dipinjam',
  [CarStatusEnum.BORROWED]: 'Sudah Disewa',
  [CarStatusEnum.CRASH]: 'Rusak',
  [CarStatusEnum.REPAIR]: 'Direparasi',
  [CarStatusEnum.MISSING]: 'Hilang',
  [CarStatusEnum.SOLD]: 'Terjual'
};

const carStatusIcons: { [key in CarStatusEnum]: JSX.Element } = {
  [CarStatusEnum.READY]: <FaCircle />,
  [CarStatusEnum.BORROWED]: <FaCircle />,
  [CarStatusEnum.CRASH]: <FaExclamation />,
  [CarStatusEnum.REPAIR]: <FaWrench />,
  [CarStatusEnum.MISSING]: <FaQuestionCircle />,
  [CarStatusEnum.SOLD]: <FaMoneyBill />
};

/**
 * Mapping of CarStatusEnum values to Bootstrap 5 color classes
 */
const carStatusColors: { [key in CarStatusEnum]: string } = {
  [CarStatusEnum.READY]: 'success',
  [CarStatusEnum.BORROWED]: 'primary',
  [CarStatusEnum.CRASH]: 'danger',
  [CarStatusEnum.REPAIR]: 'warning',
  [CarStatusEnum.MISSING]: 'dark',
  [CarStatusEnum.SOLD]: 'secondary'
};

/**
 * Mapping of CarRepairNoteStatusEnum values to human-readable labels in Indonesian
 */
const carRepairStatusLabels: { [key in CarRepairNoteStatusEnum]: string } = {
  [CarRepairNoteStatusEnum.PENDING]: 'Belum Dikerjakan',
  [CarRepairNoteStatusEnum.IN_PROGRESS]: 'Sedang Dikerjakan',
  [CarRepairNoteStatusEnum.COMPLETED]: 'Selesai',
  [CarRepairNoteStatusEnum.CANCELED]: 'Dibatalkan',
};

/**
 * Mapping of CarRepairNoteStatusEnum values to Bootstrap 5 color classes
 */
const carRepairStatusColors: { [key in CarRepairNoteStatusEnum]: string } = {
  [CarRepairNoteStatusEnum.PENDING]: 'secondary',
  [CarRepairNoteStatusEnum.IN_PROGRESS]: 'primary',
  [CarRepairNoteStatusEnum.COMPLETED]: 'success',
  [CarRepairNoteStatusEnum.CANCELED]: 'danger',
};

/**
 * Mapping of FuelEnum values to human-readable labels in Indonesian
 */
const carFuelTypeLabels: { [key in FuelEnum]: string } = {
  [FuelEnum.GASOLINE]: 'Bensin',
  [FuelEnum.DIESEL]: 'Solar',
  [FuelEnum.ELECTRIC]: 'Elektrik / Listrik',
  [FuelEnum.LPG]: 'LPG (Gas Cair)',
  [FuelEnum.CNG]: 'CNG (Gas Terkompresi)',
  [FuelEnum.BIOFUEL]: 'Bahan Bakar Nabati',
  [FuelEnum.HYDROGEN]: 'Hidrogen',
  [FuelEnum.HYBRID]: 'Hibrida',
  [FuelEnum.PLUGIN_HYBRID]: 'Hibrida Plugin',
  [FuelEnum.OTHER]: 'Lainnya',
}

const genderLabels: { [key in GenderUser]: string } = {
  [GenderUser.MALE]: 'Laki-Laki',
  [GenderUser.FEMALE]: 'Perempuan',
}

/**
 * Mapping of FuelEnum values to Bootstrap 5 color classes
 */
const carFuelTypeColors: { [key in FuelEnum]: string } = {
  [FuelEnum.GASOLINE]: 'primary',
  [FuelEnum.DIESEL]: 'info',
  [FuelEnum.ELECTRIC]: 'success',
  [FuelEnum.LPG]: 'warning',
  [FuelEnum.CNG]: 'danger',
  [FuelEnum.BIOFUEL]: 'secondary',
  [FuelEnum.HYDROGEN]: 'dark',
  [FuelEnum.HYBRID]: 'light',
  [FuelEnum.PLUGIN_HYBRID]: 'primary',
  [FuelEnum.OTHER]: 'secondary',
}

/**
 * Mapping of TransactionStatusEnum values to human-readable labels in Indonesian
 */
export const transactionStatusLabels: { [key in TransactionStatusEnum]: string } = {
  [TransactionStatusEnum.UNPAID]: 'Belum Bayar',
  [TransactionStatusEnum.PAID]: 'Sudah Bayar',
  [TransactionStatusEnum.EXPIRED]: 'Kadaluarsa',
  [TransactionStatusEnum.FAILED]: 'Gagal',
  [TransactionStatusEnum.REFUND]: 'Refund',
}

/**
 * Mapping of TransactionStatusEnum values to Bootstrap 5 color classes
 */
export const transactionStatusColors: { [key in TransactionStatusEnum]: string } = {
  [TransactionStatusEnum.UNPAID]: 'bg-yellow-500',
  [TransactionStatusEnum.PAID]: 'bg-green-500',
  [TransactionStatusEnum.EXPIRED]: 'bg-red-500',
  [TransactionStatusEnum.FAILED]: 'bg-red-500',
  [TransactionStatusEnum.REFUND]: 'bg-blue-500',
}

/**
 * Retrieves the human-readable label for a car model
 * @param model - The CarModelEnum value to be converted to a label
 * @returns The corresponding label for the car model, or 'Unknown Model' if not found
 */
export function getCarModelLabel(model: CarModelEnum): string {
  return carModelLabels[model] || 'Unknown Model';
}

export function getGenderLabel(gender: GenderUser): string {
  return genderLabels[gender] || 'Unknown Gender';
}

/**
 * Retrieves the icon for a car model
 * @param model - The CarModelEnum value to be converted to an icon
 * @returns The corresponding icon for the car model, or a blank image if not found
 */
export function CarModelIcon({ model, height }: { model: CarModelEnum; height?: number }): JSX.Element {
  return (
    <img
      src={carModelIcons[model]}
      alt={getCarModelLabel(model)}
      height={height ?? 'auto'}
      width="auto"
    />
  );
};

/**
 * Retrieves the corresponding icon for a car status
 * @param model - The CarStatusEnum value to be converted to an icon
 * @returns The corresponding icon for the car status, or a filled circle if not found
 */
export function getCarStatusIcon(model: CarStatusEnum): JSX.Element {
  return carStatusIcons[model] || <FaCircle />;
}

/**
 * Retrieves the Bootstrap 5 color class for a car model
 * @param model - The CarModelEnum value to be converted to a color
 * @returns The corresponding Bootstrap 5 color class for the car model, or 'secondary' if not found
 */
export function getCarModelColor(model: CarModelEnum): string {
  return carModelColors[model] || 'secondary';
}

/**
 * Retrieves the Bootstrap 5 color class for a rental status
 * @param status - The RentalStatusEnum value to be converted to a color
 * @returns The corresponding Bootstrap 5 color class for the rental status, or 'secondary' if not found
 */
export function getRentalStatusColor(status: RentalStatusEnum): string {
  return rentalStatusColors[status] || 'secondary';
}

/**
 * Retrieves the human-readable label for a rental status.
 * @param status - The RentalStatusEnum value to be converted to a label.
 * @returns The corresponding label for the rental status, or 'Unknown Status' if not found.
 */
export function getRentalStatusLabel(status: RentalStatusEnum): string {
  return rentalStatusLabels[status] || 'Unknown Status';
}

/**
 * Retrieves the human-readable label for a car fuel type.
 * @param fuel - The FuelEnum value to be converted to a label.
 * @returns The corresponding label for the fuel type, or 'Unknown Fuel' if not found.
 */
export function getCarFuelTypeLabel(fuel: FuelEnum): string {
  return carFuelTypeLabels[fuel] || 'Unknown Fuel';
}

/**
 * Retrieves the Bootstrap 5 color class for a car fuel type.
 * @param fuel - The FuelEnum value to be converted to a color.
 * @returns The corresponding Bootstrap 5 color class for the fuel type, or 'secondary' if not found.
 */
export function getCarFuelTypeColor(fuel: FuelEnum): string {
  return carFuelTypeColors[fuel] || 'secondary';
}

/**
 * Retrieves the human-readable label for a car transmission type
 * @param transmission - The CarTransmissionEnum value to be converted to a label
 * @returns The corresponding label for the transmission type, or 'Unknown Transmission' if not found
 */
export function getCarTransmissionLabel(transmission: CarTransmissionEnum): string {
  return carTransmissionLabels[transmission] || 'Unknown Transmission';
}

/**
 * Retrieves the Bootstrap 5 color class for a car transmission type
 * @param transmission - The CarTransmissionEnum value to be converted to a color
 * @returns The corresponding Bootstrap 5 color class for the transmission type, or 'secondary' if not found
 */
export function getCarTransmissionColor(transmission: CarTransmissionEnum): string {
  return carTransmissionColors[transmission] || 'secondary';
}

/**
 * Retrieves the human-readable label for a car repair status
 * @param status - The CarRepairNoteStatusEnum value to be converted to a label
 * @returns The corresponding label for the repair status, or 'Unknown Status' if not found
 */
export function getCarRepairStatusLabel(status: CarRepairNoteStatusEnum): string {
  return carRepairStatusLabels[status] || 'Unknown Status';
}

/**
 * Retrieves the Bootstrap 5 color class for a car repair status
 * @param status - The CarRepairNoteStatusEnum value to be converted to a color
 * @returns The corresponding Bootstrap 5 color class for the repair status, or 'secondary' if not found
 */
export function getCarRepairStatusColor(status: CarRepairNoteStatusEnum): string {
  return carRepairStatusColors[status] || 'secondary';
}

/**
 * Retrieves the human-readable label for a car status
 * @param status - The CarStatusEnum value to be converted to a label
 * @returns The corresponding label for the car status, or 'Unknown Status' if not found
 */
export function getCarStatusLabel(status: CarStatusEnum): string {
  return carStatusLabels[status] || 'Unknown Status';
}

/**
 * Retrieves the Bootstrap 5 color class for a car status
 * @param status - The CarStatusEnum value to be converted to a color
 * @returns The corresponding Bootstrap 5 color class for the car status, or 'secondary' if not found
 */
export function getCarStatusColor(status: CarStatusEnum): string {
  return carStatusColors[status] || 'secondary';
}

/**
 * Retrieves the human-readable label for a car condition
 */
export function getCarConditionLabel(condition: CarConditionEnum): string {
  return carConditionLabels[condition] || 'Kondisi Tidak Diketahui';
}

/**
 * Retrieves the Bootstrap 5 color class for a car condition
 */
export function getCarConditionColor(condition: CarConditionEnum): string {
  return carConditionColors[condition] || 'secondary';
}

/**
 * Retrieves the corresponding icon for a car condition
 */
export function getCarConditionIcon(condition: CarConditionEnum): JSX.Element {
  return carConditionIcons[condition] || <FaQuestionCircle />;
}

/**
 * Retrieves the human-readable label for a transaction status
 * @param status - The TransactionStatusEnum value to be converted to a label
 * @returns The corresponding label for the transaction status, or 'Status Transaksi Tidak Diketahui' if not found
 */
export function getTransactionStatusLabel(status: TransactionStatusEnum): string {
  return transactionStatusLabels[status] || 'Status Transaksi Tidak Diketahui';
}

/**
 * Retrieves the Bootstrap 5 color class for a transaction status
 * @param status - The TransactionStatusEnum value to be converted to a color
 * @returns The corresponding Bootstrap 5 color class for the transaction status, or 'secondary' if not found
 */
export function getTransactionStatusColor(status: TransactionStatusEnum): string {
  return transactionStatusColors[status] || 'secondary';
}
