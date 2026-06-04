<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KontingenFile extends Model
{
    use HasFactory;
    protected $table = 'kontingen_files';

    protected $fillable = [
        'kontingen_id', 'type', 'nama', 'desc', 'file_name', 'file_path', 'file_type', 'created_by'
    ];

    public function kontingen()
    {
        return $this->belongsTo(Kontingen::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
