export enum CarModelEnum {
  MINI_VAN = 'minivan',
  VAN = 'van',
  CITY_CAR = 'city_car',
  HATCHBACK = 'hatchback',
  SEDAN = 'sedan',
  SUV = 'suv',
  MPV = 'mpv',
  PICKUP = 'pickup',
  LUXURY_CAR = 'luxury_car'
}

export enum CarStatusEnum {
  READY = 'ready',
  BORROWED = 'borrowed',
  CRASH = 'crash',
  REPAIR = 'repair',
  MISSING = 'missing',
  SOLD = 'sold'
}

export enum CarTransmissionEnum {
  MT = 'manual',
  AT = 'automatic',
  SMT = 'semi_manual',
}

export enum CarRepairNoteStatusEnum {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
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
  OTHER = 'other',
}

export enum GenderUser {
  MALE = 'male',
  FEMALE = 'female',
}

export enum RoleUser {
  ADMIN = 'admin',
  MONETARY = 'monetary',
  DRIVER = 'driver',
  USER = 'user',
}

export enum CarConditionEnum {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  DAMAGED = 'damaged',
  UNDER_REPAIR = 'under_repair',
}

export enum RentalStatusEnum {
  DRAFT = 'draft',
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}
