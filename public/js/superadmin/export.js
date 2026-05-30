function exportData(type, format) {

    App.notify(`Menyiapkan file download untuk ${type}...`, 'info', 1500);
    window.location.href = `/superadmin/export/download/${type}/${format}`;
}
