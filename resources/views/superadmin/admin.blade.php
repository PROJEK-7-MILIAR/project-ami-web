<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>Manajemen Admin - Super Admin ATLET</title>

  <link rel="stylesheet" href="/css/superadmin/admin.css">
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
        </a>        <button class="logout-btn" onclick="logout()">Logout</button>
      </div>
    </div>
  </header>

  <aside class="sidebar">
    <nav class="nav-menu">
      <a class="nav-item" href="{{ route('superadmin.dashboard') }}">📊 Dashboard</a>
      <a class="nav-item" href="{{ route('superadmin.kontingen.list') }}">🏢 Manajemen Kontingen</a>
      <a class="nav-item active" href="{{ route('superadmin.admins.list') }}">👥 Manajemen Admin</a>
      <a class="nav-item" href="{{ route('superadmin.monitoring') }}">🔍 Monitoring Data</a>
      <a class="nav-item" href="{{ route('superadmin.activity-log') }}">📝 Activity Log</a>
      <a class="nav-item" href="{{ route('superadmin.export') }}">📥 Export Data</a>
      <a class="nav-item" href="{{ route('superadmin.settings') }}">⚙️ Pengaturan</a>
    </nav>
  </aside>

  <main class="container">
    <section class="page active">
      <div class="page-header">
        <h2>👥 Manajemen Admin (Pelatih)</h2>

        <button type="button" class="btn-primary" id="openAddAdminBtn">
          + Tambah Admin
        </button>
      </div>

      <table class="admin-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Nama</th>
            <th>Status</th>
            <th>Kontingen</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody id="adminList">
            @forelse ($admins as $admin)
                <tr>
                    <td>{{ $admin->username }}</td>
                    <td>{{ $admin->name }}</td>
                    <td>
                        <span class="status-badge online">
                            Aktif
                        </span>
                    </td>
                    <td>-</td>
                    <td class="action-buttons">
                        <button class="btn-warning" onclick="openEditAdminModal({{ json_encode($admin) }})">Edit</button>
                        <button class="btn-danger" onclick="deleteAdmin({{ $admin->id }})">Delete</button>
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="5" class="empty-state">
                        Belum ada admin
                    </td>
                </tr>
            @endforelse
        </tbody>
      </table>
    </section>
  </main>

  <div id="addAdminModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Tambah Admin Baru</h3>
        <button type="button" class="close-btn" onclick="closeAddAdminModal()">&times;</button>
      </div>

      <div class="modal-body">
        <form id="addAdminForm">
          <div class="form-group">
            <label for="newUsername">Username</label>
            <input type="text" id="newUsername" placeholder="Masukkan username admin" required>
          </div>

          <div class="form-group">
            <label for="newEmail">Email</label>
            <input type="email" id="newEmail" placeholder="Masukkan email admin" required>
          </div>

          <div class="form-group">
            <label for="newPassword">Password</label>
            <input type="password" id="newPassword" placeholder="Masukkan password admin" required>
          </div>

          <div class="form-group">
            <label for="newName">Nama Lengkap</label>
            <input type="text" id="newName" placeholder="Masukkan nama lengkap admin" required>
          </div>

          <div class="button-group">
            <button type="button" class="btn-secondary" onclick="closeAddAdminModal()">
              Batal
            </button>

            <button type="submit" class="btn-primary">
              Simpan Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div id="editAdminModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Edit Admin</h3>
        <button type="button" class="close-btn" onclick="closeEditAdminModal()">&times;</button>
      </div>

      <div class="modal-body">
        <form id="editAdminForm">
          <input type="hidden" id="editId">

          <div class="form-group">
            <label for="editUsername">Username</label>
            <input type="text" id="editUsername" placeholder="Masukkan username admin" required>
          </div>

          <div class="form-group">
            <label for="editEmail">Email</label>
            <input type="email" id="editEmail" placeholder="Masukkan email admin" required>
          </div>

          <div class="form-group">
            <label for="editPassword">Password (Opsional)</label>
            <input type="password" id="editPassword" placeholder="Kosongkan jika tidak ingin mengubah password">
          </div>

          <div class="form-group">
            <label for="editName">Nama Lengkap</label>
            <input type="text" id="editName" placeholder="Masukkan nama lengkap admin" required>
          </div>

          <div class="button-group">
            <button type="button" class="btn-secondary" onclick="closeEditAdminModal()">
              Batal
            </button>

            <button type="submit" class="btn-primary">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <script src="{{ asset('js/custom-alert.js') }}"></script>
  <script src="{{ asset('js/superadmin/admin.js') }}"></script>
  <script src="{{ asset('js/superadmin/common.js') }}"></script>
</body>

</html>
