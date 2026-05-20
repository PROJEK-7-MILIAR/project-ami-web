document.addEventListener('DOMContentLoaded', renderDashboard);

function renderDashboard() {
  const kontingen = App.loadKontingen();
  const admins = App.loadAdmins();

  let pelatih = 0;
  let atlet = 0;

  kontingen.forEach(function (item) {
    const detail = App.getDetail(item.code);

    pelatih += (detail.pelatih || []).length;
    atlet += (detail.atlet || []).length;
  });

  setText('totalKontingen', kontingen.length);
  setText('totalPelatih', pelatih);
  setText('totalAtlet', atlet);
  setText('totalAdmin', admins.length);

  renderRecentActivity();
}

function renderRecentActivity() {
  const container = document.getElementById('recentActivity');

  if (!container) return;

  const logs = App.loadActivity().slice(0, 5);

  if (!logs.length) {
    container.innerHTML = '<div class="empty-state">Belum ada aktivitas</div>';
    return;
  }

  container.innerHTML = logs.map(function (log) {
    return `
      <div class="activity-item">
        <div>
          <strong>${App.escapeHTML(log.description || '-')}</strong>
          <p>${App.escapeHTML(log.timestamp || '-')} - ${App.escapeHTML(log.admin || '-')}</p>
        </div>
        <span class="activity-type">${App.escapeHTML(log.type || 'info')}</span>
      </div>
    `;
  }).join('');
}

function setText(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
}