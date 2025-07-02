<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->string('queue')->index()->nullable()->default(null);
            $table->longText('payload')->nullable()->default(null);
            $table->unsignedTinyInteger('attempts')->default(0);
            $table->unsignedInteger('reserved_at')->nullable()->default(null);
            $table->unsignedInteger('available_at')->default(0);
            $table->unsignedInteger('created_at')->default(0);
        });

        Schema::create('job_batches', function (Blueprint $table) {
            $table->string('id', 255)->primary()->unique();
            $table->string('name', 255)->nullable()->default(null);
            $table->integer('total_jobs')->default(0);
            $table->integer('pending_jobs')->default(0);
            $table->integer('failed_jobs')->default(0);
            $table->longText('failed_job_ids')->nullable()->default(null);
            $table->mediumText('options')->nullable()->default(null);
            $table->integer('cancelled_at')->nullable()->default(null);
            $table->integer('created_at')->default(0);
            $table->integer('finished_at')->nullable()->default(null);
        });

        Schema::create('failed_jobs', function (Blueprint $table) {
            $table->id();
            $table->string('uuid', 255)->unique();
            $table->text('connection')->nullable()->default(null);
            $table->text('queue')->nullable()->default(null);
            $table->longText('payload')->nullable()->default(null);
            $table->longText('exception')->nullable()->default(null);
            $table->timestamp('failed_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jobs');
        Schema::dropIfExists('job_batches');
        Schema::dropIfExists('failed_jobs');
    }
};
