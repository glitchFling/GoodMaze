import React from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { Play, Trophy, Star, Key, Compass, Sparkles } from 'lucide-react';

export function StartModal({
  isOpen,
  stats,
  onPlay
}) {
  return (
    <Dialog open={isOpen} onClose={() => {}} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-slate-900/95 border border-cyan-500/30 p-6 text-center shadow-2xl transition-all">
          <DialogTitle className="text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span>GOODMAZE</span>
            <span className="text-cyan-400 text-xs font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
              v2.0
            </span>
          </DialogTitle>
          <p className="mt-1 text-xs text-slate-400">
            Neon Cyber Labyrinth Adventure
          </p>

          {/* Quick Objective Guide */}
          <div className="mt-5 flex flex-col gap-2.5 bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 text-left text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <Key className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Find the <strong>Golden Key</strong> to unlock the exit</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-pink-400 shrink-0" />
              <span>Collect <strong>Gems</strong> for bonus score and stars</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Compass className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Press <strong>H</strong> for compass path hints anytime</span>
            </div>
          </div>

          {/* Stats Box */}
          <div className="mt-5 grid grid-cols-3 gap-2 bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-center">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">High Score</div>
              <div className="text-base font-extrabold text-amber-400 flex items-center justify-center gap-1">
                <Trophy className="w-3.5 h-3.5" />
                <span>{stats.highScore.toLocaleString()}</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Max Level</div>
              <div className="text-base font-extrabold text-cyan-400">
                {stats.maxLevel}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Total Stars</div>
              <div className="text-base font-extrabold text-amber-400 flex items-center justify-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{stats.totalStars}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={onPlay}
              className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-base shadow-neon-cyan transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>PLAY GAME</span>
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
