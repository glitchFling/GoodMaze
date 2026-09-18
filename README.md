# GoodMaze ⚡ (React + Headless UI Edition)

A high-polish, neon-themed labyrinth adventure built with **React**, **Headless UI**, **Tailwind CSS**, **HTML5 Canvas**, and the **Web Audio API**.

![React](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react)
![Headless UI](https://img.shields.io/badge/Headless_UI-2.2-38bdf8?style=for-the-badge)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-6.1-646cff?style=for-the-badge&logo=vite)
![Audio](https://img.shields.io/badge/Audio-Procedural%20Web%20Audio-10b981?style=for-the-badge)

## 🎮 Features

- **Component Architecture (.jsx)**: Clean separation of concerns between the high-performance 60 FPS Canvas rendering engine and the declarative React UI layer.
- **Headless UI Accessible Dialogs**:
  - `StartModal`: Accessible game mode picker (`RadioGroup`) and high scores.
  - `WinModal`: Animated star ratings, time bonus tally, and progression.
  - `GameOverModal`: Score recap and quick retry.
  - `PauseModal`: Sound FX and Music toggles with accessible Headless UI `Switch` components.
- **Neon Cyberpunk Aesthetic**: High-DPI canvas rendering with glowing walls, smooth interpolated player movement, floor grid texture, animated rotating portals, and particle effects.
- **Procedural Web Audio Engine**: Zero external audio downloads. Sound effects (movement, wall bumps, key collection, gems, clock bonuses, level clear fanfare, game over buzz) and ambient music synthesized in real-time with Web Audio API.
- **Dynamic Lighting / Fog of War**: Lantern mode with dynamic radial flashlight lighting and memory shroud for explored corridors.
- **Keys & Objectives**: Find the golden key hidden deep in the maze to unlock the exit portal.
- **Collectibles & Power-ups**:
  - 💎 **Gems**: Boost your score and achieve a 3-star level rating.
  - ⏱️ **Clocks**: Add +10 seconds to your remaining time.
  - 🧭 **Compass / Hint System**: BFS pathfinding highlights the shortest route with an animated glowing trail.
- **4 Distinct Game Modes**:
  1. **🌟 Adventure**: Scaled difficulty from level to level with increasing grid size, keys, and tighter time limits.
  2. **🔦 Lantern**: Darkness mode with dynamic flashlight visibility.
  3. **⚡ Time Rush**: 60-second survival mode where clearing levels adds bonus time.
  4. **☕ Zen Mode**: Infinite time, zero pressure, relaxing ambient exploration.
- **Multi-Control Support**:
  - **Keyboard**: Smooth WASD and Arrow Key navigation with repeat buffering.
  - **Mobile Touch**: Touch swipe gestures and on-screen virtual D-Pad.
  - **Mouse / Tap to Move**: Tap or click any reachable cell to auto-pathfind there.
- **Progression & Stats**: High score, max level reached, and 3-star ratings persisted via `localStorage`.

---

## 🏗️ Project Structure

```
GoodMaze/
├── index.html                   # HTML shell mounting #root
├── vite.config.js               # Vite + React plugin configuration
├── tailwind.config.js           # Tailwind cyber theme & neon utilities
├── src/
│   ├── main.jsx                 # React root entry point
│   ├── App.jsx                  # Main application & modal coordinator
│   ├── index.css                # Tailwind directives & cyber styling
│   ├── game/
│   │   ├── mazeGen.js           # Recursive backtracker & dead-end analysis
│   │   ├── pathfinding.js       # BFS compass hints & tap-to-move
│   │   └── soundEngine.js       # Web Audio API procedural sound synthesizer
│   ├── hooks/
│   │   └── useMazeGame.js       # Game coordinator hook (state, timer, moves)
│   └── components/
│       ├── GameCanvas.jsx       # Canvas rendering, particles & dynamic lighting
│       ├── HUD.jsx              # Glassmorphic header & animated timer bar
│       ├── MobileControls.jsx   # Virtual on-screen D-Pad
│       └── Modals/
│           ├── StartModal.jsx   # Headless UI Dialog + RadioGroup
│           ├── WinModal.jsx     # Headless UI Dialog with star ratings
│           ├── GameOverModal.jsx# Headless UI Dialog for game over
│           └── PauseModal.jsx   # Headless UI Dialog + Switch toggles
```

---

## 🕹️ Controls

| Action | Control |
|---|---|
| **Move** | `W` `A` `S` `D` / `Arrow Keys` / Mobile Virtual D-Pad |
| **Auto-Walk** | Click or Tap any explored maze cell |
| **Path Hint** | `H` or **🧭 Hint** button |
| **Pause / Menu** | `Escape` / `P` or **⏸ Pause** button |
| **Audio Toggles** | **🔊 Sound** & **🎵 Music** buttons in toolbar |

---

## 🚀 Development & Building

### Install Dependencies
```bash
npm install
```

### Start Local Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```