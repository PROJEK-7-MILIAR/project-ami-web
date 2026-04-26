<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Authentication Routes
Route::get('/login', function () {
    return view('auth.login');
})->name('login');

Route::get('/register', function () {
    return view('auth.register');
})->name('register');

// Superadmin Routes
Route::get('/superadmin/dashboard', function () {
    return view('superadmin.admin-dashboard');
})->name('superadmin.dashboard');

// Admin Routes
Route::get('/admin/dashboard', function () {
    return view('admin.home');
})->name('admin.dashboard');
