<?php

if (!function_exists('isNotEmptyArray')) {
    /**
     * Fungsi ini memeriksa apakah array tidak kosong.
     *
     * @param array $arr Array yang akan diperiksa.
     * @return bool Mengembalikan true jika array tidak kosong, false jika tidak.
     */
    function isNotEmptyArray(array $arr): bool
    {
        return is_array($arr) && !empty($arr);
    }
}

if (!function_exists('convertNullIntoArray')) {
    /**
     * Fungsi ini mengonversi nilai null menjadi array kosong.
     *
     * @param array|null $arr Array yang akan dikonversi.
     * @return array Mengembalikan array jika nilai bukan null, array kosong jika null.
     */
    function convertNullIntoArray(?array $arr): array
    {
        return is_array($arr) ? $arr : [];
    }
}

if (!function_exists('isTruthy')) {
    /**
     * Fungsi ini memeriksa apakah nilai adalah benar.
     *
     * @param mixed $value Nilai yang akan diperiksa.
     * @return bool Mengembalikan true jika nilai adalah benar, false jika tidak.
     */
    function isTruthy($value): bool
    {
        return in_array($value, ['1', 'true', true, 1], true);
    }
}

if (!function_exists('isFalsy')) {
    /**
     * Fungsi ini memeriksa apakah nilai adalah salah.
     *
     * @param mixed $value Nilai yang akan diperiksa.
     * @return bool Mengembalikan true jika nilai adalah salah, false jika tidak.
     */
    function isFalsy($value): bool
    {
        return in_array($value, ['0', 'false', false, 0], true);
    }
}

if (!function_exists('returnConditionIfTrue')) {
    /**
     * Fungsi ini mengembalikan nilai jika kondisi adalah benar.
     *
     * @param bool $condition Kondisi yang akan diperiksa.
     * @param mixed $returnedValue Nilai yang akan dikembalikan jika kondisi benar.
     * @return mixed Mengembalikan nilai jika kondisi benar, null jika tidak.
     */
    function returnConditionIfTrue(bool $condition, $returnedValue)
    {
        return $condition ? $returnedValue : null;
    }
}

if (!function_exists('returnConditionIfFalse')) {
    /**
     * Fungsi ini mengembalikan nilai jika kondisi adalah salah.
     *
     * @param bool $condition Kondisi yang akan diperiksa.
     * @param mixed $returnedValue Nilai yang akan dikembalikan jika kondisi salah.
     * @return mixed Mengembalikan nilai jika kondisi salah, null jika tidak.
     */
    function returnConditionIfFalse(bool $condition, $returnedValue)
    {
        return !$condition ? $returnedValue : null;
    }
}

if (!function_exists('returnTrueConditionIfUndefined')) {
    /**
     * Fungsi ini mengembalikan nilai jika kondisi adalah tidak terdefinisi.
     *
     * @param mixed $condition Kondisi yang akan diperiksa.
     * @param mixed $returnedValue Nilai yang akan dikembalikan jika kondisi tidak terdefinisi.
     * @return mixed Mengembalikan nilai jika kondisi tidak terdefinisi, null jika tidak.
     */
    function returnTrueConditionIfUndefined($condition, $returnedValue)
    {
        return is_null($condition) ? $returnedValue : null;
    }
}

if (!function_exists('returnFalseConditionIfUndefined')) {
    /**
     * Fungsi ini mengembalikan nilai jika kondisi adalah tidak terdefinisi.
     *
     * @param mixed $condition Kondisi yang akan diperiksa.
     * @param mixed $returnedValue Nilai yang akan dikembalikan jika kondisi tidak terdefinisi.
     * @return mixed Mengembalikan nilai jika kondisi tidak terdefinisi, null jika tidak.
     */
    function returnFalseConditionIfUndefined($condition, $returnedValue)
    {
        return !is_null($condition) ? $returnedValue : null;
    }
}

if (!function_exists('includeSome')) {
    /**
     * Fungsi ini memeriksa apakah string mengandung nilai tertentu.
     *
     * @param string $str String yang akan diperiksa.
     * @param string $value Nilai yang akan dicari dalam string.
     * @return bool Mengembalikan true jika string mengandung nilai, false jika tidak.
     */
    function includeSome(string $str, string $value): bool
    {
        return strpos($str, $value) !== false;
    }
}

if (!function_exists('returnNullIfUndefined')) {
    /**
     * Fungsi ini mengembalikan nilai dari variabel global jika variabel tidak terdefinisi.
     *
     * @param string $varName Nama variabel global yang akan diperiksa.
     * @return mixed Mengembalikan nilai variabel global jika terdefinisi, null jika tidak.
     */
    function returnNullIfUndefined(string $varName)
    {
        return $GLOBALS[$varName] ?? null;
    }
}
