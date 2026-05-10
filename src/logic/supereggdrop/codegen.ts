import { Language } from '../../types';
import { EggApproach } from './engine';

const code: Record<EggApproach, Record<Language, string>> = {
  recursive: {
    cpp: `#include <climits>
#include <algorithm>
using namespace std;

// Naive Recursion — O(N^K) exponential
int superEggDrop(int K, int N) {
    if (N <= 1 || K == 1) return N;
    int result = INT_MAX;
    for (int x = 1; x <= N; x++) {
        int worst = 1 + max(
            superEggDrop(K-1, x-1),  // egg breaks
            superEggDrop(K, N-x)     // egg survives
        );
        result = min(result, worst);
    }
    return result;
}`,
    python: `# Naive Recursion — O(N^K) exponential
def superEggDrop(K, N):
    if N <= 1 or K == 1:
        return N
    result = float('inf')
    for x in range(1, N+1):
        worst = 1 + max(
            superEggDrop(K-1, x-1),  # egg breaks
            superEggDrop(K, N-x)     # egg survives
        )
        result = min(result, worst)
    return result

print(superEggDrop(2, 6))  # 3`,
    javascript: `// Naive Recursion — O(N^K) exponential
function superEggDrop(K, N) {
    if (N <= 1 || K === 1) return N;
    let result = Infinity;
    for (let x = 1; x <= N; x++) {
        const worst = 1 + Math.max(
            superEggDrop(K-1, x-1),
            superEggDrop(K, N-x)
        );
        result = Math.min(result, worst);
    }
    return result;
}
console.log(superEggDrop(2, 6)); // 3`,
  },
  dp: {
    cpp: `#include <vector>
#include <climits>
#include <algorithm>
using namespace std;

// DP — O(KN²) time, O(KN) space
int superEggDrop(int K, int N) {
    vector<vector<int>> dp(K+1, vector<int>(N+1, 0));
    for (int j = 1; j <= N; j++) dp[1][j] = j;
    for (int i = 1; i <= K; i++) dp[i][1] = 1;
    for (int i = 2; i <= K; i++) {
        for (int j = 2; j <= N; j++) {
            dp[i][j] = INT_MAX;
            for (int x = 1; x <= j; x++)
                dp[i][j] = min(dp[i][j], 1 + max(dp[i-1][x-1], dp[i][j-x]));
        }
    }
    return dp[K][N];
}`,
    python: `# DP — O(KN²) time, O(KN) space
def superEggDrop(K, N):
    dp = [[0]*(N+1) for _ in range(K+1)]
    for j in range(1, N+1): dp[1][j] = j
    for i in range(1, K+1): dp[i][1] = 1
    for i in range(2, K+1):
        for j in range(2, N+1):
            dp[i][j] = float('inf')
            for x in range(1, j+1):
                dp[i][j] = min(dp[i][j], 1 + max(dp[i-1][x-1], dp[i][j-x]))
    return dp[K][N]

print(superEggDrop(2, 10))  # 4`,
    javascript: `// DP — O(KN²) time, O(KN) space
function superEggDrop(K, N) {
    const dp = Array.from({length: K+1}, () => new Array(N+1).fill(0));
    for (let j = 1; j <= N; j++) dp[1][j] = j;
    for (let i = 1; i <= K; i++) dp[i][1] = 1;
    for (let i = 2; i <= K; i++) {
        for (let j = 2; j <= N; j++) {
            dp[i][j] = Infinity;
            for (let x = 1; x <= j; x++)
                dp[i][j] = Math.min(dp[i][j], 1+Math.max(dp[i-1][x-1], dp[i][j-x]));
        }
    }
    return dp[K][N];
}
console.log(superEggDrop(2, 10)); // 4`,
  },
  dpBinarySearch: {
    cpp: `#include <vector>
#include <climits>
#include <algorithm>
using namespace std;

// DP + Binary Search — O(KN·logN)
int superEggDrop(int K, int N) {
    vector<vector<int>> dp(K+1, vector<int>(N+1, 0));
    for (int j = 1; j <= N; j++) dp[1][j] = j;
    for (int i = 1; i <= K; i++) dp[i][1] = 1;
    for (int i = 2; i <= K; i++) {
        for (int j = 2; j <= N; j++) {
            int lo = 1, hi = j;
            dp[i][j] = INT_MAX;
            while (lo <= hi) {
                int mid = (lo+hi)/2;
                int brk = dp[i-1][mid-1], surv = dp[i][j-mid];
                dp[i][j] = min(dp[i][j], 1+max(brk, surv));
                brk < surv ? lo = mid+1 : hi = mid-1;
            }
        }
    }
    return dp[K][N];
}`,
    python: `# DP + Binary Search — O(KN·logN)
def superEggDrop(K, N):
    dp = [[0]*(N+1) for _ in range(K+1)]
    for j in range(1, N+1): dp[1][j] = j
    for i in range(1, K+1): dp[i][1] = 1
    for i in range(2, K+1):
        for j in range(2, N+1):
            lo, hi = 1, j
            dp[i][j] = float('inf')
            while lo <= hi:
                mid = (lo+hi)//2
                brk, surv = dp[i-1][mid-1], dp[i][j-mid]
                dp[i][j] = min(dp[i][j], 1+max(brk, surv))
                if brk < surv: lo = mid+1
                else: hi = mid-1
    return dp[K][N]

print(superEggDrop(2, 100))  # 14`,
    javascript: `// DP + Binary Search — O(KN·logN)
function superEggDrop(K, N) {
    const dp = Array.from({length:K+1}, ()=>new Array(N+1).fill(0));
    for (let j=1;j<=N;j++) dp[1][j]=j;
    for (let i=1;i<=K;i++) dp[i][1]=1;
    for (let i=2;i<=K;i++) {
        for (let j=2;j<=N;j++) {
            let lo=1, hi=j;
            dp[i][j]=Infinity;
            while (lo<=hi) {
                const mid=(lo+hi)>>1;
                const brk=dp[i-1][mid-1], surv=dp[i][j-mid];
                dp[i][j]=Math.min(dp[i][j],1+Math.max(brk,surv));
                brk<surv ? lo=mid+1 : hi=mid-1;
            }
        }
    }
    return dp[K][N];
}
console.log(superEggDrop(2, 100)); // 14`,
  },
  movesBased: {
    cpp: `#include <vector>
using namespace std;

// Moves-based DP — O(K·result)
int superEggDrop(int K, int N) {
    vector<vector<int>> dp(N+1, vector<int>(K+1, 0));
    int m = 0;
    while (dp[m][K] < N) {
        m++;
        for (int k = 1; k <= K; k++)
            dp[m][k] = dp[m-1][k-1] + dp[m-1][k] + 1;
    }
    return m;
}`,
    python: `# Moves-based DP — O(K·result)
def superEggDrop(K, N):
    dp = [[0]*(K+1) for _ in range(N+1)]
    m = 0
    while dp[m][K] < N:
        m += 1
        for k in range(1, K+1):
            dp[m][k] = dp[m-1][k-1] + dp[m-1][k] + 1
    return m

print(superEggDrop(2, 100))  # 14`,
    javascript: `// Moves-based DP — O(K·result)
function superEggDrop(K, N) {
    const dp = Array.from({length:N+1}, ()=>new Array(K+1).fill(0));
    let m = 0;
    while (dp[m][K] < N) {
        m++;
        for (let k=1;k<=K;k++)
            dp[m][k] = dp[m-1][k-1] + dp[m-1][k] + 1;
    }
    return m;
}
console.log(superEggDrop(2, 100)); // 14`,
  },
};

export const generateSuperEggDropCode = (approach: EggApproach, language: Language): string => {
  return code[approach]?.[language] ?? '';
};
