import { Language } from '../../types';

export const generateRottingOrangesCode = (language: Language): string => {
  if (language === 'cpp') return `#include <vector>
#include <queue>
using namespace std;

int orangesRotting(vector<vector<int>>& grid) {
    int rows = grid.size(), cols = grid[0].size();
    queue<pair<int,int>> q;
    int fresh = 0;

    for (int r = 0; r < rows; r++)
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == 2) q.push({r, c});
            else if (grid[r][c] == 1) fresh++;
        }

    int dirs[][2] = {{0,1},{0,-1},{1,0},{-1,0}};
    int minutes = 0;

    while (!q.empty() && fresh > 0) {
        int size = q.size();
        minutes++;
        while (size--) {
            auto [r, c] = q.front(); q.pop();
            for (auto& d : dirs) {
                int nr = r+d[0], nc = c+d[1];
                if (nr>=0 && nr<rows && nc>=0 && nc<cols && grid[nr][nc]==1) {
                    grid[nr][nc] = 2;
                    fresh--;
                    q.push({nr, nc});
                }
            }
        }
    }
    return fresh == 0 ? minutes : -1;
}`;

  if (language === 'python') return `from collections import deque

def orangesRotting(grid):
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh = 0

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c))
            elif grid[r][c] == 1:
                fresh += 1

    directions = [(0,1),(0,-1),(1,0),(-1,0)]
    minutes = 0

    while queue and fresh > 0:
        minutes += 1
        for _ in range(len(queue)):
            r, c = queue.popleft()
            for dr, dc in directions:
                nr, nc = r+dr, c+dc
                if 0<=nr<rows and 0<=nc<cols and grid[nr][nc]==1:
                    grid[nr][nc] = 2
                    fresh -= 1
                    queue.append((nr, nc))

    return minutes if fresh == 0 else -1

print(orangesRotting([[2,1,1],[1,1,0],[0,1,1]]))  # 4`;

  return `function orangesRotting(grid) {
    const rows = grid.length, cols = grid[0].length;
    const queue = [];
    let fresh = 0;

    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === 2) queue.push([r, c]);
            else if (grid[r][c] === 1) fresh++;
        }

    const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
    let minutes = 0, idx = 0;

    while (idx < queue.length && fresh > 0) {
        const size = queue.length - idx;
        minutes++;
        for (let i = 0; i < size; i++) {
            const [r, c] = queue[idx++];
            for (const [dr, dc] of dirs) {
                const nr = r+dr, nc = c+dc;
                if (nr>=0 && nr<rows && nc>=0 && nc<cols && grid[nr][nc]===1) {
                    grid[nr][nc] = 2;
                    fresh--;
                    queue.push([nr, nc]);
                }
            }
        }
    }
    return fresh === 0 ? minutes : -1;
}

console.log(orangesRotting([[2,1,1],[1,1,0],[0,1,1]])); // 4`;
};
