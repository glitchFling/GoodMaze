import React from 'react';
import { Volume2, VolumeX, Music, Compass, Pause } from 'lucide-react';

export function HUD({
  level,
  score,
  gemsCollected,
  totalGems,
  needsKey,
  hasKey,
  hintsRemaining,
  sfxEnabled,
  musicEnabled,
  onToggleSfx,
  onToggleMusic,
  onActivateHint,
  onTogglePause
}) {
  return (
    <div className="w-full max-w-3xl flex flex-col gap-2">
      {/* Top HUD Card */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-cyan-500/30 rounded-xl px-4 py-2.5 backdrop-blur-md shadow-xl">
        {/* Left Stats */}
        <div className="flex items-center gap-5">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Level</span>
            <span className="text-lg font-extrabold text-white">{level}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Score</span>
            <span className="text-lg font-extrabold text-amber-400">{score.toLocaleString()}</span>
          </div>
        </div>

        {/* Right Stats & Inventory */}
        <div className="flex items-center gap-5">
          {needsKey && (
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Key</span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded transition-all ${
                  hasKey
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400 shadow-neon-gold animate-bounce'
                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                }`}
              >
                {hasKey ? '🔑 UNLOCKED' : '🔒 NEEDED'}
              </span>
            </div>
          )}

          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Gems</span>
            <span className="text-lg font-extrabold text-pink-400">
              💎 {gemsCollected}/{totalGems}
            </span>
          </div>
        </div>
      </div>

      {/* Toolbar Controls */}
      <div className="flex items-center justify-between gap-2 px-1 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSfx}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all ${
              sfxEnabled
                ? 'bg-slate-800/80 text-cyan-300 border-cyan-500/40 hover:bg-slate-700'
                : 'bg-slate-900/50 text-slate-500 border-slate-800 hover:text-slate-400'
            }`}
            title="Toggle Sound Effects"
          >
            {sfxEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>Sound</span>
          </button>

          <button
            onClick={onToggleMusic}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all ${
              musicEnabled
                ? 'bg-slate-800/80 text-purple-300 border-purple-500/40 hover:bg-slate-700'
                : 'bg-slate-900/50 text-slate-500 border-slate-800 hover:text-slate-400'
            }`}
            title="Toggle Ambient Music"
          >
            <Music className="w-3.5 h-3.5" />
            <span>Music: {musicEnabled ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={onActivateHint}
            disabled={hintsRemaining <= 0}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 disabled:opacity-40 disabled:pointer-events-none font-semibold transition-all"
            title="Show Path Hint (H)"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Hint ({hintsRemaining})</span>
          </button>

          <button
            onClick={onTogglePause}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-700 font-semibold transition-all"
            title="Pause Game (ESC / P)"
          >
            <Pause className="w-3.5 h-3.5" />
            <span>Pause</span>
          </button>
        </div>

        <span className="hidden sm:inline text-[11px] text-slate-500">
          WASD / Arrows • Click cell to auto-walk
        </span>
      </div>
    </div>
  );
}
