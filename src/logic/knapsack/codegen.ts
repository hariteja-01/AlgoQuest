import { Language } from '../../types';

export const generateKnapsackCode = (
    weights: number[],
    values: number[],
    capacity: number,
    language: Language,
): string => {
    const safeWeights = weights.length > 0 ? weights : [2, 3, 4, 5];
    const safeValues = values.length > 0 ? values : [3, 4, 5, 6];
    const size = Math.min(safeWeights.length, safeValues.length);
    const finalWeights = safeWeights.slice(0, size);
    const finalValues = safeValues.slice(0, size);
    const safeCapacity = capacity > 0 ? capacity : 8;
  if (language === 'cpp') return `#include <vector>
#include <algorithm>
using namespace std;

// 0/1 Knapsack — O(n·W) time, O(n·W) space
int knapsack(vector<int>& weights, vector<int>& values, int W) {
    int n = weights.size();
    vector<vector<int>> dp(n+1, vector<int>(W+1, 0));
    for (int i = 1; i <= n; i++)
        for (int w = 1; w <= W; w++) {
            dp[i][w] = dp[i-1][w];  // skip
            if (weights[i-1] <= w)
                dp[i][w] = max(dp[i][w], values[i-1] + dp[i-1][w-weights[i-1]]);
        }
    return dp[n][W];
}

int main() {
    vector<int> weights = {${finalWeights.join(', ')}};
    vector<int> values = {${finalValues.join(', ')}};
    int W = ${safeCapacity};
    int result = knapsack(weights, values, W);
    return 0;
}`;
  if (language === 'java') return `class Solution {
    public int knapsack(int[] weights, int[] values, int W) {
        int n = weights.length;
        int[][] dp = new int[n + 1][W + 1];
        for (int i = 1; i <= n; i++) {
            for (int w = 1; w <= W; w++) {
                dp[i][w] = dp[i - 1][w];
                if (weights[i - 1] <= w) {
                    dp[i][w] = Math.max(dp[i][w], values[i - 1] + dp[i - 1][w - weights[i - 1]]);
                }
            }
        }
        return dp[n][W];
    }
}

class Demo {
    public static void main(String[] args) {
        Solution solution = new Solution();
        System.out.println(solution.knapsack(new int[]{${finalWeights.join(', ')}}, new int[]{${finalValues.join(', ')}}, ${safeCapacity}));
    }
}`;
  if (language === 'csharp') return `using System;

public class Solution {
    public int Knapsack(int[] weights, int[] values, int W) {
        int n = weights.Length;
        int[,] dp = new int[n + 1, W + 1];
        for (int i = 1; i <= n; i++) {
            for (int w = 1; w <= W; w++) {
                dp[i, w] = dp[i - 1, w];
                if (weights[i - 1] <= w) {
                    dp[i, w] = Math.Max(dp[i, w], values[i - 1] + dp[i - 1, w - weights[i - 1]]);
                }
            }
        }
        return dp[n, W];
    }
}

public class Demo {
    public static void Main() {
        var solution = new Solution();
        Console.WriteLine(solution.Knapsack(new int[] {${finalWeights.join(', ')}}, new int[] {${finalValues.join(', ')}}, ${safeCapacity}));
    }
}`;
  if (language === 'python') return `# 0/1 Knapsack — O(n·W) time, O(n·W) space
def knapsack(weights, values, W):
    n = len(weights)
    dp = [[0]*(W+1) for _ in range(n+1)]
    for i in range(1, n+1):
        for w in range(1, W+1):
            dp[i][w] = dp[i-1][w]  # skip
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i][w], values[i-1] + dp[i-1][w-weights[i-1]])
    return dp[n][W]

weights = [${finalWeights.join(', ')}]
values = [${finalValues.join(', ')}]
print(knapsack(weights, values, ${safeCapacity}))`;
  return `// 0/1 Knapsack — O(n·W) time, O(n·W) space
function knapsack(weights, values, W) {
    const n = weights.length;
    const dp = Array.from({length:n+1}, ()=>new Array(W+1).fill(0));
    for (let i = 1; i <= n; i++)
        for (let w = 1; w <= W; w++) {
            dp[i][w] = dp[i-1][w];  // skip
            if (weights[i-1] <= w)
                dp[i][w] = Math.max(dp[i][w], values[i-1] + dp[i-1][w-weights[i-1]]);
        }
    return dp[n][W];
}
console.log(knapsack([${finalWeights.join(', ')}], [${finalValues.join(', ')}], ${safeCapacity}));`;
};
