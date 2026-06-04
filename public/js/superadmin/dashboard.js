document.addEventListener('DOMContentLoaded', renderDashboard);

async function renderDashboard() {
    setText('totalKontingen', '...');
    setText('totalPelatih', '...');
    setText('totalAtlet', '...');
    setText('totalAdmin', '...');

    try {
        const response = await fetch('/superadmin/dashboard/stats', {
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error('Gagal mengambil data statistik');

        const stats = await response.json();

        setText('totalKontingen', stats.kontingen || 0);
        setText('totalAdmin', stats.admin || 0);
        setText('totalPelatih', stats.pelatih || 0);
        setText('totalAtlet', stats.atlet || 0);

    } catch (error) {
        console.error('Dashboard Error:', error);
        setText('totalKontingen', '0');
        setText('totalPelatih', '0');
        setText('totalAtlet', '0');
        setText('totalAdmin', '0');
    }

    renderRecentActivity();
}

async function renderRecentActivity() {
    const container = document.getElementById('recentActivity');
    if (!container) return;

    container.innerHTML = '<div class="empty-state">⏳ Memuat aktivitas terbaru...</div>';

    try {
        const response = await fetch('/superadmin/activity-log/data', {
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error('Gagal memuat log aktivitas');

        const logs = await response.json();

        const recentLogs = logs.slice(0, 5);

        if (recentLogs.length === 0) {
            container.innerHTML = '<div class="empty-state">Belum ada aktivitas</div>';
            return;
        }

        container.innerHTML = recentLogs.map(log => {
            const date = new Date(log.created_at);
            const formattedDate = date.toLocaleString('id-ID', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });

            return `
              <div class="activity-item">
                <div>
                  <strong>${escapeHTML(log.description || '-')}</strong>
                  <p>${formattedDate} - Admin: ${escapeHTML(log.admin || '-')}</p>
                </div>
                <span class="activity-type ${escapeHTML(log.type || 'info')}">
                    ${escapeHTML(log.type || 'info')}
                </span>
              </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Activity Log Error:', error);
        container.innerHTML = '<div class="empty-state" style="color: #ef4444;">❌ Gagal memuat aktivitas terbaru</div>';
    }
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

function escapeHTML(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
