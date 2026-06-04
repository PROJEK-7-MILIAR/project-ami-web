<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>Activity Log - Super Admin ATLET</title>

  <link rel="stylesheet" href="/css/superadmin/activity-log.css">
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
      <a class="nav-item active" href="{{ route('superadmin.activity-log') }}">📝 Activity Log</a>
      <a class="nav-item" href="{{ route('superadmin.export') }}">📥 Export Data</a>
      <a class="nav-item" href="{{ route('superadmin.settings') }}">⚙️ Pengaturan</a>
    </nav>
  </aside>

  <main class="container">
    <section class="page active">
      <h2>📝 Activity Log - Tracking Perubahan</h2>

      <div class="log-filters">
        <input type="date" id="filterDate" class="filter-input">

        <select id="filterType" class="filter-input">
          <option value="">Semua Tipe</option>
          <option value="create">Create</option>
          <option value="edit">Edit</option>
          <option value="delete">Delete</option>
          <option value="login">Login</option>
          <option value="logout">Logout</option>
        </select>

        <button class="btn-secondary" onclick="filterActivity()">
          Filter
        </button>
      </div>

      <table class="log-table">
        <thead>
          <tr>
            <th>Waktu</th>
            <th>Admin</th>
            <th>Tipe</th>
            <th>Deskripsi</th>
            <th>Detail</th>
          </tr>
        </thead>

        <tbody id="activityLog">
          <tr>
            <td colspan="5" class="empty-state">Loading...</td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>

  <script src="{{ asset('js/custom-alert.js') }}"></script>
  <script src="{{ asset('js/superadmin/activity-log.js') }}"></script>
  <script src="{{ asset('js/superadmin/dashboard.js') }}"></script>
</body>

</html>
