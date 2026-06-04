<?php

namespace App\Http\Controllers\Superadmin;

use App\Http\Controllers\Controller;
use App\Models\Atlet;
use App\Models\Kontingen;
use App\Models\Pelatih;

class MonitoringController extends Controller
{
    public function getPelatih()
    {
        $data = Pelatih::with(['kontingen:id,name', 'creator:id,name'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($data);
    }

    public function getAtlet()
    {
        $data = Atlet::with(['kontingen:id,name', 'creator:id,name'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($data);
    }

    public function getAbsensi()
    {
        $data = Kontingen::withCount('absensis')
            ->orderBy('name', 'asc')
            ->get();

        return response()->json($data);
    }
}
