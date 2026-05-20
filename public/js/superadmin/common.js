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

function logout() {
  const confirmed = confirm('Yakin ingin logout?');

  if (!confirmed) return;

  localStorage.removeItem('currentUser');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userRole');

  window.location.href = '/auth/login.html';
}

document.addEventListener('DOMContentLoaded', function () {
  App.loadUserInfo();
  App.setupLogout();
});