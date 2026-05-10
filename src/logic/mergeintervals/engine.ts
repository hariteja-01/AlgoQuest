export interface MergeStep {
  type: 'init' | 'sort' | 'compare' | 'merge' | 'advance' | 'complete';
  intervals: number[][];
  merged: number[][];
  currentIndex: number;
  compareIndex: number;
  explanation: string;
  highlightLine: number;
}

export class MergeIntervalsEngine {
  solve(intervals: number[][]): MergeStep[] {
    const steps: MergeStep[] = [];
    if (intervals.length === 0) return steps;

    const arr = intervals.map(i => [...i]);
    steps.push({
      type: 'init', intervals: arr.map(i=>[...i]), merged: [],
      currentIndex: -1, compareIndex: -1,
      explanation: `Input: ${arr.length} intervals. First step: sort by start time.`,
      highlightLine: 1,
    });

    arr.sort((a, b) => a[0] - b[0]);
    steps.push({
      type: 'sort', intervals: arr.map(i=>[...i]), merged: [],
      currentIndex: -1, compareIndex: -1,
      explanation: `Sorted by start time. Now scan left to right and merge overlapping intervals.`,
      highlightLine: 3,
    });

    const merged: number[][] = [arr[0]];
    for (let i = 1; i < arr.length; i++) {
      const last = merged[merged.length - 1];
      if (arr[i][0] <= last[1]) {
        last[1] = Math.max(last[1], arr[i][1]);
        steps.push({
          type: 'merge', intervals: arr.map(i=>[...i]), merged: merged.map(m=>[...m]),
          currentIndex: i, compareIndex: merged.length - 1,
          explanation: `[${arr[i]}] overlaps with [${last}] → merged to [${last[0]},${last[1]}]`,
          highlightLine: 7,
        });
      } else {
        merged.push([...arr[i]]);
        steps.push({
          type: 'advance', intervals: arr.map(i=>[...i]), merged: merged.map(m=>[...m]),
          currentIndex: i, compareIndex: merged.length - 1,
          explanation: `[${arr[i]}] doesn't overlap → added as new interval.`,
          highlightLine: 9,
        });
      }
    }

    steps.push({
      type: 'complete', intervals: arr.map(i=>[...i]), merged: merged.map(m=>[...m]),
      currentIndex: -1, compareIndex: -1,
      explanation: `Done! ${arr.length} intervals → ${merged.length} merged. Time: O(n log n), Space: O(n).`,
      highlightLine: 12,
    });

    return steps;
  }

  static generate(type: 'random' | 'overlapping' | 'disjoint' | 'nested', count = 8): number[][] {
    switch (type) {
      case 'overlapping':
        return Array.from({ length: count }, (_, i) => [i * 2, i * 2 + 3]);
      case 'disjoint':
        return Array.from({ length: count }, (_, i) => [i * 4, i * 4 + 2]);
      case 'nested':
        return Array.from({ length: count }, (_, i) => [i, count * 2 - i]);
      default:
        return Array.from({ length: count }, () => {
          const s = Math.floor(Math.random() * 20);
          return [s, s + Math.floor(Math.random() * 8) + 1];
        });
    }
  }
}
