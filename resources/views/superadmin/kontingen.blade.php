<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Manajemen Kontingen - Super Admin ATLET</title>

  <link rel="stylesheet" href="/css/superadmin/kontingen.css">
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
      <a class="nav-item" href="{{ route('superadmin.dashboard') }}">📊 Dashboard</a>
      <a class="nav-item active" href="{{ route('superadmin.kontingen.list') }}">🏢 Manajemen Kontingen</a>
      <a class="nav-item" href="{{ route('superadmin.admins.list') }}">👥 Manajemen Admin</a>
      <a class="nav-item" href="{{ route('superadmin.monitoring') }}">🔍 Monitoring Data</a>
      <a class="nav-item" href="{{ route('superadmin.activity-log') }}">📝 Activity Log</a>
      <a class="nav-item" href="{{ route('superadmin.export') }}">📥 Export Data</a>
      <a class="nav-item" href="{{ route('superadmin.settings') }}">⚙️ Pengaturan</a>
    </nav>
  </aside>

  <main class="container">
    <section class="page active">
      <div class="page-header">
        <h2>🏢 Manajemen Kontingen</h2>
      </div>

      <div class="kontingen-list" id="kontingenList">
        <div class="empty-state">Loading...</div>
      </div>
    </section>
  </main>

  <script src="/js/custom-alert.js"></script>
  <script src="/js/superadmin/common.js"></script>
  <script src="/js/superadmin/kontingen.js"></script>
</body>

</html>
