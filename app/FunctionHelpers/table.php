<?php

use Illuminate\Database\Eloquent\Model;

if (!function_exists('convertPluralToSingular')) {
    /**
     * Mengubah nama tabel dari bentuk jamak ke bentuk tunggal.
     *
     * @param string $word Nama tabel dalam bentuk jamak yang akan diubah ke bentuk tunggal.
     * @return string Mengembalikan nama tabel dalam bentuk tunggal.
     */
    function convertPluralToSingular(string $word): string
    {
        $rules = [
            '/(ies)$/i' => 'y',
            '/(oes)$/i' => 'o',
            '/([a-z])s$/i' => '$1',
            '/([^aeiou])es$/i' => '$1',
        ];

        foreach ($rules as $pattern => $replacement) {
            if (preg_match($pattern, $word))
                return preg_replace($pattern, $replacement, $word);
        }

        return $word;
    }
}

if (!function_exists('generateForeignKeyString')) {
    /**
     * Generate foreign key string based on the model class name.
     *
     * @param string $modelClass Class of the model.
     * @return string Foreign key name.
     */
    function generateForeignKeyString(string $modelClass): string
    {
        /** @var \Illuminate\Database\Eloquent\Model $model */
        $model = new $modelClass;

        /** @var string $tableName */
        $tableName = $model->getTable();

        /** @var string $primaryKey */
        $primaryKey = $model->getKeyName();

        $tableName = convertPluralToSingular($tableName);

        return "{$tableName}_{$primaryKey}";
    }
}
