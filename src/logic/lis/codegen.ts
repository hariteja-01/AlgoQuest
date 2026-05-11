import { Language } from '../../types';
import { LISApproach } from './engine';

const dpCode: Record<Language, string> = {
  cpp: `#include <vector>
#include <algorithm>
using namespace std;

// O(n²) DP
int lengthOfLIS(vector<int>& nums) {
    int n = nums.size();
    vector<int> dp(n, 1);
    for (int i = 1; i < n; i++)
        for (int j = 0; j < i; j++)
            if (nums[j] < nums[i])
                dp[i] = max(dp[i], dp[j] + 1);
    return *max_element(dp.begin(), dp.end());
}`,
  python: `# O(n²) DP
def lengthOfLIS(nums):
    n = len(nums)
    dp = [1] * n
    for i in range(1, n):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)

print(lengthOfLIS([10,9,2,5,3,7,101,18]))  # 4`,
  javascript: `// O(n²) DP
function lengthOfLIS(nums) {
    const n = nums.length;
    const dp = new Array(n).fill(1);
    for (let i = 1; i < n; i++)
        for (let j = 0; j < i; j++)
            if (nums[j] < nums[i])
                dp[i] = Math.max(dp[i], dp[j] + 1);
    return Math.max(...dp);
}
console.log(lengthOfLIS([10,9,2,5,3,7,101,18])); // 4`,
  java: `import java.util.*;

class Solution {
    public int lengthOfLIS(int[] nums) {
        int n = nums.length;
        int[] dp = new int[n];
        Arrays.fill(dp, 1);
        int best = 0;
        for (int i = 1; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[j] < nums[i]) {
                    dp[i] = Math.max(dp[i], dp[j] + 1);
                }
            }
            best = Math.max(best, dp[i]);
        }
        for (int value : dp) best = Math.max(best, value);
        return best;
    }
}

class Demo {
    public static void main(String[] args) {
        Solution solution = new Solution();
        System.out.println(solution.lengthOfLIS(new int[]{10,9,2,5,3,7,101,18}));
    }
}`,
  csharp: `using System;

public class Solution {
    public int LengthOfLIS(int[] nums) {
        int n = nums.Length;
        int[] dp = new int[n];
        for (int i = 0; i < n; i++) dp[i] = 1;
        int best = 0;
        for (int i = 1; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[j] < nums[i]) dp[i] = Math.Max(dp[i], dp[j] + 1);
            }
            best = Math.Max(best, dp[i]);
        }
        foreach (int val in dp) best = Math.Max(best, val);
        return best;
    }
}

public class Demo {
    public static void Main() {
        var solution = new Solution();
        Console.WriteLine(solution.LengthOfLIS(new int[]{10,9,2,5,3,7,101,18}));
    }
}`,
};

const patienceCode: Record<Language, string> = {
  cpp: `#include <vector>
#include <algorithm>
using namespace std;

// O(n log n) Patience Sorting
int lengthOfLIS(vector<int>& nums) {
    vector<int> tails;
    for (int x : nums) {
        auto it = lower_bound(tails.begin(), tails.end(), x);
        if (it == tails.end()) tails.push_back(x);
        else *it = x;
    }
    return tails.size();
}`,
  python: `import bisect

# O(n log n) Patience Sorting
def lengthOfLIS(nums):
    tails = []
    for x in nums:
        pos = bisect.bisect_left(tails, x)
        if pos == len(tails):
            tails.append(x)
        else:
            tails[pos] = x
    return len(tails)

print(lengthOfLIS([10,9,2,5,3,7,101,18]))  # 4`,
  javascript: `// O(n log n) Patience Sorting
function lengthOfLIS(nums) {
    const tails = [];
    for (const x of nums) {
        let lo = 0, hi = tails.length;
        while (lo < hi) {
            const mid = (lo + hi) >> 1;
            tails[mid] < x ? lo = mid + 1 : hi = mid;
        }
        if (lo === tails.length) tails.push(x);
        else tails[lo] = x;
    }
    return tails.length;
}
console.log(lengthOfLIS([10,9,2,5,3,7,101,18])); // 4`,
  java: `import java.util.*;

class Solution {
    public int lengthOfLIS(int[] nums) {
        int[] tails = new int[nums.length];
        int size = 0;
        for (int x : nums) {
            int i = Arrays.binarySearch(tails, 0, size, x);
            if (i < 0) i = -(i + 1);
            tails[i] = x;
            if (i == size) size++;
        }
        return size;
    }
}

class Demo {
    public static void main(String[] args) {
        Solution solution = new Solution();
        System.out.println(solution.lengthOfLIS(new int[]{10,9,2,5,3,7,101,18}));
    }
}`,
  csharp: `using System;

public class Solution {
    public int LengthOfLIS(int[] nums) {
        int[] tails = new int[nums.Length];
        int size = 0;
        foreach (int x in nums) {
            int lo = 0, hi = size;
            while (lo < hi) {
                int mid = (lo + hi) >> 1;
                if (tails[mid] < x) lo = mid + 1; else hi = mid;
            }
            tails[lo] = x;
            if (lo == size) size++;
        }
        return size;
    }
}

public class Demo {
    public static void Main() {
        var solution = new Solution();
        Console.WriteLine(solution.LengthOfLIS(new int[]{10,9,2,5,3,7,101,18}));
    }
}`,
};

export const generateLISCode = (approach: LISApproach, language: Language): string => {
  return approach === 'dp' ? (dpCode[language] ?? '') : (patienceCode[language] ?? '');
};
