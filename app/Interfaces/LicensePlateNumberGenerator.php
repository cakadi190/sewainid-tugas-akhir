<?php

namespace App\Interfaces;

/**
 * Interface for Indonesian License Plate Number Generator
 *
 * This interface defines the contract for generating valid Indonesian vehicle
 * license plate numbers. The implementation should follow the official format
 * and regulations set by the Indonesian Police Department (Korps Lalu Lintas
 * Polri).
 *
 * License Plate Format Rules:
 * 1. Region Code: 1-2 letters indicating the registration area
 * 2. Numbers: 1-4 digits
 * 3. End Letters: 1-3 letters (excluding I and O to avoid confusion with 1 and 0)
 *
 * Example formats:
 * - B 1234 ABC (Jakarta)
 * - AB 123 DE (Yogyakarta)
 * - L 1 XX (East Java)
 *
 * @package App\Interfaces
 * @version 2.1.0
 * @since 1.0.0
 */
interface LicensePlateNumberGenerator
{
    /**
     * Generates a valid Indonesian license plate number
     *
     * Generates a random license plate number following Indonesian regulations.
     * If a region is specified, the generated number will use that region's code.
     * If no region is specified, a random region will be selected.
     *
     * @param string|null $region The name of the region/province (e.g., "DKI Jakarta", "East Java")
     * @return string A valid license plate number in the format: "CODE NUMBER LETTERS"
     * @throws \Exception If the specified region is invalid or not found
     *
     * @example
     * // Generate a random plate number for any region
     * generateLicensePlate(); // Returns "B 1234 ABC"
     *
     * @example
     * // Generate a plate number for a specific region
     * generateLicensePlate("DKI Jakarta"); // Returns "B 5678 XY"
     */
    public function generateLicensePlate(?string $region = null): string;

    /**
     * Returns a list of all valid regions/provinces
     *
     * Provides an array of all regions/provinces that can be used for
     * license plate generation. This includes all Indonesian provinces,
     * including the recently formed provinces in Papua.
     *
     * @return array List of region/province names
     *
     * @example
     * // Get all available regions
     * getRegionList(); // Returns ["Aceh", "North Sumatra", "DKI Jakarta", ...]
     */
    public function getRegionList(): array;

    /**
     * Retrieves the registration codes for a specific region
     *
     * Returns an array of valid registration codes for the specified region.
     * Some regions may have multiple valid codes due to historical reasons
     * or administrative divisions.
     *
     * @param string $region The name of the region/province
     * @return array|null Array of valid codes for the region, or null if region not found
     * @throws \Exception If the region parameter is empty or invalid
     *
     * @example
     * // Get codes for Jakarta
     * getRegionCode("DKI Jakarta"); // Returns ["B"]
     *
     * @example
     * // Get codes for East Java
     * getRegionCode("East Java"); // Returns ["L", "M", "N", "P", "S", "W", "AG", "AE"]
     */
    public function getRegionCode(string $region): ?array;
}
