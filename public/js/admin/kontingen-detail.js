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
let absensiData = [];
let laporanTesList = [];

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
        laporanTesList = data.laporanTes || [];
        jadwalList = data.jadwal || [];
        absensiData = data.absensi || [];

        renderPelatih();
        renderAtlet();
        renderProgram();
        renderLaporanBulanan();
        renderLaporanTes();
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
window.openAddPelatihModal = () => {
    document.getElementById('addPelatihForm').reset();
    document.getElementById('dynamicFieldsContainerPelatih').innerHTML = '';
    addDynamicField('dynamicFieldsContainerPelatih');
    openModal('addPelatihModal');
};
window.openAddAtletModal = () => {
    document.getElementById('addAtletForm').reset();
    document.getElementById('dynamicFieldsContainerAtlet').innerHTML = '';
    addDynamicField('dynamicFieldsContainerAtlet');
    openModal('addAtletModal');
};
window.openUploadProgramModal = () => openModal('uploadProgramModal');
window.openUploadLaporanModal = () => openModal('uploadLaporanModal');
window.openAddJadwalModal = () => openModal('addJadwalModal');
window.openUploadLaporanTesModal = () => openModal('uploadLaporanTesModal');

function setupEventListeners() {
    document.getElementById('addPelatihForm')?.addEventListener('submit', addPelatih);
    document.getElementById('addAtletForm')?.addEventListener('submit', addAtlet);
    document.getElementById('uploadProgramForm')?.addEventListener('submit', uploadProgram);
    document.getElementById('uploadLaporanForm')?.addEventListener('submit', uploadLaporanBulanan);
    document.getElementById('addJadwalForm')?.addEventListener('submit', addJadwal);
    document.getElementById('uploadLaporanTesForm')?.addEventListener('submit', uploadLaporanTes);

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
    window.personDataStore = window.personDataStore || {};
    window.personDataStore[`${type}_${data.id}`] = data;

    const card = document.createElement('div');
    card.className = 'data-card';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.height = '100%';

    const owner = isDataOwner(data);
    const foto = data.foto || 'https://via.placeholder.com/280x200?text=No+Photo';
    const creatorName = data.creator?.name || '-';

    const editFunction = type === 'pelatih' ? 'editPelatih' : 'editAtlet';
    const deleteFunction = type === 'pelatih' ? 'deletePelatih' : 'deleteAtlet';

    let listHtml = '';

    if (data.usia) listHtml += `<div style="display: flex; justify-content: space-between; font-size: 13px; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px;"><span style="color: #64748b; font-weight: 600;">Usia</span><span style="color: #1e3a8a; font-weight: 800;">${escapeHTML(data.usia)} Tahun</span></div>`;
    if (data.ttl) listHtml += `<div style="display: flex; justify-content: space-between; font-size: 13px; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px;"><span style="color: #64748b; font-weight: 600;">TTL</span><span style="color: #1e3a8a; font-weight: 800;">${formatDate(data.ttl)}</span></div>`;
    if (data.prestasi) listHtml += `<div style="display: flex; flex-direction: column; font-size: 13px; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px;"><span style="color: #64748b; font-weight: 600;">Prestasi</span><span style="color: #1e3a8a; font-weight: 800; margin-top: 4px;">${escapeHTML(data.prestasi)}</span></div>`;

    let fields = data.dynamic_fields;
    if (typeof fields === 'string') {
        try { fields = JSON.parse(fields); } catch(e) { fields = []; }
    }

    if (fields && Array.isArray(fields)) {
        fields.forEach((field, index) => {
            if (index === 0 && field.value === data.nama) return;
            listHtml += `
                <div style="display: flex; justify-content: space-between; align-items: flex-start; font-size: 13px; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px;">
                    <span style="color: #64748b; font-weight: 600; flex: 1;">${escapeHTML(field.label)}</span>
                    <span style="color: #1e3a8a; font-weight: 800; text-align: right; flex: 2; word-break: break-word;">${escapeHTML(field.value)}</span>
                </div>
            `;
        });
    }

    card.innerHTML = `
        <img src="${foto}" alt="${escapeHTML(data.nama)}" style="width: 100%; height: 190px; object-fit: cover;">
        <div class="data-card-content" style="padding: 20px; display: flex; flex-direction: column; flex-grow: 1;">
            <h4 style="font-size: 20px; margin-bottom: 4px; color: #1e3a8a; font-weight: 900;">${escapeHTML(data.nama)}</h4>
            <div class="card-scroll-area" style="flex-grow: 1; overflow-y: auto; max-height: 180px; margin-top: 16px; display: flex; flex-direction: column; gap: 8px; padding-right: 6px;">
                ${listHtml}
            </div>
            <div style="margin-top: auto; padding-top: 12px;">
                <p style="font-size: 11px; color: #94a3b8; border-top: 1px dashed #e2e8f0; padding-top: 12px;">
                    Dibuat oleh: ${escapeHTML(creatorName)}
                </p>
                <div class="data-card-actions" style="margin-top: 14px; display: flex; gap: 10px;">
                    ${owner
                        ? `<button onclick="${editFunction}(${data.id})" style="flex: 1; padding: 8px; font-size: 12px; border-radius: 10px; border: 1px solid #cbd5e1; background: #fff; cursor: pointer; transition: all 0.2s; font-weight: 700;">✎ Edit</button>
                           <button class="delete" onclick="${deleteFunction}(${data.id})" style="flex: 1; padding: 8px; font-size: 12px; border-radius: 10px; border: 1px solid #fecaca; background: #fef2f2; color: #ef4444; cursor: pointer; transition: all 0.2s; font-weight: 700;">🗑 Hapus</button>`
                        : `<button disabled style="flex: 1; padding: 8px; font-size: 12px; border-radius: 10px; opacity: 0.5; cursor: not-allowed; font-weight: 700;">🔒 Terkunci</button>`
                    }
                </div>
            </div>
        </div>
    `;
    return card;
}

window.openEditModal = function(type, id) {
    const data = window.personDataStore[`${type}_${id}`];
    if (!data) return notify('Data tidak ditemukan', 'error');

    const formId = `edit${type.charAt(0).toUpperCase() + type.slice(1)}Form`;
    const modalId = `edit${type.charAt(0).toUpperCase() + type.slice(1)}Modal`;
    const containerId = `editDynamicFieldsContainer${type.charAt(0).toUpperCase() + type.slice(1)}`;

    document.getElementById(formId).reset();
    document.getElementById(`${type}EditId`).value = data.id;

    const container = document.getElementById(containerId);
    container.innerHTML = '';

    let fields = data.dynamic_fields;
    if (typeof fields === 'string') {
        try { fields = JSON.parse(fields); } catch(e) { fields = []; }
    }

    if (fields && Array.isArray(fields) && fields.length > 0) {
        fields.forEach(f => addDynamicField(containerId, f.label, f.value));
    } else {
        addDynamicField(containerId, 'Nama Utama', data.nama);
    }

    openModal(modalId);
};

window.editPelatih = (id) => openEditModal('pelatih', id);
window.editAtlet = (id) => openEditModal('atlet', id);

window.deletePelatih = async (id) => await deletePersonData('pelatih', id);
window.deleteAtlet = async (id) => await deletePersonData('atlet', id);

window.addDynamicField = function(containerId, initialLabel = '', initialValue = '') {
    const container = document.getElementById(containerId);
    const row = document.createElement('div');
    row.className = 'dynamic-field-row';
    row.style.display = 'flex';
    row.style.gap = '14px';
    row.style.marginBottom = '14px';
    row.style.alignItems = 'flex-start';

    row.innerHTML = `
        <div class="form-group" style="flex: 1; margin-bottom: 0;">
            <input type="text" class="field-label" placeholder="Judul" value="${escapeHTML(initialLabel)}" required>
        </div>
        <div class="form-group" style="flex: 2; margin-bottom: 0;">
            <textarea class="field-value" placeholder="Isi data..." required
                rows="1"
                style="min-height: 44px; height: 44px; resize: none; overflow: hidden; line-height: 1.5; padding-top: 11px;"
                oninput="this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px';">${escapeHTML(initialValue)}</textarea>
        </div>
        <button type="button" class="btn-danger"
            onclick="if(this.parentElement.parentElement.querySelectorAll('.dynamic-field-row').length > 1) this.parentElement.remove(); else notify('Minimal 1 baris wajib diisi!', 'warning');"
            style="flex: 0 0 auto; height: 44px; width: 44px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 14px; font-size: 16px; transition: all 0.2s;" title="Hapus Baris">🗑️</button>
    `;
    container.appendChild(row);

    if(initialValue) {
        setTimeout(() => {
            const textarea = row.querySelector('.field-value');
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        }, 10);
    }
};

// =========================================================
// PELATIH
// =========================================================
async function addPelatih(e) {
    e.preventDefault();
    await submitPersonData('pelatih', 'addPelatihForm', 'addPelatihModal');
}

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
    const foto = document.getElementById(`${type}Foto`).files[0];
    const formData = new FormData();
    let namaUtama = '';
    const dynamicFields = [];

    document.querySelectorAll(`#${formId} .dynamic-field-row`).forEach((row, index) => {
        const label = row.querySelector('.field-label').value.trim();
        const val = row.querySelector('.field-value').value.trim();

        if (label && val) {
            dynamicFields.push({ label: label, value: val });
            if (index === 0) namaUtama = val;
        }
    });

    if (dynamicFields.length === 0) return notify('Isi minimal 1 baris!', 'warning');

    formData.append('nama', namaUtama);
    formData.append('dynamic_fields', JSON.stringify(dynamicFields));
    if (foto) formData.append('foto', foto);

    const btn = document.querySelector(`#${formId} button[type="submit"]`);
    const oldText = btn.innerHTML;
    btn.disabled = true; btn.innerHTML = '⏳ Menyimpan...';

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
        console.error(error);
    } finally {
        btn.disabled = false; btn.innerHTML = oldText;
    }
}

window.submitEditPersonData = async function(type, formId, modalId) {
    const form = document.getElementById(formId);
    const id = document.getElementById(`${type}EditId`).value;
    const foto = document.getElementById(`edit${type.charAt(0).toUpperCase() + type.slice(1)}Foto`).files[0];

    const formData = new FormData();
    formData.append('_method', 'PUT');

    let namaUtama = '';
    const dynamicFields = [];

    document.querySelectorAll(`#${formId} .dynamic-field-row`).forEach((row, index) => {
        const label = row.querySelector('.field-label').value.trim();
        const val = row.querySelector('.field-value').value.trim();
        if (label && val) {
            dynamicFields.push({ label: label, value: val });
            if (index === 0) namaUtama = val;
        }
    });

    if (dynamicFields.length === 0) return notify('Isi minimal 1 baris!', 'warning');

    formData.append('nama', namaUtama);
    formData.append('dynamic_fields', JSON.stringify(dynamicFields));
    if (foto) formData.append('foto', foto);

    const btn = form.querySelector('button[type="submit"]');
    const oldText = btn.innerHTML;
    btn.disabled = true; btn.innerHTML = '⏳ Menyimpan...';

    try {
        const response = await fetch(`/admin/${type}/${id}`, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': window.csrfToken },
            body: formData
        });

        if (!response.ok) throw new Error(await response.text());

        closeModal(modalId);
        notify(`Data ${type} berhasil diperbarui.`, 'success');
        await loadDetailData();
    } catch (error) {
        notify('Gagal memperbarui data.', 'error');
        console.error(error);
    } finally {
        btn.disabled = false; btn.innerHTML = oldText;
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
// FILES (PROGRAM & LAPORAN) DENGAN CHECKBOX
// =========================================================
async function uploadProgram(e) { e.preventDefault(); await submitFileData('program', 'uploadProgramForm', 'uploadProgramModal'); }
async function uploadLaporanBulanan(e) { e.preventDefault(); await submitFileData('laporan', 'uploadLaporanForm', 'uploadLaporanModal'); }
async function uploadLaporanTes(e) { e.preventDefault(); await submitFileData('laporantes', 'uploadLaporanTesForm', 'uploadLaporanTesModal'); }

async function submitFileData(type, formId, modalId) {
    const prefix = type === 'program' ? 'program' : (type === 'laporan' ? 'laporan' : 'laporantes');

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

function renderProgram() { renderFileList(programList, 'programList', 'program'); }
function renderLaporanBulanan() { renderFileList(laporanBulananList, 'laporanBulananList', 'laporan'); }
function renderLaporanTes() { renderFileList(laporanTesList, 'laporanTesList', 'laporantes'); }

function renderFileList(list, containerId, type) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const checkboxId = type === 'program' ? 'selectAllProgram' : (type === 'laporan' ? 'selectAllLaporan' : 'selectAllLaporanTes');
    const masterCheckbox = document.getElementById(checkboxId);
    if (masterCheckbox) masterCheckbox.checked = false;

    if (list.length === 0) {
        container.innerHTML = '<div class="empty-state">Belum ada file</div>';
        return;
    }

    container.innerHTML = list.map(file => {
        const owner = isDataOwner(file);
        const icon = getFileIcon(file.file_type || file.file_name);
        return `
            <div class="program-item" style="display: flex; align-items: flex-start; gap: 15px;">
                <input type="checkbox" class="checkbox-${type}" value="${file.id}" style="width: 18px; height: 18px; cursor: pointer; margin-top: 14px;">
                <div style="display: flex; align-items: flex-start; flex: 1;">
                    <div class="program-item-icon">${icon}</div>
                    <div class="program-info">
                        <h4 style="margin-top: 0;">${escapeHTML(file.nama)}</h4>
                        <p>File: ${escapeHTML(file.file_name)}</p>
                        <p>Tanggal: ${formatDate(file.created_at)}</p>
                        ${file.desc ? `<p>${escapeHTML(file.desc)}</p>` : ''}
                        <p style="font-size: 12px; color: #777; margin-top: 8px;">Dibuat oleh: ${escapeHTML(file.creator?.name || '-')}</p>
                    </div>
                </div>
                <div class="program-actions" style="margin-top: 5px;">
                    <button onclick="window.location.href='/admin/file/${file.id}/download'">📥 Download</button>
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

window.toggleSelectAll = function(type) {
    const checkboxId = type === 'program' ? 'selectAllProgram' : (type === 'laporan' ? 'selectAllLaporan' : 'selectAllLaporanTes');
    const masterCheckbox = document.getElementById(checkboxId);
    const checkboxes = document.querySelectorAll(`.checkbox-${type}`);

    if(masterCheckbox) {
        checkboxes.forEach(cb => cb.checked = masterCheckbox.checked);
    }
};

window.downloadSelected = function(type) {
    const selectedCheckboxes = document.querySelectorAll(`.checkbox-${type}:checked`);

    if (selectedCheckboxes.length === 0) {
        return notify('Pilih minimal satu file yang ingin didownload.', 'warning');
    }

    notify(`Memulai unduhan ${selectedCheckboxes.length} file...`, 'info');

    selectedCheckboxes.forEach((cb, index) => {
        setTimeout(() => {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = `/admin/file/${cb.value}/download`;
            document.body.appendChild(iframe);

            setTimeout(() => {
                if (document.body.contains(iframe)) {
                    document.body.removeChild(iframe);
                }
            }, 10000);

        }, index * 1200);
    });
};

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
        const record = absensiData.find(a => a.atlet_id === atlet.id && a.tanggal === date);
        const status = record?.status || 'hadir';
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
        await loadDetailData();
    } catch (error) {
        notify('Gagal menyimpan absensi.', 'error');
        renderAbsensiTable(tanggal);
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
