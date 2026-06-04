document.addEventListener('DOMContentLoaded', function () {
    renderKontingenManagement();
});

async function renderKontingenManagement() {
    const container = document.getElementById('kontingenList');
    if (!container) return;

    try {
        const response = await fetch('/superadmin/kontingen/data', {
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error('Gagal memuat data');
        const kontingen = await response.json();

        if (kontingen.length === 0) {
            container.innerHTML = '<div class="empty-state">Belum ada kontingen yang terdaftar di sistem.</div>';
            return;
        }

        container.innerHTML = '';

        // Looping data dari database
        kontingen.forEach(function (item) {
            const card = document.createElement('div');
            card.className = 'kontingen-admin-card';

            card.innerHTML = `
                <div class="kontingen-admin-info">
                    <h3>${App.escapeHTML(item.name || '-')}</h3>

                    <p><strong>Kode:</strong> ${App.escapeHTML(item.code || '-')}</p>
                    <p><strong>Pemilik:</strong> ${App.escapeHTML(item.owner?.name || item.owner?.username || 'Tidak ada')}</p>
                    <p><strong>Alamat:</strong> ${App.escapeHTML(item.address || '-')}</p>

                    <div class="data-badge-group">
                        <span class="data-badge">👨‍🏫 ${item.pelatihs_count || 0} Pelatih</span>
                        <span class="data-badge">👥 ${item.atlets_count || 0} Atlet</span>
                        <span class="data-badge">📋 ${item.absensis_count || 0} Absensi</span>
                    </div>
                </div>

                <div class="kontingen-admin-actions">
                    <button type="button" class="btn-danger" data-delete="${item.id}">
                        🗑 Hapus
                    </button>
                </div>
            `;
            container.appendChild(card);
        });

        // Binding event hapus ke setiap tombol
        container.querySelectorAll('[data-delete]').forEach(button => {
            button.addEventListener('click', () => deleteKontingen(button.dataset.delete));
        });

    } catch (error) {
        container.innerHTML = '<div class="empty-state">Terjadi kesalahan saat memuat data kontingen.</div>';
        console.error(error);
    }
}

async function deleteKontingen(id) {
    const confirmed = await askConfirm('Yakin ingin menghapus kontingen ini? Semua data atlet, pelatih, absensi, dan file di dalamnya akan terhapus permanen.');
    if (!confirmed) return;

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || '';

    try {
        const response = await fetch(`/superadmin/kontingen/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            }
        });

        if (!response.ok) throw new Error('Gagal menghapus kontingen');

        notify('Kontingen dan seluruh datanya berhasil dihapus.', 'success');

        await renderKontingenManagement();

    } catch (error) {
        notify('Terjadi kesalahan saat menghapus data.', 'error');
        console.error(error);
    }
}
