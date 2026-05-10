import { Language } from '../../types';

export const generateKthLargestCode = (language: Language): string => {
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

print(findKthLargest([3,2,1,5,6,4], 2))  # 5`;
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
console.log(findKthLargest([3,2,1,5,6,4], 2)); // 5`;
};
