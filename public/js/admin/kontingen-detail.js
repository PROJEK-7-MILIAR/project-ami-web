// =========================================================
// GLOBAL STATE & CONFIG
// =========================================================
const KONTINGEN_ID = window.location.pathname.split('/').pop();
const CSRF_TOKEN = document.querySelector('meta[name="csrf-token"]')?.content || '';

let pelatihList = [];
let atletList = [];
let programList = [];
let laporanBulananList = [];
let jadwalList = [];
let absensiData = []; // Sekarang dari database berupa array

// =========================================================
// NOTIFICATION & HELPERS
// =========================================================
window.notify = function(message, type = 'info', duration = 2200) {
    if (typeof showToast === 'function') return showToast(message, type, duration);
    alert(message);
    return Promise.resolve(true);
};

window.askConfirm = function(message) {
    if (typeof customConfirm === 'function') return customConfirm(message);
    return Promise.resolve(confirm(message));
};

function isDataOwner(data) {
    const currentUserId = window.authUser?.id;
    return data.created_by === currentUserId;
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date)) return '-';
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
}

function escapeHTML(value) {
    return String(value || '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

// =========================================================
// INITIALIZE & FETCH DATA
// =========================================================
document.addEventListener('DOMContentLoaded', async () => {
    setTodayDate();
    setupEventListeners();
    await loadDetailData();
});

async function loadDetailData() {
    try {
        const response = await fetch(`/admin/kontingen-detail/${KONTINGEN_ID}/data`, {
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error('Gagal memuat data detail');

        const data = await response.json();

        pelatihList = data.pelatih || [];
        atletList = data.atlet || [];
        programList = data.program || [];
        laporanBulananList = data.laporanBulanan || [];
        jadwalList = data.jadwal || [];
        absensiData = data.absensi || [];

        renderPelatih();
        renderAtlet();
        renderProgram();
        renderLaporanBulanan();
        renderJadwal();

        if (document.getElementById('absensiDate')?.value) {
            loadAbsensi();
        }
    } catch (error) {
        console.error(error);
        notify('Terjadi kesalahan saat memuat data.', 'error');
    }
}

// =========================================================
// TABS & MODALS
// =========================================================
window.switchTab = function(tabName) {
    document.querySelectorAll('.tab-content, .tab-button').forEach(el => el.classList.remove('active'));
    document.getElementById(tabName)?.classList.add('active');
    if (window.event && window.event.target) window.event.target.classList.add('active');

    if (tabName === 'absensi') loadAbsensi();
};

window.openModal = function(modalId) { document.getElementById(modalId)?.classList.add('show'); };
window.closeModal = function(modalId) { document.getElementById(modalId)?.classList.remove('show'); };
window.openAddPelatihModal = () => openModal('addPelatihModal');
window.openAddAtletModal = () => openModal('addAtletModal');
window.openUploadProgramModal = () => openModal('uploadProgramModal');
window.openUploadLaporanModal = () => openModal('uploadLaporanModal');
window.openAddJadwalModal = () => openModal('addJadwalModal');

function setupEventListeners() {
    document.getElementById('addPelatihForm')?.addEventListener('submit', addPelatih);
    document.getElementById('addAtletForm')?.addEventListener('submit', addAtlet);
    document.getElementById('uploadProgramForm')?.addEventListener('submit', uploadProgram);
    document.getElementById('uploadLaporanForm')?.addEventListener('submit', uploadLaporanBulanan);
    document.getElementById('addJadwalForm')?.addEventListener('submit', addJadwal);

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) e.target.classList.remove('show');
    });
}

function setTodayDate() {
    const absensiDate = document.getElementById('absensiDate');
    if (absensiDate) absensiDate.value = new Date().toISOString().split('T')[0];
}

// =========================================================
// CARD RENDERER (Reusable for Pelatih & Atlet)
// =========================================================
function createDataCard(data, type) {
    const card = document.createElement('div');
    card.className = 'data-card';

    const usia = data.usia ? `Usia: ${escapeHTML(data.usia)} tahun` : '';
    const ttl = data.ttl ? `TTL: ${formatDate(data.ttl)}` : '';
    const owner = isDataOwner(data);
    const foto = data.foto || 'https://via.placeholder.com/280x200?text=No+Photo';
    const creatorName = data.creator?.name || '-';

    const editFunction = type === 'pelatih' ? 'editPelatih' : 'editAtlet';
    const deleteFunction = type === 'pelatih' ? 'deletePelatih' : 'deleteAtlet';

    card.innerHTML = `
        <img src="${foto}" alt="${escapeHTML(data.nama)}">
        <div class="data-card-content">
            <h4>${escapeHTML(data.nama)}</h4>
            ${usia ? `<p>${usia}</p>` : ''}
            ${ttl ? `<p>${ttl}</p>` : ''}
            ${data.prestasi ? `<p><strong>Prestasi:</strong> ${escapeHTML(data.prestasi)}</p>` : ''}
            <p style="font-size: 12px; color: #777; margin-top: 8px;">Dibuat oleh: ${escapeHTML(creatorName)}</p>
            <div class="data-card-actions">
                ${owner
                    ? `<button onclick="${editFunction}(${data.id})">✎ Edit</button>
                       <button class="delete" onclick="${deleteFunction}(${data.id})">🗑 Hapus</button>`
                    : `<button disabled style="opacity: 0.5; cursor: not-allowed;">🔒 Terkunci</button>`
                }
            </div>
        </div>
    `;
    return card;
}

// =========================================================
// PELATIH
// =========================================================
async function addPelatih(e) {
    e.preventDefault();
    await submitPersonData('pelatih', 'addPelatihForm', 'addPelatihModal');
}

window.editPelatih = async (id) => await editPersonData('pelatih', id, pelatihList);
window.deletePelatih = async (id) => await deletePersonData('pelatih', id);

function renderPelatih() {
    const grid = document.getElementById('pelatihGrid');
    if (!grid) return;
    grid.innerHTML = pelatihList.length ? '' : '<div class="empty-state">Belum ada data pelatih</div>';
    pelatihList.forEach(p => grid.appendChild(createDataCard(p, 'pelatih')));
}

// =========================================================
// ATLET
// =========================================================
async function addAtlet(e) {
    e.preventDefault();
    await submitPersonData('atlet', 'addAtletForm', 'addAtletModal');
}

window.editAtlet = async (id) => await editPersonData('atlet', id, atletList);
window.deleteAtlet = async (id) => await deletePersonData('atlet', id);

function renderAtlet() {
    const grid = document.getElementById('atletGrid');
    if (!grid) return;
    grid.innerHTML = atletList.length ? '' : '<div class="empty-state">Belum ada data atlet</div>';
    atletList.forEach(a => grid.appendChild(createDataCard(a, 'atlet')));
}

// =========================================================
// LOGIC REUSABLE UNTUK PELATIH & ATLET
// =========================================================
async function submitPersonData(type, formId, modalId) {
    const nama = document.getElementById(`${type}Nama`).value.trim();
    const usia = document.getElementById(`${type}Usia`).value.trim();
    const ttl = document.getElementById(`${type}TTL`).value;
    const prestasi = document.getElementById(`${type}Prestasi`).value.trim();
    const foto = document.getElementById(`${type}Foto`).files[0];

    if (!nama) return notify('Nama wajib diisi!', 'warning');

    const formData = new FormData();
    formData.append('nama', nama);
    if (usia) formData.append('usia', usia);
    if (ttl) formData.append('ttl', ttl);
    if (prestasi) formData.append('prestasi', prestasi);
    if (foto) formData.append('foto', foto);

    const btn = document.querySelector(`#${formId} button[type="submit"]`);
    const oldText = btn.innerHTML;
    btn.disabled = true; btn.innerHTML = '⏳...';

    try {
        const response = await fetch(`/admin/kontingen/${KONTINGEN_ID}/${type}`, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': CSRF_TOKEN },
            body: formData
        });

        if (!response.ok) throw new Error(await response.text());

        document.getElementById(formId).reset();
        closeModal(modalId);
        notify(`Data ${type} berhasil disimpan.`, 'success');
        await loadDetailData();
    } catch (error) {
        notify('Gagal menyimpan data.', 'error');
    } finally {
        btn.disabled = false; btn.innerHTML = oldText;
    }
}

async function editPersonData(type, id, list) {
    const person = list.find(item => item.id === id);
    if (!person) return;

    const newNama = prompt(`Ubah nama ${type}:`, person.nama);
    if (!newNama || newNama.trim() === '') return;

    try {
        const res = await fetch(`/admin/${type}/${id}`, {
            method: 'PUT',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF_TOKEN },
            body: JSON.stringify({ nama: newNama.trim() })
        });
        if (!res.ok) throw new Error();
        notify(`Data ${type} diperbarui.`, 'success');
        await loadDetailData();
    } catch (e) {
        notify('Gagal memperbarui data.', 'error');
    }
}

async function deletePersonData(type, id) {
    if (!await askConfirm(`Hapus data ${type} ini permanen?`)) return;
    try {
        const res = await fetch(`/admin/${type}/${id}`, {
            method: 'DELETE',
            headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': CSRF_TOKEN }
        });
        if (!res.ok) throw new Error();
        notify(`Data ${type} dihapus.`, 'success');
        await loadDetailData();
    } catch (e) {
        notify('Gagal menghapus data.', 'error');
    }
}

// =========================================================
// FILES (PROGRAM & LAPORAN)
// =========================================================
async function uploadProgram(e) { e.preventDefault(); await submitFileData('program', 'uploadProgramForm', 'uploadProgramModal'); }
async function uploadLaporanBulanan(e) { e.preventDefault(); await submitFileData('laporan', 'uploadLaporanForm', 'uploadLaporanModal'); }

async function submitFileData(type, formId, modalId) {
    const prefix = type === 'program' ? 'program' : 'laporan';
    const nama = document.getElementById(`${prefix}Nama`).value.trim();
    const desc = document.getElementById(`${prefix}Desc`).value.trim();
    const file = document.getElementById(`${prefix}File`).files[0];

    if (!nama || !file) return notify('Nama dan File wajib diisi!', 'warning');

    const formData = new FormData();
    formData.append('type', type);
    formData.append('nama', nama);
    if (desc) formData.append('desc', desc);
    formData.append('file', file);

    const btn = document.querySelector(`#${formId} button[type="submit"]`);
    const oldText = btn.innerHTML;
    btn.disabled = true; btn.innerHTML = '⏳ Uploading...';

    try {
        const response = await fetch(`/admin/kontingen/${KONTINGEN_ID}/file`, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': CSRF_TOKEN },
            body: formData
        });

        if (!response.ok) throw new Error();

        document.getElementById(formId).reset();
        closeModal(modalId);
        notify('File berhasil diupload.', 'success');
        await loadDetailData();
    } catch (error) {
        notify('Gagal mengupload file.', 'error');
    } finally {
        btn.disabled = false; btn.innerHTML = oldText;
    }
}

function renderProgram() { renderFileList(programList, 'programList'); }
function renderLaporanBulanan() { renderFileList(laporanBulananList, 'laporanBulananList'); }

function renderFileList(list, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (list.length === 0) {
        container.innerHTML = '<div class="empty-state">Belum ada file</div>';
        return;
    }

    container.innerHTML = list.map(file => {
        const owner = isDataOwner(file);
        const icon = getFileIcon(file.file_type || file.file_name);
        return `
            <div class="program-item">
                <div style="display: flex; align-items: flex-start; flex: 1;">
                    <div class="program-item-icon">${icon}</div>
                    <div class="program-info">
                        <h4>${escapeHTML(file.nama)}</h4>
                        <p>File: ${escapeHTML(file.file_name)}</p>
                        <p>Tanggal: ${formatDate(file.created_at)}</p>
                        ${file.desc ? `<p>${escapeHTML(file.desc)}</p>` : ''}
                        <p style="font-size: 12px; color: #777; margin-top: 8px;">Dibuat oleh: ${escapeHTML(file.creator?.name || '-')}</p>
                    </div>
                </div>
                <div class="program-actions">
                    <button onclick="window.open('${file.file_path}', '_blank')">📥 Download</button>
                    ${owner
                        ? `<button class="delete" onclick="deleteFile(${file.id})">🗑 Hapus</button>`
                        : `<button disabled style="opacity: 0.5;">🔒 Terkunci</button>`}
                </div>
            </div>
        `;
    }).join('');
}

window.deleteFile = async function(id) {
    if (!await askConfirm('Hapus file ini permanen?')) return;
    try {
        const res = await fetch(`/admin/file/${id}`, { method: 'DELETE', headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': CSRF_TOKEN }});
        if (!res.ok) throw new Error();
        notify('File dihapus.', 'success');
        await loadDetailData();
    } catch (e) {
        notify('Gagal menghapus file.', 'error');
    }
};

function getFileIcon(type) {
    type = String(type || '').toLowerCase();
    if (type.includes('pdf')) return '📄';
    if (type.includes('xls') || type.includes('csv')) return '📊';
    if (type.includes('doc')) return '📝';
    if (type.includes('png') || type.includes('jpg')) return '🖼️';
    return '📋';
}

// =========================================================
// JADWAL
// =========================================================
async function addJadwal(e) {
    e.preventDefault();
    const payload = {
        no: document.getElementById('jadwalNo').value.trim(),
        nama: document.getElementById('jadwalNama').value.trim(),
        tanggal: document.getElementById('jadwalTanggal').value,
        jam: document.getElementById('jadwalJam').value,
        tempat: document.getElementById('jadwalTempat').value.trim()
    };

    if (!payload.no || !payload.nama || !payload.tanggal) return notify('Data wajib diisi!', 'warning');

    try {
        const res = await fetch(`/admin/kontingen/${KONTINGEN_ID}/jadwal`, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF_TOKEN },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error();
        document.getElementById('addJadwalForm').reset();
        closeModal('addJadwalModal');
        notify('Jadwal disimpan.', 'success');
        await loadDetailData();
    } catch (err) {
        notify('Gagal menyimpan jadwal.', 'error');
    }
}

function renderJadwal() {
    const list = document.getElementById('jadwalList');
    if (!list) return;

    if (jadwalList.length === 0) {
        list.innerHTML = '<div class="empty-state">Belum ada jadwal</div>';
        return;
    }

    list.innerHTML = jadwalList.map(j => {
        const owner = isDataOwner(j);
        return `
            <div class="jadwal-item">
                <div class="jadwal-info">
                    <h4>[${escapeHTML(j.no)}] ${escapeHTML(j.nama)}</h4>
                    <p><strong>Tanggal:</strong> ${formatDate(j.tanggal)}</p>
                    ${j.jam ? `<p><strong>Jam:</strong> ${escapeHTML(j.jam)}</p>` : ''}
                    ${j.tempat ? `<p><strong>Tempat:</strong> ${escapeHTML(j.tempat)}</p>` : ''}
                    <p style="font-size: 12px; color: #777; margin-top: 8px;">Dibuat oleh: ${escapeHTML(j.creator?.name || '-')}</p>
                </div>
                <div class="jadwal-actions">
                    ${owner
                        ? `<button onclick="editJadwal(${j.id})">✎ Edit</button>
                           <button onclick="deleteJadwal(${j.id})" style="color:#ef4444; border-color:#fecaca;">🗑 Hapus</button>`
                        : `<button disabled style="opacity: 0.5;">🔒 Terkunci</button>`}
                </div>
            </div>
        `;
    }).join('');
}

window.editJadwal = async function(id) {
    const j = jadwalList.find(x => x.id === id);
    if (!j) return;
    const newNama = prompt('Ubah nama pertandingan:', j.nama);
    if (!newNama || newNama.trim() === '') return;

    try {
        const res = await fetch(`/admin/jadwal/${id}`, {
            method: 'PUT',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF_TOKEN },
            body: JSON.stringify({ nama: newNama.trim() })
        });
        if (!res.ok) throw new Error();
        notify('Jadwal diperbarui.', 'success');
        await loadDetailData();
    } catch (e) {
        notify('Gagal memperbarui jadwal.', 'error');
    }
};

window.deleteJadwal = async function(id) {
    if (!await askConfirm('Hapus jadwal ini?')) return;
    try {
        const res = await fetch(`/admin/jadwal/${id}`, { method: 'DELETE', headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': CSRF_TOKEN }});
        if (!res.ok) throw new Error();
        notify('Jadwal dihapus.', 'success');
        await loadDetailData();
    } catch (e) {
        notify('Gagal menghapus jadwal.', 'error');
    }
};

// =========================================================
// ABSENSI
// =========================================================
window.loadAbsensi = function() {
    const date = document.getElementById('absensiDate')?.value;
    const container = document.getElementById('absensiContainer');

    if (!date) return container.innerHTML = '<div class="empty-state">Pilih tanggal absensi</div>';
    if (atletList.length === 0) return container.innerHTML = '<div class="empty-state">Tambahkan atlet terlebih dahulu</div>';

    renderAbsensiTable(date);
};

function renderAbsensiTable(date) {
    const container = document.getElementById('absensiContainer');
    if (!container) return;

    let html = `
        <table class="absensi-table">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nama Atlet</th>
                    <th>Status</th>
                    <th>Keterangan</th>
                    <th>Dibuat Oleh</th>
                </tr>
            </thead>
            <tbody>
    `;

    atletList.forEach((atlet, index) => {
        // Cari apakah ada rekam absensi untuk atlet ini di tanggal yang dipilih
        const record = absensiData.find(a => a.atlet_id === atlet.id && a.tanggal === date);
        const status = record?.status || 'hadir'; // Default hadir jika belum diisi
        const owner = !record || record.created_by === window.authUser?.id;

        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${escapeHTML(atlet.nama)}</td>
                <td>
                    <select class="absensi-status-select" onchange="updateAbsensi('${date}', ${atlet.id}, this.value)" ${owner ? '' : 'disabled'}>
                        <option value="hadir" ${status === 'hadir' ? 'selected' : ''}>Hadir</option>
                        <option value="absen" ${status === 'absen' ? 'selected' : ''}>Absen</option>
                        <option value="izin" ${status === 'izin' ? 'selected' : ''}>Izin</option>
                    </select>
                </td>
                <td><span class="status-${status}">${String(status).toUpperCase()}</span></td>
                <td>
                    ${escapeHTML(record?.creator?.name || '-')}
                    ${owner ? '' : '<br><small>🔒 Terkunci</small>'}
                </td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
}

window.updateAbsensi = async function(tanggal, atletId, status) {
    try {
        const response = await fetch(`/admin/kontingen/${KONTINGEN_ID}/absensi`, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'X-CSRF-TOKEN': CSRF_TOKEN },
            body: JSON.stringify({ tanggal, atlet_id: atletId, status })
        });

        if (!response.ok) throw new Error();
        notify('Absensi diperbarui.', 'success', 1000);
        await loadDetailData(); // Refresh data absensi dari DB
    } catch (error) {
        notify('Gagal menyimpan absensi.', 'error');
        renderAbsensiTable(tanggal); // Kembalikan UI jika gagal
    }
};

// =========================================================
// LOGOUT
// =========================================================
window.logout = async function() {
    if (!await askConfirm('Yakin ingin logout?')) return;
    try {
        const res = await fetch('/logout', { method: 'POST', headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': CSRF_TOKEN }});
        if (res.ok) {
            localStorage.clear();
            window.location.href = '/login';
        }
    } catch (error) {
        notify('Gagal logout', 'error');
    }
};
