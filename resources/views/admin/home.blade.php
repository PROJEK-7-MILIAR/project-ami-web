<!DOCTYPE html>
<html lang="id">
@php
  $authUser = auth()->user();
  $authUserPayload = [
    'id' => $authUser->id,
    'name' => $authUser->name,
    'email' => $authUser->email,
    'username' => $authUser->username,
    'role' => $authUser->role,
  ];
@endphp

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <meta name="csrf-token" content="{{ csrf_token() }}">

  <title>Sistem Kontingen - ATLET</title>

  <link rel="stylesheet" href="/css/admin/home-styles.css">
  <link rel="stylesheet" href="/css/alert-style.css">
  <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}">
  <style>
    .user-info-link {
        text-decoration: none;
        color: inherit;
        cursor: pointer;
        padding: 5px 10px;
        border-radius: 6px;
        transition: background-color 0.2s;
    }
    .user-info-link:hover {
        background-color: rgba(0,0,0,0.05);
    }
  </style>
</head>

<body>

  <header class="header">
    <div class="header-content">
      <div class="logo">
        <h1>🏅 ATLET</h1>
        <p class="logo-subtitle">Sistem Kontingen</p>
      </div>

      <div class="header-actions">
        <a href="{{ route('profile.edit') }}" class="user-info user-info-link" id="userInfo" title="Pengaturan Profil">
          👤 {{ $authUser->name }}
        </a>
        <button class="logout-btn" onclick="logout()">Logout</button>
      </div>
    </div>
  </header>

  <main class="container">
    <div class="home-content">

      <section class="section">
        <div class="section-icon">📝</div>
        <h2>Buat Kontingen Baru</h2>
        <p>Buat kontingen baru dan dapatkan kode unik untuk dibagikan</p>

        <button class="btn-large btn-create" onclick="KontingenAPI.openModal('createModal')">
          ➕ Buat Kontingen
        </button>
      </section>

      <section class="section">
        <div class="section-icon">🔐</div>
        <h2>Masuk Kontingen dengan Kode</h2>
        <p>Masukkan kode kontingen untuk mengakses</p>

        <div class="join-form">
          <input
            type="text"
            id="joinCode"
            placeholder="Masukkan kode kontingen (contoh: ABC123)"
            maxlength="8"
            class="input-code"
          >

          <button class="btn-primary" onclick="KontingenAPI.join()">
            Masuk
          </button>
        </div>
      </section>

      <section class="section section-full">
        <div class="section-header">
          <h2>📚 Kontingen Saya</h2>
          <p>Daftar kontingen yang Anda kelola</p>
        </div>

        <div class="kontingen-grid" id="kontigenGrid">
          <div class="empty-state">Memuat data...</div>
        </div>
      </section>

    </div>
  </main>

  <div id="createModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Buat Kontingen Baru</h3>
        <button class="close-btn" onclick="KontingenAPI.closeModal('createModal')">&times;</button>
      </div>

      <div class="modal-body">
        <form id="createForm">
          <div class="form-group">
            <label for="kontigenName">Nama Kontingen</label>
            <input
              type="text"
              id="kontigenName"
              placeholder="Contoh: Pelatihan Bulutangkis"
              required
            >
          </div>

          <div class="form-group">
            <label for="kontigenDesc">Deskripsi (Opsional)</label>
            <textarea
              id="kontigenDesc"
              placeholder="Deskripsi kontingen..."
            ></textarea>
          </div>

          <div class="form-group">
            <label for="kontigenAddress">Alamat Kontingen</label>
            <input
              type="text"
              id="kontigenAddress"
              placeholder="Masukkan alamat kontingen"
            >
          </div>

          <div class="button-group">
            <button type="button" class="btn-secondary" onclick="KontingenAPI.closeModal('createModal')">
              Batal
            </button>

            <button type="submit" class="btn-primary">
              Buat
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <script src="/js/custom-alert.js"></script>

  <script>
    window.authUser = @json($authUserPayload);
  </script>

  <script src="/js/auth/session.js"></script>
  <script src="/js/admin/home.js"></script>
</body>

</html>
