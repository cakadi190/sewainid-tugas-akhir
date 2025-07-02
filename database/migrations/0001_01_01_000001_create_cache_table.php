<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cache', function (Blueprint $table) {
            $table->string('key', 255)->primary()->index();
            $table->mediumText('value')->nullable();
            $table->integer('expiration')->nullable()->index();
        });

        Schema::create('cache_locks', function (Blueprint $table) {
            $table->string('key', 255)->primary()->index();
            $table->string('owner', 255)->nullable()->index();
            $table->integer('expiration')->nullable()->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cache');
        Schema::dropIfExists('cache_locks');
    }
};
