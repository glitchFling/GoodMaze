import React from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ArrowRight, RotateCcw, Star, Trophy, Award, Sparkles } from 'lucide-react';

export function WinModal({
  isOpen,
  level,
  winStats,
  onNextLevel,
  onReplay
}) {
  const { levelClearBonus, moveBonus, gemsCollected, totalGems, totalScore, starsEarned } = winStats;

  return (
    <Dialog open={isOpen} onClose={() => {}} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-slate-900/95 border border-emerald-500/40 p-6 text-center shadow-2xl transition-all">
          <DialogTitle className="text-2xl font-black tracking-tight text-emerald-400">
            MAZE CLEARED!
          </DialogTitle>
          <p className="mt-1 text-xs text-slate-400">
            Level {level} Complete
          </p>

          {/* Stars */}
          <div className="mt-4 flex justify-center gap-2">
            {[1, 2, 3].map((starNum) => {
              const isEarned = starNum <= starsEarned;
              return (
                <Star
                  key={starNum}
                  className={`w-10 h-10 transition-all duration-500 ${
                    isEarned
                      ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] scale-110'
                      : 'text-slate-700 fill-slate-800'
                  }`}
                />
              );
            })}
          </div>

          {/* Bonus Breakdown */}
          <div className="mt-5 grid grid-cols-3 gap-2 bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-center">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-center gap-1">
                <Award className="w-3 h-3 text-cyan-400" />
                <span>Level Clear</span>
              </div>
              <div className="text-sm font-extrabold text-cyan-400">+{levelClearBonus || 300}</div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-pink-400" />
                <span>Gems</span>
              </div>
              <div className="text-sm font-extrabold text-pink-400">
                {gemsCollected}/{totalGems}
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-center gap-1">
                <Trophy className="w-3 h-3 text-amber-400" />
                <span>Total Score</span>
              </div>
              <div className="text-sm font-extrabold text-amber-400">
                {totalScore?.toLocaleString() || 0}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={onReplay}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Replay</span>
            </button>
            <button
              onClick={onNextLevel}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-sm shadow-neon-emerald transition-all"
            >
              <span>Next Level</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
