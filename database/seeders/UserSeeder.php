<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['username' => 'superadmin'],
            [
                'name' => 'Super Admin',
                'email' => 'superadmin@mail.com',
                'password' => 'super123',
                'role' => UserRole::SUPERADMIN->value,
                'email_verified_at' => now(),
            ],
        );

        User::query()->updateOrCreate(
            ['username' => 'admin'],
            [
                'name' => 'Admin',
                'email' => 'admin@mail.com',
                'password' => '12345',
                'role' => UserRole::ADMIN->value,
                'email_verified_at' => now(),
            ],
        );
    }
}
