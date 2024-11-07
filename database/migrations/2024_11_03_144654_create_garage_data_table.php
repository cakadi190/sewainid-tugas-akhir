<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('garage_data', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->string('garage_name')->unique();
            $table->string('address');
            $table->string('coordinate');
            $table->unsignedInteger('capacity')->default(0);
            $table->string('phone')->nullable();
            $table->time('opening_time')->nullable();
            $table->time('closing_time')->nullable();
            $table->boolean('is_active')->default(true);
            $table->text('description')->nullable();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('garage_data');
    }
};
