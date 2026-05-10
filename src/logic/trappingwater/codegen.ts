import { Language } from '../../types';
import { ApproachType } from './engine';

const cppCode: Record<ApproachType, string> = {
  bruteforce: `#include <vector>
#include <algorithm>
using namespace std;

int trap(vector<int>& height) {
    int n = height.size(), totalWater = 0;
    for (int i = 0; i < n; i++) {
        int leftMax = 0, rightMax = 0;
        for (int j = 0; j <= i; j++) leftMax = max(leftMax, height[j]);
        for (int j = i; j < n; j++) rightMax = max(rightMax, height[j]);
        totalWater += min(leftMax, rightMax) - height[i];
    }
    return totalWater;
}`,
  dp: `#include <vector>
#include <algorithm>
using namespace std;

int trap(vector<int>& height) {
    int n = height.size();
    if (n == 0) return 0;
    vector<int> leftMax(n), rightMax(n);
    leftMax[0] = height[0];
    for (int i = 1; i < n; i++) leftMax[i] = max(leftMax[i-1], height[i]);
    rightMax[n-1] = height[n-1];
    for (int i = n-2; i >= 0; i--) rightMax[i] = max(rightMax[i+1], height[i]);
    int totalWater = 0;
    for (int i = 0; i < n; i++) totalWater += min(leftMax[i], rightMax[i]) - height[i];
    return totalWater;
}`,
  twopointer: `#include <vector>
#include <algorithm>
using namespace std;

int trap(vector<int>& height) {
    int left = 0, right = height.size() - 1;
    int leftMax = 0, rightMax = 0, totalWater = 0;
    while (left < right) {
        if (height[left] < height[right]) {
            height[left] >= leftMax ? leftMax = height[left] : totalWater += leftMax - height[left];
            left++;
        } else {
            height[right] >= rightMax ? rightMax = height[right] : totalWater += rightMax - height[right];
            right--;
        }
    }
    return totalWater;
}`,
  stack: `#include <vector>
#include <stack>
#include <algorithm>
using namespace std;

int trap(vector<int>& height) {
    stack<int> st;
    int totalWater = 0;
    for (int i = 0; i < height.size(); i++) {
        while (!st.empty() && height[i] > height[st.top()]) {
            int top = st.top(); st.pop();
            if (st.empty()) break;
            int w = i - st.top() - 1;
            int h = min(height[st.top()], height[i]) - height[top];
            totalWater += w * h;
        }
        st.push(i);
    }
    return totalWater;
}`,
};

const pyCode: Record<ApproachType, string> = {
  bruteforce: `def trap(height):
    n = len(height)
    total = 0
    for i in range(n):
        left_max = max(height[:i+1])
        right_max = max(height[i:])
        total += min(left_max, right_max) - height[i]
    return total

print(trap([0,1,0,2,1,0,1,3,2,1,2,1]))  # 6`,
  dp: `def trap(height):
    n = len(height)
    if n == 0: return 0
    left_max, right_max = [0]*n, [0]*n
    left_max[0] = height[0]
    for i in range(1, n): left_max[i] = max(left_max[i-1], height[i])
    right_max[n-1] = height[n-1]
    for i in range(n-2, -1, -1): right_max[i] = max(right_max[i+1], height[i])
    return sum(min(left_max[i], right_max[i]) - height[i] for i in range(n))

print(trap([0,1,0,2,1,0,1,3,2,1,2,1]))  # 6`,
  twopointer: `def trap(height):
    left, right = 0, len(height) - 1
    left_max = right_max = total = 0
    while left < right:
        if height[left] < height[right]:
            if height[left] >= left_max: left_max = height[left]
            else: total += left_max - height[left]
            left += 1
        else:
            if height[right] >= right_max: right_max = height[right]
            else: total += right_max - height[right]
            right -= 1
    return total

print(trap([0,1,0,2,1,0,1,3,2,1,2,1]))  # 6`,
  stack: `def trap(height):
    stack, total = [], 0
    for i in range(len(height)):
        while stack and height[i] > height[stack[-1]]:
            top = stack.pop()
            if not stack: break
            w = i - stack[-1] - 1
            h = min(height[stack[-1]], height[i]) - height[top]
            total += w * h
        stack.append(i)
    return total

print(trap([0,1,0,2,1,0,1,3,2,1,2,1]))  # 6`,
};

const jsCode: Record<ApproachType, string> = {
  bruteforce: `function trap(height) {
    const n = height.length;
    let total = 0;
    for (let i = 0; i < n; i++) {
        let leftMax = 0, rightMax = 0;
        for (let j = 0; j <= i; j++) leftMax = Math.max(leftMax, height[j]);
        for (let j = i; j < n; j++) rightMax = Math.max(rightMax, height[j]);
        total += Math.min(leftMax, rightMax) - height[i];
    }
    return total;
}
console.log(trap([0,1,0,2,1,0,1,3,2,1,2,1])); // 6`,
  dp: `function trap(height) {
    const n = height.length;
    if (n === 0) return 0;
    const leftMax = new Array(n), rightMax = new Array(n);
    leftMax[0] = height[0];
    for (let i = 1; i < n; i++) leftMax[i] = Math.max(leftMax[i-1], height[i]);
    rightMax[n-1] = height[n-1];
    for (let i = n-2; i >= 0; i--) rightMax[i] = Math.max(rightMax[i+1], height[i]);
    let total = 0;
    for (let i = 0; i < n; i++) total += Math.min(leftMax[i], rightMax[i]) - height[i];
    return total;
}
console.log(trap([0,1,0,2,1,0,1,3,2,1,2,1])); // 6`,
  twopointer: `function trap(height) {
    let left = 0, right = height.length - 1;
    let leftMax = 0, rightMax = 0, total = 0;
    while (left < right) {
        if (height[left] < height[right]) {
            height[left] >= leftMax ? leftMax = height[left] : total += leftMax - height[left];
            left++;
        } else {
            height[right] >= rightMax ? rightMax = height[right] : total += rightMax - height[right];
            right--;
        }
    }
    return total;
}
console.log(trap([0,1,0,2,1,0,1,3,2,1,2,1])); // 6`,
  stack: `function trap(height) {
    const stack = [];
    let total = 0;
    for (let i = 0; i < height.length; i++) {
        while (stack.length && height[i] > height[stack[stack.length-1]]) {
            const top = stack.pop();
            if (!stack.length) break;
            const w = i - stack[stack.length-1] - 1;
            const h = Math.min(height[stack[stack.length-1]], height[i]) - height[top];
            total += w * h;
        }
        stack.push(i);
    }
    return total;
}
console.log(trap([0,1,0,2,1,0,1,3,2,1,2,1])); // 6`,
};

export const generateTrappingWaterCode = (approach: ApproachType, language: Language): string => {
  if (language === 'cpp') return cppCode[approach] ?? '';
  if (language === 'python') return pyCode[approach] ?? '';
  return jsCode[approach] ?? '';
};
