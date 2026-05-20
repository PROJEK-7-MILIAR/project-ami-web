document.addEventListener('DOMContentLoaded', function () {
  loadSettingForm();
  renderSettingsSummary();
  setupSettingsEvents();
});

function setupSettingsEvents() {
  const backupBtn = document.getElementById('backupBtn');
  const restoreFile = document.getElementById('restoreFile');
  const clearLogsBtn = document.getElementById('clearLogsBtn');
  const clearAllDataBtn = document.getElementById('clearAllDataBtn');
  const userSettingForm = document.getElementById('userSettingForm');

  if (backupBtn) {
    backupBtn.addEventListener('click', backupData);
  }

  if (restoreFile) {
    restoreFile.addEventListener('change', restoreData);
  }

  if (clearLogsBtn) {
    clearLogsBtn.addEventListener('click', clearOldLogs);
  }

  if (clearAllDataBtn) {
    clearAllDataBtn.addEventListener('click', clearAllData);
  }

  if (userSettingForm) {
    userSettingForm.addEventListener('submit', function (event) {
      event.preventDefault();
      saveUserSettings();
    });
  }
}

function loadSettingForm() {
  const nameInput = document.getElementById('settingUserName');
  const emailInput = document.getElementById('settingUserEmail');

  if (nameInput) {
    nameInput.value = localStorage.getItem('userName') || 'Super Admin';
  }

  if (emailInput) {
    emailInput.value = localStorage.getItem('userEmail') || 'superadmin@atlet.local';
  }
}

function saveUserSettings() {
  const nameInput = document.getElementById('settingUserName');
  const emailInput = document.getElementById('settingUserEmail');

  const name = nameInput ? nameInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim() : '';

  if (!name || !email) {
    App.notify('Nama dan email wajib diisi.');
    return;
  }

  localStorage.setItem('userName', name);
  localStorage.setItem('userEmail', email);

  App.loadUserInfo();
  App.addLog('edit', 'Mengubah pengaturan user', name + ' - ' + email);

  App.notify('Pengaturan user berhasil disimpan.');
}

function renderSettingsSummary() {
  const kontingen = App.loadKontingen();
  const admins = App.loadAdmins();
  const logs = App.loadActivity();

  setText('summaryKontingen', kontingen.length);
  setText('summaryAdmin', admins.length);
  setText('summaryLog', logs.length);
}

function backupData() {
  const backup = {
    createdAt: new Date().toISOString(),
    user: {
      name: localStorage.getItem('userName') || 'Super Admin',
      email: localStorage.getItem('userEmail') || 'superadmin@atlet.local'
    },
    kontigenData: App.readJSON('kontigenData', []),
    activityLog: App.readJSON('activityLog', []),
    systemAdmins: App.readJSON('systemAdmins', []),
    users: App.readJSON('users', []),
    onlineUsers: App.readJSON('onlineUsers', [])
  };

  const kontingen = backup.kontigenData || [];

  kontingen.forEach(function (item) {
    backup['kontingen_' + item.code] = App.readJSON('kontingen_' + item.code, {
      pelatih: [],
      atlet: [],
      absensi: {},
      jadwal: [],
      program: [],
      pengukuran: []
    });
  });

  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], {
    type: 'application/json;charset=utf-8;'
  });

  downloadBlob(blob, 'backup_atlet_' + Date.now() + '.json');

  App.addLog('export', 'Backup data sistem', 'File JSON');
  renderSettingsSummary();

  App.notify('Backup data berhasil dibuat.');
}

function restoreData(event) {
  const file = event.target.files[0];

  if (!file) return;

  const confirmed = confirm('Restore akan menimpa data saat ini. Lanjutkan?');

  if (!confirmed) {
    event.target.value = '';
    return;
  }

  const reader = new FileReader();

  reader.onload = function (readerEvent) {
    try {
      const backup = JSON.parse(readerEvent.target.result);

      if (!backup || typeof backup !== 'object') {
        App.notify('File backup tidak valid.');
        return;
      }

      if (backup.user) {
        localStorage.setItem('userName', backup.user.name || 'Super Admin');
        localStorage.setItem('userEmail', backup.user.email || 'superadmin@atlet.local');
      }

      App.writeJSON('kontigenData', backup.kontigenData || []);
      App.writeJSON('activityLog', backup.activityLog || []);
      App.writeJSON('systemAdmins', backup.systemAdmins || []);
      App.writeJSON('users', backup.users || []);
      App.writeJSON('onlineUsers', backup.onlineUsers || []);

      const kontingen = backup.kontigenData || [];

      kontingen.forEach(function (item) {
        const key = 'kontingen_' + item.code;

        App.writeJSON(key, backup[key] || {
          pelatih: [],
          atlet: [],
          absensi: {},
          jadwal: [],
          program: [],
          pengukuran: []
        });
      });

      App.addLog('edit', 'Restore data sistem', file.name);

      App.loadUserInfo();
      loadSettingForm();
      renderSettingsSummary();

      App.notify('Restore data berhasil.');
    } catch (error) {
      App.notify('Gagal restore. Pastikan file JSON valid.');
    }

    event.target.value = '';
  };

  reader.readAsText(file);
}

function clearOldLogs() {
  const confirmed = confirm('Yakin ingin menghapus semua activity log?');

  if (!confirmed) return;

  App.writeJSON('activityLog', []);

  renderSettingsSummary();

  App.notify('Activity log berhasil dihapus.');
}

function clearAllData() {
  const confirmed = confirm('Yakin ingin menghapus SEMUA data sistem? Tindakan ini tidak bisa dibatalkan.');

  if (!confirmed) return;

  const secondConfirm = confirm('Konfirmasi sekali lagi. Semua data kontingen, admin tambahan, dan log akan terhapus.');

  if (!secondConfirm) return;

  const keysToRemove = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (
      key === 'kontigenData' ||
      key === 'activityLog' ||
      key === 'systemAdmins' ||
      key === 'users' ||
      key === 'onlineUsers' ||
      key.startsWith('kontingen_')
    ) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach(function (key) {
    localStorage.removeItem(key);
  });

  App.addLog('delete', 'Menghapus semua data sistem');

  renderSettingsSummary();

  App.notify('Semua data berhasil dihapus.');
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

function setText(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
}