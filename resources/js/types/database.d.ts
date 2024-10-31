export default interface Database {
  User: {
    id: number;
    name: string;
    gender?: 'male' | 'female' | 'other'; // Sesuaikan sesuai return User::genders()
    role?: 'admin' | 'user'; // Sesuaikan sesuai return User::roles()
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
    created_at: string;
    updated_at: string;
  };

  CarData: {
    id: number;
    name: string;
    brand: string;
    frame_number: string;
    license_plate: string;
    color: string;
    year_of_manufacture: number;
    model: 'SUV' | 'sedan' | 'hatchback' | 'truck' | 'other'; // Sesuaikan sesuai return CarData::getAllCarModels()
    status: 'available' | 'maintenance' | 'rented' | 'sold'; // Sesuaikan sesuai return CarData::getAllCarStatuses()
    description?: string;
    created_at: string;
    updated_at: string;
  };
}
