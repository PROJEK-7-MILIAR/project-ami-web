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
            return view('superadmin.dashboard');
        })->name('superadmin.dashboard');

        // CRUD Admin
        Route::get('/superadmin/admins-list', [AdminManagemetController::class, 'index'])
            ->name('superadmin.admins.list');
        Route::post('/superadmin/admins-store', [AdminManagemetController::class, 'store'])
            ->name('superadmin.admins.store');
        Route::put('/superadmin/admins-update/{admin}', [AdminManagemetController::class, 'update'])
            ->name('superadmin.admins.update');
        Route::delete('/superadmin/admins-delete/{admin}', [AdminManagemetController::class, 'destroy'])
            ->name('superadmin.admins.destroy');
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
