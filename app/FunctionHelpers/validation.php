<?php

if (!function_exists('isNotEmptyArray')) {
    /**
     * Memeriksa apakah array yang diberikan tidak kosong.
     *
     * @param array $arr - Array yang akan diperiksa.
     * @return bool - Mengembalikan true jika array valid dan memiliki setidaknya satu elemen;
     *                jika tidak, false.
     */
    function isNotEmptyArray(array $arr): bool
    {
        return is_array($arr) && count($arr) > 0;
    }
}

if (!function_exists('convertNullIntoArray')) {
    /**
     * Mengonversi nilai null atau undefined menjadi array kosong.
     *
     * @param array|null $arr - Nilai yang akan diperiksa dan dikonversi.
     * @return array - Mengembalikan array asli jika valid; jika tidak, mengembalikan array kosong.
     */
    function convertNullIntoArray(?array $arr): array
    {
        return is_array($arr) ? $arr : [];
    }
}

if (!function_exists('isTruthy')) {
    /**
     * Menentukan apakah suatu nilai dianggap benar (truthy).
     *
     * Nilai dianggap benar jika bernilai '1', 'true', true, atau 1.
     *
     * @param mixed $value - Nilai yang akan diperiksa.
     * @return bool - True jika nilai dianggap benar, false jika tidak.
     */
    function isTruthy($value): bool
    {
        return in_array($value, ['1', 'true', true, 1], true);
    }
}

if (!function_exists('isFalsy')) {
    /**
     * Menentukan apakah suatu nilai dianggap salah (falsy).
     *
     * Nilai dianggap salah jika bernilai '0', 'false', false, atau 0.
     *
     * @param mixed $value - Nilai yang akan diperiksa.
     * @return bool - True jika nilai dianggap salah, false jika tidak.
     */
    function isFalsy($value): bool
    {
        return in_array($value, ['0', 'false', false, 0], true);
    }
}

if (!function_exists('returnConditionIfTrue')) {
    /**
     * Mengembalikan nilai jika kondisi benar, jika tidak mengembalikan null.
     *
     * @param bool $condition - Kondisi yang akan dievaluasi.
     * @param mixed $returnedValue - Nilai yang dikembalikan jika kondisi benar.
     * @return mixed|null - Nilai yang dikembalikan jika kondisi benar; jika tidak, null.
     */
    function returnConditionIfTrue(bool $condition, $returnedValue)
    {
        return $condition ? $returnedValue : null;
    }
}

if (!function_exists('returnConditionIfFalse')) {
    /**
     * Mengembalikan nilai jika kondisi salah, jika tidak mengembalikan null.
     *
     * @param bool $condition - Kondisi yang akan dievaluasi.
     * @param mixed $returnedValue - Nilai yang dikembalikan jika kondisi salah.
     * @return mixed|null - Nilai yang dikembalikan jika kondisi salah; jika tidak, null.
     */
    function returnConditionIfFalse(bool $condition, $returnedValue)
    {
        return !$condition ? $returnedValue : null;
    }
}

if (!function_exists('returnTrueConditionIfUndefined')) {
    /**
     * Mengembalikan nilai jika kondisi benar, mengembalikan null jika undefined.
     *
     * @param mixed|null $condition - Kondisi yang diperiksa.
     * @param mixed $returnedValue - Nilai yang dikembalikan jika kondisi benar.
     * @return mixed|null - Nilai yang dikembalikan jika kondisi benar, null jika undefined.
     */
    function returnTrueConditionIfUndefined($condition, $returnedValue)
    {
        return is_null($condition) ? $returnedValue : null;
    }
}

if (!function_exists('returnFalseConditionIfUndefined')) {
    /**
     * Mengembalikan nilai jika kondisi salah, mengembalikan null jika undefined.
     *
     * @param mixed|null $condition - Kondisi yang diperiksa.
     * @param mixed $returnedValue - Nilai yang dikembalikan jika kondisi salah.
     * @return mixed|null - Nilai yang dikembalikan jika kondisi salah, null jika undefined.
     */
    function returnFalseConditionIfUndefined($condition, $returnedValue)
    {
        return !is_null($condition) ? $returnedValue : null;
    }
}

if (!function_exists('includeSome')) {
    /**
     * Memeriksa apakah string `str` mengandung substring `value`.
     *
     * @param string $str - String yang akan diperiksa.
     * @param string $value - Substring yang akan dicari dalam `str`.
     * @return bool - Mengembalikan true jika substring ditemukan dalam `str`,
     *                jika tidak mengembalikan false.
     */
    function includeSome(string $str, string $value): bool
    {
        return strpos($str, $value) !== false;
    }
}

if (!function_exists('returnNullIfUndefined')) {
    /**
     * Mengembalikan nilai variabel jika didefinisikan, atau null jika tidak.
     *
     * @param string $varName Nama variabel yang akan diperiksa.
     * @return mixed Nilai variabel jika didefinisikan, atau null jika tidak.
     */
    function returnNullIfUndefined(string $varName)
    {
        return isset($GLOBALS[$varName]) ? $GLOBALS[$varName] : null;
    }
}
