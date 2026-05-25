// ==========================================
// NOTIFICATION & CONFIRM HELPERS
// ==========================================
window.notify = function(message, type = 'info', duration = 2200) {
    if (typeof showToast === 'function') {
        return showToast(message, type, duration);
    }
    alert(message);
    return Promise.resolve(true);
};

window.askConfirm = function(message) {
    if (typeof customConfirm === 'function') {
        return customConfirm(message);
    }
    return Promise.resolve(confirm(message));
};

// ==========================================
// CONFIG & DOM CACHE
// ==========================================
const DOM = {
    get grid() { return document.getElementById('kontigenGrid'); },
    get formCreate() { return document.getElementById('createForm'); },
    get joinCode() { return document.getElementById('joinCode'); },

    get inputs() {
        return {
            name: document.getElementById('kontigenName'),
            desc: document.getElementById('kontigenDesc'),
            address: document.getElementById('kontigenAddress')
        };
    },

    get csrfToken() {
        return document.querySelector('meta[name="csrf-token"]')?.content || '';
    }
};

// ==========================================
// API HELPER
// ==========================================
async function apiRequest(endpoint, method = 'GET', payload = null) {
    const options = {
        method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': DOM.csrfToken
        }
    };

    if (payload) options.body = JSON.stringify(payload);

    const response = await fetch(endpoint, options);
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Terjadi kesalahan pada sistem.');
    }
    return result;
}

// ==========================================
// CORE LOGIC & RENDERING
// ==========================================
async function loadKontingenData() {
    if (!DOM.grid) return;

    try {
        const { data: kontingenList } = await apiRequest('/admin/kontingen-list', 'GET');
        DOM.grid.innerHTML = '';

        if (!kontingenList || kontingenList.length === 0) {
            DOM.grid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <h3>Belum ada kontingen</h3>
                    <p>Buat kontingen baru atau masuk menggunakan kode kontingen.</p>
                </div>
            `;
            return;
        }

        kontingenList.forEach(kontingen => {
            DOM.grid.appendChild(createKontigenCard(kontingen));
        });

    } catch (error) {
        console.error('Load Error:', error);
        notify(error.message, 'error');
    }
}

function createKontigenCard(kontingen) {
    const card = document.createElement('div');
    card.className = 'kontingen-card';

    const { id, is_owner: isOwner } = kontingen;
    const safeName = escapeHTML(kontingen.name || '-');
    const safeCode = escapeHTML(kontingen.code || '-');
    const safeDesc = escapeHTML(kontingen.desc || '');
    const safeOwnerName = escapeHTML(kontingen.owner?.name || '-');

    card.innerHTML = `
        <div class="card-header">
            <div class="card-title-area">
                <span class="card-badge">${isOwner ? 'Pemilik' : 'Member'}</span>
                <h3>${safeName}</h3>
            </div>
            <div class="card-actions">
                ${isOwner
                    ? `<button class="btn-small btn-edit-card" onclick="KontingenAPI.edit(${id}, '${safeName}')" title="Edit">✎</button>
                       <button class="btn-small btn-delete-card" onclick="KontingenAPI.delete(${id})" title="Hapus">🗑</button>`
                    : `<button class="btn-small btn-exit-card" onclick="KontingenAPI.leave(${id})" title="Keluar">🚪</button>`
                }
            </div>
        </div>
        <div class="card-body">
            <div class="info-row">
                <span class="info-label">Kode Kontingen</span>
                <span class="card-code">${safeCode}</span>
            </div>
            ${safeDesc ? `<div class="info-block"><span class="info-label">Deskripsi</span><p>${safeDesc}</p></div>` : ''}
            <div class="card-meta">
                <span>Pemilik: ${safeOwnerName}</span>
            </div>
        </div>
        <div class="card-footer">
            <button class="btn-footer btn-copy-code" onclick="KontingenAPI.copyCode('${safeCode}')">
                <span>📋 Copy Kode</span>
            </button>
            <button class="btn-footer btn-enter-card" onclick="KontingenAPI.enter(${id})">
                <span>Masuk →</span>
            </button>
        </div>
    `;
    return card;
}

// ==========================================
// ACTION HANDLERS
// ==========================================
async function handleCreateKontingen(e) {
    e.preventDefault();

    const name = DOM.inputs.name?.value.trim();
    const desc = DOM.inputs.desc?.value.trim();
    const address = DOM.inputs.address?.value.trim();

    if (!name) return notify('Nama wajib diisi!', 'warning');

    const submitBtn = DOM.formCreate.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>⏳ Memproses...</span>';

    try {
        await apiRequest('/admin/kontingen', 'POST', { name, desc, address });

        DOM.formCreate.reset();
        KontingenAPI.closeModal('createModal');
        notify('Kontingen berhasil dibuat!', 'success');

        await loadKontingenData();
    } catch (error) {
        console.error('Create Kontingen Error:', error);
        notify(error.message || 'Gagal membuat kontingen.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}

// ==========================================
// UTILITIES
// ==========================================
function escapeHTML(value) {
    return String(value || '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

// ==========================================
// GLOBAL API (For Inline HTML Onclick)
// ==========================================
window.KontingenAPI = {
    edit: async (id, currentName) => {
        const newName = prompt('Ubah nama kontingen:', currentName);
        if (!newName || newName.trim() === '') return;

        try {
            await apiRequest(`/admin/kontingen/${id}`, 'PUT', { name: newName.trim() });
            notify('Nama kontingen diperbarui.', 'success');
            loadKontingenData();
        } catch (error) {
            notify(error.message, 'error');
        }
    },

    delete: async (id) => {
        if (!await askConfirm('Yakin ingin menghapus kontingen ini? Semua data di dalamnya akan terhapus secara permanen.')) return;

        try {
            await apiRequest(`/admin/kontingen/${id}`, 'DELETE');
            notify('Kontingen berhasil dihapus.', 'success');
            loadKontingenData();
        } catch (error) {
            notify(error.message, 'error');
        }
    },

    join: async () => {
        if (!DOM.joinCode) return;

        const code = DOM.joinCode.value.trim().toUpperCase();
        if (!code) return notify('Masukkan kode!', 'warning');

        try {
            await apiRequest('/admin/kontingen/join', 'POST', { code });
            DOM.joinCode.value = '';
            notify('Berhasil masuk ke kontingen.', 'success');
            loadKontingenData();
        } catch (error) {
            notify(error.message, 'error');
        }
    },

    leave: async (id) => {
        if (!await askConfirm('Yakin ingin keluar dari kontingen ini?')) return;

        try {
            await apiRequest(`/admin/kontingen/${id}/leave`, 'POST');
            notify('Anda berhasil keluar.', 'success');
            loadKontingenData();
        } catch (error) {
            notify(error.message, 'error');
        }
    },

    enter: (id) => {
        window.location.href = `/admin/kontingen-detail/${id}`;
    },

    copyCode: (code) => {
        navigator.clipboard.writeText(code).then(
            () => notify(`Kode ${code} berhasil disalin!`, 'success'),
            () => notify('Gagal menyalin kode.', 'error')
        );
    },

    closeModal: (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('show');
    },

    openModal: (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('show');
    }
};

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    loadKontingenData();

    if (DOM.formCreate) {
        DOM.formCreate.addEventListener('submit', handleCreateKontingen);
    }
});

// ==========================================
// AUTH & LOGOUT (ADMIN)
// ==========================================
window.logout = async function() {
    // 1. Tampilkan konfirmasi
    if (!await askConfirm('Yakin ingin logout?')) return;

    try {
        // Ambil CSRF Token
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || '';

        // 2. Tembak endpoint logout backend Laravel
        const response = await fetch('/logout', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            }
        });

        if (response.ok) {
            // 3. Bersihkan data di localStorage spesifik untuk Admin
            const keysToRemove = [
                'isLoggedIn', 'userEmail', 'userUsername',
                'userRole', 'userName', 'currentKontigen'
            ];
            keysToRemove.forEach(key => localStorage.removeItem(key));

            // Jika Anda masih menggunakan tracker online lokal dari versi lama
            if (typeof IU_setOffline === 'function') {
                IU_setOffline();
            }

            // 4. Redirect kembali ke halaman login
            window.location.href = '/login';
        } else {
            notify('Gagal melakukan logout. Silakan coba lagi.', 'error');
        }
    } catch (error) {
        console.error('Logout Error:', error);
        notify('Terjadi kesalahan koneksi ke server.', 'error');
    }
};
