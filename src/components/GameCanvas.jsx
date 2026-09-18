import React, { useRef, useEffect } from 'react';
import { AnimeParticleSystem } from '../game/particles';

export function GameCanvas({
  mazeData,
  player,
  setPlayer,
  hasKey,
  activeHintPath,
  onCellClick
}) {
  const canvasRef = useRef(null);
  const particlesRef = useRef(new AnimeParticleSystem());
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(performance.now());

  // Track pickups for Anime.js particle explosions
  const prevGemsCountRef = useRef(mazeData?.gems?.length || 0);
  const prevHasKeyRef = useRef(hasKey);
  const winCelebratedRef = useRef(false);

  // Layout cache
  const layoutRef = useRef({
    cellSize: 40,
    offsetX: 0,
    offsetY: 0,
    width: 600,
    height: 600
  });

  // Canvas resize and render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !mazeData) return;
    const ctx = canvas.getContext('2d');
    const { cols, rows, walls, goal, keyItem, gems, visitedFog, needsKey } = mazeData;

    // Reset win celebration for new level
    winCelebratedRef.current = false;
    prevGemsCountRef.current = gems?.length || 0;
    prevHasKeyRef.current = hasKey;

    const resize = () => {
      const container = canvas.parentElement;
      const maxSize = Math.min(container.clientWidth, window.innerHeight - 240, 780);
      const size = Math.max(300, maxSize);

      const dpr = window.devicePixelRatio || 1;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;

      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);

      const pad = 12;
      const w = size - pad * 2;
      const h = size - pad * 2;
      const cellSize = Math.floor(Math.min(w / cols, h / rows));
      const offsetX = Math.floor((size - cellSize * cols) / 2);
      const offsetY = Math.floor((size - cellSize * rows) / 2);

      layoutRef.current = { cellSize, offsetX, offsetY, width: size, height: size };
      particlesRef.current.initAmbient(size, size, 30);
    };

    resize();
    window.addEventListener('resize', resize);

    const render = (now) => {
      const dt = Math.min(0.1, (now - lastTimeRef.current) / 1000);
      lastTimeRef.current = now;

      const { cellSize, offsetX, offsetY, width } = layoutRef.current;

      // Lerp player render position
      const lerpSpeed = 16 * dt;
      player.renderX += (player.x - player.renderX) * Math.min(1, lerpSpeed);
      player.renderY += (player.y - player.renderY) * Math.min(1, lerpSpeed);

      const px = offsetX + (player.renderX + 0.5) * cellSize;
      const py = offsetY + (player.renderY + 0.5) * cellSize;

      // Spawn Anime.js movement trail while gliding
      if (Math.hypot(player.x - player.renderX, player.y - player.renderY) > 0.04) {
        particlesRef.current.spawnTrail(px, py, '#00f3ff');
      }

      // Check for gem collection trigger
      if (gems && gems.length < prevGemsCountRef.current) {
        particlesRef.current.spawnGemPickup(px, py);
        prevGemsCountRef.current = gems.length;
      }

      // Check for key collection trigger
      if (hasKey && !prevHasKeyRef.current) {
        particlesRef.current.spawnKeyPickup(px, py);
        prevHasKeyRef.current = true;
      }

      // Check for victory celebration fireworks
      if (player.x === goal.x && player.y === goal.y && (!needsKey || hasKey) && !winCelebratedRef.current) {
        winCelebratedRef.current = true;
        particlesRef.current.spawnVictoryFireworks(width, width);
      }

      // Update ambient drifting dust
      particlesRef.current.updateAmbient(width, width);

      // Clear Screen
      ctx.fillStyle = '#0a0d14';
      ctx.fillRect(0, 0, width, width);

      // Ambient corridor grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= cols; x++) {
        const lineX = offsetX + x * cellSize;
        ctx.beginPath();
        ctx.moveTo(lineX, offsetY);
        ctx.lineTo(lineX, offsetY + rows * cellSize);
        ctx.stroke();
      }
      for (let y = 0; y <= rows; y++) {
        const lineY = offsetY + y * cellSize;
        ctx.beginPath();
        ctx.moveTo(offsetX, lineY);
        ctx.lineTo(offsetX + cols * cellSize, lineY);
        ctx.stroke();
      }

      // Hint Breadcrumb Trail
      if (activeHintPath && activeHintPath.length > 0) {
        ctx.save();
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.85)';
        ctx.lineWidth = Math.max(3, cellSize * 0.18);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.setLineDash([6, 8]);
        ctx.lineDashOffset = -now * 0.025;

        ctx.beginPath();
        ctx.moveTo(px, py);
        for (const step of activeHintPath) {
          ctx.lineTo(offsetX + (step.x + 0.5) * cellSize, offsetY + (step.y + 0.5) * cellSize);
        }
        ctx.stroke();
        ctx.restore();
      }

      // Walls
      const wallWidth = Math.max(2, Math.floor(cellSize * 0.14));
      ctx.lineWidth = wallWidth;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#3b82f6';
      ctx.shadowColor = 'rgba(59, 130, 246, 0.6)';
      ctx.shadowBlur = 8;

      ctx.beginPath();
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const mask = walls[`${x},${y}`] || 0;
          const cellX = offsetX + x * cellSize;
          const cellY = offsetY + y * cellSize;

          if (!(mask & 1)) { ctx.moveTo(cellX, cellY); ctx.lineTo(cellX + cellSize, cellY); }
          if (!(mask & 2)) { ctx.moveTo(cellX + cellSize, cellY); ctx.lineTo(cellX + cellSize, cellY + cellSize); }
          if (!(mask & 4)) { ctx.moveTo(cellX + cellSize, cellY + cellSize); ctx.lineTo(cellX, cellY + cellSize); }
          if (!(mask & 8)) { ctx.moveTo(cellX, cellY + cellSize); ctx.lineTo(cellX, cellY); }
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Gems (Pulsing Diamond)
      for (const g of gems) {
        const gx = offsetX + (g.x + 0.5) * cellSize;
        const gy = offsetY + (g.y + 0.5) * cellSize;
        const pulse = 1 + Math.sin(now * 0.006 + g.x * 3 + g.y) * 0.15;
        const s = cellSize * 0.22 * pulse;

        ctx.save();
        ctx.fillStyle = '#f43f5e';
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(gx, gy - s);
        ctx.lineTo(gx + s, gy);
        ctx.lineTo(gx, gy + s);
        ctx.lineTo(gx - s, gy);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(gx, gy, s * 0.28, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Key Item (Spinning Golden Key)
      if (keyItem) {
        const kx = offsetX + (keyItem.x + 0.5) * cellSize;
        const ky = offsetY + (keyItem.y + 0.5) * cellSize;
        const bounce = Math.sin(now * 0.005) * (cellSize * 0.08);

        ctx.save();
        ctx.translate(kx, ky + bounce);
        ctx.fillStyle = '#fbbf24';
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(0, -cellSize * 0.15, cellSize * 0.16, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0a0d14';
        ctx.beginPath();
        ctx.arc(0, -cellSize * 0.15, cellSize * 0.07, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(-cellSize * 0.04, -cellSize * 0.05, cellSize * 0.08, cellSize * 0.32);
        ctx.fillRect(-cellSize * 0.04, cellSize * 0.15, cellSize * 0.14, cellSize * 0.08);
        ctx.restore();
      }

      // Goal Portal
      const gx = offsetX + (goal.x + 0.5) * cellSize;
      const gy = offsetY + (goal.y + 0.5) * cellSize;
      const isGoalLocked = needsKey && !hasKey;
      const portalRadius = cellSize * 0.38;

      // Spawn ambient portal particles
      if (!isGoalLocked) {
        particlesRef.current.spawnPortalAura(gx, gy, portalRadius);
      }

      ctx.save();
      ctx.translate(gx, gy);

      ctx.fillStyle = isGoalLocked ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.25)';
      ctx.shadowColor = isGoalLocked ? '#ef4444' : '#10b981';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(0, 0, portalRadius * (1 + Math.sin(now * 0.006) * 0.15), 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = isGoalLocked ? '#ef4444' : '#4ade80';
      ctx.lineWidth = Math.max(2, cellSize * 0.08);
      ctx.beginPath();
      ctx.arc(0, 0, portalRadius * 0.75, now * 0.003, now * 0.003 + Math.PI * 1.5);
      ctx.stroke();

      ctx.fillStyle = isGoalLocked ? '#ef4444' : '#10b981';
      ctx.beginPath();
      ctx.arc(0, 0, portalRadius * 0.45, 0, Math.PI * 2);
      ctx.fill();

      if (isGoalLocked) {
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${Math.floor(cellSize * 0.4)}px system-ui`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🔒', 0, 0);
      }
      ctx.restore();

      // Player Neon Orb
      const playerRadius = Math.max(5, cellSize * 0.28);
      ctx.save();
      ctx.shadowColor = '#00f3ff';
      ctx.shadowBlur = 18;
      ctx.fillStyle = '#00f3ff';
      ctx.beginPath();
      ctx.arc(px, py, playerRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(px, py, playerRadius * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Draw all Anime.js particles & ambient dust
      particlesRef.current.draw(ctx);

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [mazeData, player, hasKey, activeHintPath]);

  // Click Handler for Tap-to-move
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas || !onCellClick) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / (rect.width * (window.devicePixelRatio || 1));
    const scaleY = canvas.height / (rect.height * (window.devicePixelRatio || 1));
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    const { cellSize, offsetX, offsetY } = layoutRef.current;
    const cellX = Math.floor((clickX - offsetX) / cellSize);
    const cellY = Math.floor((clickY - offsetY) / cellSize);

    onCellClick(cellX, cellY);
  };

  return (
    <div className="relative flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl border border-cyan-500/20 bg-black">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="block cursor-pointer"
      />
    </div>
  );
}
