<!DOCTYPE html>
<html lang="id">
@php
  $authUser = auth()->user();
  $authUserPayload = [
    'id' => $authUser->id,
    'name' => $authUser->name,
    'email' => $authUser->email,
    'username' => $authUser->username,
    'role' => $authUser->role,
  ];
@endphp

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>Detail Kontingen - ATLET</title>

  <link rel="stylesheet" href="/css/admin/kontingen-detail-styles.css">
  <link rel="stylesheet" href="/css/alert-style.css">
  <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}">
    <style>
    .user-info-link {
        text-decoration: none;
        color: inherit;
        cursor: pointer;
        padding: 5px 10px;
        border-radius: 6px;
        transition: background-color 0.2s;
    }
    .user-info-link:hover {
        background-color: rgba(0,0,0,0.05);
    }
  </style>
</head>

<body>

  <header class="header">
    <div class="header-content">
      <div class="logo">
        <h1>🏅 ATLET</h1>
      </div>

      <div class="header-actions">
        <a href="{{ route('profile.edit') }}" class="user-info user-info-link" id="userInfo" title="Pengaturan Profil">
          👤 {{ $authUser->name }}
        </a>
        <button class="logout-btn" onclick="logout()">Logout</button>
      </div>
    </div>
  </header>

  <div class="breadcrumb">
    <div class="breadcrumb-content">
      <a href="{{ route('admin.dashboard') }}">← Kembali ke Dashboard</a>
      <span id="breadcrumbTitle"> / {{ $kontingen->name }}</span>
    </div>
  </div>

  <main class="container">

    <section class="kontingen-header">
      <div>
        <h2 id="kontigenName">{{ $kontingen->name }}</h2>
        <p id="kontigenAddress" class="kontigen-address">
            {{ $kontingen->address ?? $kontingen->desc ?? 'Alamat belum diisi' }}
        </p>
        <p class="kontigen-code">
          Kode: <code id="kontigenCode">{{ $kontingen->code }}</code>
        </p>
      </div>
    </section>

    <section class="tabs-container">
      <div class="tabs">
        <button class="tab-button active" onclick="switchTab('data-pelatih')">
          👨‍🏫 Data Pelatih
        </button>

        <button class="tab-button" onclick="switchTab('data-atlet')">
          👥 Data Atlet
        </button>

        <button class="tab-button" onclick="switchTab('program-latihan')">
          📋 Program Latihan
        </button>

        <button class="tab-button" onclick="switchTab('absensi')">
          📋 Absensi
        </button>

        <button class="tab-button" onclick="switchTab('jadwal')">
          📅 Jadwal Pertandingan
        </button>

        <button class="tab-button" onclick="switchTab('laporan-bulanan')">
          📊 Laporan Bulanan
        </button>

        <button class="tab-button" onclick="switchTab('laporan-tes')">
          📝 Laporan Tes
        </button>
      </div>
    </section>

    <section class="tabs-content">

      <div id="data-pelatih" class="tab-content active">
        <div class="section-header">
          <h3>Data Pelatih</h3>
          <button class="btn-primary" onclick="openAddPelatihModal()">
            + Tambah Pelatih
          </button>
        </div>

        <div class="data-grid" id="pelatihGrid">
          <div class="empty-state">Belum ada data pelatih</div>
        </div>
      </div>

      <div id="data-atlet" class="tab-content">
        <div class="section-header">
          <h3>Data Atlet</h3>
          <button class="btn-primary" onclick="openAddAtletModal()">
            + Tambah Atlet
          </button>
        </div>

        <div class="data-grid" id="atletGrid">
          <div class="empty-state">Belum ada data atlet</div>
        </div>
      </div>

    <div id="program-latihan" class="tab-content">
        <div class="section-header">
          <h3>Program Latihan</h3>

          <div class="button-group-small" style="align-items: center;">
            <label style="cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 14px; margin-right: 10px;">
              <input type="checkbox" id="selectAllProgram" onchange="toggleSelectAll('program')" style="width: 16px; height: 16px;">
              Pilih Semua
            </label>

            <button class="btn-primary" onclick="openUploadProgramModal()">
               Diload File
            </button>

            <button class="btn-secondary" onclick="downloadSelected('program')">
               Download Pilihan
            </button>
          </div>
        </div>

        <div class="program-list" id="programList">
          <div class="empty-state">Belum ada file program latihan</div>
        </div>
      </div>

      <div id="absensi" class="tab-content">
        <div class="section-header">
          <h3>Absensi</h3>

          <div class="button-group-small">
            <input type="date" id="absensiDate" class="date-input">
            <button class="btn-primary" onclick="loadAbsensi()">Load</button>
          </div>
        </div>

        <div class="absensi-container" id="absensiContainer">
          <div class="empty-state">Pilih tanggal untuk melihat absensi</div>
        </div>

        <div class="absensi-legend">
          <span class="legend-item">
            <span class="legend-color" style="background: #22c55e;"></span>
            Hadir
          </span>

          <span class="legend-item">
            <span class="legend-color" style="background: #ef4444;"></span>
            Absen
          </span>

          <span class="legend-item">
            <span class="legend-color" style="background: #eab308;"></span>
            Izin
          </span>
        </div>
      </div>

      <div id="jadwal" class="tab-content">
        <div class="section-header">
          <h3>Jadwal Pertandingan</h3>
          <button class="btn-primary" onclick="openAddJadwalModal()">
            + Tambah Jadwal
          </button>
        </div>

        <div class="jadwal-list" id="jadwalList">
          <div class="empty-state">Belum ada jadwal pertandingan</div>
        </div>
      </div>

    <div id="laporan-bulanan" class="tab-content">
        <div class="section-header">
          <h3>Laporan Bulanan</h3>

          <div class="button-group-small" style="align-items: center;">
            <label style="cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 14px; margin-right: 10px;">
              <input type="checkbox" id="selectAllLaporan" onchange="toggleSelectAll('laporan')" style="width: 16px; height: 16px;">
              Pilih Semua
            </label>

            <button class="btn-primary" onclick="openUploadLaporanModal()">
               Upload File
            </button>

            <button class="btn-secondary" onclick="downloadSelected('laporan')">
               Download Pilihan
            </button>
          </div>
        </div>

        <div class="program-list" id="laporanBulananList">
          <div class="empty-state">Belum ada file laporan bulanan</div>
        </div>
      </div>

      <div id="laporan-tes" class="tab-content">
        <div class="section-header">
          <h3>Laporan Tes</h3>

          <div class="button-group-small" style="align-items: center;">
            <label style="cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 14px; margin-right: 10px;">
              <input type="checkbox" id="selectAllLaporanTes" onchange="toggleSelectAll('laporantes')" style="width: 16px; height: 16px;">
              Pilih Semua
            </label>

            <button class="btn-primary" onclick="openUploadLaporanTesModal()">
              📤 Upload File
            </button>

            <button class="btn-secondary" onclick="downloadSelected('laporantes')">
              📥 Download Pilihan
            </button>
          </div>
        </div>

        <div class="program-list" id="laporanTesList">
          <div class="empty-state">Belum ada file laporan tes</div>
        </div>
      </div>

    </section>
  </main>

  <!-- MODAL PELATIH -->
  <div id="addPelatihModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Tambah Data Pelatih</h3>
        <button class="close-btn" onclick="closeModal('addPelatihModal')">&times;</button>
      </div>

      <div class="modal-body">
       <form id="addPelatihForm">
          <div class="form-group">
            <label for="pelatihFoto">Foto Pelatih</label>
            <input type="file" id="pelatihFoto" accept="image/*" required>
          </div>

          <hr style="margin: 20px 0; border-color: #e2e8f0;">

          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <label style="margin: 0; color: #1b3061; font-weight: 800; font-size: 13px;">Isi Form</label>
              <button type="button" class="btn-secondary" onclick="addDynamicField('dynamicFieldsContainerPelatih')" style="padding: 4px 10px; font-size: 11px;">+ Tambah Baris</button>
          </div>

          <div id="dynamicFieldsContainerPelatih"></div>

          <div class="button-group">
            <button type="button" class="btn-secondary" onclick="closeModal('addPelatihModal')">Batal</button>
            <button type="submit" class="btn-primary">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- MODAL ATLET -->
  <div id="addAtletModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Tambah Data Atlet</h3>
        <button class="close-btn" onclick="closeModal('addAtletModal')">&times;</button>
      </div>

      <div class="modal-body">
       <form id="addAtletForm">
          <div class="form-group">
            <label for="atletFoto">Foto Atlet</label>
            <input type="file" id="atletFoto" accept="image/*" required>
          </div>

          <hr style="margin: 20px 0; border-color: #e2e8f0;">

          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <label style="margin: 0; color: #1b3061; font-weight: 800; font-size: 13px;">Isian Form (Bebas)</label>
              <button type="button" class="btn-secondary" onclick="addDynamicField('dynamicFieldsContainerAtlet')" style="padding: 4px 10px; font-size: 11px;">+ Tambah Baris</button>
          </div>

          <div id="dynamicFieldsContainerAtlet"></div>

          <div class="button-group">
            <button type="button" class="btn-secondary" onclick="closeModal('addAtletModal')">Batal</button>
            <button type="submit" class="btn-primary">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- MODAL PROGRAM LATIHAN -->
  <div id="uploadProgramModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Upload File Program Latihan</h3>
        <button class="close-btn" onclick="closeModal('uploadProgramModal')">&times;</button>
      </div>

      <div class="modal-body">
        <form id="uploadProgramForm">
          <div class="form-group">
            <label for="programFile">Pilih File (PDF, Excel, Spreadsheet)</label>
            <input type="file" id="programFile" accept=".pdf,.xlsx,.xls,.csv" required>
            <small>Format: PDF, Excel (.xlsx, .xls), atau CSV</small>
          </div>

          <div class="form-group">
            <label for="programNama">Nama Program</label>
            <input
              type="text"
              id="programNama"
              placeholder="Contoh: Program Latihan Bulan Februari"
              required
            >
          </div>

          <div class="form-group">
            <label for="programDesc">Deskripsi (Opsional)</label>
            <textarea id="programDesc"></textarea>
          </div>

          <div class="button-group">
            <button type="button" class="btn-secondary" onclick="closeModal('uploadProgramModal')">
              Batal
            </button>

            <button type="submit" class="btn-primary">
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- MODAL LAPORAN BULANAN -->
  <div id="uploadLaporanModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Upload File Laporan Bulanan</h3>
        <button class="close-btn" onclick="closeModal('uploadLaporanModal')">&times;</button>
      </div>

      <div class="modal-body">
        <form id="uploadLaporanForm">
          <div class="form-group">
            <label for="laporanFile">Pilih File Laporan</label>
            <input type="file" id="laporanFile" accept=".pdf,.xlsx,.xls,.csv" required>
            <small>Format: PDF, Excel (.xlsx, .xls), atau CSV</small>
          </div>

          <div class="form-group">
            <label for="laporanNama">Nama Laporan</label>
            <input
              type="text"
              id="laporanNama"
              placeholder="Contoh: Laporan Bulanan Januari"
              required
            >
          </div>

          <div class="form-group">
            <label for="laporanDesc">Deskripsi (Opsional)</label>
            <textarea id="laporanDesc"></textarea>
          </div>

          <div class="button-group">
            <button type="button" class="btn-secondary" onclick="closeModal('uploadLaporanModal')">
              Batal
            </button>

            <button type="submit" class="btn-primary">
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- MODAL JADWAL -->
  <div id="addJadwalModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Tambah Jadwal Pertandingan</h3>
        <button class="close-btn" onclick="closeModal('addJadwalModal')">&times;</button>
      </div>

      <div class="modal-body">
        <form id="addJadwalForm">
          <div class="form-group">
            <label for="jadwalNo">No. Pertandingan</label>
            <input type="text" id="jadwalNo" placeholder="Contoh: P001" required>
          </div>

          <div class="form-group">
            <label for="jadwalNama">Nama Pertandingan</label>
            <input type="text" id="jadwalNama" placeholder="Contoh: Turnamen Bulutangkis" required>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="jadwalTanggal">Tanggal</label>
              <input type="date" id="jadwalTanggal" required>
            </div>

            <div class="form-group">
              <label for="jadwalJam">Jam</label>
              <input type="time" id="jadwalJam">
            </div>
          </div>

          <div class="form-group">
            <label for="jadwalTempat">Tempat</label>
            <textarea
              id="jadwalTempat"
              placeholder="Alamat lengkap tempat pertandingan"
            ></textarea>
          </div>

          <div class="button-group">
            <button type="button" class="btn-secondary" onclick="closeModal('addJadwalModal')">
              Batal
            </button>

            <button type="submit" class="btn-primary">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- MODAL LAPORAN TES -->
  <div id="uploadLaporanTesModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Upload File Laporan Tes</h3>
        <button class="close-btn" onclick="closeModal('uploadLaporanTesModal')">&times;</button>
      </div>

      <div class="modal-body">
        <form id="uploadLaporanTesForm">
          <div class="form-group">
            <label for="laporantesFile">Pilih File (PDF, Excel, Spreadsheet)</label>
            <input type="file" id="laporantesFile" accept=".pdf,.xlsx,.xls,.csv" required>
          </div>

          <div class="form-group">
            <label for="laporantesNama">Nama Laporan Tes</label>
            <input type="text" id="laporantesNama" placeholder="Contoh: Laporan Tes Fisik Tahap 1" required>
          </div>

          <div class="form-group">
            <label for="laporantesDesc">Deskripsi (Opsional)</label>
            <textarea id="laporantesDesc"></textarea>
          </div>

          <div class="button-group">
            <button type="button" class="btn-secondary" onclick="closeModal('uploadLaporanTesModal')">Batal</button>
            <button type="submit" class="btn-primary">Upload</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div id="editPelatihModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Edit Data Pelatih</h3>
        <button class="close-btn" onclick="closeModal('editPelatihModal')">&times;</button>
      </div>
      <div class="modal-body">
        <form id="editPelatihForm" onsubmit="event.preventDefault(); submitEditPersonData('pelatih', 'editPelatihForm', 'editPelatihModal');">
          <input type="hidden" id="pelatihEditId"> <div class="form-group">
            <label>Foto Baru</label>
            <input type="file" id="editPelatihFoto" accept="image/*">
          </div>
          <hr style="margin: 20px 0; border-color: #e2e8f0;">

          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <label style="margin: 0; color: #1b3061; font-weight: 800; font-size: 13px;">Isian Form</label>
              <button type="button" class="btn-secondary" onclick="addDynamicField('editDynamicFieldsContainerPelatih')" style="padding: 4px 10px; font-size: 11px;">+ Tambah Baris</button>
          </div>
          <div id="editDynamicFieldsContainerPelatih"></div>
          <div class="button-group">
            <button type="button" class="btn-secondary" onclick="closeModal('editPelatihModal')">Batal</button>
            <button type="submit" class="btn-primary">Update Data</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div id="editAtletModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Edit Data Atlet</h3>
        <button class="close-btn" onclick="closeModal('editAtletModal')">&times;</button>
      </div>
      <div class="modal-body">
        <form id="editAtletForm" onsubmit="event.preventDefault(); submitEditPersonData('atlet', 'editAtletForm', 'editAtletModal');">
          <input type="hidden" id="atletEditId">
          <div class="form-group">
            <label>Foto Baru (Biarkan kosong jika tidak diganti)</label>
            <input type="file" id="editAtletFoto" accept="image/*">
          </div>
          <hr style="margin: 20px 0; border-color: #e2e8f0;">

          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <label style="margin: 0; color: #1b3061; font-weight: 800; font-size: 13px;">Isian Form (Bebas)</label>
              <button type="button" class="btn-secondary" onclick="addDynamicField('editDynamicFieldsContainerAtlet')" style="padding: 4px 10px; font-size: 11px;">+ Tambah Baris</button>
          </div>
          <div id="editDynamicFieldsContainerAtlet"></div>
          <div class="button-group">
            <button type="button" class="btn-secondary" onclick="closeModal('editAtletModal')">Batal</button>
            <button type="submit" class="btn-primary">Update Data</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div id="previewModal" class="modal">
    <div class="modal-content" style="width: 85%; max-width: 1000px; height: 85vh; display: flex; flex-direction: column; padding: 0; overflow: hidden;">

      <div class="modal-header" style="padding: 16px 24px; border-bottom: 1px solid #e2e8f0; background: #fff; z-index: 10;">
        <h3 id="previewTitle" style="margin: 0; font-size: 18px; color: #1e3a8a;">Preview File</h3>
        <button class="close-btn" onclick="closeModal('previewModal')" style="margin: 0;">&times;</button>
      </div>

      <div class="modal-body" style="flex: 1; padding: 0; background: #f8fafc; display: flex; justify-content: center; align-items: center; position: relative;">

          <img id="previewImage" style="display: none; max-width: 100%; max-height: 100%; object-fit: contain;" src="" alt="Preview">

          <iframe id="previewIframe" style="display: none; width: 100%; height: 100%; border: none; background: #fff;" src=""></iframe>

          <div id="previewFallback" style="display: none; text-align: center; padding: 40px;">
              <div style="font-size: 54px; margin-bottom: 12px;">📄</div>
              <h4 style="color: #1e293b; margin-bottom: 8px; font-size: 18px;">Preview Tidak Tersedia</h4>
              <p style="color: #64748b; font-size: 14px; margin-bottom: 24px;">
                  Format file <strong id="previewExt" style="text-transform: uppercase;"></strong> tidak dapat ditampilkan langsung di browser.<br>Silakan download file untuk membukanya.
              </p>
              <button class="btn-primary" id="previewDownloadBtn">📥 Download File</button>
          </div>

      </div>
    </div>
  </div>

  <div id="previewModal" class="modal">
    <div class="modal-content" style="width: 85%; max-width: 1000px; height: 85vh; display: flex; flex-direction: column; padding: 0; overflow: hidden;">

      <div class="modal-header" style="padding: 16px 24px; border-bottom: 1px solid #e2e8f0; background: #fff; z-index: 10;">
        <h3 id="previewTitle" style="margin: 0; font-size: 18px; color: #1e3a8a;">Preview File</h3>
        <button class="close-btn" onclick="closeModal('previewModal')" style="margin: 0;">&times;</button>
      </div>

      <div class="modal-body" style="flex: 1; padding: 0; background: #f8fafc; display: flex; justify-content: center; align-items: center; position: relative;">

          <img id="previewImage" style="display: none; max-width: 100%; max-height: 100%; object-fit: contain;" src="" alt="Preview">

          <iframe id="previewIframe" style="display: none; width: 100%; height: 100%; border: none; background: #fff;" src=""></iframe>

          <div id="previewFallback" style="display: none; text-align: center; padding: 40px;">
              <div style="font-size: 54px; margin-bottom: 12px;">📄</div>
              <h4 style="color: #1e293b; margin-bottom: 8px; font-size: 18px;">Preview Tidak Tersedia</h4>
              <p style="color: #64748b; font-size: 14px; margin-bottom: 24px;">
                  Format file <strong id="previewExt" style="text-transform: uppercase;"></strong> tidak dapat ditampilkan.<br>Silakan download file untuk membukanya.
              </p>
              <button class="btn-primary" id="previewDownloadBtn">📥 Download File</button>
          </div>

      </div>
    </div>
  </div>

  <script src="/js/custom-alert.js"></script>
  <form id="logoutForm" method="POST" action="{{ route('logout') }}" hidden>
    @csrf
  </form>
  <script>
    window.authUser = @json($authUserPayload);
    window.logoutUrl = @json(route('logout'));
    window.csrfToken = @json(csrf_token());
  </script>
  <script src="/js/auth/session.js"></script>
  <script src="/js/admin/kontingen-detail.js"></script>
</body>

</html>
