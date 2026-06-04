<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jadwal extends Model
{
    use HasFactory;

    protected $fillable = [
        'kontingen_id', 'no', 'nama', 'tanggal', 'jam', 'tempat', 'created_by'
    ];

    public function kontingen()
    {
        return $this->belongsTo(Kontingen::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
