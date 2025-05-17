import { CarConditionEnum } from "@/Helpers/enum";

// Base Interfaces
export interface DeleteColumns {
  deleted_at?: string;
}

export interface BaseModel {
  created_at: string;
  updated_at: string;
}

// Utility type untuk soft delete
export type WithSoftDeletes<T> = T & DeleteColumns;

// Model Interfaces
export interface User extends BaseModel {
  id: number;
  name: string;
  gender?: GenderUser;
  role?: RoleUser;
  address?: string;
  pbirth?: string;
  dbirth?: string;
  email: string;
  email_verified_at?: string;
  password: string;
  avatar: string;
  nik?: string;
  kk?: string;
  sim?: string;
  rememberToken?: string;
}

export interface CarData extends BaseModel {
  id: number;
  car_name: string;
  brand: string;
  frame_number: string;
  engine_number: string;
  slug?: string;
  license_plate: string;
  license_plate_expiration: string;
  vehicle_registration_cert_number: string;
  vehicle_registration_cert_expiration: string;
  color: string;
  vehicle_ownership_book_number: string;
  year_of_manufacture: number;
  transmission?: CarTransmissionEnum;
  model?: CarModelEnum;
  fuel_type?: FuelEnum;
  status?: CarStatusEnum;
  description?: string;
  condition?: CarConditionEnum;
  rent_price: number;
  doors: number;
  mileage?: number;
  seats: number;
  max_speed: number;
  big_luggage: number;
  med_luggage: number;
  small_luggage: number;
  ac: boolean;
  audio: boolean;
  abs: boolean;
  child_lock: boolean;
  traction_control: boolean;
  baby_seat: boolean;
  gps_imei: ?string;
}

export interface CarRepairNoteData extends BaseModel {
  id: string;
  repair_date: string;
  description: string;
  cost: number;
  status: CarRepairNoteStatusEnum;
  last_mileage?: number;
  current_mileage?: number;
  notes?: string;
  car_data_id: number | string;
}

export interface Review extends BaseModel {
  id: number;
  rating: number;
  description: string;
  user_id: number;
  car_data_id: number;
}

// Main Database Interface
export default interface Database {
  User: WithSoftDeletes<User>;
  CarData: WithSoftDeletes<CarData>;
  GarageData: WithSoftDeletes<GarageData>;
  RepairShopData: WithSoftDeletes<RepairShopData>;
  CarRepairNoteData: WithSoftDeletes<CarRepairNoteData>;
  Review: WithSoftDeletes<Review>;
}

// Type helpers untuk mengakses model dengan soft delete
export type SoftDeleteModel<K extends keyof Database> = Database[K];

// Contoh penggunaan:
// type UserWithSoftDelete = SoftDeleteModel<'User'>;
// type CarDataWithSoftDelete = SoftDeleteModel<'CarData'>;

// Utility type untuk membuat partial model (berguna untuk update operations)
export type PartialModel<K extends keyof Database> = Partial<Database[K]>;

// Utility type untuk create operation (tanpa id, created_at, updated_at, deleted_at)
export type CreateModel<K extends keyof Database> = Omit<
  Database[K],
  'id' | 'created_at' | 'updated_at' | 'deleted_at'
>;

// Utility type untuk update operation (tanpa timestamps)
export type UpdateModel<K extends keyof Database> = Omit<
  Partial<Database[K]>,
  'created_at' | 'updated_at' | 'deleted_at'
>;
