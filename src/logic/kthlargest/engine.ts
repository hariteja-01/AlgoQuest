export interface KthLargestStep {
  type: 'init' | 'partition' | 'swap' | 'found' | 'recurse' | 'complete';
  nums: number[];
  k: number;
  left: number;
  right: number;
  pivotIdx: number;
  pivotVal: number;
  result: number;
  comparisons: number;
  explanation: string;
  highlightLine: number;
  highlightIndices: number[];
}

export class KthLargestEngine {
  solve(nums: number[], k: number): KthLargestStep[] {
    const arr = [...nums];
    const steps: KthLargestStep[] = [];
    let comps = 0;
    const target = arr.length - k; // 0-indexed position for kth largest

    steps.push({
      type: 'init', nums: [...arr], k,
      left: 0, right: arr.length - 1,
      pivotIdx: -1, pivotVal: 0, result: 0,
      comparisons: 0,
      explanation: `Find the ${k}th largest element (target index ${target} in sorted order). Using QuickSelect — expected O(n).`,
      highlightLine: 1, highlightIndices: [],
    });

    const partition = (lo: number, hi: number): number => {
      const pivot = arr[hi];
      let i = lo;
      for (let j = lo; j < hi; j++) {
        comps++;
        if (arr[j] <= pivot) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          i++;
        }
      }
      [arr[i], arr[hi]] = [arr[hi], arr[i]];
      return i;
    };

    let lo = 0, hi = arr.length - 1;
    while (lo <= hi) {
      const pivotIdx = partition(lo, hi);

      steps.push({
        type: 'partition', nums: [...arr], k,
        left: lo, right: hi,
        pivotIdx, pivotVal: arr[pivotIdx], result: 0,
        comparisons: comps,
        explanation: `Partitioned [${lo}..${hi}] around pivot ${arr[pivotIdx]} at index ${pivotIdx}. Elements ≤ pivot are on its left.`,
        highlightLine: 6,
        highlightIndices: [pivotIdx],
      });

      if (pivotIdx === target) {
        steps.push({
          type: 'found', nums: [...arr], k,
          left: lo, right: hi,
          pivotIdx, pivotVal: arr[pivotIdx], result: arr[pivotIdx],
          comparisons: comps,
          explanation: `Found! Pivot index ${pivotIdx} === target ${target}. The ${k}th largest element is ${arr[pivotIdx]}.`,
          highlightLine: 10,
          highlightIndices: [pivotIdx],
        });
        break;
      } else if (pivotIdx < target) {
        lo = pivotIdx + 1;
        steps.push({
          type: 'recurse', nums: [...arr], k,
          left: lo, right: hi,
          pivotIdx, pivotVal: arr[pivotIdx], result: 0,
          comparisons: comps,
          explanation: `Pivot ${pivotIdx} < target ${target}. Search right half [${lo}..${hi}].`,
          highlightLine: 12,
          highlightIndices: [],
        });
      } else {
        hi = pivotIdx - 1;
        steps.push({
          type: 'recurse', nums: [...arr], k,
          left: lo, right: hi,
          pivotIdx, pivotVal: arr[pivotIdx], result: 0,
          comparisons: comps,
          explanation: `Pivot ${pivotIdx} > target ${target}. Search left half [${lo}..${hi}].`,
          highlightLine: 14,
          highlightIndices: [],
        });
      }
    }

    steps.push({
      type: 'complete', nums: [...arr], k,
      left: 0, right: arr.length - 1,
      pivotIdx: target, pivotVal: arr[target], result: arr[target],
      comparisons: comps,
      explanation: `QuickSelect complete! ${k}th largest = ${arr[target]}. Comparisons: ${comps}. Expected time: O(n).`,
      highlightLine: 16,
      highlightIndices: [target],
    });

    return steps;
  }

  static generate(size = 12): number[] {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 50) + 1);
  }
}
