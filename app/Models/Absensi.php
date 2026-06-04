<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Absensi extends Model
{
    use HasFactory;

    protected $table = 'absensis';

    protected $fillable = [
        'kontingen_id', 'atlet_id', 'tanggal', 'status', 'created_by'
    ];

    public function kontingen()
    {
        return $this->belongsTo(Kontingen::class);
    }

    public function atlet()
    {
        return $this->belongsTo(Atlet::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
