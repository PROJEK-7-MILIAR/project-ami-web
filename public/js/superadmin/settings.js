function backupData() {
    notify('Menyiapkan file backup dari server database...', 'info');
    window.location.href = '/superadmin/settings/backup';
}

async function restoreData(event) {
    const file = event.target.files[0];
    if (!file) return; // Batal pilih file

    const confirmed = await askConfirm('⚠ Yakin ingin me-restore data dari file ini? SELURUH DATA LAMA AKAN DITIMPA PERMANEN!');

    if (!confirmed) {
        event.target.value = '';
        return;
    }

    notify('Membaca file dan memproses restore database...', 'warning');

    const formData = new FormData();
    formData.append('backup_file', file);

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || '';

    try {
        const response = await fetch('/superadmin/settings/restore', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            },
            body: formData
        });

        const result = await response.json();

        if (!response.ok) throw new Error(result.error || result.message || 'Gagal dari server');

        notify('Restore data selesai! Sistem telah diperbarui.', 'success');

    } catch (error) {
        notify('Gagal me-restore data: ' + error.message, 'error');
        console.error(error);
    }

    event.target.value = '';
}

async function clearOldLogs() {
    const confirmed = await askConfirm('Yakin ingin menghapus secara permanen semua Activity Log dari Database?');
    if (!confirmed) return;

    try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || '';
        const response = await fetch('/superadmin/settings/clear-logs', {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            }
        });

        if (!response.ok) throw new Error('Gagal dari server');

        notify('Semua Activity Log berhasil dikosongkan.', 'success');

    } catch (error) {
        notify('Terjadi kesalahan saat menghapus log.', 'error');
        console.error(error);
    }
}

async function clearAllData() {
    const confirmed = await askConfirm('⚠ YAKIN INGIN MENGHAPUS SEMUA DATA? (Kontingen, Atlet, Pelatih, Absensi akan hilang permanen dari server!)');
    if (!confirmed) return;

    const secondConfirm = await askConfirm('Tindakan ini SANGAT FATAL dan TIDAK BISA DIBATALKAN. Eksekusi sekarang?');
    if (!secondConfirm) return;

    notify('Sedang mereset seluruh database sistem...', 'warning');

    try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || '';
        const response = await fetch('/superadmin/settings/clear-all', {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            }
        });

        if (!response.ok) throw new Error('Gagal dari server');

        notify('Sistem berhasil di-reset. Seluruh data telah dibersihkan.', 'success');

    } catch (error) {
        notify('Terjadi kesalahan fatal saat mengeksekusi reset database.', 'error');
        console.error(error);
    }
}
