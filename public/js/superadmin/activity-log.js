document.addEventListener('DOMContentLoaded', function () {
  renderActivityLog();
  setupActivityEvents();
});

function setupActivityEvents() {
  const filterBtn = document.getElementById('filterBtn');
  const clearFilterBtn = document.getElementById('clearFilterBtn');

  if (filterBtn) {
    filterBtn.addEventListener('click', filterActivity);
  }

  if (clearFilterBtn) {
    clearFilterBtn.addEventListener('click', function () {
      const filterDate = document.getElementById('filterDate');
      const filterType = document.getElementById('filterType');

      if (filterDate) filterDate.value = '';
      if (filterType) filterType.value = '';

      renderActivityLog();
    });
  }
}

function renderActivityLog(logs = null) {
  const tbody = document.getElementById('activityLog');

  if (!tbody) return;

  const activityLog = logs || App.loadActivity();

  if (!activityLog.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-state">Tidak ada log aktivitas</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = activityLog.map(function (log) {
    const type = log.type || 'info';

    return `
      <tr>
        <td>${App.escapeHTML(log.timestamp || '-')}</td>
        <td>${App.escapeHTML(log.admin || '-')}</td>
        <td>
          <span class="log-type ${App.escapeHTML(type)}">
            ${App.escapeHTML(type)}
          </span>
        </td>
        <td>${App.escapeHTML(log.description || '-')}</td>
        <td>${App.escapeHTML(log.detail || '-')}</td>
      </tr>
    `;
  }).join('');
}

function filterActivity() {
  const filterDate = document.getElementById('filterDate')?.value || '';
  const filterType = document.getElementById('filterType')?.value || '';

  let logs = App.loadActivity();

  if (filterType) {
    logs = logs.filter(function (log) {
      return log.type === filterType;
    });
  }

  if (filterDate) {
    const selectedDate = new Date(filterDate).toLocaleDateString('id-ID');

    logs = logs.filter(function (log) {
      return String(log.timestamp || '').includes(selectedDate);
    });
  }

  renderActivityLog(logs);
}