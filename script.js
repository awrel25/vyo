// ============================================================
// Autoplay Audio Tanpa Tombol + Stiker Kucing Besar Muter-muter
// ============================================================

const bgAudio = document.getElementById('bgMusic');

function forcePlay() {
  if (!bgAudio) return;
  if (!bgAudio.paused && !bgAudio.muted) return;

  bgAudio.muted = false;
  bgAudio.volume = 1.0;

  const playPromise = bgAudio.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Menunggu trigger otomatis berikutnya
    });
  }
}

// 1. Eksekusi instan saat script dimuat
forcePlay();

// 2. Loop retry setiap 150ms sampai benar-benar berputar
const autoPlayTimer = setInterval(() => {
  if (bgAudio && !bgAudio.paused) {
    clearInterval(autoPlayTimer);
  } else {
    forcePlay();
  }
}, 150);

// 3. Listener pasif: begitu cursor bergerak ke jendela atau layar disentuh, langsung bunyi
const autoEvents = [
  'load',
  'pageshow',
  'focus',
  'mouseenter',
  'mouseover',
  'mousemove',
  'pointermove',
  'pointerdown',
  'touchstart',
  'click',
  'wheel',
  'scroll'
];

autoEvents.forEach((evt) => {
  window.addEventListener(evt, forcePlay, { capture: true, passive: true });
  document.addEventListener(evt, forcePlay, { capture: true, passive: true });
});

document.addEventListener('DOMContentLoaded', () => {
  forcePlay();

  // --- Dynamic Bouncing & Tumbling Square Stickers ---
  const isMobile = window.innerWidth <= 600;
  const catCount = isMobile ? 8 : 12;
  const cats = [];

  class BouncingCat {
    constructor(index) {
      this.el = document.createElement('div');
      this.el.className = 'bouncing-cat';

      const img = document.createElement('img');
      img.src = 'cat.jpeg';
      img.alt = 'Foto basri';
      this.el.appendChild(img);

      // Stiker besar:
      // Mobile: 130px - 185px | Desktop: 170px - 260px
      this.size = isMobile
        ? Math.random() * 55 + 130
        : Math.random() * 90 + 170;

      this.el.style.width = this.size + 'px';
      this.el.style.height = this.size + 'px';

      // Posisi acak
      this.x = Math.random() * Math.max(10, (window.innerWidth - this.size));
      this.y = Math.random() * Math.max(10, (window.innerHeight - this.size));

      // Kecepatan dan arah acak
      const speed = Math.random() * 1.4 + 0.8;
      const angle = Math.random() * Math.PI * 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;

      // Rotasi muter-muter
      this.rot = Math.random() * 360;
      this.vRot = (Math.random() - 0.5) * 1.8;

      // Lapisan kedalaman: melewati depan (z-index 6) atau belakang (z-index 4) teks
      this.el.style.zIndex = index % 2 === 0 ? '6' : '4';

      // Interaksi sentuh stiker
      this.el.addEventListener('pointerdown', (e) => {
        forcePlay();
        this.vx *= -1.35;
        this.vy *= -1.35;
        this.vRot += (Math.random() - 0.5) * 10;
        spawnTapParticle(e.clientX, e.clientY);
      });

      document.body.appendChild(this.el);
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.rot += this.vRot;

      const screenW = window.innerWidth;
      const screenH = window.innerHeight;

      // Pantulan tepi layar horizontal
      if (this.x <= 0) {
        this.x = 0;
        this.vx = Math.abs(this.vx);
      } else if (this.x + this.size >= screenW) {
        this.x = screenW - this.size;
        this.vx = -Math.abs(this.vx);
      }

      // Pantulan tepi layar vertikal
      if (this.y <= 0) {
        this.y = 0;
        this.vy = Math.abs(this.vy);
      } else if (this.y + this.size >= screenH) {
        this.y = screenH - this.size;
        this.vy = -Math.abs(this.vy);
      }

      this.el.style.transform = `translate3d(${this.x}px, ${this.y}px, 0) rotate(${this.rot}deg)`;
    }
  }

  // Buat stiker kucing
  for (let i = 0; i < catCount; i++) {
    cats.push(new BouncingCat(i));
  }

  // Animasi 60 FPS
  function animate() {
    for (let i = 0; i < cats.length; i++) {
      cats[i].update();
    }
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  // Responsif saat ukuran browser diubah
  window.addEventListener('resize', () => {
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    cats.forEach((cat) => {
      if (cat.x + cat.size > screenW) cat.x = screenW - cat.size;
      if (cat.y + cat.size > screenH) cat.y = screenH - cat.size;
    });
  });

  // Partikel halus saat layar disentuh
  function spawnTapParticle(x, y) {
    const particle = document.createElement('span');
    particle.className = 'tap-particle';
    particle.textContent = ['🥺', '😍', '💙', '✨'][Math.floor(Math.random() * 4)];
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';

    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 850);
  }

  window.addEventListener('pointerdown', (e) => {
    forcePlay();
    spawnTapParticle(e.clientX, e.clientY);
  });
});
