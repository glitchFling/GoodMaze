import React from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Switch } from '@headlessui/react';
import { Play, RotateCcw, Home, Volume2, Music } from 'lucide-react';

export function PauseModal({
  isOpen,
  sfxEnabled,
  musicEnabled,
  onToggleSfx,
  onToggleMusic,
  onResume,
  onRestartLevel,
  onExitToMenu
}) {
  return (
    <Dialog open={isOpen} onClose={onResume} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-xs transform overflow-hidden rounded-2xl bg-slate-900/95 border border-cyan-500/30 p-6 text-center shadow-2xl transition-all">
          <DialogTitle className="text-2xl font-black tracking-tight text-white">
            GAME PAUSED
          </DialogTitle>
          <p className="mt-1 text-xs text-slate-400">
            Take a breather or adjust settings
          </p>

          {/* Audio Switches */}
          <div className="mt-5 flex flex-col gap-3 bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span>Sound Effects</span>
              </div>
              <Switch
                checked={sfxEnabled}
                onChange={onToggleSfx}
                className={`${
                  sfxEnabled ? 'bg-cyan-500' : 'bg-slate-700'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
              >
                <span
                  className={`${
                    sfxEnabled ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <Music className="w-4 h-4 text-purple-400" />
                <span>Ambient Music</span>
              </div>
              <Switch
                checked={musicEnabled}
                onChange={onToggleMusic}
                className={`${
                  musicEnabled ? 'bg-purple-500' : 'bg-slate-700'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
              >
                <span
                  className={`${
                    musicEnabled ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={onResume}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-sm shadow-neon-cyan transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Resume Game</span>
            </button>
            <button
              onClick={onRestartLevel}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restart Level</span>
            </button>
            <button
              onClick={onExitToMenu}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-400 font-bold text-sm transition-all"
            >
              <Home className="w-4 h-4" />
              <span>Main Menu</span>
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

