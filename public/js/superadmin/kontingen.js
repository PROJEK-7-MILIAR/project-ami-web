document.addEventListener('DOMContentLoaded', function () {
  renderKontingenManagement();
  setupKontingenEvents();
});

function setupKontingenEvents() {
  const openBtn = document.getElementById('openAddKontingenBtn');
  const closeBtn = document.getElementById('closeAddKontingenModal');
  const cancelBtn = document.getElementById('cancelAddKontingen');
  const form = document.getElementById('addKontingenForm');
  const modal = document.getElementById('addKontingenModal');
  const nameInput = document.getElementById('kontingenName');
  const codeInput = document.getElementById('kontingenCode');

  if (openBtn) {
    openBtn.addEventListener('click', openAddKontingenModal);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeAddKontingenModal);
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeAddKontingenModal);
  }

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      addKontingen();
    });
  }

  if (modal) {
    modal.addEventListener('click', function (event) {
      if (event.target === modal) {
        closeAddKontingenModal();
      }
    });
  }

  if (nameInput && codeInput) {
    nameInput.addEventListener('input', function () {
      if (codeInput.dataset.edited === 'true') return;

      const generatedCode = generateKontingenCode(nameInput.value);

      codeInput.value = generatedCode;
    });

    codeInput.addEventListener('input', function () {
      codeInput.dataset.edited = 'true';
      codeInput.value = codeInput.value.toUpperCase();
    });
  }
}

function openAddKontingenModal() {
  const modal = document.getElementById('addKontingenModal');

  if (modal) {
    modal.classList.add('show');
  }
}

function closeAddKontingenModal() {
  const modal = document.getElementById('addKontingenModal');
  const form = document.getElementById('addKontingenForm');
  const codeInput = document.getElementById('kontingenCode');

  if (modal) {
    modal.classList.remove('show');
  }

  if (form) {
    form.reset();
  }

  if (codeInput) {
    codeInput.dataset.edited = 'false';
  }
}

function renderKontingenManagement() {
  const container = document.getElementById('kontingenList');

  if (!container) return;

  const kontingen = App.loadKontingen();

  if (!kontingen.length) {
    container.innerHTML = '<div class="empty-state">Belum ada kontingen</div>';
    return;
  }

  container.innerHTML = '';

  kontingen.forEach(function (item) {
    const detail = App.getDetail(item.code);

    const totalPelatih = (detail.pelatih || []).length;
    const totalAtlet = (detail.atlet || []).length;
    const totalAbsensi = Object.keys(detail.absensi || {}).length;

    const card = document.createElement('div');
    card.className = 'kontingen-admin-card';

    card.innerHTML = `
      <div class="kontingen-admin-info">
        <h3>${App.escapeHTML(item.name || '-')}</h3>

        <p><strong>Kode:</strong> ${App.escapeHTML(item.code || '-')}</p>
        <p><strong>Pemilik:</strong> ${App.escapeHTML(item.ownerName || item.owner || '-')}</p>
        <p><strong>Alamat:</strong> ${App.escapeHTML(item.address || '-')}</p>

        <div class="data-badge-group">
          <span class="data-badge">👨‍🏫 ${totalPelatih} Pelatih</span>
          <span class="data-badge">👥 ${totalAtlet} Atlet</span>
          <span class="data-badge">📋 ${totalAbsensi} Absensi</span>
        </div>
      </div>

      <div class="kontingen-admin-actions">
        <button type="button" class="btn-danger" data-delete="${item.id}">
          🗑 Hapus
        </button>
      </div>
    `;

    container.appendChild(card);
  });

  container.querySelectorAll('[data-delete]').forEach(function (button) {
    button.addEventListener('click', function () {
      deleteKontingen(Number(button.dataset.delete));
    });
  });
}

function addKontingen() {
  const nameInput = document.getElementById('kontingenName');
  const codeInput = document.getElementById('kontingenCode');
  const ownerInput = document.getElementById('kontingenOwner');
  const addressInput = document.getElementById('kontingenAddress');

  const name = nameInput.value.trim();
  const code = codeInput.value.trim().toUpperCase();
  const ownerName = ownerInput.value.trim();
  const address = addressInput.value.trim();

  if (!name || !code) {
    App.notify('Nama kontingen dan kode kontingen wajib diisi.');
    return;
  }

  if (code.length < 2) {
    App.notify('Kode kontingen minimal 2 karakter.');
    return;
  }

  const kontingen = App.loadKontingen();

  const isCodeExists = kontingen.some(function (item) {
    return String(item.code || '').toLowerCase() === code.toLowerCase();
  });

  if (isCodeExists) {
    App.notify('Kode kontingen sudah digunakan.');
    return;
  }

  const newKontingen = {
    id: Date.now(),
    code: code,
    name: name,
    ownerName: ownerName || 'Super Admin',
    address: address || '-',
    createdAt: new Date().toISOString()
  };

  kontingen.push(newKontingen);

  App.saveKontingen(kontingen);

  App.saveDetail(code, {
    pelatih: [],
    atlet: [],
    absensi: {},
    jadwal: [],
    program: [],
    pengukuran: []
  });

  App.addLog(
    'create',
    'Menambahkan kontingen baru: ' + name,
    'Kode: ' + code
  );

  closeAddKontingenModal();
  renderKontingenManagement();

  App.notify('Kontingen berhasil ditambahkan.');
}

function deleteKontingen(id) {
  const kontingen = App.loadKontingen();

  const selected = kontingen.find(function (item) {
    return item.id === id;
  });

  if (!selected) {
    App.notify('Kontingen tidak ditemukan.');
    return;
  }

  const confirmed = confirm(
    'Yakin ingin menghapus kontingen "' + selected.name + '"? Semua data di dalamnya akan ikut terhapus.'
  );

  if (!confirmed) return;

  const updatedKontingen = kontingen.filter(function (item) {
    return item.id !== id;
  });

  App.saveKontingen(updatedKontingen);

  localStorage.removeItem('kontingen_' + selected.code);

  App.addLog(
    'delete',
    'Menghapus kontingen: ' + selected.name,
    'Kode: ' + selected.code
  );

  renderKontingenManagement();

  App.notify('Kontingen berhasil dihapus.');
}

function generateKontingenCode(name) {
  if (!name) return '';

  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 1) {
    return words[0].substring(0, 3).toUpperCase();
  }

  return words
    .map(function (word) {
      return word.charAt(0);
    })
    .join('')
    .substring(0, 4)
    .toUpperCase();
}