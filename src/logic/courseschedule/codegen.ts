import { Language } from '../../types';

export const generateCourseScheduleCode = (language: Language): string => {
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

print(canFinish(4, [[1,0],[2,1],[3,2]]))  # True`;
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
console.log(canFinish(4, [[1,0],[2,1],[3,2]])); // true`;
};
