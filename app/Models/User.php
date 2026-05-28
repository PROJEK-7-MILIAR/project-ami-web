<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Enums\UserRole;
use App\Models\Kontingen;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'username',
        'password',
        'phone_number',
        'role'
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'role'
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === UserRole::ADMIN->value;
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === UserRole::SUPERADMIN->value;
    }

    public function ownedKontingens()
    {
        return $this->hasMany(Kontingen::class, 'owner_id');
    }

    public function joinedKontingens()
    {
        return $this->belongsToMany(Kontingen::class, 'kontingen_user', 'user_id', 'kontingen_id')
                    ->withTimestamps();
    }
}
