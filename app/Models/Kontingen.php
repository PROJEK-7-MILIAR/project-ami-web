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
}
