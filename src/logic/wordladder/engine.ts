export interface LadderGraphNode {
  word: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface LadderGraphEdge {
  source: string;
  target: string;
}

export interface LadderGraph {
  nodes: LadderGraphNode[];
  edges: LadderGraphEdge[];
  adjacency: Map<string, string[]>;
}

export interface LadderSearchResult {
  path: string[];
  layers: string[][];
  deadEnds: string[];
  visited: string[];
  meetingWord: string | null;
  startFrontiers: string[][];
  endFrontiers: string[][];
}

export const normalizeWord = (word: string) => word.trim().toLowerCase().replace(/[^a-z]/g, '');

export const differsByOne = (left: string, right: string) => {
  if (left.length !== right.length) return false;

  let differences = 0;
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) {
      differences += 1;
      if (differences > 1) return false;
    }
  }

  return differences === 1;
};

export const prepareDictionary = (startWord: string, endWord: string, words: string[]) => {
  const start = normalizeWord(startWord);
  const end = normalizeWord(endWord);
  const targetLength = start.length || end.length;

  const prepared = new Set<string>();

  words.forEach((word) => {
    const normalized = normalizeWord(word);
    if (normalized.length === targetLength && normalized) {
      prepared.add(normalized);
    }
  });

  if (start.length === targetLength && start) prepared.add(start);
  if (end.length === targetLength && end) prepared.add(end);

  return Array.from(prepared);
};

export const buildGraph = (words: string[]): LadderGraph => {
  const nodes = words.map((word, index) => {
    const angle = (index / Math.max(words.length, 1)) * Math.PI * 2;
    const radius = 120 + ((index * 37) % 140);

    return {
      word,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      vx: 0,
      vy: 0,
    } satisfies LadderGraphNode;
  });

  const adjacency = new Map<string, string[]>();
  const edges: LadderGraphEdge[] = [];

  words.forEach((word) => adjacency.set(word, []));

  for (let left = 0; left < words.length; left += 1) {
    for (let right = left + 1; right < words.length; right += 1) {
      if (differsByOne(words[left], words[right])) {
        edges.push({ source: words[left], target: words[right] });
        adjacency.get(words[left])?.push(words[right]);
        adjacency.get(words[right])?.push(words[left]);
      }
    }
  }

  return { nodes, edges, adjacency };
};

export const bfsWordLadder = (startWord: string, endWord: string, words: string[]): LadderSearchResult => {
  const start = normalizeWord(startWord);
  const end = normalizeWord(endWord);

  if (!start || !end) {
    return {
      path: [],
      layers: [],
      deadEnds: [],
      visited: [],
      meetingWord: null,
      startFrontiers: [],
      endFrontiers: [],
    };
  }

  const prepared = prepareDictionary(start, end, words);
  const graph = buildGraph(prepared);

  const queue: string[] = [start];
  const parents = new Map<string, string | null>([[start, null]]);
  const visited = new Set<string>([start]);
  const layers: string[][] = [];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLayer: string[] = [];

    for (let index = 0; index < levelSize; index += 1) {
      const current = queue.shift() as string;
      currentLayer.push(current);

      const neighbors = graph.adjacency.get(current) ?? [];
      neighbors.forEach((neighbor) => {
        if (visited.has(neighbor)) return;
        visited.add(neighbor);
        parents.set(neighbor, current);
        queue.push(neighbor);
      });

      if (current === end) {
        queue.length = 0;
        break;
      }
    }

    layers.push(currentLayer);
  }

  const path: string[] = [];
  if (parents.has(end)) {
    let cursor: string | null = end;
    while (cursor) {
      path.unshift(cursor);
      cursor = parents.get(cursor) ?? null;
    }
  }

  const deadEnds = Array.from(visited).filter((word) => !path.includes(word));

  return {
    path,
    layers,
    deadEnds,
    visited: Array.from(visited),
    meetingWord: null,
    startFrontiers: layers,
    endFrontiers: [],
  };
};

export const bidirectionalWordLadder = (startWord: string, endWord: string, words: string[]): LadderSearchResult => {
  const start = normalizeWord(startWord);
  const end = normalizeWord(endWord);

  if (!start || !end) {
    return {
      path: [],
      layers: [],
      deadEnds: [],
      visited: [],
      meetingWord: null,
      startFrontiers: [],
      endFrontiers: [],
    };
  }

  const prepared = prepareDictionary(start, end, words);
  const graph = buildGraph(prepared);

  let front = new Set<string>([start]);
  let back = new Set<string>([end]);
  const parentsFromStart = new Map<string, string | null>([[start, null]]);
  const parentsFromEnd = new Map<string, string | null>([[end, null]]);
  const visitedFromStart = new Set<string>([start]);
  const visitedFromEnd = new Set<string>([end]);
  const startFrontiers: string[][] = [[start]];
  const endFrontiers: string[][] = [[end]];
  let meetingWord: string | null = null;

  const expand = (
    currentFrontier: Set<string>,
    visited: Set<string>,
    oppositeVisited: Set<string>,
    parents: Map<string, string | null>
  ) => {
    const next = new Set<string>();

    for (const word of currentFrontier) {
      const neighbors = graph.adjacency.get(word) ?? [];
      for (const neighbor of neighbors) {
        if (visited.has(neighbor)) continue;

        visited.add(neighbor);
        parents.set(neighbor, word);
        next.add(neighbor);

        if (oppositeVisited.has(neighbor)) {
          meetingWord = neighbor;
        }
      }
    }

    return next;
  };

  while (front.size > 0 && back.size > 0 && !meetingWord) {
    if (front.size <= back.size) {
      front = expand(front, visitedFromStart, visitedFromEnd, parentsFromStart);
      if (front.size > 0) startFrontiers.push(Array.from(front));
    } else {
      back = expand(back, visitedFromEnd, visitedFromStart, parentsFromEnd);
      if (back.size > 0) endFrontiers.push(Array.from(back));
    }
  }

  const path: string[] = [];
  if (meetingWord) {
    const forward: string[] = [];
    let cursor: string | null = meetingWord;

    while (cursor) {
      forward.unshift(cursor);
      cursor = parentsFromStart.get(cursor) ?? null;
    }

    const backward: string[] = [];
    cursor = parentsFromEnd.get(meetingWord) ?? null;
    while (cursor) {
      backward.push(cursor);
      cursor = parentsFromEnd.get(cursor) ?? null;
    }

    path.push(...forward, ...backward);
  }

  const visited = Array.from(new Set([...visitedFromStart, ...visitedFromEnd]));
  const deadEnds = visited.filter((word) => !path.includes(word));

  return {
    path,
    layers: startFrontiers,
    deadEnds,
    visited,
    meetingWord,
    startFrontiers,
    endFrontiers,
  };
};