let currentMonitoringTab = 'pelatih';

document.addEventListener('DOMContentLoaded', function () {
  setupMonitoringTabs();
  renderMonitoring('pelatih');
});

function setupMonitoringTabs() {
  const buttons = document.querySelectorAll('.tab-button');

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      const tab = button.dataset.tab;

      buttons.forEach(function (item) {
        item.classList.remove('active');
      });

      button.classList.add('active');
      renderMonitoring(tab);
    });
  });
}

function renderMonitoring(tab) {
  currentMonitoringTab = tab;

  if (tab === 'pelatih') {
    renderPelatihMonitoring();
    return;
  }

  if (tab === 'atlet') {
    renderAtletMonitoring();
    return;
  }

  if (tab === 'absensi') {
    renderAbsensiMonitoring();
    return;
  }
}

function renderPelatihMonitoring() {
  const container = document.getElementById('monitoringContent');

  if (!container) return;

  const kontingen = App.loadKontingen();

  let rows = '';

  kontingen.forEach(function (item) {
    const detail = App.getDetail(item.code);

    (detail.pelatih || []).forEach(function (pelatih) {
      rows += `
        <tr>
          <td>${App.escapeHTML(item.name || '-')}</td>
          <td>${App.escapeHTML(pelatih.nama || '-')}</td>
          <td>${App.escapeHTML(pelatih.usia || '-')}</td>
          <td>${App.escapeHTML(pelatih.ttl || '-')}</td>
          <td>${App.escapeHTML(pelatih.createdByName || pelatih.createdBy || '-')}</td>
        </tr>
      `;
    });
  });

  if (!rows) {
    container.innerHTML = '<div class="empty-state">Belum ada data pelatih</div>';
    return;
  }

  container.innerHTML = `
    <h3>📊 Daftar Semua Pelatih</h3>

    <table class="monitoring-table">
      <thead>
        <tr>
          <th>Kontingen</th>
          <th>Nama</th>
          <th>Usia</th>
          <th>TTL</th>
          <th>Dibuat Oleh</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

function renderAtletMonitoring() {
  const container = document.getElementById('monitoringContent');

  if (!container) return;

  const kontingen = App.loadKontingen();

  let rows = '';

  kontingen.forEach(function (item) {
    const detail = App.getDetail(item.code);

    (detail.atlet || []).forEach(function (atlet) {
      rows += `
        <tr>
          <td>${App.escapeHTML(item.name || '-')}</td>
          <td>${App.escapeHTML(atlet.nama || '-')}</td>
          <td>${App.escapeHTML(atlet.usia || '-')}</td>
          <td>${App.escapeHTML(atlet.ttl || '-')}</td>
          <td>${App.escapeHTML(atlet.createdByName || atlet.createdBy || '-')}</td>
        </tr>
      `;
    });
  });

  if (!rows) {
    container.innerHTML = '<div class="empty-state">Belum ada data atlet</div>';
    return;
  }

  container.innerHTML = `
    <h3>📊 Daftar Semua Atlet</h3>

    <table class="monitoring-table">
      <thead>
        <tr>
          <th>Kontingen</th>
          <th>Nama</th>
          <th>Usia</th>
          <th>TTL</th>
          <th>Dibuat Oleh</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

function renderAbsensiMonitoring() {
  const container = document.getElementById('monitoringContent');

  if (!container) return;

  const kontingen = App.loadKontingen();

  let rows = '';

  kontingen.forEach(function (item) {
    const detail = App.getDetail(item.code);
    const totalAbsensi = Object.keys(detail.absensi || {}).length;

    rows += `
      <tr>
        <td>${App.escapeHTML(item.name || '-')}</td>
        <td>${totalAbsensi}</td>
      </tr>
    `;
  });

  if (!rows) {
    container.innerHTML = '<div class="empty-state">Belum ada data absensi</div>';
    return;
  }

  container.innerHTML = `
    <h3>📊 Ringkasan Absensi</h3>

    <table class="monitoring-table">
      <thead>
        <tr>
          <th>Kontingen</th>
          <th>Total Record</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}