<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Tabel Pelatih
        Schema::create('pelatihs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kontingen_id')->constrained()->onDelete('cascade');
            $table->string('nama');
            $table->integer('usia')->nullable();
            $table->date('ttl')->nullable();
            $table->text('prestasi')->nullable();
            $table->string('foto')->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });

        // 2. Tabel Atlet
        Schema::create('atlets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kontingen_id')->constrained()->onDelete('cascade');
            $table->string('nama');
            $table->integer('usia')->nullable();
            $table->date('ttl')->nullable();
            $table->text('prestasi')->nullable();
            $table->string('foto')->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });

        // 3. Tabel File (Untuk Program Latihan & Laporan Bulanan)
        Schema::create('kontingen_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kontingen_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['program', 'laporan']);
            $table->string('nama');
            $table->text('desc')->nullable();
            $table->string('file_name');
            $table->string('file_path');
            $table->string('file_type')->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });

        // 4. Tabel Jadwal Pertandingan
        Schema::create('jadwals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kontingen_id')->constrained()->onDelete('cascade');
            $table->string('no');
            $table->string('nama');
            $table->date('tanggal');
            $table->time('jam')->nullable();
            $table->text('tempat')->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });

        // 5. Tabel Absensi (Relasi ke Atlet)
        Schema::create('absensis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kontingen_id')->constrained()->onDelete('cascade');
            $table->foreignId('atlet_id')->constrained()->onDelete('cascade');
            $table->date('tanggal');
            $table->enum('status', ['hadir', 'absen', 'izin'])->default('hadir');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            $table->unique(['atlet_id', 'tanggal']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('absensis');
        Schema::dropIfExists('jadwals');
        Schema::dropIfExists('kontingen_files');
        Schema::dropIfExists('atlets');
        Schema::dropIfExists('pelatihs');
    }
};
