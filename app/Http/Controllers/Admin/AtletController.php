<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Atlet;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class AtletController extends Controller
{
    public function store(Request $request, $kontingenId)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'usia' => 'nullable|integer',
            'ttl' => 'nullable|date',
            'prestasi' => 'nullable|string',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $fotoPath = 'https://via.placeholder.com/280x200?text=No+Photo';
        if ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('atlet_fotos', 'public');
            $fotoPath = '/storage/' . $path;
        }

        $atlet = Atlet::create([
            'kontingen_id' => $kontingenId,
            'nama' => $request->nama,
            'usia' => $request->usia,
            'ttl' => $request->ttl,
            'prestasi' => $request->prestasi,
            'foto' => $fotoPath,
            'created_by' => Auth::id()
        ]);

        ActivityLog::create([
            'admin' => Auth::user()->name ?? Auth::user()->username,
            'type' => 'create',
            'description' => 'Menambahkan atlet baru: ' . $request->nama
        ]);

        return response()->json([
            'message' => 'Atlet berhasil ditambahkan',
            'data' => $atlet
        ]);
    }

    public function update(Request $request, Atlet $atlet)
    {
        if ($atlet->created_by !== Auth::id()) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        $request->validate(['nama' => 'required|string|max:255']);
        $atlet->update(['nama' => $request->nama]);

        ActivityLog::create([
            'admin' => Auth::user()->name ?? Auth::user()->username,
            'type' => 'edit',
            'description' => 'Mengubah data atlet: ' . $request->nama
        ]);

        return response()->json(['message' => 'Data atlet diperbarui']);
    }

    public function destroy(Atlet $atlet)
    {
        if ($atlet->created_by !== Auth::id()) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        if ($atlet->foto && strpos($atlet->foto, '/storage/') === 0) {
            $path = str_replace('/storage/', '', $atlet->foto);
            Storage::disk('public')->delete($path);
        }

        ActivityLog::create([
            'admin' => Auth::user()->name ?? Auth::user()->username,
            'type' => 'delete',
            'description' => 'Menghapus data atlet: ' . $atlet->nama
        ]);

        $atlet->delete();
        return response()->json(['message' => 'Data atlet dihapus']);
    }
}
