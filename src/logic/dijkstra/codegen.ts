import { Language } from '../../types';

export const generateDijkstraCode = (language: Language): string => {
  if (language === 'cpp') return `#include <vector>
#include <queue>
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
adj = [[(1,4),(2,1)], [(3,1)], [(1,2),(3,5)], [(4,3)], [(5,1)], []]
print(dijkstra(6, adj, 0))`;
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
}`;
};
