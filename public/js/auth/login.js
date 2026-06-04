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

function notify(message, type = 'info', duration = 2200) {
  if (typeof showToast === 'function') {
    return showToast(message, type, duration);
  }

  alert(message);
  return Promise.resolve(true);
}

