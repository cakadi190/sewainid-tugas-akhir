<?php

namespace App\Helpers;

use App\Interfaces\LicensePlateNumberGenerator as LicensePlateNumberGeneratorInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

/**
 * Class for generating Indonesian vehicle license plate numbers
 *
 * This class implements the logic to generate valid vehicle license plate
 * numbers according to the format and rules applicable in Indonesia.
 * Includes all provinces including the latest territorial expansions.
 *
 * License plate format: [Region Code] [Number] [Letters]
 * Example: B 1234 ABC
 *
 * @package LicensePlate
 * @author Cak Adi
 * @version 2.1.0
 */
class LicensePlateNumberGenerator implements LicensePlateNumberGeneratorInterface {
    /**
     * List of region codes for each province in Indonesia using Collection
     */
    private Collection $regionCodes;

    public function __construct()
    {
        $this->regionCodes = collect([
            'Aceh' => ['BL'],
            'North Sumatra' => ['BB', 'BK', 'BA'],
            'West Sumatra' => ['BA'],
            'Riau' => ['BM'],
            'Riau Islands' => ['BP'],
            'Jambi' => ['BH'],
            'South Sumatra' => ['BG', 'BN'],
            'Bangka Belitung Islands' => ['BN'],
            'Bengkulu' => ['BD'],
            'Lampung' => ['BE', 'BH'],

            'DKI Jakarta' => ['B'],
            'Banten' => ['A'],
            'West Java' => ['D', 'E', 'F', 'T', 'Z'],
            'Central Java' => ['G', 'H', 'K', 'R', 'AA', 'AD'],
            'DI Yogyakarta' => ['AB'],
            'East Java' => ['L', 'M', 'N', 'P', 'S', 'W', 'AG', 'AE'],

            'Bali' => ['DK'],
            'West Nusa Tenggara' => ['DR', 'EA'],
            'East Nusa Tenggara' => ['DH', 'EB'],

            'West Kalimantan' => ['KB'],
            'Central Kalimantan' => ['KH'],
            'South Kalimantan' => ['DA'],
            'East Kalimantan' => ['KT'],
            'North Kalimantan' => ['KU'],

            'North Sulawesi' => ['DB', 'DL'],
            'Gorontalo' => ['DM'],
            'Central Sulawesi' => ['DN'],
            'West Sulawesi' => ['DC'],
            'South Sulawesi' => ['DD', 'DP', 'DW'],
            'Southeast Sulawesi' => ['DT'],

            'Maluku' => ['DE', 'DG'],
            'North Maluku' => ['DG'],

            'Papua' => ['DS'],
            'West Papua' => ['PB'],
            'South Papua' => ['PA'],
            'Central Papua' => ['PC'],
            'Highland Papua' => ['PG'],
            'Southwest Papua' => ['PD']
        ]);
    }

    /**
     * Generate random number with 1-4 digits length
     *
     * @return string Generated number with '0' padding in front if needed
     */
    private function generateNumber(): string {
        return Str::padLeft((string)random_int(1, 9999), random_int(1, 4), '0');
    }

    /**
     * Generate random letter combination for the back of the plate
     *
     * Generates 1-3 random letters from A-Z (except I and O to avoid
     * confusion with numbers 1 and 0)
     *
     * @return string Generated letter combination
     */
    private function generateBackLetters(): string {
        return collect(range('A', 'Z'))
            ->reject(fn($char) => in_array($char, ['I', 'O']))
            ->random(random_int(1, 3))
            ->implode('');
    }

    /**
     * {@inheritdoc}
     *
     * @throws \Exception If the provided region is not registered
     */
    public function generateLicensePlate(?string $region = null): string {
        $region = $region ?? $this->regionCodes->keys()->random();

        if (!$this->regionCodes->has($region)) {
            throw new \Exception("Region '$region' is not valid");
        }

        $regionCode = collect($this->regionCodes->get($region))->random();
        $number = $this->generateNumber();
        $backLetters = $this->generateBackLetters();

        return sprintf("%s %s %s", $regionCode, $number, $backLetters);
    }

    /**
     * Get list of regions
     *
     * @return array
     */
    public function getRegionList(): array
    {
        return $this->regionCodes->keys()->toArray();
    }

    /**
     * Get region code based on region name
     *
     * @param string $region
     * @return array|null
     */
    public function getRegionCode(string $region): ?array
    {
        return $this->regionCodes->get($region);
    }
}
