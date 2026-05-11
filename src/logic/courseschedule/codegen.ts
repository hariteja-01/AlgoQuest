import { Language } from '../../types';

export const generateCourseScheduleCode = (
    numCourses: number,
    prerequisites: number[][],
    language: Language,
): string => {
    const prereqList = prerequisites.length > 0 ? prerequisites : [[1, 0]];
    const cppPrereq = prereqList.map(([a, b]) => `{${a}, ${b}}`).join(', ');
    const javaPrereq = prereqList.map(([a, b]) => `{${a},${b}}`).join(',');
    const csharpPrereq = prereqList.map(([a, b]) => `new int[]{${a},${b}}`).join(', ');
    const pyPrereq = prereqList.map(([a, b]) => `[${a}, ${b}]`).join(', ');
    const jsPrereq = pyPrereq;
  if (language === 'cpp') return `#include <vector>
#include <queue>
using namespace std;

// Kahn's Algorithm — Topological Sort via BFS
bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>> adj(numCourses);
    vector<int> inDeg(numCourses, 0);
    for (auto& p : prerequisites) {
        adj[p[1]].push_back(p[0]);
        inDeg[p[0]]++;
    }
    queue<int> q;
    for (int i = 0; i < numCourses; i++)
        if (inDeg[i] == 0) q.push(i);
    int count = 0;
    while (!q.empty()) {
        int node = q.front(); q.pop();
        count++;
        for (int nb : adj[node])
            if (--inDeg[nb] == 0) q.push(nb);
    }
    return count == numCourses;
}

int main() {
    int numCourses = ${numCourses};
    vector<vector<int>> prerequisites = {${cppPrereq}};
    bool result = canFinish(numCourses, prerequisites);
    return 0;
}`;
  if (language === 'java') return `import java.util.*;

class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
        int[] inDeg = new int[numCourses];
        for (int[] p : prerequisites) {
            adj.get(p[1]).add(p[0]);
            inDeg[p[0]]++;
        }
        Queue<Integer> queue = new ArrayDeque<>();
        for (int i = 0; i < numCourses; i++) {
            if (inDeg[i] == 0) queue.add(i);
        }
        int count = 0;
        while (!queue.isEmpty()) {
            int node = queue.poll();
            count++;
            for (int nb : adj.get(node)) {
                if (--inDeg[nb] == 0) queue.add(nb);
            }
        }
        return count == numCourses;
    }
}

class Demo {
    public static void main(String[] args) {
        Solution solution = new Solution();
        System.out.println(solution.canFinish(${numCourses}, new int[][]{${javaPrereq}}));
    }
}`;
  if (language === 'csharp') return `using System;
using System.Collections.Generic;

public class Solution {
    public bool CanFinish(int numCourses, int[][] prerequisites) {
        var adj = new List<int>[numCourses];
        for (int i = 0; i < numCourses; i++) adj[i] = new List<int>();
        var inDeg = new int[numCourses];
        foreach (var p in prerequisites) {
            adj[p[1]].Add(p[0]);
            inDeg[p[0]]++;
        }
        var queue = new Queue<int>();
        for (int i = 0; i < numCourses; i++) if (inDeg[i] == 0) queue.Enqueue(i);
        int count = 0;
        while (queue.Count > 0) {
            int node = queue.Dequeue();
            count++;
            foreach (int nb in adj[node]) {
                if (--inDeg[nb] == 0) queue.Enqueue(nb);
            }
        }
        return count == numCourses;
    }
}

public class Demo {
    public static void Main() {
        var solution = new Solution();
        Console.WriteLine(solution.CanFinish(${numCourses}, new int[][]{ ${csharpPrereq} }));
    }
}`;
  if (language === 'python') return `from collections import deque

def canFinish(numCourses, prerequisites):
    adj = [[] for _ in range(numCourses)]
    in_deg = [0] * numCourses
    for a, b in prerequisites:
        adj[b].append(a)
        in_deg[a] += 1
    queue = deque(i for i in range(numCourses) if in_deg[i] == 0)
    count = 0
    while queue:
        node = queue.popleft()
        count += 1
        for nb in adj[node]:
            in_deg[nb] -= 1
            if in_deg[nb] == 0:
                queue.append(nb)
    return count == numCourses

print(canFinish(${numCourses}, [${pyPrereq}]))`;
  return `function canFinish(numCourses, prerequisites) {
    const adj = Array.from({length: numCourses}, () => []);
    const inDeg = new Array(numCourses).fill(0);
    for (const [a, b] of prerequisites) {
        adj[b].push(a);
        inDeg[a]++;
    }
    const queue = [];
    for (let i = 0; i < numCourses; i++)
        if (inDeg[i] === 0) queue.push(i);
    let count = 0, idx = 0;
    while (idx < queue.length) {
        const node = queue[idx++];
        count++;
        for (const nb of adj[node])
            if (--inDeg[nb] === 0) queue.push(nb);
    }
    return count === numCourses;
}
console.log(canFinish(${numCourses}, [${jsPrereq}]));`;
};
