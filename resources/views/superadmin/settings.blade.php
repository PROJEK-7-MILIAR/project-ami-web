<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>Pengaturan Sistem - Super Admin ATLET</title>

  <link rel="stylesheet" href="/css/superadmin/settings.css">
  <link rel="stylesheet" href="/css/superadmin/common.css">
  <link rel="stylesheet" href="/css/alert-style.css">
  <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}">
</head>

<body>

  <header class="header">
    <div class="header-content">
      <div class="logo">
        <h1>🏅 ATLET - Super Admin</h1>
        <p class="logo-subtitle">Pusat Kontrol Sistem</p>
      </div>

      <div class="header-actions">
        <a href="{{ route('profile.edit') }}" class="user-info user-info-link" id="userInfo" title="Pengaturan Profil">
          👤 {{ $authUser->name ?? 'Super Admin' }}
        </a>
        <button class="logout-btn" id="logoutBtn">Logout</button>
      </div>
    </div>
  </header>

  <aside class="sidebar">
    <nav class="nav-menu">
      <a class="nav-item" href="{{ route('superadmin.dashboard') }}">📊 Dashboard</a>
      <a class="nav-item" href="{{ route('superadmin.kontingen.list') }}">🏢 Manajemen Kontingen</a>
      <a class="nav-item" href="{{ route('superadmin.admins.list') }}">👥 Manajemen Admin</a>
      <a class="nav-item" href="{{ route('superadmin.monitoring') }}">🔍 Monitoring Data</a>
      <a class="nav-item" href="{{ route('superadmin.activity-log') }}">📝 Activity Log</a>
      <a class="nav-item" href="{{ route('superadmin.export') }}">📥 Export Data</a>
      <a class="nav-item active" href="{{ route('superadmin.settings') }}">⚙️ Pengaturan</a>
    </nav>
  </aside>

  <main class="container">
    <section class="page active">
      <h2>⚙️ Pengaturan Sistem</h2>

      <div class="settings-section">
        <h3>🔐 Backup & Restore</h3>
        <button class="btn-primary" onclick="backupData()">💾 Backup Data</button>
        <button class="btn-secondary" onclick="document.getElementById('restoreFileInput').click()">📂 Restore Data</button>
        <input type="file" id="restoreFileInput" accept=".json" style="display: none;" onchange="restoreData(event)">
      </div>

      <div class="settings-section">
        <h3>🗑️ Pembersihan Data</h3>
        <button class="btn-danger" onclick="clearOldLogs()">Hapus Log Lama</button>
        <button class="btn-danger" onclick="clearAllData()">⚠️ Hapus Semua Data</button>
      </div>
    </section>
  </main>

  <script src="/js/custom-alert.js"></script>
  <script src="/js/superadmin/common.js"></script>
  <script src="/js/superadmin/settings.js"></script>
</body>

</html>
