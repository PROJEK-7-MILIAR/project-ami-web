<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Superadmin\AdminManagemetController;

Route::get('/', function () {
    return view('index');
});

// Testing: Get CSRF Token
    Route::get('/csrf-token', function () {
        return response()->json([
            'csrf_token' => csrf_token()
        ]);
    });

// Guest Routes
Route::middleware('guest')->group(function () {

    Route::get('/login', [LoginController::class, 'index'])
        ->name('login');

    Route::get('/register', [RegisterController::class, 'index'])
        ->name('register');

    Route::post('/register', [RegisterController::class, 'store'])
        ->name('register.store');

    Route::post('/login', [LoginController::class, 'authenticate'])
        ->name('login.authenticate');
});

// Authenticated Routes
Route::middleware('auth')->group(function () {

    Route::post('/logout', [LoginController::class, 'logout'])
        ->name('logout');

    // Superadmin Routes
    Route::middleware('role:superadmin')->group(function () {

        Route::get('/superadmin/dashboard', function () {
            return view('superadmin.admin-dashboard');
        })->name('superadmin.dashboard');
    });

    // Admin Routes
    Route::middleware('role:admin,superadmin')->group(function () {

        Route::get('/admin/dashboard', function () {
            return view('admin.home');
        })->name('admin.dashboard');

        Route::get('/admin/kontingen-detail', function () {
            return view('admin.kontingen-detail');
        })->name('admin.kontingen-detail');

        Route::get('/admin/kontingen-detail.html', function () {
            return redirect()->route('admin.kontingen-detail');
        });
    });
});

// Testing: API Routes for Admin Management
Route::resource('admins', AdminManagemetController::class);
