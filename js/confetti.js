/* ============================================
   Aarya's Learning Star — Confetti & Celebration Effects
   Canvas-based confetti with star particles
   ============================================ */

const Confetti = (() => {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let particles = [];
  let animating = false;

  function resize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const COLORS = ['#7C3AED', '#EC4899', '#FBBF24', '#34D399', '#60A5FA', '#FB923C', '#F472B6'];

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = -20;
      this.size = Math.random() * 8 + 4;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.speedY = Math.random() * 3 + 2;
      this.speedX = (Math.random() - 0.5) * 4;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 10;
      this.opacity = 1;
      this.shape = Math.random() > 0.5 ? 'star' : 'circle';
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotationSpeed;
      this.speedY += 0.05; // gravity
      this.opacity -= 0.005;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.fillStyle = this.color;

      if (this.shape === 'star') {
        drawStar(ctx, 0, 0, 5, this.size, this.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  function drawStar(ctx, cx, cy, spikes, outerR, innerR) {
    let rot = (Math.PI / 2) * 3;
    let step = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerR);
    for (let i = 0; i < spikes; i++) {
      ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
      rot += step;
      ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerR);
    ctx.closePath();
    ctx.fill();
  }

  function animate() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles = particles.filter(p => p.opacity > 0 && p.y < canvas.height + 50);
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    if (particles.length > 0) {
      requestAnimationFrame(animate);
    } else {
      animating = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  return {
    // Launch a burst of confetti
    burst(count = 80) {
      if (!ctx) return;
      resize();
      for (let i = 0; i < count; i++) {
        const p = new Particle();
        // Spread from center-top area
        p.x = canvas.width / 2 + (Math.random() - 0.5) * canvas.width * 0.6;
        p.y = canvas.height * 0.2;
        p.speedY = -(Math.random() * 6 + 3); // shoot upward
        p.speedX = (Math.random() - 0.5) * 8;
        particles.push(p);
      }
      if (!animating) {
        animating = true;
        animate();
      }
    },

    // Gentle rain of confetti from top
    rain(count = 50, duration = 2000) {
      if (!ctx) return;
      resize();
      const interval = duration / count;
      let i = 0;
      const timer = setInterval(() => {
        if (i >= count) { clearInterval(timer); return; }
        particles.push(new Particle());
        i++;
        if (!animating) {
          animating = true;
          animate();
        }
      }, interval);
    }
  };
})();
