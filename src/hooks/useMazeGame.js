import { useState, useEffect, useRef, useCallback } from 'react';
import { generateMaze } from '../game/mazeGen';
import { findShortestPath, canMoveInDir } from '../game/pathfinding';
import { globalSound } from '../game/soundEngine';

export function useMazeGame() {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);

  // Maze State
  const [mazeData, setMazeData] = useState(null);
  const [player, setPlayer] = useState({ x: 0, y: 0, renderX: 0, renderY: 0 });
  const [gemsCollected, setGemsCollected] = useState(0);
  const [hasKey, setHasKey] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [activeHintPath, setActiveHintPath] = useState([]);

  // Modals & Game Flow
  const [isStartOpen, setIsStartOpen] = useState(true);
  const [isWinOpen, setIsWinOpen] = useState(false);
  const [isGameOverOpen, setIsGameOverOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Win stats for modal display
  const [winStats, setWinStats] = useState({
    gemBonus: 0,
    levelClearBonus: 0,
    moveBonus: 0,
    gemsCollected: 0,
    totalGems: 0,
    totalScore: 0,
    starsEarned: 1
  });

  // Sound settings
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(false);

  // Persistent Stats
  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem('goodmaze_stats_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { highScore: 0, maxLevel: 1, totalStars: 0, starsPerLevel: {} };
  });

  const hintTimeoutRef = useRef(null);

  // Save stats helper
  const updateStats = useCallback((newScore, newLevel, starsEarned) => {
    setStats(prev => {
      const prevStars = prev.starsPerLevel[`lvl_${newLevel}`] || 0;
      const starDiff = Math.max(0, starsEarned - prevStars);
      const updated = {
        ...prev,
        highScore: Math.max(prev.highScore, newScore),
        maxLevel: Math.max(prev.maxLevel, newLevel + 1),
        totalStars: prev.totalStars + starDiff,
        starsPerLevel: {
          ...prev.starsPerLevel,
          [`lvl_${newLevel}`]: Math.max(prevStars, starsEarned)
        }
      };
      try {
        localStorage.setItem('goodmaze_stats_v2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, []);

  // Initialize and start a level
  const startLevel = useCallback((lvl = 1) => {
    globalSound.init();
    setIsPlaying(true);
    setIsPaused(false);
    setIsWinOpen(false);
    setIsGameOverOpen(false);
    setIsStartOpen(false);
    setHintsRemaining(3);
    setActiveHintPath([]);
    setMoves(0);
    setGemsCollected(0);
    setLevel(lvl);

    // Maze size scaling (gradual growth from 9x9 up to 31x31)
    const size = Math.min(31, 9 + (lvl - 1) * 2);
    const newMaze = generateMaze(size, lvl);

    setMazeData(newMaze);
    setHasKey(newMaze.hasKey);
    setPlayer({ x: 0, y: 0, renderX: 0, renderY: 0 });
  }, []);

  // Movement Logic
  const movePlayer = useCallback((dir) => {
    if (!isPlaying || isPaused || !mazeData) return;

    const { walls, cols, rows } = mazeData;
    if (!canMoveInDir(walls, cols, rows, player.x, player.y, dir)) {
      globalSound.playBump();
      return;
    }

    let nx = player.x;
    let ny = player.y;
    if (dir === 'up') ny--;
    else if (dir === 'right') nx++;
    else if (dir === 'down') ny++;
    else if (dir === 'left') nx--;

    globalSound.playMove();
    setMoves(m => m + 1);

    // Update player
    setPlayer(prev => ({ ...prev, x: nx, y: ny }));

    // Check Key Pickup
    if (mazeData.keyItem && nx === mazeData.keyItem.x && ny === mazeData.keyItem.y && !hasKey) {
      setHasKey(true);
      setMazeData(prev => ({ ...prev, keyItem: null, hasKey: true }));
      globalSound.playKey();
      setScore(s => s + 250);
    }

    // Check Gems Pickup
    const gemIdx = mazeData.gems.findIndex(g => g.x === nx && g.y === ny);
    if (gemIdx !== -1) {
      setMazeData(prev => ({
        ...prev,
        gems: prev.gems.filter((_, i) => i !== gemIdx)
      }));
      setGemsCollected(g => g + 1);
      setScore(s => s + 150);
      globalSound.playGem();
    }

    // Check Goal
    if (nx === mazeData.goal.x && ny === mazeData.goal.y) {
      if (mazeData.needsKey && !hasKey) {
        globalSound.playBump();
        return;
      }

      // Level Cleared
      setIsPlaying(false);
      globalSound.playWin();

      const gemBonus = (gemsCollected + (gemIdx !== -1 ? 1 : 0)) * 100;
      const levelClearBonus = level * 300;
      const moveBonus = Math.max(50, 400 - moves * 2);
      const totalBonus = gemBonus + levelClearBonus + moveBonus;
      const newScore = score + totalBonus;
      setScore(newScore);

      const finalGems = gemsCollected + (gemIdx !== -1 ? 1 : 0);
      let starsEarned = 1;
      if (mazeData.totalGems > 0) {
        const gemRatio = finalGems / mazeData.totalGems;
        if (gemRatio >= 0.9) starsEarned = 3;
        else if (gemRatio >= 0.5) starsEarned = 2;
      } else {
        starsEarned = 3;
      }

      updateStats(newScore, level, starsEarned);
      setWinStats({
        gemBonus,
        levelClearBonus,
        moveBonus,
        gemsCollected: finalGems,
        totalGems: mazeData.totalGems,
        totalScore: newScore,
        starsEarned
      });

      setTimeout(() => {
        setIsWinOpen(true);
      }, 400);
    }
  }, [isPlaying, isPaused, mazeData, player.x, player.y, hasKey, gemsCollected, level, score, moves, updateStats]);

  // Activate BFS Hint
  const activateHint = useCallback(() => {
    if (!isPlaying || isPaused || !mazeData || hintsRemaining <= 0) return;

    const target = (mazeData.needsKey && !hasKey && mazeData.keyItem) ? mazeData.keyItem : mazeData.goal;
    const path = findShortestPath(mazeData.walls, mazeData.cols, mazeData.rows, player.x, player.y, target.x, target.y);

    if (path.length > 0) {
      setHintsRemaining(h => h - 1);
      setActiveHintPath(path);
      globalSound.playHint();

      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
      hintTimeoutRef.current = setTimeout(() => {
        setActiveHintPath([]);
      }, 4000);
    }
  }, [isPlaying, isPaused, mazeData, hintsRemaining, player.x, player.y, hasKey]);

  // Auto-walk to clicked cell
  const handleCellClick = useCallback((targetX, targetY) => {
    if (!isPlaying || isPaused || !mazeData) return;

    const path = findShortestPath(mazeData.walls, mazeData.cols, mazeData.rows, player.x, player.y, targetX, targetY);
    if (path.length > 0) {
      let stepIdx = 0;
      const stepInterval = setInterval(() => {
        if (!isPlaying || isPaused || stepIdx >= path.length) {
          clearInterval(stepInterval);
          return;
        }
        const next = path[stepIdx++];
        if (next.x > player.x) movePlayer('right');
        else if (next.x < player.x) movePlayer('left');
        else if (next.y > player.y) movePlayer('down');
        else if (next.y < player.y) movePlayer('up');
      }, 95);
    }
  }, [isPlaying, isPaused, mazeData, player.x, player.y, movePlayer]);

  // Sound Toggles
  const toggleSfx = useCallback(() => {
    globalSound.init();
    setSfxEnabled(prev => {
      const next = !prev;
      globalSound.setSfx(next);
      return next;
    });
  }, []);

  const toggleMusic = useCallback(() => {
    globalSound.init();
    setMusicEnabled(prev => {
      const next = !prev;
      globalSound.setMusic(next);
      return next;
    });
  }, []);

  // Keyboard Handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      const k = e.key.toLowerCase();
      if (k === 'escape' || k === 'p') {
        if (isPlaying) setIsPaused(p => !p);
        e.preventDefault();
        return;
      }
      if (k === 'h') {
        activateHint();
        e.preventDefault();
        return;
      }
      if (['arrowup', 'w'].includes(k)) { movePlayer('up'); e.preventDefault(); }
      else if (['arrowright', 'd'].includes(k)) { movePlayer('right'); e.preventDefault(); }
      else if (['arrowdown', 's'].includes(k)) { movePlayer('down'); e.preventDefault(); }
      else if (['arrowleft', 'a'].includes(k)) { movePlayer('left'); e.preventDefault(); }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, movePlayer, activateHint]);

  return {
    level,
    score,
    moves,
    mazeData,
    player,
    setPlayer,
    hasKey,
    gemsCollected,
    hintsRemaining,
    activeHintPath,
    bannerMsg,
    isPlaying,
    isPaused,
    setIsPaused,
    isStartOpen,
    setIsStartOpen,
    isWinOpen,
    setIsWinOpen,
    isGameOverOpen,
    setIsGameOverOpen,
    winStats,
    stats,
    sfxEnabled,
    musicEnabled,
    toggleSfx,
    toggleMusic,
    startLevel,
    movePlayer,
    activateHint,
    handleCellClick
  };
}
