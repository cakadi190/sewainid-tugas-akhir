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
  license_plate: string;
  color: string;
  year_of_manufacture: number;
  model?: CarModelEnum;
  status?: CarStatusEnum;
  description?: string;
}

export interface GarageData extends BaseModel {
  id: number;
  garage_name: string;
  address: string;
  coordinate?: string;
  capacity: number;
  phone: string;
  opening_time: string;
  closing_time: string;
  is_active: boolean;
  description: string;
}

export interface RepairShopData extends BaseModel {
  id: number;
  repair_shop_name: string;
  address: string;
  coordinate?: string;
  phone: string;
  opening_time: string;
  closing_time: string;
  is_active: boolean;
  description: string;
}

// Main Database Interface
export default interface Database {
  User: WithSoftDeletes<User>;
  CarData: WithSoftDeletes<CarData>;
  GarageData: WithSoftDeletes<GarageData>;
  RepairShopData: WithSoftDeletes<RepairShopData>;
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
