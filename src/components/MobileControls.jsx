import React, { useRef } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

export function MobileControls({ onMove }) {
  const timerRef = useRef(null);

  const startMove = (dir, e) => {
    e.preventDefault();
    onMove(dir);
    if (!timerRef.current) {
      timerRef.current = setInterval(() => onMove(dir), 140);
    }
  };

  const stopMove = (e) => {
    e.preventDefault();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const btnClass = "w-14 h-12 bg-slate-800/80 active:bg-cyan-500/30 border border-slate-700 active:border-cyan-400 rounded-xl flex items-center justify-center text-white shadow-lg touch-manipulation select-none active:scale-95 transition-transform";

  return (
    <div className="flex md:hidden justify-center mt-2 w-full">
      <div className="grid grid-cols-3 grid-rows-3 gap-1.5 w-fit">
        <div />
        <button
          className={btnClass}
          onMouseDown={(e) => startMove('up', e)}
          onMouseUp={stopMove}
          onMouseLeave={stopMove}
          onTouchStart={(e) => startMove('up', e)}
          onTouchEnd={stopMove}
          aria-label="Move Up"
        >
          <ArrowUp className="w-5 h-5 text-cyan-400" />
        </button>
        <div />

        <button
          className={btnClass}
          onMouseDown={(e) => startMove('left', e)}
          onMouseUp={stopMove}
          onMouseLeave={stopMove}
          onTouchStart={(e) => startMove('left', e)}
          onTouchEnd={stopMove}
          aria-label="Move Left"
        >
          <ArrowLeft className="w-5 h-5 text-cyan-400" />
        </button>
        <div className="w-14 h-12 flex items-center justify-center text-slate-600 font-bold text-xs">
          MOVE
        </div>
        <button
          className={btnClass}
          onMouseDown={(e) => startMove('right', e)}
          onMouseUp={stopMove}
          onMouseLeave={stopMove}
          onTouchStart={(e) => startMove('right', e)}
          onTouchEnd={stopMove}
          aria-label="Move Right"
        >
          <ArrowRight className="w-5 h-5 text-cyan-400" />
        </button>

        <div />
        <button
          className={btnClass}
          onMouseDown={(e) => startMove('down', e)}
          onMouseUp={stopMove}
          onMouseLeave={stopMove}
          onTouchStart={(e) => startMove('down', e)}
          onTouchEnd={stopMove}
          aria-label="Move Down"
        >
          <ArrowDown className="w-5 h-5 text-cyan-400" />
        </button>
        <div />
      </div>
    </div>
  );
}

