<?php

use App\Enums\RoleUser;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50);
            $table->enum('gender', User::genders()->toArray())->nullable()->default(null);
            $table->enum('role', User::roles()->toArray())->nullable()->default(RoleUser::USER);
            $table->string('pbirth', 60)->nullable()->default(null);
            $table->date('dbirth')->nullable()->default(null);
            $table->string('email', 100)->unique();
            $table->timestamp('email_verified_at')->nullable()->default(null);
            $table->string('password', 255);
            $table->string('avatar', 255);
            $table->string('nik', 20)->unique()->nullable()->comment('Encrypted Data')->default(null);
            $table->string('kk', 20)->nullable()->comment('Encrypted Data')->default(null);
            $table->string('sim', 20)->nullable()->comment('Encrypted Data')->default(null);
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email', 100)->primary();
            $table->string('token', 255);
            $table->timestamp('created_at')->nullable()->default(null);
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id', 255)->primary();
            $table->foreignId('user_id')->nullable()->index()->constrained()->nullOnDelete();
            $table->string('ip_address', 45)->nullable()->default(null);
            $table->text('user_agent')->nullable()->default(null);
            $table->longText('payload')->nullable()->default(null);
            $table->integer('last_activity')->index()->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};

