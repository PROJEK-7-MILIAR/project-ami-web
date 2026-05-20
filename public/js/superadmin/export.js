document.addEventListener('DOMContentLoaded', function () {
  setupExportButtons();
});

function setupExportButtons() {
  const buttons = document.querySelectorAll('[data-type][data-format]');

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      const type = button.dataset.type;
      const format = button.dataset.format;

      exportData(type, format);
    });
  });
}

function exportData(type, format) {
  const data = collectExportData(type);

  if (!data.length) {
    App.notify('Tidak ada data untuk di-export.');
    return;
  }

  const filename = type + '_' + Date.now();

  if (format === 'csv') {
    downloadCSV(data, filename + '.csv');
  }

  if (format === 'json') {
    downloadJSON(data, filename + '.json');
  }

  App.addLog(
    'export',
    'Export data ' + type,
    'Format: ' + format.toUpperCase()
  );

  App.notify('Data berhasil di-export.');
}

function collectExportData(type) {
  const kontingen = App.loadKontingen();
  const result = [];

  if (type === 'kontingen') {
    return kontingen.map(function (item) {
      return {
        kode: item.code || '',
        nama: item.name || '',
        pemilik: item.ownerName || item.owner || '',
        alamat: item.address || ''
      };
    });
  }

  if (type === 'activity') {
    return App.loadActivity().map(function (log) {
      return {
        waktu: log.timestamp || '',
        admin: log.admin || '',
        tipe: log.type || '',
        deskripsi: log.description || '',
        detail: log.detail || ''
      };
    });
  }

  kontingen.forEach(function (item) {
    const detail = App.getDetail(item.code);

    if (type === 'atlet') {
      (detail.atlet || []).forEach(function (atlet) {
        result.push({
          kontingen: item.name || '',
          nama: atlet.nama || '',
          usia: atlet.usia || '',
          ttl: atlet.ttl || '',
          prestasi: atlet.prestasi || '',
          dibuat_oleh: atlet.createdByName || atlet.createdBy || ''
        });
      });
    }

    if (type === 'pelatih') {
      (detail.pelatih || []).forEach(function (pelatih) {
        result.push({
          kontingen: item.name || '',
          nama: pelatih.nama || '',
          usia: pelatih.usia || '',
          ttl: pelatih.ttl || '',
          dibuat_oleh: pelatih.createdByName || pelatih.createdBy || ''
        });
      });
    }

    if (type === 'absensi') {
      const absensi = detail.absensi || {};

      Object.keys(absensi).forEach(function (tanggal) {
        result.push({
          kontingen: item.name || '',
          tanggal: tanggal,
          data: JSON.stringify(absensi[tanggal])
        });
      });
    }

    if (type === 'jadwal') {
      (detail.jadwal || []).forEach(function (jadwal) {
        result.push({
          kontingen: item.name || '',
          nama_jadwal: jadwal.nama || jadwal.title || '',
          tanggal: jadwal.tanggal || jadwal.date || '',
          lokasi: jadwal.lokasi || jadwal.location || '',
          keterangan: jadwal.keterangan || jadwal.description || ''
        });
      });
    }

    if (type === 'program') {
      (detail.program || []).forEach(function (program) {
        result.push({
          kontingen: item.name || '',
          nama_program: program.nama || program.title || '',
          tanggal: program.tanggal || program.date || '',
          deskripsi: program.deskripsi || program.description || ''
        });
      });
    }

    if (type === 'pengukuran') {
      (detail.pengukuran || []).forEach(function (pengukuran) {
        result.push({
          kontingen: item.name || '',
          nama_atlet: pengukuran.namaAtlet || pengukuran.atlet || '',
          jenis_tes: pengukuran.jenisTes || pengukuran.test || '',
          nilai: pengukuran.nilai || pengukuran.value || '',
          tanggal: pengukuran.tanggal || pengukuran.date || ''
        });
      });
    }
  });

  return result;
}

function downloadJSON(data, filename) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], {
    type: 'application/json;charset=utf-8;'
  });

  downloadBlob(blob, filename);
}

function downloadCSV(data, filename) {
  if (!data.length) return;

  const headers = Object.keys(data[0]);

  const rows = data.map(function (row) {
    return headers.map(function (header) {
      return csvEscape(row[header]);
    }).join(',');
  });

  const csv = [
    headers.join(','),
    ...rows
  ].join('\n');

  const blob = new Blob([csv], {
    type: 'text/csv;charset=utf-8;'
  });

  downloadBlob(blob, filename);
}

function csvEscape(value) {
  const text = String(value ?? '');

  if (
    text.includes(',') ||
    text.includes('"') ||
    text.includes('\n')
  ) {
    return '"' + text.replaceAll('"', '""') + '"';
  }

  return text;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}