import { Language } from '../../types';

export const generateMergeIntervalsCode = (language: Language): string => {
  if (language === 'cpp') return `#include <vector>
#include <algorithm>
using namespace std;

vector<vector<int>> merge(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> merged = {intervals[0]};
    for (int i = 1; i < intervals.size(); i++) {
        if (intervals[i][0] <= merged.back()[1])
            merged.back()[1] = max(merged.back()[1], intervals[i][1]);
        else
            merged.push_back(intervals[i]);
    }
    return merged;
}`;
  if (language === 'java') return `import java.util.*;

class Solution {
    public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, Comparator.comparingInt(a -> a[0]));
        List<int[]> merged = new ArrayList<>();
        merged.add(intervals[0]);
        for (int i = 1; i < intervals.length; i++) {
            int[] last = merged.get(merged.size() - 1);
            if (intervals[i][0] <= last[1]) {
                last[1] = Math.max(last[1], intervals[i][1]);
            } else {
                merged.add(intervals[i]);
            }
        }
        return merged.toArray(new int[merged.size()][]);
    }
}

class Demo {
    public static void main(String[] args) {
        Solution solution = new Solution();
        int[][] result = solution.merge(new int[][]{{1,3},{2,6},{8,10},{15,18}});
        System.out.println(Arrays.deepToString(result));
    }
}`;
  if (language === 'csharp') return `using System;
using System.Collections.Generic;

public class Solution {
    public int[][] Merge(int[][] intervals) {
        Array.Sort(intervals, (a, b) => a[0].CompareTo(b[0]));
        var merged = new List<int[]> { intervals[0] };
        for (int i = 1; i < intervals.Length; i++) {
            int[] last = merged[merged.Count - 1];
            if (intervals[i][0] <= last[1]) {
                last[1] = Math.Max(last[1], intervals[i][1]);
            } else {
                merged.Add(intervals[i]);
            }
        }
        return merged.ToArray();
    }
}

public class Demo {
    public static void Main() {
        var solution = new Solution();
        var result = solution.Merge(new int[][]{
            new int[]{1,3}, new int[]{2,6}, new int[]{8,10}, new int[]{15,18}
        });
        Console.WriteLine(string.Join(" | ", Array.ConvertAll(result, x => $"[{x[0]},{x[1]}]")));
    }
}`;
  if (language === 'python') return `def merge(intervals):
    intervals.sort()
    merged = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged

print(merge([[1,3],[2,6],[8,10],[15,18]]))`;
  return `function merge(intervals) {
    intervals.sort((a, b) => a[0] - b[0]);
    const merged = [intervals[0]];
    for (let i = 1; i < intervals.length; i++) {
        const last = merged[merged.length - 1];
        if (intervals[i][0] <= last[1])
            last[1] = Math.max(last[1], intervals[i][1]);
        else
            merged.push([...intervals[i]]);
    }
    return merged;
}
console.log(merge([[1,3],[2,6],[8,10],[15,18]]));`;
};
