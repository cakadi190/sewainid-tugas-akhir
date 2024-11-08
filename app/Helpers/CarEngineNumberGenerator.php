<?php

namespace App\Helpers;

use Illuminate\Support\Str;

/**
 * Class for generating random car engine numbers
 *
 * This class implements the logic to generate random car engine numbers.
 * The generated number is a string of 10 characters.
 *
 * @package CarEngineNumberGenerator
 * @author Your Name
 * @version 1.0.0
 */
class CarEngineNumberGenerator
{
    /**
     * Generate random car engine number
     *
     * @return string Generated car engine number
     */
    public static function generateEngineNumber(): string {
        return Str::random(10);
    }
}
