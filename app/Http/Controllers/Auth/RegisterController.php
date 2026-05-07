<?php

namespace App\Http\Controllers\Auth;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

class RegisterController extends Controller
{
    public function index()
    {
        return view('auth.register');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->merge([
            'email' => Str::lower(trim((string) $request->input('email'))),
            'username' => Str::lower(trim((string) $request->input('username'))),
        ]);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'username' => [
                'required',
                'string',
                'min:3',
                'max:50',
                'regex:/^[a-z0-9_]+$/',
                'not_in:admin,superadmin,pelatih',
                'unique:users,username',
            ],
            'password' => ['required', 'confirmed', Password::min(6)],
            'phone_number' => ['nullable', 'string', 'max:30'],
            'terms' => ['accepted'],
        ], [
            'username.regex' => 'Username hanya boleh berisi huruf kecil, angka, dan underscore.',
            'username.not_in' => 'Username ini sudah disediakan oleh sistem. Silakan gunakan username lain.',
            'terms.accepted' => 'Anda harus menyetujui Syarat & Ketentuan.',
        ]);

        $user = User::create([
            'name' => trim($validated['name']),
            'email' => $validated['email'],
            'username' => $validated['username'],
            'password' => $validated['password'],
            'phone_number' => $validated['phone_number'] ?? null,
            'role' => UserRole::ADMIN->value,
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('admin.dashboard');
    }
}
