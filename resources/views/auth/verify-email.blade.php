<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifikasi Email - ATLET</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f1f5f9;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .card {
            background: white;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            max-width: 420px;
            width: 90%;
            text-align: center;
        }
        .icon-container {
            width: 80px;
            height: 80px;
            background-color: #eff6ff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
            font-size: 40px;
        }
        h2 {
            color: #1e293b;
            margin-top: 0;
            margin-bottom: 12px;
            font-size: 24px;
            font-weight: 700;
        }
        p {
            color: #64748b;
            line-height: 1.6;
            margin-bottom: 24px;
            font-size: 15px;
        }
        .btn-primary {
            background-color: #2563eb;
            color: white;
            border: none;
            padding: 14px 24px;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            transition: background-color 0.2s;
            font-size: 15px;
        }
        .btn-primary:hover {
            background-color: #1d4ed8;
        }
        .btn-link {
            background: none;
            border: none;
            color: #94a3b8;
            text-decoration: underline;
            cursor: pointer;
            margin-top: 20px;
            font-size: 14px;
            transition: color 0.2s;
        }
        .btn-link:hover {
            color: #64748b;
        }
        .alert-success {
            background-color: #dcfce3;
            color: #166534;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 24px;
            font-size: 14px;
            font-weight: 600;
            border: 1px solid #bbf7d0;
        }
    </style>
</head>
<body>

    <div class="card">
        <div class="icon-container">
            ✉️
        </div>

        <h2>Verifikasi Email Anda</h2>

        <p>
            Terima kasih telah mendaftar! Kami telah mengirimkan tautan verifikasi ke alamat email Anda. Mohon klik tautan tersebut untuk mengaktifkan akun Anda.
        </p>

        @if (session('message'))
            <div class="alert-success">
                ✅ {{ session('message') }}
            </div>
        @endif

        <form method="POST" action="{{ route('verification.send') }}">
            @csrf
            <button type="submit" class="btn-primary">
                Kirim Ulang Email Verifikasi
            </button>
        </form>

        <!-- Form Logout -->
        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit" class="btn-link">
                Keluar dari akun ini
            </button>
        </form>
    </div>

</body>
</html>
