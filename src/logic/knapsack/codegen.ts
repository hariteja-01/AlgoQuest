import { Language } from '../../types';

export const generateKnapsackCode = (language: Language): string => {
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

weights = [2, 3, 4, 5]
values = [3, 4, 5, 6]
print(knapsack(weights, values, 8))  # 10`;
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
console.log(knapsack([2,3,4,5], [3,4,5,6], 8)); // 10`;
};
