const App = {
  readJSON(key, fallback = null) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      return fallback;
    }
  },

  writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  escapeHTML(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  },

  notify(message) {
    const toast = document.getElementById('toast');

    if (!toast) {
      alert(message);
      return;
    }

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(function () {
      toast.classList.remove('show');
    }, 2200);
  },

  loadKontingen() {
    return this.readJSON('kontigenData', []);
  },

  saveKontingen(data) {
    this.writeJSON('kontigenData', data);
  },

  getDetail(code) {
    if (!code) {
      return {
        pelatih: [],
        atlet: [],
        absensi: {},
        jadwal: [],
        program: [],
        pengukuran: []
      };
    }

    return this.readJSON('kontingen_' + code, {
      pelatih: [],
      atlet: [],
      absensi: {},
      jadwal: [],
      program: [],
      pengukuran: []
    });
  },

  saveDetail(code, detail) {
    if (!code) return;
    this.writeJSON('kontingen_' + code, detail);
  },

  loadActivity() {
    return this.readJSON('activityLog', []);
  },

  saveActivity(logs) {
    this.writeJSON('activityLog', logs);
  },

  addLog(type, description, detail = '') {
    const logs = this.loadActivity();

    const userName = localStorage.getItem('userName') || 'Super Admin';

    logs.unshift({
      id: Date.now(),
      timestamp: new Date().toLocaleString('id-ID'),
      admin: userName,
      type: type,
      description: description,
      detail: detail
    });

    this.saveActivity(logs);
  },

  loadAdmins() {
    const defaultAdmins = [
      {
        username: 'admin',
        password: '12345',
        name: 'Admin Pelatih',
        email: 'admin@atlet.local',
        role: 'admin',
        kontingen: '',
        source: 'default'
      },
      {
        username: 'pelatih',
        password: 'password123',
        name: 'Pelatih',
        email: 'pelatih@atlet.local',
        role: 'admin',
        kontingen: '',
        source: 'default'
      }
    ];

    const systemAdmins = this.readJSON('systemAdmins', []);
    const registeredUsers = this.readJSON('users', []);

    const normalizedSystemAdmins = systemAdmins.map(function (admin) {
      return {
        username: String(admin.username || '').toLowerCase(),
        password: String(admin.password || ''),
        name: admin.name || admin.fullname || admin.username,
        email: String(admin.email || admin.username || '').toLowerCase(),
        role: admin.role || 'admin',
        kontingen: admin.kontingen || '',
        source: 'system'
      };
    });

    const normalizedRegisteredUsers = registeredUsers.map(function (user) {
      return {
        username: String(user.username || '').toLowerCase(),
        password: String(user.password || ''),
        name: user.fullname || user.name || user.username,
        email: String(user.email || user.username || '').toLowerCase(),
        role: user.role || 'admin',
        kontingen: user.kontingen || '',
        source: 'register'
      };
    });

    const merged = [
      ...defaultAdmins,
      ...normalizedSystemAdmins,
      ...normalizedRegisteredUsers
    ];

    const unique = [];

    merged.forEach(function (admin) {
      if (!admin.username) return;

      const exists = unique.some(function (item) {
        return item.username === admin.username;
      });

      if (!exists) {
        unique.push(admin);
      }
    });

    return unique;
  },

  saveSystemAdmins(admins) {
    const onlySystemAdmins = admins.filter(function (admin) {
      return admin.source === 'system';
    });

    this.writeJSON('systemAdmins', onlySystemAdmins);
  },

  loadUserInfo() {
    const userInfo = document.getElementById('userInfo');

    if (!userInfo) return;

    const userName = localStorage.getItem('userName') || 'Super Admin';
    const userEmail = localStorage.getItem('userEmail') || 'superadmin@atlet.local';

    userInfo.textContent = userName + ' (' + userEmail + ')';
  },

  setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');

    if (logoutBtn) {
      logoutBtn.addEventListener('click', logout);
    }
  }
};

async function logout() {
  try {
    const confirmed = await askConfirm('Yakin ingin logout?');
    if (!confirmed) return;

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || '';

    const response = await fetch('/logout', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken
      }
    });

    if (response.ok) {
      const username = localStorage.getItem('userUsername');
      const email = localStorage.getItem('userEmail');
      let onlineUsers = JSON.parse(localStorage.getItem('onlineUsers')) || [];

      onlineUsers = onlineUsers.filter(user => user.username !== username && user.email !== email);
      localStorage.setItem('onlineUsers', JSON.stringify(onlineUsers));

      const keysToRemove = [
        'isLoggedIn', 'userEmail', 'userUsername',
        'userRole', 'userName', 'currentKontigen'
      ];
      keysToRemove.forEach(key => localStorage.removeItem(key));

      await notify('Anda berhasil logout.', 'success', 900);
      window.location.href = '/login';

    } else {
      notify('Gagal melakukan logout. Silakan coba lagi.', 'error');
    }

  } catch (error) {
    console.error('Logout error:', error);
    notify('Terjadi kesalahan koneksi ke server.', 'error');
  }
}

function notify(message, type = 'info', duration = 2200) {
  if (typeof showToast === 'function') {
    return showToast(message, type, duration);
  }

  alert(message);
  return Promise.resolve(true);
}

function askConfirm(message) {
  if (typeof customConfirm === 'function') {
    return customConfirm(message);
  }

  return Promise.resolve(confirm(message));
}

window.logout = logout;

document.addEventListener('DOMContentLoaded', function () {
  App.loadUserInfo();
  App.setupLogout();
});
