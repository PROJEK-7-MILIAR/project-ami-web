<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Kontingen extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'code', 'desc', 'address', 'owner_id'
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function members()
    {
        return $this->belongsToMany(User::class, 'kontingen_user', 'kontingen_id', 'user_id')
                    ->withTimestamps();
    }

    public function pelatihs()
    {
        return $this->hasMany(Pelatih::class);
    }

    public function atlets()
    {
        return $this->hasMany(Atlet::class);
    }

    public function programs()
    {
        return $this->hasMany(KontingenFile::class)->where('type', 'program');
    }

    public function laporans()
    {
        return $this->hasMany(KontingenFile::class)->where('type', 'laporan');
    }

    public function jadwals()
    {
        return $this->hasMany(Jadwal::class);
    }

    public function absensis()
    {
        return $this->hasMany(Absensi::class);
    }
}
