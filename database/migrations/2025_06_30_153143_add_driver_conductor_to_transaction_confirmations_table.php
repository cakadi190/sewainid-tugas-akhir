<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            // Data sopir (opsional)
            $table->unsignedInteger('driver_id')->nullable()->index()->after('user_id');
            $table->foreign('driver_id')->references('id')->on('users')->nullOnDelete();

            // Data kernet (opsional)
            $table->unsignedInteger('conductor_id')->nullable()->index()->after('driver_id');
            $table->foreign('conductor_id')->references('id')->on('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['conductor_id']);
            $table->dropForeign(['driver_id']);
            $table->dropColumn(['conductor_id', 'driver_id']);
        });
    }
};
