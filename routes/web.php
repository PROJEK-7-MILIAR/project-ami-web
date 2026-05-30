<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Superadmin\DashboardController;
use App\Http\Controllers\Superadmin\AdminManagemetController;
use App\Http\Controllers\Superadmin\KontingenController as SuperAdminKontingenController;
use App\Http\Controllers\Superadmin\MonitoringController;
use App\Http\Controllers\Superadmin\ActivityLogController;
use App\Http\Controllers\Admin\KontingenController;
use App\Http\Controllers\Admin\KontingenDetailController;
use App\Http\Controllers\Admin\PelatihController;
use App\Http\Controllers\Admin\AtletController;
use App\Http\Controllers\Admin\JadwalController;
use App\Http\Controllers\Admin\KontingenFileController;

Route::get('/', function () {
    return view('index');
});

// Guest Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'index'])->name('login');
    Route::get('/register', [RegisterController::class, 'index'])->name('register');
    Route::post('/register', [RegisterController::class, 'store'])->name('register.store');
    Route::post('/login', [LoginController::class, 'authenticate'])->name('login.authenticate');
});

// Authenticated Routes
Route::middleware('auth')->group(function () {

    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

    // =========================================================
    // SUPERADMIN ROUTES
    // =========================================================
    Route::middleware('role:superadmin')->group(function () {

        Route::get('/superadmin/dashboard', function () {
            return view('superadmin.dashboard');
        })->name('superadmin.dashboard');
        Route::get('/superadmin/dashboard/stats', [DashboardController::class, 'getStats']);

        // Admin User Management
        Route::get('/superadmin/admins-list', [AdminManagemetController::class, 'index'])->name('superadmin.admins.list');
        Route::post('/superadmin/admins-store', [AdminManagemetController::class, 'store'])->name('superadmin.admins.store');
        Route::put('/superadmin/admins-update/{admin}', [AdminManagemetController::class, 'update'])->name('superadmin.admins.update');
        Route::delete('/superadmin/admins-delete/{admin}', [AdminManagemetController::class, 'destroy'])->name('superadmin.admins.destroy');

        // Kontingen Management
        Route::get('/superadmin/kontingen-list', function () {
            return view('superadmin.kontingen');
        })->name('superadmin.kontingen.list');
        Route::get('/superadmin/kontingen/data', [SuperAdminKontingenController::class, 'getAllData']);
        Route::delete('/superadmin/kontingen/{id}', [SuperAdminKontingenController::class, 'destroy']);

        // Monitoring Data
        Route::get('/superadmin/monitoring', function () {
            return view('superadmin.monitoring');
        })->name('superadmin.monitoring');
        Route::get('/superadmin/monitoring/pelatih', [MonitoringController::class, 'getPelatih']);
        Route::get('/superadmin/monitoring/atlet', [MonitoringController::class, 'getAtlet']);
        Route::get('/superadmin/monitoring/absensi', [MonitoringController::class, 'getAbsensi']);

        // Activity Log
        Route::get('/superadmin/activity-log', function () {
            return view('superadmin.activity-log');
        })->name('superadmin.activity-log');
        Route::get('/superadmin/activity-log/data', [ActivityLogController::class, 'getLogs']);

        // Export Data
        Route::get('/superadmin/export', function () {
            return view('superadmin.export');
        })->name('superadmin.export');

        // Settings
        Route::get('/superadmin/settings', function () {
            return view('superadmin.settings');
        })->name('superadmin.settings');

    });


    // =========================================================
    // ADMIN ROUTES
    // =========================================================
    Route::middleware('role:admin')->group(function () {

        // Dashboard Admin
        Route::get('/admin/dashboard', function () {
            return view('admin.home');
        })->name('admin.dashboard');

        // Manajemen Kontingen Utama
        Route::get('/admin/kontingen-list', [KontingenController::class, 'index']);
        Route::post('/admin/kontingen', [KontingenController::class, 'store']);
        Route::put('/admin/kontingen/{kontingen}', [KontingenController::class, 'update']);
        Route::delete('/admin/kontingen/{kontingen}', [KontingenController::class, 'destroy']);

        // Detail Page
        Route::get('/admin/kontingen-detail/{id}', [KontingenDetailController::class, 'show'])->name('kontingen.detail');
        Route::get('/admin/kontingen-detail/{id}/data', [KontingenDetailController::class, 'getAllData']);

        // CRUD Pelatih
        Route::post('/admin/kontingen/{id}/pelatih', [PelatihController::class, 'store']);
        Route::put('/admin/pelatih/{pelatih}', [PelatihController::class, 'update']);
        Route::delete('/admin/pelatih/{pelatih}', [PelatihController::class, 'destroy']);

        // CRUD Atlet
        Route::post('/admin/kontingen/{id}/atlet', [AtletController::class, 'store']);
        Route::put('/admin/atlet/{atlet}', [AtletController::class, 'update']);
        Route::delete('/admin/atlet/{atlet}', [AtletController::class, 'destroy']);

        // CRUD Jadwal Pertandingan
        Route::post('/admin/kontingen/{id}/jadwal', [JadwalController::class, 'store']);
        Route::put('/admin/jadwal/{jadwal}', [JadwalController::class, 'update']);
        Route::delete('/admin/jadwal/{jadwal}', [JadwalController::class, 'destroy']);

        // File Management (Program Latihan & Laporan Bulanan)
        Route::post('/admin/kontingen/{id}/file', [KontingenFileController::class, 'store']);
        Route::delete('/admin/file/{file}', [KontingenFileController::class, 'destroy']);
        Route::get('/admin/file/{file}/download', [KontingenFileController::class, 'download']);
    });

});
