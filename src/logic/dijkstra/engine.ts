export interface DijkstraStep {
  type: 'init' | 'visit' | 'relax' | 'complete';
  graph: { nodes: number; edges: [number, number, number][] };
  distances: number[];
  visited: boolean[];
  current: number;
  parent: number[];
  pqSize: number;
  explanation: string;
  highlightLine: number;
  activeEdge?: [number, number];
}

export class DijkstraEngine {
  solve(nodes: number, edges: [number, number, number][], source: number): DijkstraStep[] {
    const steps: DijkstraStep[] = [];
    const adj: [number, number][][] = Array.from({ length: nodes }, () => []);
    for (const [u, v, w] of edges) {
      adj[u].push([v, w]);
      adj[v].push([u, w]);
    }

    const dist = new Array(nodes).fill(Infinity);
    const visited = new Array(nodes).fill(false);
    const parent = new Array(nodes).fill(-1);
    dist[source] = 0;

    // Simple priority queue via array
    const pq: [number, number][] = [[0, source]]; // [dist, node]

    steps.push({
      type: 'init',
      graph: { nodes, edges },
      distances: [...dist],
      visited: [...visited],
      current: source,
      parent: [...parent],
      pqSize: 1,
      explanation: `Initialize: Set dist[${source}] = 0, all others = ∞. Push source into priority queue.`,
      highlightLine: 1,
    });

    while (pq.length > 0) {
      pq.sort((a, b) => a[0] - b[0]);
      const [d, u] = pq.shift()!;

      if (visited[u]) continue;
      visited[u] = true;

      steps.push({
        type: 'visit',
        graph: { nodes, edges },
        distances: [...dist],
        visited: [...visited],
        current: u,
        parent: [...parent],
        pqSize: pq.length,
        explanation: `Visit node ${u} with distance ${d}. Mark as visited.`,
        highlightLine: 5,
      });

      for (const [v, w] of adj[u]) {
        if (!visited[v] && dist[u] + w < dist[v]) {
          dist[v] = dist[u] + w;
          parent[v] = u;
          pq.push([dist[v], v]);

          steps.push({
            type: 'relax',
            graph: { nodes, edges },
            distances: [...dist],
            visited: [...visited],
            current: u,
            parent: [...parent],
            pqSize: pq.length,
            explanation: `Relax edge ${u}→${v}: dist[${v}] = ${dist[v]} (via ${u}, weight ${w})`,
            highlightLine: 9,
            activeEdge: [u, v],
          });
        }
      }
    }

    steps.push({
      type: 'complete',
      graph: { nodes, edges },
      distances: [...dist],
      visited: [...visited],
      current: -1,
      parent: [...parent],
      pqSize: 0,
      explanation: `Dijkstra complete! Shortest distances from node ${source}: [${dist.map((d, i) => `${i}:${d === Infinity ? '∞' : d}`).join(', ')}]`,
      highlightLine: 14,
    });

    return steps;
  }

  static generate(type: 'simple' | 'dense' | 'sparse' | 'grid'): { nodes: number; edges: [number, number, number][]; source: number } {
    switch (type) {
      case 'simple':
        return {
          nodes: 6,
          edges: [[0,1,4],[0,2,1],[1,3,1],[2,1,2],[2,3,5],[3,4,3],[4,5,1],[2,4,8]],
          source: 0,
        };
      case 'dense':
        return {
          nodes: 5,
          edges: [[0,1,2],[0,2,4],[0,3,1],[1,2,3],[1,3,5],[1,4,2],[2,3,1],[2,4,6],[3,4,4]],
          source: 0,
        };
      case 'sparse':
        return {
          nodes: 7,
          edges: [[0,1,3],[1,2,2],[2,3,4],[3,4,1],[4,5,6],[5,6,2],[0,6,15]],
          source: 0,
        };
      default:
        return {
          nodes: 6,
          edges: [[0,1,2],[0,2,5],[1,3,4],[2,3,1],[2,4,6],[3,5,3],[4,5,2]],
          source: 0,
        };
    }
  }
}
