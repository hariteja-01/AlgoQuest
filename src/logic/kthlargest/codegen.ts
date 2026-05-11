import { Language } from '../../types';

export const generateKthLargestCode = (nums: number[], k: number, language: Language): string => {
    const safeNums = nums.length > 0 ? nums : [3, 2, 1, 5, 6, 4];
    const safeK = Math.min(Math.max(k, 1), safeNums.length);
  if (language === 'cpp') return `#include <vector>
#include <algorithm>
using namespace std;

// QuickSelect — O(n) average, O(n²) worst
int findKthLargest(vector<int>& nums, int k) {
    int target = nums.size() - k;
    int lo = 0, hi = nums.size() - 1;
    while (lo <= hi) {
        int pivot = nums[hi], i = lo;
        for (int j = lo; j < hi; j++)
            if (nums[j] <= pivot) swap(nums[i++], nums[j]);
        swap(nums[i], nums[hi]);
        if (i == target) return nums[i];
        else if (i < target) lo = i + 1;
        else hi = i - 1;
    }
    return nums[target];
}

int main() {
    vector<int> nums = {${safeNums.join(', ')}};
    int k = ${safeK};
    int result = findKthLargest(nums, k);
    return 0;
}`;
  if (language === 'java') return `class Solution {
    public int findKthLargest(int[] nums, int k) {
        int target = nums.length - k;
        int lo = 0, hi = nums.length - 1;
        while (lo <= hi) {
            int pivot = nums[hi];
            int i = lo;
            for (int j = lo; j < hi; j++) {
                if (nums[j] <= pivot) {
                    int tmp = nums[i]; nums[i] = nums[j]; nums[j] = tmp;
                    i++;
                }
            }
            int tmp = nums[i]; nums[i] = nums[hi]; nums[hi] = tmp;
            if (i == target) return nums[i];
            if (i < target) lo = i + 1;
            else hi = i - 1;
        }
        return nums[target];
    }
}

class Demo {
    public static void main(String[] args) {
        Solution solution = new Solution();
        System.out.println(solution.findKthLargest(new int[]{${safeNums.join(', ')}}, ${safeK}));
    }
}`;
  if (language === 'csharp') return `using System;

public class Solution {
    public int FindKthLargest(int[] nums, int k) {
        int target = nums.Length - k;
        int lo = 0, hi = nums.Length - 1;
        while (lo <= hi) {
            int pivot = nums[hi];
            int i = lo;
            for (int j = lo; j < hi; j++) {
                if (nums[j] <= pivot) {
                    int tmp = nums[i]; nums[i] = nums[j]; nums[j] = tmp;
                    i++;
                }
            }
            int temp = nums[i]; nums[i] = nums[hi]; nums[hi] = temp;
            if (i == target) return nums[i];
            if (i < target) lo = i + 1;
            else hi = i - 1;
        }
        return nums[target];
    }
}

public class Demo {
    public static void Main() {
        var solution = new Solution();
        Console.WriteLine(solution.FindKthLargest(new int[] {${safeNums.join(', ')}}, ${safeK}));
    }
}`;
  if (language === 'python') return `import random

# QuickSelect — O(n) average
def findKthLargest(nums, k):
    target = len(nums) - k
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        pivot, i = nums[hi], lo
        for j in range(lo, hi):
            if nums[j] <= pivot:
                nums[i], nums[j] = nums[j], nums[i]
                i += 1
        nums[i], nums[hi] = nums[hi], nums[i]
        if i == target: return nums[i]
        elif i < target: lo = i + 1
        else: hi = i - 1
    return nums[target]

print(findKthLargest([${safeNums.join(', ')}], ${safeK}))`;
  return `// QuickSelect — O(n) average
function findKthLargest(nums, k) {
    const target = nums.length - k;
    let lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        const pivot = nums[hi];
        let i = lo;
        for (let j = lo; j < hi; j++)
            if (nums[j] <= pivot) [nums[i++], nums[j]] = [nums[j], nums[i]];
        [nums[i], nums[hi]] = [nums[hi], nums[i]];
        if (i === target) return nums[i];
        else if (i < target) lo = i + 1;
        else hi = i - 1;
    }
    return nums[target];
}
console.log(findKthLargest([${safeNums.join(', ')}], ${safeK}));`;
};
