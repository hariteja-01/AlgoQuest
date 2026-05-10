export type CellState = 0 | 1 | 2; // 0=empty, 1=fresh, 2=rotten

export interface BFSStep {
  grid: CellState[][];
  queue: [number, number][];
  frontier: [number, number][];
  minute: number;
  freshCount: number;
  processedCount: number;
  explanation: string;
  highlightLine: number;
}

export class RottingOrangesEngine {
  solve(grid: CellState[][]): BFSStep[] {
    const rows = grid.length, cols = grid[0].length;
    const g: CellState[][] = grid.map(r => [...r]);
    const steps: BFSStep[] = [];
    const queue: [number, number][] = [];
    let fresh = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (g[r][c] === 2) queue.push([r, c]);
        else if (g[r][c] === 1) fresh++;
      }
    }

    steps.push({
      grid: g.map(r => [...r]),
      queue: [...queue],
      frontier: [...queue],
      minute: 0,
      freshCount: fresh,
      processedCount: 0,
      explanation: `Initial state: ${queue.length} rotten orange(s), ${fresh} fresh orange(s). Starting multi-source BFS.`,
      highlightLine: 1,
    });

    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    let minute = 0;
    let processed = 0;

    while (queue.length > 0 && fresh > 0) {
      const size = queue.length;
      const frontier: [number, number][] = [];
      minute++;

      for (let i = 0; i < size; i++) {
        const [r, c] = queue.shift()!;
        processed++;

        for (const [dr, dc] of dirs) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && g[nr][nc] === 1) {
            g[nr][nc] = 2;
            fresh--;
            queue.push([nr, nc]);
            frontier.push([nr, nc]);
          }
        }
      }

      if (frontier.length > 0) {
        steps.push({
          grid: g.map(r => [...r]),
          queue: [...queue],
          frontier,
          minute,
          freshCount: fresh,
          processedCount: processed,
          explanation: `Minute ${minute}: ${frontier.length} orange(s) rotted. ${fresh} fresh remaining. Queue size: ${queue.length}`,
          highlightLine: 8,
        });
      }
    }

    steps.push({
      grid: g.map(r => [...r]),
      queue: [],
      frontier: [],
      minute: fresh > 0 ? -1 : minute,
      freshCount: fresh,
      processedCount: processed,
      explanation: fresh > 0
        ? `Impossible! ${fresh} orange(s) can never be reached. Return -1.`
        : `All oranges rotted in ${minute} minute(s)! BFS complete.`,
      highlightLine: 14,
    });

    return steps;
  }

  static generateGrid(type: 'random' | 'sparse' | 'dense' | 'impossible' | 'single', rows = 6, cols = 6): CellState[][] {
    const grid: CellState[][] = Array.from({ length: rows }, () => Array(cols).fill(0));
    switch (type) {
      case 'random':
        for (let r = 0; r < rows; r++)
          for (let c = 0; c < cols; c++)
            grid[r][c] = [0, 1, 1, 2][Math.floor(Math.random() * 4)] as CellState;
        if (!grid.flat().includes(2)) grid[0][0] = 2;
        if (!grid.flat().includes(1)) grid[rows-1][cols-1] = 1;
        return grid;
      case 'sparse':
        for (let r = 0; r < rows; r++)
          for (let c = 0; c < cols; c++)
            grid[r][c] = Math.random() < 0.3 ? 1 : 0;
        grid[0][0] = 2;
        return grid;
      case 'dense':
        for (let r = 0; r < rows; r++)
          for (let c = 0; c < cols; c++)
            grid[r][c] = 1;
        grid[Math.floor(rows/2)][Math.floor(cols/2)] = 2;
        return grid;
      case 'impossible':
        for (let r = 0; r < rows; r++)
          for (let c = 0; c < cols; c++)
            grid[r][c] = 1;
        grid[0][0] = 2;
        grid[rows-1][cols-1] = 1;
        // Create wall
        for (let r = 0; r < rows; r++) grid[r][Math.floor(cols/2)] = 0;
        return grid;
      case 'single':
        grid[Math.floor(rows/2)][Math.floor(cols/2)] = 2;
        grid[0][0] = 1;
        grid[rows-1][cols-1] = 1;
        return grid;
      default:
        return grid;
    }
  }
}
