<?php

namespace App\Console\Commands;

use App\Helpers\CarEngineNumberGenerator;
use App\Helpers\IndonesianVinGenerator;
use App\Helpers\LicensePlateNumberGenerator;
use App\Helpers\VehicleRegCodeGenerator;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class GenerateVehicleDataCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'vehicle:generate
                            {vehicle_name : Nama lengkap kendaraan}
                            {--region= : Kode wilayah untuk registrasi kendaraan}
                            {--count=1 : Jumlah data yang akan dihasilkan}
                            {--output=table : Format output (table/json)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Menghasilkan data kendaraan acak berdasarkan nama lengkap kendaraan';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $vehicleName = $this->argument('vehicle_name');
        $region = $this->option('region');
        $count = (int) $this->option('count');
        $output = $this->option('output');

        $this->info("Menghasilkan data untuk kendaraan: {$vehicleName}");

        try {
            $results = [];

            for ($i = 0; $i < $count; $i++) {
                $result = $this->generateVehicleData($vehicleName, $region);
                $results[] = $result;
            }

            if ($output === 'json') {
                $this->output->writeln(json_encode($results, JSON_PRETTY_PRINT));
            } else {
                $this->displayTableOutput($results);
            }

            return self::SUCCESS;
        } catch (Exception $e) {
            $this->error('Error: ' . $e->getMessage());

            return self::FAILURE;
        }
    }

    /**
     * Menghasilkan data kendaraan acak berdasarkan nama lengkap kendaraan
     *
     * @param  string  $vehicleName  Nama lengkap kendaraan
     * @param  string|null  $region  Kode wilayah untuk registrasi kendaraan
     * @return array Data kendaraan yang dihasilkan
     */
    private function generateVehicleData(string $vehicleName, ?string $region): array
    {
        // Membuat instance dari generator yang diperlukan
        $regionCode = $region ?? $this->getRegionCodeFromName($vehicleName);
        $regCodeGenerator = new VehicleRegCodeGenerator($regionCode);
        $vinGenerator = new IndonesianVinGenerator;
        $licensePlateGenerator = new LicensePlateNumberGenerator;

        // Menghasilkan nomor plat berdasarkan wilayah yang dapat ditentukan
        $licensePlate = $licensePlateGenerator->generateLicensePlate($this->getRegionNameFromCode($regionCode));

        return [
            'vehicle_name' => $vehicleName,
            'registration_code' => $regCodeGenerator->generate(),
            'vin' => $vinGenerator->generateVin(),
            'engine_number' => CarEngineNumberGenerator::generateEngineNumber(),
            'license_plate' => $licensePlate,
            'generated_at' => now()->format('Y-m-d H:i:s'),
            'vehicle_ownership' => Str::random(8),
            'imei' => sprintf('%02d%06d%06d', rand(1, 99), rand(1, 999999), rand(1, 999999)),
        ];
    }

    /**
     * Menampilkan output dalam bentuk tabel
     *
     * @param  array  $results  Data kendaraan yang akan ditampilkan
     */
    private function displayTableOutput(array $results): void
    {
        $headers = [
            'Nama Kendaraan',
            'Nomor STNK',
            'Nomor Rangka',
            'Nomor Mesin',
            'Nomor BPKB',
            'Plat Nomor',
            'IMEI GPS',
            'Dibuat Pada',
        ];

        $rows = collect($results)->map(function ($item) {
            return [
                $item['vehicle_name'],
                $item['registration_code'],
                $item['vin'],
                $item['engine_number'],
                $item['vehicle_ownership'],
                $item['license_plate'],
                $item['imei'],
                $item['generated_at'],
            ];
        })->toArray();

        $this->table($headers, $rows);
    }

    /**
     * Mengonversi nama kendaraan menjadi kode wilayah
     *
     * @param  string  $vehicleName  Nama lengkap kendaraan
     * @return string Kode wilayah yang dihasilkan
     */
    private function getRegionCodeFromName(string $vehicleName): string
    {
        // Logika sederhana untuk mendapatkan kode wilayah dari nama kendaraan
        // Ini hanya contoh, Anda bisa memodifikasi sesuai kebutuhan

        // Jika nama mengandung brand tertentu, kembalikan kode wilayah tertentu
        return match (true) {
            Str::contains(strtolower($vehicleName), ['toyota', 'honda', 'daihatsu']) => 'B', // Jakarta
            Str::contains(strtolower($vehicleName), ['suzuki', 'mazda', 'nissan']) => 'D', // Bandung
            Str::contains(strtolower($vehicleName), ['bmw', 'mercedes', 'audi']) => 'AB', // Yogyakarta
            Str::contains(strtolower($vehicleName), ['hyundai', 'byd', 'dfsk', 'chery']) => 'AE', // Madiun
            default => strtoupper(substr($vehicleName, 0, 1)), // Default, gunakan karakter pertama dari nama
        };
    }

    /**
     * Mengonversi kode wilayah menjadi nama wilayah
     *
     * @param  string  $regionCode  Kode wilayah
     * @return string|null Nama wilayah
     */
    private function getRegionNameFromCode(string $regionCode): ?string
    {
        $regionMap = [
            'B' => 'DKI Jakarta',
            'A' => 'Banten',
            'D' => 'West Java',
            'AB' => 'DI Yogyakarta',
            'L' => 'East Java',
            'DK' => 'Bali',
        ];

        return $regionMap[$regionCode] ?? null;
    }
}
