<?php

namespace App\Http\Controllers\Superadmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Kontingen;
use App\Models\Pelatih;
use App\Models\Atlet;
use App\Models\Absensi;
use App\Models\Jadwal;
use App\Models\KontingenFile;
use App\Models\ActivityLog;

class ExportController extends Controller
{
    public function download($type, $format)
    {
        $data = [];
        $filename = $type . '_' . date('Y-m-d_H-i-s');

        if ($type === 'kontingen') {
            $data = Kontingen::with('owner')->get()->map(fn($item) => [
                'Kode' => $item->code,
                'Nama Kontingen' => $item->name,
                'Nama Pemilik' => $item->owner->name ?? '-',
                'Alamat' => $item->address ?? '-'
            ])->toArray();
        }
        else if ($type === 'pelatih') {
            $data = Pelatih::with(['kontingen', 'creator'])->get()->map(fn($item) => [
                'Asal Kontingen' => $item->kontingen->name ?? '-',
                'Nama Pelatih' => $item->nama,
                'Usia' => $item->usia ?? '-',
                'Tanggal Lahir' => $item->ttl ?? '-',
                'Diinput Oleh' => $item->creator->name ?? '-'
            ])->toArray();
        }
        else if ($type === 'atlet') {
            $data = Atlet::with(['kontingen', 'creator'])->get()->map(fn($item) => [
                'Asal Kontingen' => $item->kontingen->name ?? '-',
                'Nama Atlet' => $item->nama,
                'Usia' => $item->usia ?? '-',
                'Tanggal Lahir' => $item->ttl ?? '-',
                'Prestasi' => $item->prestasi ?? '-',
                'Diinput Oleh' => $item->creator->name ?? '-'
            ])->toArray();
        }
        else if ($type === 'absensi') {
            $data = Absensi::with('kontingen')->get()->map(fn($item) => [
                'Kontingen' => $item->kontingen->name ?? '-',
                'Tanggal Absen' => $item->tanggal ?? '-',
                'Keterangan' => $item->keterangan ?? '-',
            ])->toArray();
        }
        else if ($type === 'jadwal') {
            $data = Jadwal::with('kontingen')->get()->map(fn($item) => [
                'Kontingen' => $item->kontingen->name ?? '-',
                'Nama Jadwal' => $item->nama ?? '-',
                'Tanggal' => $item->tanggal ?? '-',
                'Lokasi' => $item->lokasi ?? '-',
                'Keterangan' => $item->keterangan ?? '-'
            ])->toArray();
        }
        else if ($type === 'program') {
            $data = KontingenFile::where('type', 'program')->with('kontingen')->get()->map(fn($item) => [
                'Kontingen' => $item->kontingen->name ?? '-',
                'Nama Program' => $item->nama ?? '-',
                'Nama File' => $item->file_name ?? '-',
                'Tanggal Diupload' => $item->created_at->format('Y-m-d')
            ])->toArray();
        }
        else if ($type === 'activity') {
            $data = ActivityLog::orderBy('created_at', 'desc')->get()->map(fn($item) => [
                'Waktu' => $item->created_at->format('Y-m-d H:i:s'),
                'Admin' => $item->admin,
                'Tipe Aksi' => $item->type,
                'Deskripsi' => $item->description,
            ])->toArray();
        }
        else if ($type === 'pengukuran') {
            $data = [];
        }

        if (empty($data)) {
            echo "<script>alert('Tidak ada data {$type} untuk di-export saat ini.'); window.history.back();</script>";
            return;
        }

        // Excel Spatie Logic
        if ($format === 'csv' || $format === 'excel') {
            $ext = $format === 'excel' ? 'xlsx' : 'csv';
            $fileFullName = $filename . '.' . $ext;

            $writer = \Spatie\SimpleExcel\SimpleExcelWriter::streamDownload($fileFullName);

            foreach ($data as $row) {
                $writer->addRow($row);
            }

            return $writer->toBrowser();
        }

        return abort(404, 'Format tidak didukung');
    }
}
