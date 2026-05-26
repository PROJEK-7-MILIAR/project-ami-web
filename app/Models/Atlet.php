<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Atlet extends Model
{
    use HasFactory;

    protected $fillable = [
        'kontingen_id', 'nama', 'usia', 'ttl', 'prestasi', 'foto', 'created_by'
    ];

    public function kontingen()
    {
        return $this->belongsTo(Kontingen::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function absensis()
    {
        return $this->hasMany(Absensi::class);
    }
}
