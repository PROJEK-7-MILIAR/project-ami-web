<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kontingen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class KontingenController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $owned = $user->ownedKontingens()->with('owner:id,name')->get()->map(function ($k) {
            $k->is_owner = true;
            return $k;
        });

        $joined = $user->joinedKontingens()->with('owner:id,name')->get()->map(function ($k) {
            $k->is_owner = false;
            return $k;
        });

        $allKontingens = $owned->concat($joined);

        return response()->json(['data' => $allKontingens]);
    }

   public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'desc' => 'nullable|string|max:1000',
            'address' => 'nullable|string|max:500',
        ]);

        try {
            do {
                $code = strtoupper(Str::random(6));
            } while (Kontingen::where('code', $code)->exists());

            $kontingen = Kontingen::create([
                'name' => $validated['name'],
                'desc' => $validated['desc'],
                'address' => $validated['address'],
                'code' => $code,
                'owner_id' => Auth::id(),
            ]);

            return response()->json([
                'message' => 'Kontingen berhasil dibuat',
                'data' => $kontingen
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Gagal membuat kontingen: ' . $e->getMessage());

            return response()->json([
                'message' => 'Terjadi kesalahan internal pada server saat menyimpan data.'
            ], 500);
        }
    }

    public function update(Request $request, Kontingen $kontingen)
    {
        if ($kontingen->owner_id !== Auth::id()) {
            return response()->json(['message' => 'Anda tidak memiliki akses'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $kontingen->update(['name' => $request->name]);

        return response()->json(['message' => 'Kontingen berhasil diperbarui']);
    }

    public function destroy(Kontingen $kontingen)
    {
        if ($kontingen->owner_id !== Auth::id()) {
            return response()->json(['message' => 'Anda tidak memiliki akses'], 403);
        }

        $kontingen->delete();
        return response()->json(['message' => 'Kontingen berhasil dihapus']);
    }

    public function join(Request $request)
    {
        $request->validate([
            'code' => 'required|string'
        ]);

        $kontingen = Kontingen::where('code', strtoupper($request->code))->first();

        if (!$kontingen) {
            return response()->json(['message' => 'Kode kontingen tidak ditemukan'], 404);
        }

        if ($kontingen->owner_id === Auth::id()) {
            return response()->json(['message' => 'Anda adalah pemilik kontingen ini'], 400);
        }

        if ($kontingen->members()->where('user_id', Auth::id())->exists()) {
            return response()->json(['message' => 'Anda sudah bergabung di kontingen ini'], 400);
        }

        $kontingen->members()->attach(Auth::id());

        return response()->json(['message' => 'Berhasil bergabung dengan kontingen']);
    }

    public function leave(Kontingen $kontingen)
    {
        if ($kontingen->owner_id === Auth::id()) {
            return response()->json(['message' => 'Pemilik tidak bisa keluar dari kontingen'], 400);
        }

        $kontingen->members()->detach(Auth::id());

        return response()->json(['message' => 'Berhasil keluar dari kontingen']);
    }
}
