<?php

namespace App\Http\Controllers\Superadmin;

use App\Http\Controllers\Controller;
use App\Models\Kontingen;
use App\Models\User;
use App\Models\Pelatih;
use App\Models\Atlet;

class DashboardController extends Controller
{
    public function getStats()
    {
        return response()->json([
            'kontingen' => Kontingen::count(),
            'admin'     => User::where('role', 'admin')->count(),
            'pelatih'   => Pelatih::count(),
            'atlet'     => Atlet::count()
        ]);
    }
}
