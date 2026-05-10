import { Language } from '../../types';

export const generateSlidingWindowCode = (language: Language): string => {
  if (language === 'cpp') return `#include <vector>
#include <deque>
using namespace std;

vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    deque<int> dq;
    vector<int> result;
    for (int i = 0; i < nums.size(); i++) {
        while (!dq.empty() && dq.front() < i-k+1) dq.pop_front();
        while (!dq.empty() && nums[dq.back()] <= nums[i]) dq.pop_back();
        dq.push_back(i);
        if (i >= k-1) result.push_back(nums[dq.front()]);
    }
    return result;
}`;
  if (language === 'python') return `from collections import deque

def maxSlidingWindow(nums, k):
    dq = deque()
    result = []
    for i in range(len(nums)):
        while dq and dq[0] < i - k + 1:
            dq.popleft()
        while dq and nums[dq[-1]] <= nums[i]:
            dq.pop()
        dq.append(i)
        if i >= k - 1:
            result.append(nums[dq[0]])
    return result

print(maxSlidingWindow([1,3,-1,-3,5,3,6,7], 3))`;
  return `function maxSlidingWindow(nums, k) {
    const dq = [];
    const result = [];
    let front = 0;
    for (let i = 0; i < nums.length; i++) {
        while (front < dq.length && dq[front] < i-k+1) front++;
        while (dq.length > front && nums[dq[dq.length-1]] <= nums[i]) dq.pop();
        dq.push(i);
        if (i >= k-1) result.push(nums[dq[front]]);
    }
    return result;
}
console.log(maxSlidingWindow([1,3,-1,-3,5,3,6,7], 3));`;
};
