<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pelatih;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class PelatihController extends Controller
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
            $path = $request->file('foto')->store('pelatih_fotos', 'public');
            $fotoPath = '/storage/' . $path;
        }

        $pelatih = Pelatih::create([
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
            'description' => 'Menambahkan pelatih baru: ' . $request->nama
        ]);

        return response()->json(['message' => 'Pelatih berhasil ditambahkan', 'data' => $pelatih]);
    }

    public function update(Request $request, Pelatih $pelatih)
    {
        if ($pelatih->created_by !== Auth::id()) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        $request->validate(['nama' => 'required|string|max:255']);
        $pelatih->update(['nama' => $request->nama]);

        ActivityLog::create([
            'admin' => Auth::user()->name ?? Auth::user()->username,
            'type' => 'edit',
            'description' => 'Mengubah data pelatih: ' . $request->nama
        ]);

        return response()->json(['message' => 'Data pelatih diperbarui']);
    }

    public function destroy(Pelatih $pelatih)
    {
        if ($pelatih->created_by !== Auth::id()) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        if ($pelatih->foto && strpos($pelatih->foto, '/storage/') === 0) {
            $path = str_replace('/storage/', '', $pelatih->foto);
            Storage::disk('public')->delete($path);
        }

        ActivityLog::create([
            'admin' => Auth::user()->name ?? Auth::user()->username,
            'type' => 'delete',
            'description' => 'Menghapus data pelatih: ' . $pelatih->nama
        ]);

        $pelatih->delete();
        return response()->json(['message' => 'Data pelatih dihapus']);
    }
}
