export interface EditDistanceStep {
  type: 'init' | 'fill' | 'match' | 'insert' | 'delete' | 'replace' | 'complete';
  word1: string;
  word2: string;
  dp: number[][];
  i: number;
  j: number;
  operations: string[];
  explanation: string;
  highlightLine: number;
}

export class EditDistanceEngine {
  solve(word1: string, word2: string): EditDistanceStep[] {
    const m = word1.length, n = word2.length;
    const steps: EditDistanceStep[] = [];
    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    // Base cases
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    steps.push({
      type: 'init', word1, word2,
      dp: dp.map(r => [...r]),
      i: 0, j: 0, operations: [],
      explanation: `Edit Distance: "${word1}" → "${word2}". Base cases filled: dp[i][0]=i, dp[0][j]=j.`,
      highlightLine: 1,
    });

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (word1[i - 1] === word2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
      }

      if (i % Math.max(1, Math.floor(m / 10)) === 0 || i === m) {
        steps.push({
          type: 'fill', word1, word2,
          dp: dp.map(r => [...r]),
          i, j: n, operations: [],
          explanation: `Row ${i} complete (char '${word1[i-1]}'). dp[${i}][${n}] = ${dp[i][n]}.`,
          highlightLine: 5,
        });
      }
    }

    // Backtrack for operations
    const ops: string[] = [];
    let i = m, j = n;
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && word1[i - 1] === word2[j - 1]) {
        ops.unshift(`Keep '${word1[i - 1]}'`);
        i--; j--;
      } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
        ops.unshift(`Replace '${word1[i - 1]}' → '${word2[j - 1]}'`);
        i--; j--;
      } else if (j > 0 && dp[i][j] === dp[i][j - 1] + 1) {
        ops.unshift(`Insert '${word2[j - 1]}'`);
        j--;
      } else {
        ops.unshift(`Delete '${word1[i - 1]}'`);
        i--;
      }
    }

    steps.push({
      type: 'complete', word1, word2,
      dp: dp.map(r => [...r]),
      i: m, j: n, operations: ops,
      explanation: `Min edit distance: ${dp[m][n]}. Operations: ${ops.filter(o => !o.startsWith('Keep')).length} edits needed. Time: O(mn), Space: O(mn).`,
      highlightLine: 11,
    });

    return steps;
  }
}
