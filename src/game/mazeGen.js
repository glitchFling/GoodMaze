/**
 * Maze Generation using Recursive Backtracker & Distance Analysis
 */

export function generateMaze(size, level = 1) {
  const cols = size;
  const rows = size;
  const grid = Array(cols * rows).fill(0).map((_, i) => ({
    x: i % cols,
    y: Math.floor(i / cols),
    visited: false
  }));
  const walls = {};
  const visitedFog = {};

  const stack = [];
  const start = grid[0];
  start.visited = true;
  stack.push(start);

  const dirs = [
    { dx: 0, dy: -1, bit: 1, opp: 4 },
    { dx: 1, dy: 0,  bit: 2, opp: 8 },
    { dx: 0, dy: 1,  bit: 4, opp: 1 },
    { dx: -1, dy: 0, bit: 8, opp: 2 }
  ];

  while (stack.length) {
    const current = stack[stack.length - 1];
    const neighbors = [];

    for (const d of dirs) {
      const nx = current.x + d.dx;
      const ny = current.y + d.dy;
      if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
        const n = grid[ny * cols + nx];
        if (!n.visited) neighbors.push({ cell: n, dir: d });
      }
    }

    if (neighbors.length) {
      const pick = neighbors[Math.floor(Math.random() * neighbors.length)];
      const kCur = `${current.x},${current.y}`;
      const kN = `${pick.cell.x},${pick.cell.y}`;
      walls[kCur] = (walls[kCur] || 0) | pick.dir.bit;
      walls[kN] = (walls[kN] || 0) | pick.dir.opp;
      pick.cell.visited = true;
      stack.push(pick.cell);
    } else {
      stack.pop();
    }
  }

  // Calculate distances from (0,0) using BFS
  const distMap = computeDistances(walls, cols, rows, 0, 0);

  // Goal at bottom-right corner
  const goal = { x: cols - 1, y: rows - 1 };

  // Identify all dead-ends (cells with only 1 opening)
  const deadEnds = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (x === 0 && y === 0) continue;
      if (x === goal.x && y === goal.y) continue;
      const mask = walls[`${x},${y}`] || 0;
      const openings = ((mask & 1) ? 1 : 0) + ((mask & 2) ? 1 : 0) + ((mask & 4) ? 1 : 0) + ((mask & 8) ? 1 : 0);
      if (openings === 1) {
        deadEnds.push({ x, y, dist: distMap[`${x},${y}`] || 0 });
      }
    }
  }

  // Sort dead-ends by distance
  deadEnds.sort((a, b) => b.dist - a.dist);

  // Determine key requirement (level 2+ introduces the golden key)
  const needsKey = level >= 2;
  let keyItem = null;

  if (needsKey && deadEnds.length > 0) {
    const keyCandidateIdx = Math.min(deadEnds.length - 1, Math.floor(deadEnds.length * 0.4) + Math.floor(Math.random() * (deadEnds.length * 0.4)));
    const keyLoc = deadEnds.splice(keyCandidateIdx, 1)[0];
    keyItem = { x: keyLoc.x, y: keyLoc.y };
  }

  // Gems placed in dead ends
  const gems = [];
  const gemCount = Math.min(deadEnds.length, Math.max(3, Math.floor(cols / 2)));
  for (let i = 0; i < gemCount && deadEnds.length; i++) {
    const loc = deadEnds.splice(Math.floor(Math.random() * deadEnds.length), 1)[0];
    gems.push({ x: loc.x, y: loc.y });
  }

  return {
    cols,
    rows,
    walls,
    visitedFog: { '0,0': true },
    goal,
    keyItem,
    needsKey,
    hasKey: !needsKey,
    gems,
    clocks: [],
    totalGems: gems.length
  };
}

export function computeDistances(walls, cols, rows, sx, sy) {
  const dist = {};
  const queue = [{ x: sx, y: sy, d: 0 }];
  dist[`${sx},${sy}`] = 0;

  const dirs = [
    { dx: 0, dy: -1, bit: 1 },
    { dx: 1, dy: 0,  bit: 2 },
    { dx: 0, dy: 1,  bit: 4 },
    { dx: -1, dy: 0, bit: 8 }
  ];

  while (queue.length) {
    const cur = queue.shift();
    const mask = walls[`${cur.x},${cur.y}`] || 0;
    for (const d of dirs) {
      if (mask & d.bit) {
        const nx = cur.x + d.dx;
        const ny = cur.y + d.dy;
        const key = `${nx},${ny}`;
        if (dist[key] === undefined) {
          dist[key] = cur.d + 1;
          queue.push({ x: nx, y: ny, d: cur.d + 1 });
        }
      }
    }
  }
  return dist;
}

