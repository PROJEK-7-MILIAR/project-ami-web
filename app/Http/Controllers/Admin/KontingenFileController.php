<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KontingenFile;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class KontingenFileController extends Controller
{
    public function store(Request $request, $kontingenId)
    {
        $request->validate([
            'type' => 'required|in:program,laporan',
            'nama' => 'required|string|max:255',
            'desc' => 'nullable|string',
            'file' => 'required|file|mimes:pdf,xlsx,xls,csv,txt|max:5120',
        ]);

        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();

        $path = $file->store('kontingen_files', 'public');

        $kontingenFile = KontingenFile::create([
            'kontingen_id' => $kontingenId,
            'type' => $request->type,
            'nama' => $request->nama,
            'desc' => $request->desc,
            'file_name' => $originalName,
            'file_path' => '/storage/' . $path,
            'file_type' => $extension,
            'created_by' => Auth::id()
        ]);

        ActivityLog::create([
            'admin' => Auth::user()->name ?? Auth::user()->username,
            'type' => 'create',
            'description' => 'Mengupload file ' . $request->type . ': ' . $request->nama
        ]);

        return response()->json([
            'message' => 'File berhasil diupload',
            'data' => $kontingenFile
        ]);
    }

    public function destroy(KontingenFile $file)
    {
        if ($file->created_by !== Auth::id()) {
            return response()->json(['message' => 'Anda tidak memiliki hak untuk menghapus laporan ini.'], 403);
        }

        if ($file->file_path && strpos($file->file_path, '/storage/') === 0) {
            $path = str_replace('/storage/', '', $file->file_path);
            Storage::disk('public')->delete($path);
        }

        ActivityLog::create([
            'admin' => Auth::user()->name ?? Auth::user()->username,
            'type' => 'delete',
            'description' => 'Menghapus file ' . $file->type . ': ' . $file->nama
        ]);

        $file->delete();

        return response()->json(['message' => 'File berhasil dihapus']);
    }

    public function download(KontingenFile $file)
    {
        $kontingen = $file->kontingen;
        $userId = auth()->id();

        $isOwner = $kontingen->owner_id === $userId;
        $isMember = $kontingen->members()->where('user_id', $userId)->exists();

        if (!$isOwner && !$isMember) {
            abort(403, 'Anda tidak memiliki akses untuk mengunduh file ini.');
        }

        $realPath = str_replace('/storage/', '', $file->file_path);

        if (!Storage::disk('public')->exists($realPath)) {
            abort(404, 'File fisik tidak ditemukan di server.');
        }
        return Storage::disk('public')->download($realPath, $file->file_name);
    }
}
