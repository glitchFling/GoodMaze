import React, { useEffect } from 'react';
import { useMazeGame } from './hooks/useMazeGame';
import { HUD } from './components/HUD';
import { GameCanvas } from './components/GameCanvas';
import { MobileControls } from './components/MobileControls';
import { StartModal } from './components/Modals/StartModal';
import { WinModal } from './components/Modals/WinModal';
import { GameOverModal } from './components/Modals/GameOverModal';
import { PauseModal } from './components/Modals/PauseModal';
import { dev, DevBadge } from './dev';

export default function App() {
  const {
    level,
    score,
    mazeData,
    player,
    setPlayer,
    hasKey,
    gemsCollected,
    hintsRemaining,
    activeHintPath,
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
  } = useMazeGame();

  useEffect(() => {
    dev();
  }, []);

  const handleStartGame = () => {
    startLevel(1);
  };

  const handleNextLevel = () => {
    startLevel(level + 1);
  };

  const handleReplayLevel = () => {
    startLevel(level);
  };

  const handleTryAgain = () => {
    setIsGameOverOpen(false);
    startLevel(level);
  };

  const handleExitToMenu = () => {
    setIsPaused(false);
    setIsGameOverOpen(false);
    setIsWinOpen(false);
    setIsStartOpen(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-3 md:p-6 bg-radial-gradient">
      <div className="w-full max-w-3xl flex flex-col items-center gap-3">
        {/* HUD */}
        <HUD
          level={level}
          score={score}
          gemsCollected={gemsCollected}
          totalGems={mazeData?.totalGems || 0}
          needsKey={mazeData?.needsKey || false}
          hasKey={hasKey}
          hintsRemaining={hintsRemaining}
          sfxEnabled={sfxEnabled}
          musicEnabled={musicEnabled}
          onToggleSfx={toggleSfx}
          onToggleMusic={toggleMusic}
          onActivateHint={activateHint}
          onTogglePause={() => setIsPaused(p => !p)}
        />

        {/* Canvas Engine */}
        <div className="w-full flex justify-center">
          <GameCanvas
            mazeData={mazeData}
            player={player}
            setPlayer={setPlayer}
            hasKey={hasKey}
            activeHintPath={activeHintPath}
            onCellClick={handleCellClick}
          />
        </div>

        {/* Mobile Virtual D-Pad */}
        <MobileControls onMove={movePlayer} />
      </div>

      {/* Headless UI Modals */}
      <StartModal
        isOpen={isStartOpen}
        stats={stats}
        onPlay={handleStartGame}
      />

      <WinModal
        isOpen={isWinOpen}
        level={level}
        winStats={winStats}
        onNextLevel={handleNextLevel}
        onReplay={handleReplayLevel}
      />

      <GameOverModal
        isOpen={isGameOverOpen}
        level={level}
        score={score}
        bestScore={stats.highScore}
        onTryAgain={handleTryAgain}
        onBackToMenu={handleExitToMenu}
      />

      <PauseModal
        isOpen={isPaused}
        sfxEnabled={sfxEnabled}
        musicEnabled={musicEnabled}
        onToggleSfx={toggleSfx}
        onToggleMusic={toggleMusic}
        onResume={() => setIsPaused(false)}
        onRestartLevel={handleReplayLevel}
        onExitToMenu={handleExitToMenu}
      />

      <DevBadge />
    </div>
  );
}
