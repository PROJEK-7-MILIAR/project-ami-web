<?php

namespace App\Http\Controllers\Superadmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class AdminManagemetController extends Controller
{
    public function index(){
        $admins = User::where('role', 'admin')->get();

        return view('superadmin.admin', compact('admins'));
    }

    public function store(Request $request){
        $request->validate([
            'name'=> 'required|string|max:255',
            'email'=> 'required|string|email|max:255|unique:users',
            'username'=> 'required|string|max:255|unique:users',
            'password'=> 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name'=> $request->name,
            'email'=> $request->email,
            'username'=> $request->username,
            'password'=> bcrypt($request->password),
        ]);
        return response()->json([
        'message' => 'Admin berhasil ditambahkan',
        'data' => $user
        ], 201);
    }

    public function update(Request $request, User $admin){
        if($admin->role !== 'admin'){
            abort(404, 'Pengguna tidak ditemukan');
        }

        $admin->update([
            'name' => $request->name,
            'email' => $request->email,
            'username' => $request->username,
            'password' => bcrypt($request->password),
        ]);
        // return back()->with('success', 'Admin berhasil diperbarui');
        return response()->json([
            'message'=> 'Admin berhasil diperbarui'
        ]);

    }

    public function destroy(User $admin){
        if($admin->role !== 'admin'){
            abort(404, 'Pengguna tidak ditemukan');
        }

        $admin->delete();
        return response()->json([
            'message'=> 'Admin berhasil dihapus'
        ]);
    }
}
