export interface SlidingWindowStep {
  type: 'init' | 'slide' | 'push' | 'pop' | 'record' | 'complete';
  nums: number[];
  k: number;
  windowStart: number;
  windowEnd: number;
  deque: number[];
  result: number[];
  explanation: string;
  highlightLine: number;
}

export class SlidingWindowEngine {
  solve(nums: number[], k: number): SlidingWindowStep[] {
    const steps: SlidingWindowStep[] = [];
    const deque: number[] = [];
    const result: number[] = [];

    steps.push({
      type: 'init', nums: [...nums], k,
      windowStart: 0, windowEnd: 0, deque: [], result: [],
      explanation: `Array of ${nums.length} elements, window size k=${k}. Using monotonic deque for O(n) solution.`,
      highlightLine: 1,
    });

    for (let i = 0; i < nums.length; i++) {
      // Remove elements outside window
      while (deque.length > 0 && deque[0] < i - k + 1) {
        deque.shift();
        steps.push({
          type: 'pop', nums: [...nums], k,
          windowStart: Math.max(0, i - k + 1), windowEnd: i, deque: [...deque], result: [...result],
          explanation: `Removed front of deque — index outside current window.`,
          highlightLine: 4,
        });
      }

      // Remove smaller elements from back
      while (deque.length > 0 && nums[deque[deque.length - 1]] <= nums[i]) {
        const removed = deque.pop()!;
        steps.push({
          type: 'pop', nums: [...nums], k,
          windowStart: Math.max(0, i - k + 1), windowEnd: i, deque: [...deque], result: [...result],
          explanation: `Popped index ${removed} (val ${nums[removed]}) from back — smaller than nums[${i}]=${nums[i]}.`,
          highlightLine: 7,
        });
      }

      deque.push(i);
      steps.push({
        type: 'push', nums: [...nums], k,
        windowStart: Math.max(0, i - k + 1), windowEnd: i, deque: [...deque], result: [...result],
        explanation: `Pushed index ${i} (val ${nums[i]}). Deque: [${deque.map(d => nums[d]).join(', ')}]`,
        highlightLine: 9,
      });

      if (i >= k - 1) {
        result.push(nums[deque[0]]);
        steps.push({
          type: 'record', nums: [...nums], k,
          windowStart: i - k + 1, windowEnd: i, deque: [...deque], result: [...result],
          explanation: `Window [${i-k+1}..${i}] max = ${nums[deque[0]]}. Result: [${result.join(', ')}]`,
          highlightLine: 11,
        });
      }
    }

    steps.push({
      type: 'complete', nums: [...nums], k,
      windowStart: 0, windowEnd: nums.length - 1, deque: [...deque], result: [...result],
      explanation: `Done! Result: [${result.join(', ')}]. Time: O(n), Space: O(k).`,
      highlightLine: 14,
    });

    return steps;
  }

  static generate(size = 10): { nums: number[]; k: number } {
    return {
      nums: Array.from({ length: size }, () => Math.floor(Math.random() * 20) + 1),
      k: Math.min(3 + Math.floor(Math.random() * 3), size),
    };
  }
}
