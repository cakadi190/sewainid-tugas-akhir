<?php

/**
 * Check if the given string is a valid IMEI number.
 *
 * @param string $string The string to check.
 * @return bool True if valid IMEI, false otherwise.
 */
if (!function_exists('is_imei')) {
    function is_imei(string $string): bool
    {
        if (strlen($string) !== 15 || !ctype_digit($string)) {
            return false;
        }
        return is_valid_luhn($string);
    }
}

/**
 * Validate a number using the Luhn algorithm.
 *
 * @param string $number The number to validate.
 * @return bool True if valid according to Luhn, false otherwise.
 */
if (!function_exists('is_valid_luhn')) {
    function is_valid_luhn(string $number): bool
    {
        $sum = 0;
        $alt = false;
        for ($i = strlen($number) - 1; $i >= 0; $i--) {
            $n = (int)$number[$i];
            if ($alt) {
                $n *= 2;
                if ($n > 9) {
                    $n -= 9;
                }
            }
            $sum += $n;
            $alt = !$alt;
        }
        return ($sum % 10) === 0;
    }
}
