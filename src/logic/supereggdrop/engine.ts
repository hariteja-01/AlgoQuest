export interface EggDropStep {
  type: 'init' | 'try-floor' | 'cache-hit' | 'dp-fill' | 'binary-search' | 'complete';
  eggs: number;
  floors: number;
  currentEggs?: number;
  currentFloors?: number;
  tryFloor?: number;
  dpTable: number[][];
  result: number;
  operations: number;
  explanation: string;
  highlightLine: number;
}

export type EggApproach = 'recursive' | 'dp' | 'dpBinarySearch' | 'movesBased';

export class SuperEggDropEngine {
  dpSolve(K: number, N: number): EggDropStep[] {
    const steps: EggDropStep[] = [];
    const dp: number[][] = Array.from({ length: K + 1 }, () => new Array(N + 1).fill(0));
    let ops = 0;

    // Base cases
    for (let i = 1; i <= K; i++) dp[i][0] = 0, dp[i][1] = 1;
    for (let j = 1; j <= N; j++) dp[1][j] = j;

    steps.push({
      type: 'init',
      eggs: K, floors: N,
      dpTable: dp.map(r => [...r]),
      result: 0, operations: 0,
      explanation: `DP Table initialized. K=${K} eggs, N=${N} floors. Base: dp[1][j]=j, dp[i][0]=0, dp[i][1]=1.`,
      highlightLine: 1,
    });

    for (let i = 2; i <= K; i++) {
      for (let j = 2; j <= N; j++) {
        dp[i][j] = Infinity;
        for (let x = 1; x <= j; x++) {
          const breaks = dp[i - 1][x - 1];
          const survives = dp[i][j - x];
          const worst = 1 + Math.max(breaks, survives);
          if (worst < dp[i][j]) dp[i][j] = worst;
          ops++;
        }

        if (j % Math.max(1, Math.floor(N / 8)) === 0 || j === N) {
          steps.push({
            type: 'dp-fill',
            eggs: K, floors: N,
            currentEggs: i, currentFloors: j,
            dpTable: dp.map(r => [...r]),
            result: dp[i][j],
            operations: ops,
            explanation: `dp[${i}][${j}] = ${dp[i][j]}. With ${i} eggs and ${j} floors, minimum ${dp[i][j]} moves needed.`,
            highlightLine: 8,
          });
        }
      }
    }

    steps.push({
      type: 'complete',
      eggs: K, floors: N,
      dpTable: dp.map(r => [...r]),
      result: dp[K][N],
      operations: ops,
      explanation: `Result: With ${K} eggs and ${N} floors, minimum moves = ${dp[K][N]}. Time: O(KN²), Space: O(KN).`,
      highlightLine: 14,
    });

    return steps;
  }

  dpBinarySearchSolve(K: number, N: number): EggDropStep[] {
    const steps: EggDropStep[] = [];
    const dp: number[][] = Array.from({ length: K + 1 }, () => new Array(N + 1).fill(0));
    let ops = 0;

    for (let i = 1; i <= K; i++) dp[i][0] = 0, dp[i][1] = 1;
    for (let j = 1; j <= N; j++) dp[1][j] = j;

    steps.push({
      type: 'init',
      eggs: K, floors: N,
      dpTable: dp.map(r => [...r]),
      result: 0, operations: 0,
      explanation: `DP + Binary Search. Instead of trying all floors linearly, use binary search to find optimal drop floor.`,
      highlightLine: 1,
    });

    for (let i = 2; i <= K; i++) {
      for (let j = 2; j <= N; j++) {
        let lo = 1, hi = j;
        dp[i][j] = Infinity;
        while (lo <= hi) {
          const mid = Math.floor((lo + hi) / 2);
          const breaks = dp[i - 1][mid - 1];
          const survives = dp[i][j - mid];
          const worst = 1 + Math.max(breaks, survives);
          if (worst < dp[i][j]) dp[i][j] = worst;
          if (breaks < survives) lo = mid + 1;
          else hi = mid - 1;
          ops++;
        }

        if (j % Math.max(1, Math.floor(N / 6)) === 0 || j === N) {
          steps.push({
            type: 'binary-search',
            eggs: K, floors: N,
            currentEggs: i, currentFloors: j,
            dpTable: dp.map(r => [...r]),
            result: dp[i][j],
            operations: ops,
            explanation: `dp[${i}][${j}] = ${dp[i][j]} (binary search optimization). Operations so far: ${ops}.`,
            highlightLine: 10,
          });
        }
      }
    }

    steps.push({
      type: 'complete',
      eggs: K, floors: N,
      dpTable: dp.map(r => [...r]),
      result: dp[K][N],
      operations: ops,
      explanation: `Result: ${dp[K][N]} moves. Binary search reduced time to O(KN·logN).`,
      highlightLine: 16,
    });

    return steps;
  }

  movesBasedSolve(K: number, N: number): EggDropStep[] {
    const steps: EggDropStep[] = [];
    // dp[m][k] = max floors checkable with m moves and k eggs
    const dp: number[][] = Array.from({ length: N + 1 }, () => new Array(K + 1).fill(0));
    let m = 0;
    let ops = 0;

    steps.push({
      type: 'init',
      eggs: K, floors: N,
      dpTable: [[0]],
      result: 0, operations: 0,
      explanation: `Moves-based DP: dp[m][k] = max floors checkable with m moves and k eggs. Find smallest m where dp[m][K] >= N.`,
      highlightLine: 1,
    });

    while (dp[m][K] < N) {
      m++;
      if (m >= dp.length) break;
      for (let k = 1; k <= K; k++) {
        dp[m][k] = dp[m - 1][k - 1] + dp[m - 1][k] + 1;
        ops++;
      }

      if (m <= 20 || dp[m][K] >= N) {
        steps.push({
          type: 'dp-fill',
          eggs: K, floors: N,
          dpTable: dp.slice(0, m + 1).map(r => r.slice(0, K + 1)),
          result: m,
          operations: ops,
          explanation: `Move ${m}: dp[${m}][${K}] = ${dp[m][K]}. ${dp[m][K] >= N ? 'Sufficient!' : `Need ${N}, continuing...`}`,
          highlightLine: 6,
        });
      }
    }

    steps.push({
      type: 'complete',
      eggs: K, floors: N,
      dpTable: dp.slice(0, m + 1).map(r => r.slice(0, K + 1)),
      result: m,
      operations: ops,
      explanation: `Result: ${m} moves. Time: O(K·result), Space: O(K·result). Most efficient approach!`,
      highlightLine: 10,
    });

    return steps;
  }

  solve(approach: EggApproach, eggs: number, floors: number): EggDropStep[] {
    const e = Math.min(eggs, 10);
    const f = Math.min(floors, 500);
    switch (approach) {
      case 'dp': return this.dpSolve(e, f);
      case 'dpBinarySearch': return this.dpBinarySearchSolve(e, f);
      case 'movesBased': return this.movesBasedSolve(e, f);
      default: return this.dpSolve(e, Math.min(f, 50));
    }
  }
}
