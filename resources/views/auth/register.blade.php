<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registrasi Athlete</title>

  <link rel="stylesheet" href="/css/auth/register.css">
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

        <h3>Bergabunglah dengan Kami</h3>

        <form id="registerForm" method="POST" action="{{ route('register.store') }}">
          @csrf

          <div class="input-group">
            <label for="fullname">Nama Lengkap</label>
            <input type="text" id="fullname" name="name" value="{{ old('name') }}" placeholder="Masukkan nama lengkap" required>
            @error('name')
              <p class="input-error">{{ $message }}</p>
            @enderror
          </div>

          <div class="input-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" value="{{ old('email') }}" placeholder="Masukkan email" required>
            @error('email')
              <p class="input-error">{{ $message }}</p>
            @enderror
          </div>

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

          <div class="input-group">
            <label for="password_confirmation">Konfirmasi Password</label>
            <input type="password" id="password_confirmation" name="password_confirmation" placeholder="Konfirmasi password" required>
          </div>

          <div class="input-group">
            <label for="phone">No. Telepon (Opsional)</label>
            <input type="tel" id="phone" name="phone_number" value="{{ old('phone_number') }}" placeholder="Masukkan no. telepon">
            @error('phone_number')
              <p class="input-error">{{ $message }}</p>
            @enderror
          </div>

          <div class="options">
            <label>
              <input type="checkbox" id="agreeTerms" name="terms" value="1" {{ old('terms') ? 'checked' : '' }} required>
              Saya setuju dengan <a href="#">Syarat & Ketentuan</a>
            </label>
            @error('terms')
              <p class="input-error">{{ $message }}</p>
            @enderror
          </div>

          <button type="submit">Daftar</button>

          <p class="login">
            Sudah punya akun? <a href="{{ route('login') }}">Login</a>
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
  <script src="/js/auth/register.js"></script>
</body>
</html>
