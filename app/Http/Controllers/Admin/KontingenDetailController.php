<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kontingen;
use App\Models\KontingenFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class KontingenDetailController extends Controller
{
    public function show($id)
    {
        $kontingen = Kontingen::with('owner')->findOrFail($id);

        $userId = Auth::id();
        $isOwner = $kontingen->owner_id === $userId;
        $isMember = $kontingen->members()->where('user_id', $userId)->exists();

        if (!$isOwner && !$isMember) {
            abort(403, 'Anda tidak memiliki akses ke kontingen ini.');
        }

        return view('admin.kontingen-detail', compact('kontingen', 'isOwner'));
    }

    public function getAllData($id)
    {
        $kontingen = Kontingen::with([
            'pelatihs.creator',
            'atlets.creator',
            'programs.creator',
            'laporans.creator',
            'jadwals.creator',
            'absensis.creator'
        ])->findOrFail($id);

        $laporanTes = KontingenFile::with('creator')
                        ->where('kontingen_id', $id)
                        ->where('type', 'laporantes')
                        ->get();

        return response()->json([
            'pelatih' => $kontingen->pelatihs,
            'atlet' => $kontingen->atlets,
            'program' => $kontingen->programs,
            'laporanBulanan' => $kontingen->laporans,
            'laporanTes' => $laporanTes,
            'jadwal' => $kontingen->jadwals,
            'absensi' => $kontingen->absensis
        ]);
    }
}
