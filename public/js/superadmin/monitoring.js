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

function parseDynamicFields(dynamicFields) {
    let fields = dynamicFields;
    if (typeof fields === 'string') {
        try { fields = JSON.parse(fields); } catch(e) { fields = []; }
    }

    if (fields && Array.isArray(fields) && fields.length > 1) {
        return fields.map((field, index) => {
            if (index === 0) return ''; // Skip baris pertama karena itu adalah Nama Utama
            return `
                <div style="font-size: 12px; margin-bottom: 4px; line-height: 1.4;">
                    <span style="color: #64748b; font-weight: 600;">${escapeHTML(field.label)}:</span>
                    <span style="color: #1e3a8a; font-weight: 700;">${escapeHTML(field.value)}</span>
                </div>
            `;
        }).join('');
    }
    return '<span style="color: #94a3b8; font-style: italic;">Tidak ada detail</span>';
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
            <td>${parseDynamicFields(item.dynamic_fields)}</td>
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
                    <th>Informasi Detail</th> <th>Dibuat Oleh</th>
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
            <td>${parseDynamicFields(item.dynamic_fields)}</td>
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
                    <th>Informasi Detail</th> <th>Dibuat Oleh</th>
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
