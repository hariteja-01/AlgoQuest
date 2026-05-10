export interface CourseStep {
  type: 'init' | 'enqueue' | 'process' | 'cycle' | 'complete';
  numCourses: number;
  prerequisites: number[][];
  inDegree: number[];
  queue: number[];
  order: number[];
  processed: number;
  hasCycle: boolean;
  explanation: string;
  highlightLine: number;
  activeEdges: [number, number][];
}

export class CourseScheduleEngine {
  solve(numCourses: number, prerequisites: number[][]): CourseStep[] {
    const steps: CourseStep[] = [];
    const adj: number[][] = Array.from({ length: numCourses }, () => []);
    const inDeg = new Array(numCourses).fill(0);

    for (const [a, b] of prerequisites) {
      adj[b].push(a);
      inDeg[a]++;
    }

    steps.push({
      type: 'init', numCourses, prerequisites,
      inDegree: [...inDeg], queue: [], order: [], processed: 0,
      hasCycle: false, activeEdges: [],
      explanation: `${numCourses} courses, ${prerequisites.length} prerequisites. Built adjacency list and in-degree array.`,
      highlightLine: 1,
    });

    const queue: number[] = [];
    for (let i = 0; i < numCourses; i++) {
      if (inDeg[i] === 0) queue.push(i);
    }

    steps.push({
      type: 'enqueue', numCourses, prerequisites,
      inDegree: [...inDeg], queue: [...queue], order: [], processed: 0,
      hasCycle: false, activeEdges: [],
      explanation: `Enqueued ${queue.length} course(s) with in-degree 0: [${queue.join(', ')}]`,
      highlightLine: 5,
    });

    const order: number[] = [];
    let idx = 0;

    while (idx < queue.length) {
      const node = queue[idx++];
      order.push(node);
      const edges: [number, number][] = [];

      for (const neighbor of adj[node]) {
        inDeg[neighbor]--;
        edges.push([node, neighbor]);
        if (inDeg[neighbor] === 0) queue.push(neighbor);
      }

      steps.push({
        type: 'process', numCourses, prerequisites,
        inDegree: [...inDeg], queue: queue.slice(idx), order: [...order],
        processed: order.length, hasCycle: false, activeEdges: edges,
        explanation: `Processed course ${node}. Updated neighbors: [${adj[node].join(', ')}]. Order: [${order.join(' → ')}]`,
        highlightLine: 9,
      });
    }

    const hasCycle = order.length !== numCourses;
    steps.push({
      type: hasCycle ? 'cycle' : 'complete', numCourses, prerequisites,
      inDegree: [...inDeg], queue: [], order: [...order],
      processed: order.length, hasCycle, activeEdges: [],
      explanation: hasCycle
        ? `Cycle detected! Only ${order.length}/${numCourses} courses processed. Cannot finish all courses.`
        : `All ${numCourses} courses scheduled! Topological order: [${order.join(' → ')}]`,
      highlightLine: 13,
    });

    return steps;
  }

  static generate(type: 'linear' | 'tree' | 'cycle' | 'random', n = 6): { numCourses: number; prerequisites: number[][] } {
    const prereqs: number[][] = [];
    switch (type) {
      case 'linear':
        for (let i = 1; i < n; i++) prereqs.push([i, i - 1]);
        return { numCourses: n, prerequisites: prereqs };
      case 'tree':
        for (let i = 1; i < n; i++) prereqs.push([i, Math.floor((i - 1) / 2)]);
        return { numCourses: n, prerequisites: prereqs };
      case 'cycle':
        for (let i = 0; i < n; i++) prereqs.push([(i + 1) % n, i]);
        return { numCourses: n, prerequisites: prereqs };
      default:
        for (let i = 1; i < n; i++) {
          if (Math.random() < 0.6) prereqs.push([i, Math.floor(Math.random() * i)]);
        }
        return { numCourses: n, prerequisites: prereqs };
    }
  }
}
