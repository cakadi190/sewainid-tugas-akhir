<?php

if (!function_exists('errorCode')) {
    /**
     * Memeriksa apakah kode error dari exception adalah integer.
     * Jika bukan integer, mengembalikan 500.
     *
     * @param \Exception $e Exception yang mengandung kode error.
     * @return int Kode error yang valid, atau 500 jika tidak valid.
     */
    function errorCode($e) {
        $code = $e->getCode();
        return is_int($code) ? $code : 500;
    }
}
