document.addEventListener('DOMContentLoaded', function () {
    renderMonitoring('pelatih');
});

window.switchMonitoringTab = function (tab) {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));

    if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add('active');
    }

    renderMonitoring(tab);
};

function escapeHTML(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

async function renderMonitoring(tab) {
    const container = document.getElementById('monitoringContent');
    if (!container) return;

    container.innerHTML = '<div class="empty-state">⏳ Memuat data...</div>';

    try {
        const response = await fetch(`/superadmin/monitoring/${tab}`, {
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error('Gagal memuat data dari server');
        const data = await response.json();

        if (tab === 'pelatih') renderPelatih(data, container);
        if (tab === 'atlet') renderAtlet(data, container);
        if (tab === 'absensi') renderAbsensi(data, container);

    } catch (error) {
        container.innerHTML = '<div class="empty-state" style="color: #ef4444;">❌ Terjadi kesalahan saat memuat data.</div>';
        console.error(error);
    }
}

// ---------------------------------------------------------
// RENDERERS
// ---------------------------------------------------------

function renderPelatih(data, container) {
    if (data.length === 0) {
        return container.innerHTML = '<div class="empty-state">Belum ada data pelatih terdaftar.</div>';
    }

    let rows = data.map(item => `
        <tr>
            <td><strong>${escapeHTML(item.kontingen?.name || '-')}</strong></td>
            <td>${escapeHTML(item.nama)}</td>
            <td>${item.usia ? escapeHTML(item.usia) + ' thn' : '-'}</td>
            <td>${item.ttl ? escapeHTML(item.ttl) : '-'}</td>
            <td>${escapeHTML(item.creator?.name || '-')}</td>
        </tr>
    `).join('');

    container.innerHTML = `
        <h3>📊 Daftar Semua Pelatih</h3>
        <table class="monitoring-table">
            <thead>
                <tr>
                    <th>Kontingen</th>
                    <th>Nama Pelatih</th>
                    <th>Usia</th>
                    <th>Tgl Lahir</th>
                    <th>Dibuat Oleh</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
}

function renderAtlet(data, container) {
    if (data.length === 0) {
        return container.innerHTML = '<div class="empty-state">Belum ada data atlet terdaftar.</div>';
    }

    let rows = data.map(item => `
        <tr>
            <td><strong>${escapeHTML(item.kontingen?.name || '-')}</strong></td>
            <td>${escapeHTML(item.nama)}</td>
            <td>${item.usia ? escapeHTML(item.usia) + ' thn' : '-'}</td>
            <td>${item.ttl ? escapeHTML(item.ttl) : '-'}</td>
            <td>${escapeHTML(item.creator?.name || '-')}</td>
        </tr>
    `).join('');

    container.innerHTML = `
        <h3>📊 Daftar Semua Atlet</h3>
        <table class="monitoring-table">
            <thead>
                <tr>
                    <th>Kontingen</th>
                    <th>Nama Atlet</th>
                    <th>Usia</th>
                    <th>Tgl Lahir</th>
                    <th>Dibuat Oleh</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
}

function renderAbsensi(data, container) {
    if (data.length === 0) {
        return container.innerHTML = '<div class="empty-state">Belum ada data kontingen untuk dihitung.</div>';
    }

    let rows = data.map(item => `
        <tr>
            <td><strong>${escapeHTML(item.name)}</strong></td>
            <td>
                <span style="background: #eff6ff; color: #2563eb; padding: 4px 10px; border-radius: 999px; font-weight: 800; font-size: 12px;">
                    ${item.absensis_count} Data
                </span>
            </td>
        </tr>
    `).join('');

    container.innerHTML = `
        <h3>📊 Ringkasan Absensi Per Kontingen</h3>
        <table class="monitoring-table">
            <thead>
                <tr>
                    <th style="width: 70%;">Kontingen</th>
                    <th>Total Record Absensi</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
}
