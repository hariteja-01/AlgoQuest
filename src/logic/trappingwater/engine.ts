export interface TrappingWaterStep {
  type: 'init' | 'scan' | 'compute' | 'fill' | 'pointer-move' | 'stack-push' | 'stack-pop' | 'complete';
  heights: number[];
  waterLevels: number[];
  leftMax: number[];
  rightMax: number[];
  leftPointer?: number;
  rightPointer?: number;
  currentIndex?: number;
  stack: number[];
  totalWater: number;
  operations: number;
  explanation: string;
  highlightLine: number;
  highlightIndices: number[];
}

export type ApproachType = 'bruteforce' | 'dp' | 'twopointer' | 'stack';

export class TrappingWaterEngine {
  private heights: number[];

  constructor(heights: number[]) {
    this.heights = [...heights];
  }

  setHeights(heights: number[]) {
    this.heights = [...heights];
  }

  getHeights() {
    return [...this.heights];
  }

  bruteForce(): TrappingWaterStep[] {
    const n = this.heights.length;
    const steps: TrappingWaterStep[] = [];
    const waterLevels = new Array(n).fill(0);
    let totalWater = 0;
    let operations = 0;

    steps.push({
      type: 'init',
      heights: [...this.heights],
      waterLevels: [...waterLevels],
      leftMax: [],
      rightMax: [],
      stack: [],
      totalWater: 0,
      operations: 0,
      explanation: 'Brute Force: For each bar, find the max height to its left and right, then compute trapped water.',
      highlightLine: 1,
      highlightIndices: [],
    });

    for (let i = 0; i < n; i++) {
      let lMax = 0;
      for (let j = 0; j <= i; j++) {
        lMax = Math.max(lMax, this.heights[j]);
        operations++;
      }

      let rMax = 0;
      for (let j = i; j < n; j++) {
        rMax = Math.max(rMax, this.heights[j]);
        operations++;
      }

      const water = Math.max(0, Math.min(lMax, rMax) - this.heights[i]);
      waterLevels[i] = water;
      totalWater += water;

      steps.push({
        type: 'compute',
        heights: [...this.heights],
        waterLevels: [...waterLevels],
        leftMax: [],
        rightMax: [],
        currentIndex: i,
        stack: [],
        totalWater,
        operations,
        explanation: `Bar ${i}: leftMax=${lMax}, rightMax=${rMax}, water = min(${lMax},${rMax}) - ${this.heights[i]} = ${water}`,
        highlightLine: 5,
        highlightIndices: [i],
      });
    }

    steps.push({
      type: 'complete',
      heights: [...this.heights],
      waterLevels: [...waterLevels],
      leftMax: [],
      rightMax: [],
      stack: [],
      totalWater,
      operations,
      explanation: `Brute Force complete! Total trapped water: ${totalWater}. Time: O(n²), Space: O(1).`,
      highlightLine: 12,
      highlightIndices: [],
    });

    return steps;
  }

  dpApproach(): TrappingWaterStep[] {
    const n = this.heights.length;
    const steps: TrappingWaterStep[] = [];
    const waterLevels = new Array(n).fill(0);
    const leftMax = new Array(n).fill(0);
    const rightMax = new Array(n).fill(0);
    let totalWater = 0;
    let operations = 0;

    steps.push({
      type: 'init',
      heights: [...this.heights],
      waterLevels: [...waterLevels],
      leftMax: [...leftMax],
      rightMax: [...rightMax],
      stack: [],
      totalWater: 0,
      operations: 0,
      explanation: 'DP Approach: Precompute leftMax[] and rightMax[] arrays, then calculate water at each position.',
      highlightLine: 1,
      highlightIndices: [],
    });

    // Build leftMax
    leftMax[0] = this.heights[0];
    for (let i = 1; i < n; i++) {
      leftMax[i] = Math.max(leftMax[i - 1], this.heights[i]);
      operations++;
      steps.push({
        type: 'scan',
        heights: [...this.heights],
        waterLevels: [...waterLevels],
        leftMax: [...leftMax],
        rightMax: [...rightMax],
        currentIndex: i,
        stack: [],
        totalWater: 0,
        operations,
        explanation: `Building leftMax[${i}] = max(leftMax[${i-1}]=${leftMax[i-1]}, height[${i}]=${this.heights[i]}) = ${leftMax[i]}`,
        highlightLine: 4,
        highlightIndices: [i],
      });
    }

    // Build rightMax
    rightMax[n - 1] = this.heights[n - 1];
    for (let i = n - 2; i >= 0; i--) {
      rightMax[i] = Math.max(rightMax[i + 1], this.heights[i]);
      operations++;
      steps.push({
        type: 'scan',
        heights: [...this.heights],
        waterLevels: [...waterLevels],
        leftMax: [...leftMax],
        rightMax: [...rightMax],
        currentIndex: i,
        stack: [],
        totalWater: 0,
        operations,
        explanation: `Building rightMax[${i}] = max(rightMax[${i+1}]=${rightMax[i+1]}, height[${i}]=${this.heights[i]}) = ${rightMax[i]}`,
        highlightLine: 8,
        highlightIndices: [i],
      });
    }

    // Compute water
    for (let i = 0; i < n; i++) {
      const water = Math.max(0, Math.min(leftMax[i], rightMax[i]) - this.heights[i]);
      waterLevels[i] = water;
      totalWater += water;
      operations++;

      steps.push({
        type: 'fill',
        heights: [...this.heights],
        waterLevels: [...waterLevels],
        leftMax: [...leftMax],
        rightMax: [...rightMax],
        currentIndex: i,
        stack: [],
        totalWater,
        operations,
        explanation: `Water[${i}] = min(leftMax[${i}]=${leftMax[i]}, rightMax[${i}]=${rightMax[i]}) - height[${i}]=${this.heights[i]} = ${water}`,
        highlightLine: 12,
        highlightIndices: [i],
      });
    }

    steps.push({
      type: 'complete',
      heights: [...this.heights],
      waterLevels: [...waterLevels],
      leftMax: [...leftMax],
      rightMax: [...rightMax],
      stack: [],
      totalWater,
      operations,
      explanation: `DP complete! Total trapped water: ${totalWater}. Time: O(n), Space: O(n).`,
      highlightLine: 15,
      highlightIndices: [],
    });

    return steps;
  }

  twoPointer(): TrappingWaterStep[] {
    const n = this.heights.length;
    const steps: TrappingWaterStep[] = [];
    const waterLevels = new Array(n).fill(0);
    let left = 0, right = n - 1;
    let leftMax = 0, rightMax = 0;
    let totalWater = 0;
    let operations = 0;

    steps.push({
      type: 'init',
      heights: [...this.heights],
      waterLevels: [...waterLevels],
      leftMax: [],
      rightMax: [],
      leftPointer: left,
      rightPointer: right,
      stack: [],
      totalWater: 0,
      operations: 0,
      explanation: 'Two Pointer: Use left and right pointers moving inward. Track running max from each side.',
      highlightLine: 1,
      highlightIndices: [left, right],
    });

    while (left < right) {
      operations++;
      if (this.heights[left] < this.heights[right]) {
        if (this.heights[left] >= leftMax) {
          leftMax = this.heights[left];
          steps.push({
            type: 'pointer-move',
            heights: [...this.heights],
            waterLevels: [...waterLevels],
            leftMax: [],
            rightMax: [],
            leftPointer: left,
            rightPointer: right,
            stack: [],
            totalWater,
            operations,
            explanation: `Left pointer at ${left}: height ${this.heights[left]} >= leftMax, updating leftMax to ${leftMax}`,
            highlightLine: 6,
            highlightIndices: [left],
          });
        } else {
          const water = leftMax - this.heights[left];
          waterLevels[left] = water;
          totalWater += water;
          steps.push({
            type: 'fill',
            heights: [...this.heights],
            waterLevels: [...waterLevels],
            leftMax: [],
            rightMax: [],
            leftPointer: left,
            rightPointer: right,
            stack: [],
            totalWater,
            operations,
            explanation: `Left pointer at ${left}: water = leftMax(${leftMax}) - height(${this.heights[left]}) = ${water}`,
            highlightLine: 8,
            highlightIndices: [left],
          });
        }
        left++;
      } else {
        if (this.heights[right] >= rightMax) {
          rightMax = this.heights[right];
          steps.push({
            type: 'pointer-move',
            heights: [...this.heights],
            waterLevels: [...waterLevels],
            leftMax: [],
            rightMax: [],
            leftPointer: left,
            rightPointer: right,
            stack: [],
            totalWater,
            operations,
            explanation: `Right pointer at ${right}: height ${this.heights[right]} >= rightMax, updating rightMax to ${rightMax}`,
            highlightLine: 11,
            highlightIndices: [right],
          });
        } else {
          const water = rightMax - this.heights[right];
          waterLevels[right] = water;
          totalWater += water;
          steps.push({
            type: 'fill',
            heights: [...this.heights],
            waterLevels: [...waterLevels],
            leftMax: [],
            rightMax: [],
            leftPointer: left,
            rightPointer: right,
            stack: [],
            totalWater,
            operations,
            explanation: `Right pointer at ${right}: water = rightMax(${rightMax}) - height(${this.heights[right]}) = ${water}`,
            highlightLine: 13,
            highlightIndices: [right],
          });
        }
        right--;
      }
    }

    steps.push({
      type: 'complete',
      heights: [...this.heights],
      waterLevels: [...waterLevels],
      leftMax: [],
      rightMax: [],
      stack: [],
      totalWater,
      operations,
      explanation: `Two Pointer complete! Total trapped water: ${totalWater}. Time: O(n), Space: O(1).`,
      highlightLine: 16,
      highlightIndices: [],
    });

    return steps;
  }

  monotonicStack(): TrappingWaterStep[] {
    const n = this.heights.length;
    const steps: TrappingWaterStep[] = [];
    const waterLevels = new Array(n).fill(0);
    const stack: number[] = [];
    let totalWater = 0;
    let operations = 0;

    steps.push({
      type: 'init',
      heights: [...this.heights],
      waterLevels: [...waterLevels],
      leftMax: [],
      rightMax: [],
      stack: [...stack],
      totalWater: 0,
      operations: 0,
      explanation: 'Monotonic Stack: Maintain a decreasing stack. When a taller bar is found, pop and compute trapped water.',
      highlightLine: 1,
      highlightIndices: [],
    });

    for (let i = 0; i < n; i++) {
      while (stack.length > 0 && this.heights[i] > this.heights[stack[stack.length - 1]]) {
        const top = stack.pop()!;
        operations++;

        if (stack.length === 0) {
          steps.push({
            type: 'stack-pop',
            heights: [...this.heights],
            waterLevels: [...waterLevels],
            leftMax: [],
            rightMax: [],
            currentIndex: i,
            stack: [...stack],
            totalWater,
            operations,
            explanation: `Popped index ${top}, stack empty — no left boundary, no water trapped here.`,
            highlightLine: 6,
            highlightIndices: [top, i],
          });
          break;
        }

        const left = stack[stack.length - 1];
        const width = i - left - 1;
        const height = Math.min(this.heights[left], this.heights[i]) - this.heights[top];
        const water = width * height;
        totalWater += water;

        // Distribute water visually
        for (let j = left + 1; j < i; j++) {
          const addWater = Math.max(0, Math.min(this.heights[left], this.heights[i]) - this.heights[j] - waterLevels[j]);
          if (addWater > 0) waterLevels[j] = Math.min(this.heights[left], this.heights[i]) - this.heights[j];
        }

        steps.push({
          type: 'stack-pop',
          heights: [...this.heights],
          waterLevels: [...waterLevels],
          leftMax: [],
          rightMax: [],
          currentIndex: i,
          stack: [...stack],
          totalWater,
          operations,
          explanation: `Popped ${top}: left=${left}, right=${i}, width=${width}, height=${height}, water=${water}`,
          highlightLine: 9,
          highlightIndices: [left, top, i],
        });
      }

      stack.push(i);
      operations++;
      steps.push({
        type: 'stack-push',
        heights: [...this.heights],
        waterLevels: [...waterLevels],
        leftMax: [],
        rightMax: [],
        currentIndex: i,
        stack: [...stack],
        totalWater,
        operations,
        explanation: `Pushed index ${i} (height ${this.heights[i]}) onto stack. Stack: [${stack.join(', ')}]`,
        highlightLine: 4,
        highlightIndices: [i],
      });
    }

    steps.push({
      type: 'complete',
      heights: [...this.heights],
      waterLevels: [...waterLevels],
      leftMax: [],
      rightMax: [],
      stack: [...stack],
      totalWater,
      operations,
      explanation: `Monotonic Stack complete! Total trapped water: ${totalWater}. Time: O(n), Space: O(n).`,
      highlightLine: 14,
      highlightIndices: [],
    });

    return steps;
  }

  solve(approach: ApproachType): TrappingWaterStep[] {
    switch (approach) {
      case 'bruteforce': return this.bruteForce();
      case 'dp': return this.dpApproach();
      case 'twopointer': return this.twoPointer();
      case 'stack': return this.monotonicStack();
    }
  }

  static generateTerrain(type: 'random' | 'valley' | 'mountain' | 'flat' | 'increasing' | 'decreasing' | 'edge', size: number = 12): number[] {
    switch (type) {
      case 'random':
        return Array.from({ length: size }, () => Math.floor(Math.random() * 8) + 1);
      case 'valley':
        return Array.from({ length: size }, (_, i) => {
          const mid = size / 2;
          return Math.max(1, Math.floor(Math.abs(i - mid) * 1.5) + 1);
        });
      case 'mountain':
        return Array.from({ length: size }, (_, i) => {
          const mid = size / 2;
          return Math.max(1, Math.floor((mid - Math.abs(i - mid)) * 1.5) + 1);
        });
      case 'flat':
        return new Array(size).fill(3);
      case 'increasing':
        return Array.from({ length: size }, (_, i) => i + 1);
      case 'decreasing':
        return Array.from({ length: size }, (_, i) => size - i);
      case 'edge':
        return [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];
      default:
        return [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];
    }
  }
}
