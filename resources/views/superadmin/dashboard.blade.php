<!DOCTYPE html>
<html lang="id">

@php
  $authUser = auth()->user();
  $authUserPayload = [
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
  <title>Dashboard Statistik - Super Admin ATLET</title>

  <link rel="stylesheet" href="/css/superadmin/dashboard.css">
  <link rel="stylesheet" href="/css/superadmin/common.css">
  <link rel="stylesheet" href="/css/alert-style.css">
</head>

<body>

  <header class="header">
    <div class="header-content">
      <div class="logo">
        <h1>🏅 ATLET - Super Admin</h1>
        <p class="logo-subtitle">Pusat Kontrol Sistem</p>
      </div>

      <div class="header-actions">
        <span class="user-info" id="userInfo">Super Admin</span>
        <button class="logout-btn" id="logoutBtn">Logout</button>
      </div>
    </div>
  </header>

  <aside class="sidebar">
    <nav class="nav-menu">
      <a class="nav-item active" href="dashboard.html">📊 Dashboard</a>
      <a class="nav-item" href="{{ route('superadmin.kontingen.list') }}">🏢 Manajemen Kontingen</a>
      <a class="nav-item" href="{{ route('superadmin.admins.list') }}">👥 Manajemen Admin</a>
      <a class="nav-item" href="monitoring.html">🔍 Monitoring Data</a>
      <a class="nav-item" href="activity-log.html">📝 Activity Log</a>
      <a class="nav-item" href="export.html">📥 Export Data</a>
      <a class="nav-item" href="settings.html">⚙️ Pengaturan</a>
    </nav>
  </aside>

  <main class="container">
    <section class="page active">
      <h2>📊 Dashboard Statistik</h2>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🏢</div>
          <div class="stat-info">
            <h3>Total Kontingen</h3>
            <p class="stat-number" id="totalKontingen">0</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">👨‍🏫</div>
          <div class="stat-info">
            <h3>Total Pelatih</h3>
            <p class="stat-number" id="totalPelatih">0</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <h3>Total Atlet</h3>
            <p class="stat-number" id="totalAtlet">0</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📝</div>
          <div class="stat-info">
            <h3>Total Admin</h3>
            <p class="stat-number" id="totalAdmin">0</p>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>📝 Aktivitas Terbaru</h3>
        <div class="activity-list" id="recentActivity">
          <div class="empty-state">Belum ada aktivitas</div>
        </div>
      </div>
    </section>
  </main>

  <script src="/js/custom-alert.js"></script>
  <script src="/js/superadmin/common.js"></script>
  <script src="/js/superadmin/dashboard.js"></script>
</body>

</html>
