const images = [
  '/assets/login1.jpg',
  '/assets/login2.jpg',
  '/assets/login3.jpg',
  '/assets/gallery1.png'
];

let currentImageIndex = 0;

function changeImage() {
  const rightDiv = document.querySelector('.right');
  if (!rightDiv) return;

  rightDiv.style.backgroundImage = `url('${images[currentImageIndex]}')`;
  currentImageIndex = (currentImageIndex + 1) % images.length;
}

window.addEventListener('load', function () {
  changeImage();
  setInterval(changeImage, 3000);
});

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function notify(message, type = 'info', duration = 2200) {
  if (typeof showToast === 'function') {
    return showToast(message, type, duration);
  }

  alert(message);
  return Promise.resolve(true);
}

const registerForm = document.getElementById('registerForm');

if (registerForm) {
  registerForm.addEventListener('submit', function (e) {
    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const username = document.getElementById('username').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const confirmPasswordElement = document.getElementById('password_confirmation');
    const confirmPassword = confirmPasswordElement ? confirmPasswordElement.value : '';

    const agreeTermsElement = document.getElementById('agreeTerms');
    const agreeTerms = agreeTermsElement ? agreeTermsElement.checked : true;

    if (!fullname) {
      e.preventDefault();
      notify('Nama lengkap tidak boleh kosong!', 'warning', 2200);
      return;
    }

    if (!email || !isValidEmail(email)) {
      e.preventDefault();
      notify('Email tidak valid!', 'error', 2200);
      return;
    }

    if (!username || username.length < 3) {
      e.preventDefault();
      notify('Username minimal 3 karakter!', 'warning', 2200);
      return;
    }

    if (!/^[a-z0-9_]+$/.test(username)) {
      e.preventDefault();
      notify('Username hanya boleh berisi huruf kecil, angka, dan underscore.', 'warning', 2200);
      return;
    }

    if (!password || password.length < 6) {
      e.preventDefault();
      notify('Password minimal 6 karakter!', 'warning', 2200);
      return;
    }

    if (password !== confirmPassword) {
      e.preventDefault();
      notify('Password tidak cocok!', 'error', 2200);
      return;
    }

    if (!agreeTerms) {
      e.preventDefault();
      notify('Anda harus setuju dengan Syarat & Ketentuan!', 'warning', 2200);
      return;
    }

    const reservedUsernames = ['superadmin', 'admin', 'pelatih'];

    if (reservedUsernames.includes(username)) {
      e.preventDefault();
      notify('Username ini sudah disediakan oleh sistem. Silakan gunakan username lain!', 'error', 2200);
      return;
    }
  });
}
