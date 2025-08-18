export class LCSEngine {
  private strings: string[];
  private memo: Map<string, number> = new Map();

  constructor(strings: string[]) {
    this.strings = strings;
    this.memo.clear();
  }

  solveTwoStrings(str1: string, str2: string): {
    dpTable: number[][];
    lcs: string;
    path: Array<{row: number, col: number, char?: string}>;
  } {
    const m = str1.length;
    const n = str2.length;
    const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    // Fill DP table
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    // Reconstruct LCS and path
    const path: Array<{row: number, col: number, char?: string}> = [];
    let lcs = '';
    let i = m, j = n;

    while (i > 0 && j > 0) {
      if (str1[i - 1] === str2[j - 1]) {
        lcs = str1[i - 1] + lcs;
        path.unshift({row: i, col: j, char: str1[i - 1]});
        i--;
        j--;
      } else if (dp[i - 1][j] > dp[i][j - 1]) {
        path.unshift({row: i, col: j});
        i--;
      } else {
        path.unshift({row: i, col: j});
        j--;
      }
    }

    return { dpTable: dp, lcs, path };
  }

  solveMultipleStrings(strings: string[]): {
    dpTable: number[][][];
    lcs: string;
    dependencies: Array<{from: number[], to: number[], value: number}>;
  } {
    if (strings.length < 2) throw new Error('Need at least 2 strings');
    if (strings.length === 2) {
      const result = this.solveTwoStrings(strings[0], strings[1]);
      return {
        dpTable: [result.dpTable],
        lcs: result.lcs,
        dependencies: []
      };
    }

    const n = strings.length;
    const lengths = strings.map(s => s.length);
    const totalSize = lengths.reduce((acc, len) => acc * (len + 1), 1);
    
    // For visualization, we'll use a simplified 3D approach
    if (n === 3) {
      return this.solve3D(strings[0], strings[1], strings[2]);
    }

    // For 4+ strings, use rolling optimization
    return this.solveND(strings);
  }

  private solve3D(str1: string, str2: string, str3: string): {
    dpTable: number[][][];
    lcs: string;
    dependencies: Array<{from: number[], to: number[], value: number}>;
  } {
    const l1 = str1.length, l2 = str2.length, l3 = str3.length;
    const dp: number[][][] = Array(l1 + 1).fill(null).map(() =>
      Array(l2 + 1).fill(null).map(() =>
        Array(l3 + 1).fill(0)
      )
    );

    const dependencies: Array<{from: number[], to: number[], value: number}> = [];

    for (let i = 1; i <= l1; i++) {
      for (let j = 1; j <= l2; j++) {
        for (let k = 1; k <= l3; k++) {
          if (str1[i - 1] === str2[j - 1] && str2[j - 1] === str3[k - 1]) {
            dp[i][j][k] = dp[i - 1][j - 1][k - 1] + 1;
            dependencies.push({
              from: [i - 1, j - 1, k - 1],
              to: [i, j, k],
              value: dp[i][j][k]
            });
          } else {
            const candidates = [
              dp[i - 1][j][k],
              dp[i][j - 1][k],
              dp[i][j][k - 1]
            ];
            dp[i][j][k] = Math.max(...candidates);
          }
        }
      }
    }

    const lcs = this.reconstructLCS3D(str1, str2, str3, dp);
    return { dpTable: [dp], lcs, dependencies };
  }

  private solveND(strings: string[]): {
    dpTable: number[][][];
    lcs: string;
    dependencies: Array<{from: number[], to: number[], value: number}>;
  } {
    // Simplified N-dimensional LCS using pairwise approach
    let current = strings[0];
    const tables: number[][][] = [];
    
    for (let i = 1; i < strings.length; i++) {
      const result = this.solveTwoStrings(current, strings[i]);
      tables.push([result.dpTable]);
      current = result.lcs;
    }

    return {
      dpTable: tables.flat(),
      lcs: current,
      dependencies: []
    };
  }

  private reconstructLCS3D(str1: string, str2: string, str3: string, dp: number[][][]): string {
    let lcs = '';
    let i = str1.length, j = str2.length, k = str3.length;

    while (i > 0 && j > 0 && k > 0) {
      if (str1[i - 1] === str2[j - 1] && str2[j - 1] === str3[k - 1]) {
        lcs = str1[i - 1] + lcs;
        i--; j--; k--;
      } else {
        const candidates = [
          { val: dp[i - 1][j][k], move: () => i-- },
          { val: dp[i][j - 1][k], move: () => j-- },
          { val: dp[i][j][k - 1], move: () => k-- }
        ];
        const max = candidates.reduce((a, b) => a.val >= b.val ? a : b);
        max.move();
      }
    }

    return lcs;
  }

  getSpaceOptimizedCode(): string {
    return `
// Space-optimized O(min(m,n)) LCS
function lcsSpaceOptimized(str1, str2) {
  if (str1.length > str2.length) [str1, str2] = [str2, str1];
  
  let prev = new Array(str1.length + 1).fill(0);
  let curr = new Array(str1.length + 1).fill(0);
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str1[j-1] === str2[i-1]) {
        curr[j] = prev[j-1] + 1;
      } else {
        curr[j] = Math.max(prev[j], curr[j-1]);
      }
    }
    [prev, curr] = [curr, prev];
  }
  
  return prev[str1.length];
}`;
  }
}