import { CarConditionEnum } from "@/Helpers/enum";

// Enum Types
export enum GenderUser {
  MALE = 'male',
  FEMALE = 'female'
}

export enum RoleUser {
  ADMIN = 'admin',
  MONETARY = 'monetary',
  DRIVER = 'driver',
  USER = 'user'
}

export enum CarTransmissionEnum {
  MANUAL = 'manual',
  AUTOMATIC = 'automatic',
  SEMI_MANUAL = 'semi_manual'
}

export enum CarModelEnum {
  MINIVAN = 'minivan',
  VAN = 'van',
  CITY_CAR = 'city_car',
  HATCHBACK = 'hatchback',
  SEDAN = 'sedan',
  SUV = 'suv',
  MPV = 'mpv',
  PICKUP = 'pickup',
  LUXURY_CAR = 'luxury_car'
}

export enum FuelEnum {
  GASOLINE = 'gasoline',
  DIESEL = 'diesel',
  ELECTRIC = 'electric',
  LPG = 'lpg',
  CNG = 'cng',
  BIOFUEL = 'biofuel',
  HYDROGEN = 'hydrogen',
  HYBRID = 'hybrid',
  PLUGIN_HYBRID = 'plugin_hybrid',
  OTHER = 'other'
}

export enum CarStatusEnum {
  READY = 'ready',
  BORROWED = 'borrowed',
  CRASH = 'crash',
  REPAIR = 'repair',
  MISSING = 'missing',
  SOLD = 'sold'
}

export enum CarRepairNoteStatusEnum {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELED = 'canceled'
}

export enum TransactionStatusEnum {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  EXPIRED = 'EXPIRED',
  FAILED = 'FAILED',
  REFUND = 'REFUND'
}

export enum RentalStatusEnum {
  DRAFT = 'draft',
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELED = 'canceled'
}

export enum UsageNoteTypeEnum {
  NORMAL = 'normal',
  LATE = 'late',
  MINOR_DAMAGE = 'minor_damage',
  MAJOR_DAMAGE = 'major_damage',
  PICKED_UP = 'picked_up',
  MISSING = 'missing'
}

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
  role?: RoleUser | { key: string; value: string };
  address?: string;
  pbirth?: string;
  dbirth?: string;
  email: string;
  phone?: string;
  email_verified_at?: string;
  password?: string;
  avatar?: string;
  nik?: string;
  kk?: string;
  sim?: string;
  google_id?: string;
  remember_token?: string;
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
  vehicle_registration_cert_number?: string;
  vehicle_registration_cert_expiration: string;
  color: string;
  vehicle_ownership_book_number?: string;
  year_of_manufacture: number;
  transmission: CarTransmissionEnum;
  model: CarModelEnum;
  fuel_type: FuelEnum;
  status: CarStatusEnum;
  description: string;
  condition: CarConditionEnum;
  rent_price: number;
  doors: number;
  mileage: number;
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
  gps_imei?: string;
}

export interface CarRepairNoteData extends BaseModel {
  id: number;
  repair_date: string;
  description: string;
  cost: number;
  status: CarRepairNoteStatusEnum;
  last_mileage?: number;
  current_mileage?: number;
  notes?: string;
  car_data_id: number;
}

export interface Review extends BaseModel {
  id: number;
  rating: number;
  description?: string;
  user_id?: number;
  car_data_id?: number;
}

export interface Transaction extends BaseModel {
  id: string;
  status: TransactionStatusEnum;
  rental_status: RentalStatusEnum;
  confirmed_at?: string;
  payment_channel?: string;
  payment_references?: string;
  expired_at?: string;
  total_price: number;
  total_pay: number;
  pickup_date?: string;
  return_date?: string;
  place_name: string;
  with_driver: boolean;
  longitude: number;
  latitude: number;
  user_id?: number;
  car_data_id?: number;
}

export interface TransactionConfirmation extends BaseModel {
  id: number;
  transaction_receipt: string;
  transaction_id: string;
  user_id?: number;
}

export interface UsageNoteData extends BaseModel {
  id: number;
  description?: string;
  mileage?: number;
  type: UsageNoteTypeEnum;
  user_id?: number;
  car_data_id?: number;
  transaction_id?: string;
}

export interface Wishlist extends BaseModel {
  id: number;
  user_id?: number;
  car_data_id?: number;
}

export interface AssignDriver extends BaseModel {
  id: number;
  transaction_id: string;
  user_id: number;
}

export interface Media extends BaseModel {
  id: number;
  model_type: string;
  model_id: number;
  uuid?: string;
  collection_name: string;
  name: string;
  file_name: string;
  mime_type?: string;
  disk: string;
  conversions_disk?: string;
  size: number;
  manipulations?: any;
  custom_properties?: any;
  generated_conversions?: any;
  responsive_images?: any;
  order_column?: number;
}

// Missing structures for GarageData and RepairShopData since they weren't in the SQL
export interface GarageData extends BaseModel {
  id: number;
  name: string;
  address: string;
  // Add other fields as needed once we have more info
}

export interface RepairShopData extends BaseModel {
  id: number;
  name: string;
  address: string;
  // Add other fields as needed once we have more info
}

// Main Database Interface
export default interface Database {
  User: WithSoftDeletes<User>;
  CarData: WithSoftDeletes<CarData>;
  GarageData: WithSoftDeletes<GarageData>;
  RepairShopData: WithSoftDeletes<RepairShopData>;
  CarRepairNoteData: WithSoftDeletes<CarRepairNoteData>;
  Review: WithSoftDeletes<Review>;
  Transaction: WithSoftDeletes<Transaction>;
  TransactionConfirmation: WithSoftDeletes<TransactionConfirmation>;
  UsageNoteData: WithSoftDeletes<UsageNoteData>;
  Wishlist: WithSoftDeletes<Wishlist>;
  AssignDriver: WithSoftDeletes<AssignDriver>;
  Media: WithSoftDeletes<Media>;
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
