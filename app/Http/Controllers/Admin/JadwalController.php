<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Jadwal;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class JadwalController extends Controller
{
    public function store(Request $request, $kontingenId)
    {
        $request->validate([
            'no' => 'required|string|max:50',
            'nama' => 'required|string|max:255',
            'tanggal' => 'required|date',
            'jam' => 'nullable|string',
            'tempat' => 'nullable|string',
        ]);

        $jadwal = Jadwal::create([
            'kontingen_id' => $kontingenId,
            'no' => $request->no,
            'nama' => $request->nama,
            'tanggal' => $request->tanggal,
            'jam' => $request->jam,
            'tempat' => $request->tempat,
            'created_by' => Auth::id()
        ]);

        ActivityLog::create([
            'admin' => Auth::user()->name ?? Auth::user()->username,
            'type' => 'create',
            'description' => 'Menambahkan jadwal pertandingan: [' . $request->no . '] ' . $request->nama
        ]);

        return response()->json([
            'message' => 'Jadwal pertandingan berhasil ditambahkan',
            'data' => $jadwal
        ]);
    }

    public function update(Request $request, Jadwal $jadwal)
    {
        if ($jadwal->created_by !== Auth::id()) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        $request->validate([
            'nama' => 'required|string|max:255'
        ]);

        $jadwal->update(['nama' => $request->nama]);

        ActivityLog::create([
            'admin' => Auth::user()->name ?? Auth::user()->username,
            'type' => 'edit',
            'description' => 'Mengubah data jadwal: ' . $request->nama
        ]);

        return response()->json(['message' => 'Data jadwal diperbarui']);
    }

    public function destroy(Jadwal $jadwal)
    {
        if ($jadwal->created_by !== Auth::id()) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        ActivityLog::create([
            'admin' => Auth::user()->name ?? Auth::user()->username,
            'type' => 'delete',
            'description' => 'Menghapus jadwal pertandingan: ' . $jadwal->nama
        ]);

        $jadwal->delete();

        return response()->json(['message' => 'Data jadwal dihapus']);
    }
}
