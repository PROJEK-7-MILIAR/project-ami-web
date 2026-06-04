<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE kontingen_files DROP CONSTRAINT IF EXISTS kontingen_files_type_check;");
        DB::statement("ALTER TABLE kontingen_files ADD CONSTRAINT kontingen_files_type_check CHECK (type::text = ANY (ARRAY['program'::text, 'laporan'::text, 'laporantes'::text]));");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE kontingen_files DROP CONSTRAINT IF EXISTS kontingen_files_type_check;");
        DB::statement("ALTER TABLE kontingen_files ADD CONSTRAINT kontingen_files_type_check CHECK (type::text = ANY (ARRAY['program'::text, 'laporan'::text]));");
    }
};
