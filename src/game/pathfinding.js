/**
 * BFS Shortest Path Algorithm for Hint System and Tap-to-Move
 */

export function findShortestPath(walls, cols, rows, fromX, fromY, toX, toY) {
  if (fromX === toX && fromY === toY) return [];
  const queue = [{ x: fromX, y: fromY }];
  const parent = {};
  const visited = new Set([`${fromX},${fromY}`]);

  const dirs = [
    { dx: 0, dy: -1, bit: 1 },
    { dx: 1, dy: 0,  bit: 2 },
    { dx: 0, dy: 1,  bit: 4 },
    { dx: -1, dy: 0, bit: 8 }
  ];

  let found = false;
  while (queue.length) {
    const cur = queue.shift();
    if (cur.x === toX && cur.y === toY) {
      found = true;
      break;
    }
    const mask = walls[`${cur.x},${cur.y}`] || 0;
    for (const d of dirs) {
      if (mask & d.bit) {
        const nx = cur.x + d.dx;
        const ny = cur.y + d.dy;
        const key = `${nx},${ny}`;
        if (!visited.has(key)) {
          visited.add(key);
          parent[key] = cur;
          queue.push({ x: nx, y: ny });
        }
      }
    }
  }

  if (!found) return [];

  // Reconstruct path
  const path = [];
  let curr = { x: toX, y: toY };
  while (curr.x !== fromX || curr.y !== fromY) {
    path.push(curr);
    curr = parent[`${curr.x},${curr.y}`];
  }
  return path.reverse();
}

export function canMoveInDir(walls, cols, rows, x, y, dir) {
  if (x < 0 || x >= cols || y < 0 || y >= rows) return false;
  const mask = walls[`${x},${y}`] || 0;
  if (dir === 'up') return !!(mask & 1);
  if (dir === 'right') return !!(mask & 2);
  if (dir === 'down') return !!(mask & 4);
  if (dir === 'left') return !!(mask & 8);
  return false;
}

