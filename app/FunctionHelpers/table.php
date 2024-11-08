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

        return preg_replace_callback('/(ies|oes|[a-z]s|[^aeiou]es)$/i', function ($matches) use ($rules) {
            foreach ($rules as $pattern => $replacement) {
                if (preg_match($pattern, $matches[0])) {
                    return preg_replace($pattern, $replacement, $matches[0]);
                }
            }
            return $matches[0];
        }, $word);
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
        $model = new $modelClass;
        $tableName = convertPluralToSingular($model->getTable());
        $primaryKey = $model->getKeyName();

        return "{$tableName}_{$primaryKey}";
    }
}
