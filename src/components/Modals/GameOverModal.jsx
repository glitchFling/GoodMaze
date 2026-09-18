import React from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { RotateCcw, Home, Skull, Trophy } from 'lucide-react';

export function GameOverModal({
  isOpen,
  level,
  score,
  bestScore,
  onTryAgain,
  onBackToMenu
}) {
  return (
    <Dialog open={isOpen} onClose={() => {}} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-slate-900/95 border border-pink-500/40 p-6 text-center shadow-2xl transition-all">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-pink-500/10 rounded-full border border-pink-500/30 text-pink-400">
              <Skull className="w-8 h-8" />
            </div>
          </div>

          <DialogTitle className="text-2xl font-black tracking-tight text-pink-400">
            TIME'S UP!
          </DialogTitle>
          <p className="mt-1 text-xs text-slate-400">
            You got lost in the cyber labyrinth.
          </p>

          <div className="mt-5 grid grid-cols-3 gap-2 bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-center">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Level</div>
              <div className="text-base font-extrabold text-cyan-400">{level}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Final Score</div>
              <div className="text-base font-extrabold text-pink-400">{score.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-center gap-1">
                <Trophy className="w-3 h-3 text-amber-400" />
                <span>Best</span>
              </div>
              <div className="text-base font-extrabold text-amber-400">{bestScore.toLocaleString()}</div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={onBackToMenu}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-all"
            >
              <Home className="w-4 h-4" />
              <span>Menu</span>
            </button>
            <button
              onClick={onTryAgain}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-extrabold text-sm shadow-neon-magenta transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

