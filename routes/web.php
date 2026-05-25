<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Superadmin\AdminManagemetController;
use App\Http\Controllers\Admin\KontingenController;

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

        // Admin User Management
        Route::get('/superadmin/admins-list', [AdminManagemetController::class, 'index'])
            ->name('superadmin.admins.list');
        Route::post('/superadmin/admins-store', [AdminManagemetController::class, 'store'])
            ->name('superadmin.admins.store');
        Route::put('/superadmin/admins-update/{admin}', [AdminManagemetController::class, 'update'])
            ->name('superadmin.admins.update');
        Route::delete('/superadmin/admins-delete/{admin}', [AdminManagemetController::class, 'destroy'])
            ->name('superadmin.admins.destroy');
        });

        // Kontingen Management
        Route::get('/superadmin/kontingen-list', function () {
            return view('superadmin.kontingen');
        })->name('superadmin.kontingen.list');

        // Monitoring Data
        Route::get('/superadmin/monitoring', function () {
            return view('superadmin.monitoring');
        })->name('superadmin.monitoring');

        // Activity Log
        Route::get('/superadmin/activity-log', function () {
            return view('superadmin.activity-log');
        })->name('superadmin.activity-log');

        // Export Data
        Route::get('/superadmin/export', function () {
            return view('superadmin.export');
        })->name('superadmin.export');

        // Settings
        Route::get('/superadmin/settings', function () {
            return view('superadmin.settings');
        })->name('superadmin.settings');

    // Admin Routes
    Route::middleware('role:admin,superadmin')->group(function () {

        Route::get('/admin/dashboard', function () {
            return view('admin.home');
        })->name('admin.dashboard');

        Route::get('/admin/kontingen-list', [KontingenController::class, 'index']);
        Route::post('/admin/kontingen', [KontingenController::class, 'store']);
        Route::put('/admin/kontingen/{kontingen}', [KontingenController::class, 'update']);
        Route::delete('/admin/kontingen/{kontingen}', [KontingenController::class, 'destroy']);
        });
});
