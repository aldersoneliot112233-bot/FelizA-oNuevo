// === CUENTA REGRESIVA REAL ===
const clockEl = document.getElementById('clock');
const messageEl = document.getElementById('message');

function getTargetMidnight() {
  return new Date(2026, 0, 1, 0, 0, 0);
}

function updateCountdown() {
  const now = new Date();
  const target = getTargetMidnight();
  
  if (now >= target) {
    launchNewYear();
    return;
  }

  const currentHours = String(now.getHours()).padStart(2, '0');
  const currentMinutes = String(now.getMinutes()).padStart(2, '0');
  const currentSeconds = String(now.getSeconds()).padStart(2, '0');
  clockEl.textContent = `${currentHours}:${currentMinutes}:${currentSeconds}`;

  clockEl.classList.add('blink');
  setTimeout(() => clockEl.classList.remove('blink'), 400);

  setTimeout(updateCountdown, 1000);
}

// === FUEGOS ARTIFICIALES ÉPICOS ===
// (tu código de fuegos artificiales SIN CAMBIOS, desde "let canvas, ctx;" hasta "function createFirework()")

// ✅ launchNewYear() SIN CAMBIOS

// Iniciar
updateCountdown();

// === FUEGOS ARTIFICIALES ÉPICOS ===
let canvas, ctx;
let fireworks = [];
let isFireworksActive = false;

// 🎨 Paleta de colores vibrantes (¡más impacto!)
const vibrantHues = [0, 30, 60, 120, 180, 240, 300]; // rojo, naranja, amarillo, verde, cyan, azul, magenta

function initFireworks() {
  if (isFireworksActive) return;
  isFireworksActive = true;

  canvas = document.getElementById('fireworksCanvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // ✨ ¡LANZAMIENTO INICIAL ÉPICO! (4 cohetes al mismo tiempo)
  for (let i = 0; i < 4; i++) {
    setTimeout(() => {
      createFirework();
    }, i * 150); // pequeños delay para que no se superpongan
  }

  // 🔥 Luego, continuar con la secuencia normal
  let launchCount = 0;
  const totalLaunches = 150;

  const launchInterval = setInterval(() => {
    if (launchCount >= totalLaunches) {
      clearInterval(launchInterval);
      return;
    }

    const numRockets = Math.random() > 0.4 ? 1 : 2;
    for (let i = 0; i < numRockets; i++) {
      setTimeout(() => {
        createFirework();
      }, i * 300);
    }

    launchCount++;
  }, 2000);

  // Animación principal
  function animate() {
    if (!isFireworksActive) return;
    requestAnimationFrame(animate);
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    fireworks = fireworks.filter(fw => {
      fw.update();
      fw.draw(ctx);
      return !fw.isDead;
    });
  }

  animate();
}

class Firework {
  constructor() {
    this.x = 50 + Math.random() * (canvas.width - 100);
    this.y = canvas.height + 20;
    this.vy = -10 - Math.random() * 5;
    this.ay = 0.1;
    // ✨ Usar color vibrante aleatorio
    this.hue = vibrantHues[Math.floor(Math.random() * vibrantHues.length)];
    this.trail = [];
    this.maxTrail = 15;
    this.exploded = false;
    this.isDead = false;
    this.particles = [];
    this.explodeAtY = canvas.height * 0.3;
  }

  update() {
    if (this.exploded) {
      this.particles.forEach(p => p.update());
      this.particles = this.particles.filter(p => p.life > 0);
      if (this.particles.length === 0) {
        this.isDead = true;
      }
    } else {
      this.vy += this.ay;
      this.y += this.vy;
      
      this.trail.push({x: this.x, y: this.y});
      if (this.trail.length > this.maxTrail) {
        this.trail.shift();
      }
      
      if (this.y <= this.explodeAtY) {
        this.explode();
      }
    }
  }

  explode() {
    this.exploded = true;
    const particleCount = 300 + Math.random() * 100;
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(new Particle(this.x, this.y, this.hue));
    }
  }

  draw(ctx) {
    if (this.exploded) {
      this.particles.forEach(p => p.draw(ctx));
    } else {
      for (let i = 0; i < this.trail.length; i++) {
        const point = this.trail[i];
        const alpha = i / this.trail.length;
        const radius = alpha * 3 + 1;
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        // ✨ Más brillante
        ctx.fillStyle = `hsla(${this.hue}, 100%, 85%, ${alpha * 0.8})`;
        ctx.fill();
      }
      
      ctx.beginPath();
      ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 100%, 80%, 0.95)`;
      ctx.fill();
    }
  }
}

class Particle {
  constructor(x, y, hue) {
    this.x = x;
    this.y = y;
    this.hue = hue + (Math.random() - 0.5) * 20;
    this.vx = (Math.random() - 0.5) * 16;
    this.vy = (Math.random() - 0.5) * 16 - 8;
    this.gravity = 0.18;
    this.friction = 0.96;
    this.life = 150;
    this.maxLife = 150;
    this.radius = Math.random() * 2 + 1;
  }

  update() {
    this.vx *= this.friction;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
  }

  draw(ctx) {
    const lifePct = this.life / this.maxLife;
    const alpha = lifePct * lifePct * 0.95;
    const size = this.radius * (0.5 + lifePct * 0.8);
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue}, 100%, 85%, ${alpha})`;
    ctx.fill();
    
    if (lifePct > 0.8) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, size * 1.8, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 100%, 90%, ${alpha * 0.6})`;
      ctx.fill();
    }
  }
}

function createFirework() {
  fireworks.push(new Firework());
}

// ✅ Versión corregida de launchNewYear (única)
function launchNewYear() {
  document.getElementById('message').style.opacity = '0';
  document.getElementById('clock').style.opacity = '0';
  document.getElementById('newYear').style.display = 'flex';
  
  setTimeout(() => {
    initFireworks();
  }, 800);
}
