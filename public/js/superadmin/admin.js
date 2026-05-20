document.addEventListener('DOMContentLoaded', function () {
  renderAdminManagement();
  setupAdminEvents();
});

function setupAdminEvents() {
  const openBtn = document.getElementById('openAddAdminBtn');
  const closeBtn = document.getElementById('closeAddAdminModal');
  const cancelBtn = document.getElementById('cancelAddAdmin');
  const form = document.getElementById('addAdminForm');
  const modal = document.getElementById('addAdminModal');

  if (openBtn) {
    openBtn.addEventListener('click', openAddAdminModal);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeAddAdminModal);
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeAddAdminModal);
  }

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      addAdmin();
    });
  }

  if (modal) {
    modal.addEventListener('click', function (event) {
      if (event.target === modal) {
        closeAddAdminModal();
      }
    });
  }
}

function openAddAdminModal() {
  const modal = document.getElementById('addAdminModal');

  if (modal) {
    modal.classList.add('show');
  }
}

function closeAddAdminModal() {
  const modal = document.getElementById('addAdminModal');

  if (modal) {
    modal.classList.remove('show');
  }
}

function renderAdminManagement() {
  const tbody = document.getElementById('adminList');

  if (!tbody) return;

  const admins = App.loadAdmins();

  if (!admins.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Belum ada admin</td></tr>';
    return;
  }

  tbody.innerHTML = '';

  admins.forEach(function (admin) {
    const online = isAdminOnline(admin);

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${App.escapeHTML(admin.username || '-')}</td>
      <td>${App.escapeHTML(admin.name || '-')}</td>
      <td>${App.escapeHTML(admin.email || '-')}</td>
      <td>
        <span class="status-badge ${online ? 'online' : 'offline'}">
          ${online ? 'Online' : 'Offline'}
        </span>
      </td>
      <td>${App.escapeHTML(admin.kontingen || '-')}</td>
      <td>
        ${
          admin.source === 'default'
            ? '<button disabled class="btn-secondary" style="opacity:.5;cursor:not-allowed;">Default</button>'
            : `<button class="btn-danger" data-delete="${App.escapeHTML(admin.username)}">Hapus</button>`
        }
      </td>
    `;

    tbody.appendChild(row);
  });

  tbody.querySelectorAll('[data-delete]').forEach(function (button) {
    button.addEventListener('click', function () {
      deleteAdmin(button.dataset.delete);
    });
  });
}

function addAdmin() {
  const usernameInput = document.getElementById('newUsername');
  const passwordInput = document.getElementById('newPassword');
  const nameInput = document.getElementById('newName');
  const emailInput = document.getElementById('newEmail');
  const kontingenInput = document.getElementById('newKontingen');

  const username = usernameInput.value.trim().toLowerCase();
  const password = passwordInput.value.trim();
  const name = nameInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();
  const kontingen = kontingenInput.value.trim();

  if (!username || !password || !name) {
    App.notify('Username, password, dan nama wajib diisi.');
    return;
  }

  if (username.length < 3) {
    App.notify('Username minimal 3 karakter.');
    return;
  }

  if (password.length < 5) {
    App.notify('Password minimal 5 karakter.');
    return;
  }

  const admins = App.loadAdmins();

  const exists = admins.some(function (admin) {
    return admin.username === username;
  });

  if (exists || username === 'superadmin') {
    App.notify('Username sudah digunakan.');
    return;
  }

  const systemAdmins = App.readJSON('systemAdmins', []);

  const newAdmin = {
    id: Date.now(),
    username: username,
    password: password,
    name: name,
    email: email || username + '@atlet.local',
    role: 'admin',
    kontingen: kontingen,
    source: 'system',
    createdAt: new Date().toISOString()
  };

  systemAdmins.push(newAdmin);

  App.writeJSON('systemAdmins', systemAdmins);

  App.addLog(
    'create',
    'Menambahkan admin baru: ' + name,
    'Username: ' + username
  );

  const form = document.getElementById('addAdminForm');

  if (form) {
    form.reset();
  }

  closeAddAdminModal();
  renderAdminManagement();

  App.notify('Admin baru berhasil ditambahkan.');
}

function deleteAdmin(username) {
  if (username === 'admin' || username === 'pelatih') {
    App.notify('Admin default tidak bisa dihapus.');
    return;
  }

  const confirmed = confirm(`Yakin ingin menghapus admin "${username}"?`);

  if (!confirmed) return;

  let systemAdmins = App.readJSON('systemAdmins', []);
  let registeredUsers = App.readJSON('users', []);
  let onlineUsers = App.readJSON('onlineUsers', []);

  systemAdmins = systemAdmins.filter(function (admin) {
    return admin.username !== username;
  });

  registeredUsers = registeredUsers.filter(function (user) {
    return user.username !== username;
  });

  onlineUsers = onlineUsers.filter(function (user) {
    return user.username !== username;
  });

  App.writeJSON('systemAdmins', systemAdmins);
  App.writeJSON('users', registeredUsers);
  App.writeJSON('onlineUsers', onlineUsers);

  App.addLog('delete', 'Menghapus admin: ' + username);

  renderAdminManagement();

  App.notify('Admin berhasil dihapus.');
}

function isAdminOnline(admin) {
  const onlineUsers = App.readJSON('onlineUsers', []);

  return onlineUsers.some(function (user) {
    return String(user.username || '').toLowerCase() === String(admin.username || '').toLowerCase();
  });
}