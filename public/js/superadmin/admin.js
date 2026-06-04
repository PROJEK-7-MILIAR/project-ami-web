document.addEventListener('DOMContentLoaded', () => {
    setupAdminEvents();
});

function setupAdminEvents() {
    const openBtn = document.getElementById('openAddAdminBtn');
    const modal = document.getElementById('addAdminModal');
    const form = document.getElementById('addAdminForm');
    const editForm = document.getElementById('editAdminForm');
    const editModal = document.getElementById('editAdminModal');

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

    if (editForm) {
        editForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            await submitUpdateAdmin();
        });
    }

    if (editModal) {
        editModal.addEventListener('click', (event) => {
            if (event.target === editModal) {
                closeEditAdminModal();
            }
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

function openEditAdminModal(adminData) {
    const admin = typeof adminData === 'string' ? JSON.parse(adminData) : adminData;

    document.getElementById('editId').value = admin.id;
    document.getElementById('editUsername').value = admin.username;
    document.getElementById('editName').value = admin.name;
    document.getElementById('editEmail').value = admin.email;
    document.getElementById('editPassword').value = '';

    const modal = document.getElementById('editAdminModal');
    if (modal) modal.classList.add('show');
}

function closeEditAdminModal() {
    const modal = document.getElementById('editAdminModal');
    if (modal) modal.classList.remove('show');
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

async function submitUpdateAdmin() {
    const id = document.getElementById('editId').value;
    const username = document.getElementById('editUsername').value.trim();
    const name = document.getElementById('editName').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const password = document.getElementById('editPassword').value.trim();

    // Validasi basic
    if (!username || !email || !name) {
        alert('Username, Email, dan Nama wajib diisi.');
        return;
    }

    const payload = { username, name, email };
    if (password !== '') {
        payload.password = password;
    }

    try {
        const response = await fetch(`/superadmin/admins-update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
            console.error(result);
            alert(result.message || 'Gagal memperbarui admin');
            return;
        }

        alert('Admin berhasil diperbarui');
        closeEditAdminModal();
        window.location.reload();

    } catch (error) {
        console.error(error);
        alert('Terjadi kesalahan pada sistem.');
    }
}

async function deleteAdmin(id) {
    const confirmed = confirm('Yakin ingin menghapus admin ini? Data tidak dapat dikembalikan.');
    if (!confirmed) return;

    try {
        const response = await fetch(`/superadmin/admins-delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            }
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.message || 'Gagal menghapus admin');
            return;
        }

        alert('Admin berhasil dihapus');
        window.location.reload(); // Refresh untuk menghilangkan baris dari tabel

    } catch (error) {
        console.error(error);
        alert('Terjadi kesalahan pada sistem.');
    }
}
