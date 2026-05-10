export interface LISStep {
  type: 'init' | 'compare' | 'update' | 'binary-search' | 'complete';
  nums: number[];
  dp: number[];
  tails: number[];
  currentIndex: number;
  lisIndices: number[];
  explanation: string;
  highlightLine: number;
}

export type LISApproach = 'dp' | 'patience';

export class LISEngine {
  dpSolve(nums: number[]): LISStep[] {
    const n = nums.length;
    const steps: LISStep[] = [];
    const dp = new Array(n).fill(1);
    const parent = new Array(n).fill(-1);

    steps.push({
      type: 'init', nums: [...nums], dp: [...dp], tails: [],
      currentIndex: 0, lisIndices: [],
      explanation: `Initialize dp[0..${n-1}] = 1. Each element is a subsequence of length 1.`,
      highlightLine: 1,
    });

    for (let i = 1; i < n; i++) {
      for (let j = 0; j < i; j++) {
        if (nums[j] < nums[i] && dp[j] + 1 > dp[i]) {
          dp[i] = dp[j] + 1;
          parent[i] = j;
        }
      }

      steps.push({
        type: 'update', nums: [...nums], dp: [...dp], tails: [],
        currentIndex: i, lisIndices: [],
        explanation: `dp[${i}] = ${dp[i]}. Best subsequence ending at nums[${i}]=${nums[i]} has length ${dp[i]}.`,
        highlightLine: 6,
      });
    }

    // Reconstruct
    let maxLen = 0, maxIdx = 0;
    for (let i = 0; i < n; i++) {
      if (dp[i] > maxLen) { maxLen = dp[i]; maxIdx = i; }
    }
    const lisIndices: number[] = [];
    let idx = maxIdx;
    while (idx !== -1) { lisIndices.unshift(idx); idx = parent[idx]; }

    steps.push({
      type: 'complete', nums: [...nums], dp: [...dp], tails: [],
      currentIndex: -1, lisIndices,
      explanation: `LIS length = ${maxLen}. Subsequence: [${lisIndices.map(i => nums[i]).join(', ')}]. Time: O(n²), Space: O(n).`,
      highlightLine: 10,
    });

    return steps;
  }

  patienceSolve(nums: number[]): LISStep[] {
    const n = nums.length;
    const steps: LISStep[] = [];
    const tails: number[] = [];

    steps.push({
      type: 'init', nums: [...nums], dp: [], tails: [],
      currentIndex: 0, lisIndices: [],
      explanation: `Patience Sorting: Maintain array of smallest tail elements. Use binary search for O(n log n).`,
      highlightLine: 1,
    });

    for (let i = 0; i < n; i++) {
      let lo = 0, hi = tails.length;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (tails[mid] < nums[i]) lo = mid + 1;
        else hi = mid;
      }

      if (lo === tails.length) tails.push(nums[i]);
      else tails[lo] = nums[i];

      steps.push({
        type: 'binary-search', nums: [...nums], dp: [], tails: [...tails],
        currentIndex: i, lisIndices: [],
        explanation: `nums[${i}]=${nums[i]}: ${lo === tails.length - 1 && tails[lo] === nums[i] ? 'extended' : `replaced tails[${lo}]`}. Tails: [${tails.join(', ')}]. LIS length = ${tails.length}.`,
        highlightLine: 7,
      });
    }

    steps.push({
      type: 'complete', nums: [...nums], dp: [], tails: [...tails],
      currentIndex: -1, lisIndices: [],
      explanation: `LIS length = ${tails.length}. Time: O(n log n), Space: O(n). Tails: [${tails.join(', ')}]`,
      highlightLine: 12,
    });

    return steps;
  }

  solve(approach: LISApproach, nums: number[]): LISStep[] {
    return approach === 'dp' ? this.dpSolve(nums) : this.patienceSolve(nums);
  }

  static generate(size = 10): number[] {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 30) + 1);
  }
}
