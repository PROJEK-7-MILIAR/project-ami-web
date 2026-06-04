<?php

namespace App\Http\Controllers\Superadmin;

use App\Http\Controllers\Controller;
use App\Models\Kontingen;

class KontingenController extends Controller
{
    public function getAllData()
    {
        try {
            $kontingens = \App\Models\Kontingen::with('owner:id,name,username')
                ->withCount(['pelatihs', 'atlets', 'absensis'])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($kontingens);

        } catch (\Exception $e) {
            return response()->json([
                'pesan_error' => $e->getMessage(),
                'file' => $e->getFile(),
                'baris' => $e->getLine()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $kontingen = Kontingen::findOrFail($id);

        $kontingen->delete();

        return response()->json(['message' => 'Kontingen berhasil dihapus permanen']);
    }
}
