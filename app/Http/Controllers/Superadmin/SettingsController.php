<?php

namespace App\Http\Controllers\Superadmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\ActivityLog;
use App\Models\Kontingen;
use App\Models\Pelatih;
use App\Models\Atlet;
use App\Models\Absensi;

class SettingsController extends Controller
{
    public function backup()
    {
        $backupData = [
            'timestamp' => now()->toDateTimeString(),
            'kontingen' => Kontingen::with(['owner', 'pelatihs', 'atlets', 'absensis'])->get(),
            'activity_logs' => ActivityLog::all(),
        ];

        $filename = 'backup_db_atlet_' . date('Y_m_d_His') . '.json';

        return response()->streamDownload(function () use ($backupData) {
            echo json_encode($backupData, JSON_PRETTY_PRINT);
        }, $filename, [
            'Content-Type' => 'application/json',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    public function clearLogs()
    {
        ActivityLog::truncate();
        return response()->json(['message' => 'Log aktivitas berhasil dibersihkan.']);
    }

   public function clearAllData()
    {
        try {
            \Illuminate\Support\Facades\DB::statement('TRUNCATE TABLE activity_logs, absensis, atlets, pelatihs, kontingens CASCADE;');

            ActivityLog::create([
                'admin' => auth()->user()->name ?? 'System',
                'type' => 'delete',
                'description' => 'RESET SISTEM: Semua data kontingen dan entitas telah dihapus permanen.'
            ]);

            return response()->json(['message' => 'Semua data sistem berhasil direset.']);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mereset data server',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function restore(\Illuminate\Http\Request $request)
    {
        try {
            if (!$request->hasFile('backup_file')) {
                return response()->json(['message' => 'File backup tidak ditemukan'], 400);
            }

            // Read JSON file and decode
            $json = file_get_contents($request->file('backup_file')->getRealPath());
            $data = json_decode($json, true);

            if (!isset($data['kontingen'])) {
                return response()->json(['message' => 'Format file backup tidak valid.'], 400);
            }

            \Illuminate\Support\Facades\DB::beginTransaction();

            \Illuminate\Support\Facades\DB::statement('TRUNCATE TABLE activity_logs, absensis, atlets, pelatihs, kontingens CASCADE;');

            foreach ($data['kontingen'] as $kData) {
                $kontingen = Kontingen::create([
                    'code' => $kData['code'] ?? '',
                    'name' => $kData['name'] ?? '',
                    'owner_id' => $kData['owner_id'] ?? null,
                    'address' => $kData['address'] ?? '',
                ]);

                if (!empty($kData['pelatihs'])) {
                    foreach ($kData['pelatihs'] as $pData) {
                        $kontingen->pelatihs()->create([
                            'nama' => $pData['nama'],
                            'usia' => $pData['usia'] ?? null,
                            'ttl' => $pData['ttl'] ?? null,
                            'created_by' => $pData['created_by'] ?? null,
                        ]);
                    }
                }

                if (!empty($kData['atlets'])) {
                    foreach ($kData['atlets'] as $aData) {
                        $kontingen->atlets()->create([
                            'nama' => $aData['nama'],
                            'usia' => $aData['usia'] ?? null,
                            'ttl' => $aData['ttl'] ?? null,
                            'prestasi' => $aData['prestasi'] ?? null,
                            'created_by' => $aData['created_by'] ?? null,
                        ]);
                    }
                }

                if (!empty($kData['absensis'])) {
                    foreach ($kData['absensis'] as $abData) {
                        $kontingen->absensis()->create([
                            'tanggal' => $abData['tanggal'],
                            'keterangan' => $abData['keterangan'] ?? null,
                        ]);
                    }
                }
            }

            if (!empty($data['activity_logs'])) {
                foreach ($data['activity_logs'] as $log) {
                    ActivityLog::create([
                        'admin' => $log['admin'],
                        'type' => $log['type'],
                        'description' => $log['description'],
                        'detail' => $log['detail'] ?? null,
                        'created_at' => $log['created_at'] ?? now(),
                    ]);
                }
            }

            ActivityLog::create([
                'admin' => auth()->user()->name ?? 'System',
                'type' => 'edit',
                'description' => 'RESTORE SISTEM: Data dipulihkan dari file backup JSON.'
            ]);

            \Illuminate\Support\Facades\DB::commit();
            return response()->json(['message' => 'Restore data berhasil diselesaikan!']);

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\DB::rollBack();
            return response()->json([
                'message' => 'Gagal melakukan restore data',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
