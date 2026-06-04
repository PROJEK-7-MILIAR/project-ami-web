<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Profile - ATLET</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        h2 { color: #1e293b; margin-top: 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 25px; }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 8px; color: #475569; font-weight: 600; font-size: 14px; }
        input[type="text"], input[type="email"], input[type="password"] { width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; font-size: 15px; transition: border-color 0.2s; }
        input:focus { border-color: #3b82f6; outline: none; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
        .help-text { font-size: 12px; color: #64748b; margin-top: 5px; display: block; }
        .btn-submit { background-color: #2563eb; color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 15px; width: 100%; margin-top: 10px; }
        .btn-submit:hover { background-color: #1d4ed8; }
        .btn-back { display: inline-block; margin-bottom: 20px; color: #64748b; text-decoration: none; font-size: 14px; font-weight: 600; }
        .btn-back:hover { color: #0f172a; }
        .alert { padding: 12px; border-radius: 6px; margin-bottom: 20px; font-size: 14px; }
        .alert-success { background-color: #dcfce3; color: #166534; border: 1px solid #bbf7d0; }
        .alert-danger { background-color: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
        .role-badge { background: #e0e7ff; color: #3730a3; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-left: 10px; vertical-align: middle; }
    </style>
</head>
<body>

<div class="container">
    <!-- Tombol kembali otomatis menyesuaikan role -->
    <a href="{{ auth()->user()->role === 'superadmin' ? route('superadmin.dashboard') : route('admin.dashboard') }}" class="btn-back">
        ← Kembali ke Dashboard
    </a>

    <h2>Pengaturan Profil <span class="role-badge">{{ auth()->user()->role }}</span></h2>

    @if(session('success'))
        <div class="alert alert-success">✅ {{ session('success') }}</div>
    @endif

    @if($errors->any())
        <div class="alert alert-danger">
            <strong>Terjadi Kesalahan:</strong>
            <ul style="margin: 5px 0 0 20px; padding: 0;">
                @foreach($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ route('profile.update') }}" method="POST">
        @csrf
        @method('PUT')

        <div class="form-group">
            <label for="name">Nama Lengkap</label>
            <input type="text" id="name" name="name" value="{{ old('name', $user->name) }}" required>
        </div>

        <div class="form-group">
            <label for="email">Alamat Email</label>
            <input type="email" id="email" name="email" value="{{ old('email', $user->email) }}" required>
        </div>

        <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" value="{{ old('username', $user->username) }}" required>
        </div>

        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        <h4 style="margin-top: 0; color: #475569;">Ganti Password (Opsional)</h4>

        <div class="form-group">
            <label for="password">Password Baru</label>
            <input type="password" id="password" name="password">
            <span class="help-text">Kosongkan jika tidak ingin mengubah password.</span>
        </div>

        <div class="form-group">
            <label for="password_confirmation">Konfirmasi Password Baru</label>
            <input type="password" id="password_confirmation" name="password_confirmation">
        </div>

        <button type="submit" class="btn-submit">Simpan Perubahan</button>
    </form>
</div>

</body>
</html>
