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
  AT = 'automatic'
}

export enum CarRepairNoteStatusEnum {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

enum GenderUser {
  MALE = 'male',
  FEMALE = 'female',
}

enum RoleUser {
  ADMIN = 'admin',
  MONETARY = 'monetary',
  DRIVER = 'driver',
  USER = 'user',
}
