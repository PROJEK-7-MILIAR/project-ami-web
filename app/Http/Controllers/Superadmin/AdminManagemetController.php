<?php

namespace App\Http\Controllers\Superadmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Auth\Events\Registered;

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
            'password'=> 'required|string|min:6',
        ]);

        $user = User::create([
            'name'=> $request->name,
            'email'=> $request->email,
            'username'=> $request->username,
            'password'=> bcrypt($request->password),
            'role' => 'admin',
        ]);

        event(new Registered($user));

        return response()->json([
        'message' => 'Admin berhasil ditambahkan',
        'data' => $user
        ], 201);
    }

    public function update(Request $request, User $admin){
        if($admin->role !== 'admin'){
            abort(404, 'Pengguna tidak ditemukan');
        }

        $request->validate([
            'name'=> 'required|string|max:255',
            'email'=> 'required|string|email|max:255|unique:users,email,' . $admin->id,
            'username'=> 'required|string|max:255|unique:users,username,' . $admin->id,
            'password'=> 'nullable|string|min:6',
        ]);

        $dataUpdate = [
            'name' => $request->name,
            'email' => $request->email,
            'username' => $request->username,
        ];

        if ($request->filled('password')) {
            $dataUpdate['password'] = bcrypt($request->password);
        }

        $admin->update($dataUpdate);

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
