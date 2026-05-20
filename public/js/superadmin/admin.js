document.addEventListener('DOMContentLoaded', () => {
    setupAdminEvents();
});

function setupAdminEvents() {
    const openBtn = document.getElementById('openAddAdminBtn');
    const modal = document.getElementById('addAdminModal');
    const form = document.getElementById('addAdminForm');

    if (openBtn) {
        openBtn.addEventListener('click', openAddAdminModal);
    }

    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeAddAdminModal();
            }
        });
    }

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            await addAdmin();
        });
    }
}

function openAddAdminModal() {
    const modal = document.getElementById('addAdminModal');
    if (!modal) return;
    modal.classList.add('show');
}

function closeAddAdminModal() {
    const modal = document.getElementById('addAdminModal');
    if (!modal) return;
    modal.classList.remove('show');
}

async function addAdmin() {
    const username = document
        .getElementById('newUsername')
        .value
        .trim();
    const password = document
        .getElementById('newPassword')
        .value
        .trim();
    const name = document
        .getElementById('newName')
        .value
        .trim();
    const email = document
        .getElementById('newEmail')
        .value
        .trim();
    if (!username || !email || !password || !name) {
        alert('Semua field wajib diisi.');
        return;
    }

    try {
        const response = await fetch('/superadmin/admins-store', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document
                    .querySelector('meta[name="csrf-token"]')
                    .content
            },
            body: JSON.stringify({
                username,
                password,
                password_confirmation: password,
                email,
                name
            })
        });

        const result = await response.json();

        if (!response.ok) {
            console.error(result);
            alert(result.message || 'Gagal menambahkan admin');
            return;
        }
        alert('Admin berhasil ditambahkan');
        closeAddAdminModal();
        window.location.reload();
    } catch (error) {
        console.error(error);
        alert('Terjadi kesalahan');
    }
}

async function deleteAdmin(id) {
    const confirmed = confirm(
        'Yakin ingin menghapus admin ini?'
    );
    if (!confirmed) return;
    try {
        const response = await fetch(
            `/superadmin/admins-delete/${id}`,
            {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document
                        .querySelector('meta[name="csrf-token"]')
                        .content
                }
            }
        );

        const result = await response.json();
        if (!response.ok) {
            alert(result.message || 'Gagal menghapus admin');
            return;
        }
        alert('Admin berhasil dihapus');
        window.location.reload();
    } catch (error) {
        console.error(error);
        alert('Terjadi kesalahan');
    }
}
