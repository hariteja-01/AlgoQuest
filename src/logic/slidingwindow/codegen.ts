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
  if (language === 'java') return `import java.util.*;

class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        Deque<Integer> dq = new ArrayDeque<>();
        int[] result = new int[nums.length - k + 1];
        int idx = 0;
        for (int i = 0; i < nums.length; i++) {
            while (!dq.isEmpty() && dq.peekFirst() < i - k + 1) dq.pollFirst();
            while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[i]) dq.pollLast();
            dq.offerLast(i);
            if (i >= k - 1) result[idx++] = nums[dq.peekFirst()];
        }
        return result;
    }
}

class Demo {
    public static void main(String[] args) {
        Solution solution = new Solution();
        System.out.println(Arrays.toString(solution.maxSlidingWindow(new int[]{1,3,-1,-3,5,3,6,7}, 3)));
    }
}`;
  if (language === 'csharp') return `using System;
using System.Collections.Generic;

public class Solution {
    public int[] MaxSlidingWindow(int[] nums, int k) {
        var dq = new LinkedList<int>();
        var result = new int[nums.Length - k + 1];
        int idx = 0;
        for (int i = 0; i < nums.Length; i++) {
            if (dq.Count > 0 && dq.First.Value < i - k + 1) dq.RemoveFirst();
            while (dq.Count > 0 && nums[dq.Last.Value] <= nums[i]) dq.RemoveLast();
            dq.AddLast(i);
            if (i >= k - 1) result[idx++] = nums[dq.First.Value];
        }
        return result;
    }
}

public class Demo {
    public static void Main() {
        var solution = new Solution();
        Console.WriteLine(string.Join(",", solution.MaxSlidingWindow(new int[]{1,3,-1,-3,5,3,6,7}, 3)));
    }
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
