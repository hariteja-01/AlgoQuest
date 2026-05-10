export interface KnapsackStep {
  type: 'init' | 'consider' | 'take' | 'skip' | 'complete';
  weights: number[];
  values: number[];
  capacity: number;
  dp: number[][];
  currentItem: number;
  currentCap: number;
  selectedItems: number[];
  explanation: string;
  highlightLine: number;
}

export class KnapsackEngine {
  solve(weights: number[], values: number[], capacity: number): KnapsackStep[] {
    const n = weights.length;
    const steps: KnapsackStep[] = [];
    const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));

    steps.push({
      type: 'init', weights, values, capacity,
      dp: dp.map(r => [...r]),
      currentItem: 0, currentCap: 0, selectedItems: [],
      explanation: `0/1 Knapsack: ${n} items, capacity ${capacity}. Build dp[i][w] = max value using items 0..i-1 with capacity w.`,
      highlightLine: 1,
    });

    for (let i = 1; i <= n; i++) {
      for (let w = 1; w <= capacity; w++) {
        if (weights[i - 1] <= w) {
          const take = values[i - 1] + dp[i - 1][w - weights[i - 1]];
          const skip = dp[i - 1][w];
          dp[i][w] = Math.max(take, skip);
        } else {
          dp[i][w] = dp[i - 1][w];
        }
      }

      if (i % Math.max(1, Math.floor(n / 8)) === 0 || i === n) {
        steps.push({
          type: 'consider', weights, values, capacity,
          dp: dp.map(r => [...r]),
          currentItem: i, currentCap: capacity, selectedItems: [],
          explanation: `Processed item ${i} (w=${weights[i-1]}, v=${values[i-1]}). dp[${i}][${capacity}] = ${dp[i][capacity]}.`,
          highlightLine: 6,
        });
      }
    }

    // Backtrack to find selected items
    const selected: number[] = [];
    let w = capacity;
    for (let i = n; i > 0; i--) {
      if (dp[i][w] !== dp[i - 1][w]) {
        selected.unshift(i - 1);
        w -= weights[i - 1];
      }
    }

    steps.push({
      type: 'complete', weights, values, capacity,
      dp: dp.map(r => [...r]),
      currentItem: n, currentCap: capacity, selectedItems: selected,
      explanation: `Max value = ${dp[n][capacity]}. Items: [${selected.map(i => `(w=${weights[i]},v=${values[i]})`).join(', ')}]. Time: O(n·W), Space: O(n·W).`,
      highlightLine: 12,
    });

    return steps;
  }

  static generate(): { weights: number[]; values: number[]; capacity: number } {
    const n = 5 + Math.floor(Math.random() * 4);
    const weights = Array.from({ length: n }, () => Math.floor(Math.random() * 8) + 1);
    const values = Array.from({ length: n }, () => Math.floor(Math.random() * 15) + 5);
    const capacity = Math.floor(weights.reduce((a, b) => a + b, 0) * 0.6);
    return { weights, values, capacity };
  }
}
