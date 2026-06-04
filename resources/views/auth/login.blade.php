<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login Athlete</title>

  <link rel="stylesheet" href="/css/auth/login.css">
  <link rel="stylesheet" href="/css/alert-style.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}">
</head>
<body>

  <div class="container">

    <a href="/" class="back-btn">
      <i class="fas fa-arrow-left"></i>
    </a>

    <div class="left">
      <div class="form-box">
        <h2>ATLET</h2>

        <p class="subtitle">
          Lampaui Batas. Ukir Prestasi. Jadi Juara.
        </p>

        <p class="description">
          Platform manajemen atlet dan pelatih terpadu untuk mengembangkan potensi maksimal Anda
        </p>

        <h3>Selamat Datang!</h3>

        <form id="loginForm" method="POST" action="{{ route('login.authenticate') }}">
          @csrf

          <div class="input-group">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" value="{{ old('username') }}" placeholder="Masukkan username" required>
            @error('username')
              <p class="input-error">{{ $message }}</p>
            @enderror
          </div>

          <div class="input-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Masukkan password" required>
            @error('password')
              <p class="input-error">{{ $message }}</p>
            @enderror
          </div>

          <div class="options">
            <label>
              <input type="checkbox" name="remember" value="1">
              Remember me
            </label>
          </div>

          <button type="submit">Login</button>

          <p class="signup">
            Belum punya akun? <a href="{{ route('register') }}">Daftar</a>
          </p>

          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ccc;">

          <p style="font-size: 12px; color: #666;">
            <strong>Demo Akun:</strong><br>
            Admin: admin / 12345<br>
            Super Admin: superadmin / super123
          </p>
        </form>
      </div>
    </div>

    <div class="right">
      <div class="overlay">
        <h1></h1>
        <h2></h2>
      </div>
    </div>

  </div>

  <script src="/js/custom-alert.js"></script>
  <script src="/js/auth/login.js"></script>
</body>
</html>
