<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Absensi;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AbsensiController extends Controller
{
    public function store(Request $request, $kontingenId)
    {
        $request->validate([
            'tanggal' => 'required|date',
            'atlet_id' => 'required|exists:atlets,id',
            'status' => 'required|in:hadir,absen,izin'
        ]);

        $absensi = Absensi::updateOrCreate(
            [
                'kontingen_id' => $kontingenId,
                'atlet_id' => $request->atlet_id,
                'tanggal' => $request->tanggal
            ],
            [
                'status' => $request->status,
                'keterangan' => $request->status,
                'created_by' => Auth::id()
            ]
        );

        ActivityLog::create([
            'admin' => Auth::user()->name ?? Auth::user()->username,
            'type' => 'edit',
            'description' => 'Mencatat absensi atlet (ID: ' . $request->atlet_id . ') menjadi: ' . strtoupper($request->status)
        ]);

        return response()->json([
            'message' => 'Absensi berhasil disimpan',
            'data' => $absensi
        ]);
    }
}
