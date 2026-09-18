import { animate } from 'animejs';

/**
 * Anime.js-powered High-Performance Particle Engine for GoodMaze
 */
export class AnimeParticleSystem {
  constructor() {
    this.particles = [];
    this.ambientParticles = [];
  }

  // Initialize ambient floating cyber-dust
  initAmbient(width, height, count = 35) {
    this.ambientParticles = [];
    for (let i = 0; i < count; i++) {
      this.ambientParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.35 + 0.1,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        color: Math.random() > 0.5 ? '#00f3ff' : '#a855f7'
      });
    }
  }

  // Smooth trail emitted while player is gliding
  spawnTrail(x, y, color = '#00f3ff') {
    const p = {
      x: x + (Math.random() - 0.5) * 8,
      y: y + (Math.random() - 0.5) * 8,
      size: Math.random() * 3 + 1.5,
      alpha: 0.75,
      color
    };
    this.particles.push(p);

    animate(p, {
      alpha: 0,
      size: 0.2,
      duration: 450 + Math.random() * 250,
      ease: 'outQuad',
      onComplete: () => {
        const idx = this.particles.indexOf(p);
        if (idx !== -1) this.particles.splice(idx, 1);
      }
    });
  }

  // Explosive radial burst with elastic / expo deceleration
  spawnBurst(x, y, color, count = 35, speed = 90, size = 3.5, duration = 800) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = (Math.random() * 0.75 + 0.25) * speed;
      const targetX = x + Math.cos(angle) * dist;
      const targetY = y + Math.sin(angle) * dist;

      const p = {
        x,
        y,
        size: Math.random() * size + 1.5,
        alpha: 1,
        color,
        sparkle: Math.random() > 0.4
      };
      this.particles.push(p);

      animate(p, {
        x: targetX,
        y: targetY,
        alpha: 0,
        size: 0.3,
        duration: duration * (0.6 + Math.random() * 0.7),
        ease: 'outExpo',
        onComplete: () => {
          const idx = this.particles.indexOf(p);
          if (idx !== -1) this.particles.splice(idx, 1);
        }
      });
    }
  }

  // Wall bump shockwave micro-sparks
  spawnBump(x, y) {
    this.spawnBurst(x, y, '#64748b', 12, 35, 2, 400);
  }

  // Gem collection sparkling burst
  spawnGemPickup(x, y) {
    this.spawnBurst(x, y, '#f43f5e', 32, 95, 3.5, 750);
    this.spawnBurst(x, y, '#ffffff', 14, 55, 2.5, 600);
  }

  // Key collection radiant golden starburst
  spawnKeyPickup(x, y) {
    this.spawnBurst(x, y, '#fbbf24', 45, 120, 4.5, 1000);
    this.spawnBurst(x, y, '#f59e0b', 25, 70, 3, 850);
    this.spawnBurst(x, y, '#ffffff', 20, 140, 2.5, 950);
  }

  // Multi-wave celebratory victory fireworks
  spawnVictoryFireworks(width, height) {
    const colors = ['#00f3ff', '#10b981', '#fbbf24', '#f43f5e', '#a855f7', '#38bdf8'];
    for (let wave = 0; wave < 5; wave++) {
      setTimeout(() => {
        const x = width * 0.15 + Math.random() * width * 0.7;
        const y = height * 0.15 + Math.random() * height * 0.7;
        const color = colors[wave % colors.length];
        this.spawnBurst(x, y, color, 40, 160, 4.5, 1200);
        this.spawnBurst(x, y, '#ffffff', 18, 90, 2.5, 900);
      }, wave * 180);
    }
  }

  // Swirling vortex suction particles around the exit portal
  spawnPortalAura(gx, gy, radius) {
    if (Math.random() > 0.45) return;
    const angle = Math.random() * Math.PI * 2;
    const spawnDist = radius * (1.2 + Math.random() * 0.6);
    const startX = gx + Math.cos(angle) * spawnDist;
    const startY = gy + Math.sin(angle) * spawnDist;

    const p = {
      x: startX,
      y: startY,
      size: Math.random() * 2 + 1,
      alpha: 0.8,
      color: '#34d399'
    };
    this.particles.push(p);

    animate(p, {
      x: gx,
      y: gy,
      alpha: 0,
      size: 0.2,
      duration: 600 + Math.random() * 300,
      ease: 'inQuad',
      onComplete: () => {
        const idx = this.particles.indexOf(p);
        if (idx !== -1) this.particles.splice(idx, 1);
      }
    });
  }

  updateAmbient(width, height) {
    for (const p of this.ambientParticles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
    }
  }

  draw(ctx) {
    ctx.save();
    // Ambient floating dust
    for (const p of this.ambientParticles) {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Active animated Anime.js particles
    for (const p of this.particles) {
      if (p.alpha <= 0.01) continue;
      ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.2, p.size), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

