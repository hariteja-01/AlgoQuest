import { Language } from '../../types';

export const generateDijkstraCode = (
    nodes: number,
    edges: [number, number, number][],
    source: number,
    language: Language,
): string => {
    const edgeList = edges.length > 0 ? edges : [[0, 1, 2]];
    const cppEdges = edgeList
        .map(([u, v, w]) => `    adj[${u}].push_back({${v}, ${w}});\n    adj[${v}].push_back({${u}, ${w}});`)
        .join('\n');
    const javaEdges = edgeList
        .map(([u, v, w]) => `adj.get(${u}).add(new int[]{${v}, ${w}});\n        adj.get(${v}).add(new int[]{${u}, ${w}});`)
        .join('\n        ');
    const csharpEdges = edgeList
        .map(([u, v, w]) => `adj[${u}].Add((${v}, ${w}));\n        adj[${v}].Add((${u}, ${w}));`)
        .join('\n        ');
    const pyEdges = edgeList
        .map(([u, v, w]) => `adj[${u}].append((${v}, ${w}))\n    adj[${v}].append((${u}, ${w}))`)
        .join('\n    ');
    const jsEdges = edgeList
        .map(([u, v, w]) => `adj[${u}].push([${v}, ${w}]);\n    adj[${v}].push([${u}, ${w}]);`)
        .join('\n    ');
  if (language === 'cpp') return `#include <vector>
#include <queue>
#include <limits>
using namespace std;

// Dijkstra's Algorithm — O((V+E) log V)
vector<int> dijkstra(int n, vector<vector<pair<int,int>>>& adj, int src) {
    vector<int> dist(n, INT_MAX);
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    dist[src] = 0;
    pq.push({0, src});

    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;  // stale entry

        for (auto [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}

int main() {
    int n = ${nodes};
    vector<vector<pair<int,int>>> adj(n);
${cppEdges}
    auto dist = dijkstra(n, adj, ${source});
    return 0;
}`;
  if (language === 'java') return `import java.util.*;

class Solution {
    public int[] dijkstra(int n, List<List<int[]>> adj, int src) {
        int[] dist = new int[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[src] = 0;
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        pq.offer(new int[]{0, src});

        while (!pq.isEmpty()) {
            int[] current = pq.poll();
            int d = current[0];
            int u = current[1];
            if (d > dist[u]) continue;
            for (int[] edge : adj.get(u)) {
                int v = edge[0];
                int w = edge[1];
                if (dist[u] != Integer.MAX_VALUE && dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    pq.offer(new int[]{dist[v], v});
                }
            }
        }
        return dist;
    }
}

class Demo {
    public static void main(String[] args) {
        int n = ${nodes};
        List<List<int[]>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        ${javaEdges}

        Solution solution = new Solution();
        System.out.println(Arrays.toString(solution.dijkstra(n, adj, ${source})));
    }
}`;
  if (language === 'csharp') return `using System;
using System.Collections.Generic;

public class Solution {
    public int[] Dijkstra(int n, List<List<(int v, int w)>> adj, int src) {
        int[] dist = new int[n];
        for (int i = 0; i < n; i++) dist[i] = int.MaxValue;
        dist[src] = 0;
        var pq = new PriorityQueue<(int node, int dist), int>();
        pq.Enqueue((src, 0), 0);

        while (pq.Count > 0) {
            var (u, d) = pq.Dequeue();
            if (d > dist[u]) continue;
            foreach (var (v, w) in adj[u]) {
                if (dist[u] != int.MaxValue && dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    pq.Enqueue((v, dist[v]), dist[v]);
                }
            }
        }
        return dist;
    }
}

public class Demo {
    public static void Main() {
        int n = ${nodes};
        var adj = new List<List<(int, int)>>();
        for (int i = 0; i < n; i++) adj.Add(new List<(int, int)>());
        ${csharpEdges}

        var solution = new Solution();
        Console.WriteLine(string.Join(",", solution.Dijkstra(n, adj, ${source})));
    }
}`;
  if (language === 'python') return `import heapq

def dijkstra(n, adj, src):
    dist = [float('inf')] * n
    dist[src] = 0
    pq = [(0, src)]

    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue  # stale entry

        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(pq, (dist[v], v))

    return dist

# Example
adj = [[] for _ in range(${nodes})]
${pyEdges}
print(dijkstra(${nodes}, adj, ${source}))`;
  return `// Dijkstra's Algorithm — O((V+E) log V)
function dijkstra(n, adj, src) {
    const dist = new Array(n).fill(Infinity);
    dist[src] = 0;
    // Min-heap: [distance, node]
    const pq = [[0, src]];

    while (pq.length > 0) {
        pq.sort((a, b) => a[0] - b[0]);
        const [d, u] = pq.shift();
        if (d > dist[u]) continue;

        for (const [v, w] of adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push([dist[v], v]);
            }
        }
    }
    return dist;
}

const adj = Array.from({length: ${nodes}}, () => []);
${jsEdges}
console.log(dijkstra(${nodes}, adj, ${source}));`;
};
