document.addEventListener('DOMContentLoaded', function () {
    renderActivityLog();
    setupActivityEvents();
});

function setupActivityEvents() {
    const filterType = document.getElementById('filterType');
    const filterDate = document.getElementById('filterDate');

    if (filterType) {
        filterType.addEventListener('change', renderActivityLog);
    }

    if (filterDate) {
        filterDate.addEventListener('change', renderActivityLog);
    }
}

async function renderActivityLog() {
    const tbody = document.getElementById('activityLog');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="5" class="empty-state">⏳ Memuat riwayat aktivitas...</td></tr>';

    const filterType = document.getElementById('filterType')?.value || '';
    const filterDate = document.getElementById('filterDate')?.value || '';

    const url = new URL(window.location.origin + '/superadmin/activity-log/data');
    if (filterType) url.searchParams.append('type', filterType);
    if (filterDate) url.searchParams.append('date', filterDate);

    try {
        const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
        if (!response.ok) throw new Error('Gagal memuat data');

        const logs = await response.json();

        if (logs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-state">Tidak ada log aktivitas yang ditemukan.</td></tr>';
            return;
        }

        tbody.innerHTML = logs.map(log => {
            const date = new Date(log.created_at);
            const formattedDate = date.toLocaleString('id-ID', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });

            return `
                <tr>
                    <td>${formattedDate}</td>
                    <td><strong>${escapeHTML(log.admin)}</strong></td>
                    <td>
                        <span class="log-type ${escapeHTML(log.type)}">
                            ${escapeHTML(log.type)}
                        </span>
                    </td>
                    <td>${escapeHTML(log.description)}</td>
                    <td>${escapeHTML(log.detail || '-')}</td>
                </tr>
            `;
        }).join('');

    } catch (error) {
        console.error(error);
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state" style="color: red;">❌ Gagal memuat data aktivitas.</td></tr>';
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
