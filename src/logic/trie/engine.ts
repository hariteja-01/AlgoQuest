import { TrieNode } from '../../types';

export class TrieEngine {
  root: TrieNode;
  private nodeCounter: number = 0;

  constructor() {
    this.root = {
      id: 'root',
      char: '',
      children: new Map(),
      isEndOfWord: false,
      depth: 0,
      x: 0,
      y: 0
    };
  }

  insert(word: string): { path: TrieNode[], newNodes: TrieNode[] } {
    const path: TrieNode[] = [];
    const newNodes: TrieNode[] = [];
    let current = this.root;
    path.push(current);

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      
      if (!current.children.has(char)) {
        const newNode: TrieNode = {
          id: `node_${this.nodeCounter++}`,
          char: char,
          children: new Map(),
          isEndOfWord: false,
          depth: i + 1,
          x: 0,
          y: 0
        };
        current.children.set(char, newNode);
        newNodes.push(newNode);
      }
      
      current = current.children.get(char)!;
      path.push(current);
    }

    current.isEndOfWord = true;
    return { path, newNodes };
  }

  search(word: string): { 
    found: boolean, 
    path: TrieNode[], 
    failedAt?: { node: TrieNode, char: string, index: number } 
  } {
    const path: TrieNode[] = [];
    let current = this.root;
    path.push(current);

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      
      if (!current.children.has(char)) {
        return { 
          found: false, 
          path, 
          failedAt: { node: current, char, index: i }
        };
      }
      
      current = current.children.get(char)!;
      path.push(current);
    }

    return { found: current.isEndOfWord, path };
  }

  startsWith(prefix: string): { 
    hasPrefix: boolean, 
    path: TrieNode[], 
    suggestions: string[] 
  } {
    const path: TrieNode[] = [];
    let current = this.root;
    path.push(current);

    // Navigate to prefix end
    for (let i = 0; i < prefix.length; i++) {
      const char = prefix[i];
      
      if (!current.children.has(char)) {
        return { hasPrefix: false, path, suggestions: [] };
      }
      
      current = current.children.get(char)!;
      path.push(current);
    }

    // Collect all words with this prefix
    const suggestions = this.collectWords(current, prefix);
    return { hasPrefix: true, path, suggestions };
  }

  private collectWords(node: TrieNode, prefix: string): string[] {
    const words: string[] = [];
    
    if (node.isEndOfWord) {
      words.push(prefix);
    }
    
    for (const [char, child] of node.children) {
      words.push(...this.collectWords(child, prefix + char));
    }
    
    return words.slice(0, 10); // Limit suggestions
  }

  getAllWords(): string[] {
    return this.collectWords(this.root, '');
  }

  getMemoryUsage(): { nodes: number, edges: number, bytes: number } {
    let nodes = 0;
    let edges = 0;

    const traverse = (node: TrieNode) => {
      nodes++;
      for (const child of node.children.values()) {
        edges++;
        traverse(child);
      }
    };

    traverse(this.root);
    
    // Estimate memory: each node ~100 bytes, each edge ~50 bytes
    const bytes = nodes * 100 + edges * 50;
    
    return { nodes, edges, bytes };
  }

  calculateLayout(): void {
    this.calculateNodePositions(this.root, 0, 0, 400);
  }

  private calculateNodePositions(node: TrieNode, x: number, y: number, width: number): void {
    node.x = x;
    node.y = y;

    const children = Array.from(node.children.values());
    if (children.length === 0) return;

    const childWidth = width / children.length;
    children.forEach((child, index) => {
      const childX = x - width / 2 + childWidth * index + childWidth / 2;
      const childY = y + 80;
      this.calculateNodePositions(child, childX, childY, childWidth * 0.8);
    });
  }

  insertBatch(words: string[]): { 
    totalNodes: number, 
    sharedNodes: number, 
    compressionRatio: number 
  } {
    const initialNodeCount = this.countNodes();
    
    for (const word of words) {
      this.insert(word);
    }
    
    const finalNodeCount = this.countNodes();
    const totalNodes = finalNodeCount;
    const wouldBeNodes = words.reduce((acc, word) => acc + word.length, 0) + words.length;
    const sharedNodes = wouldBeNodes - (finalNodeCount - initialNodeCount);
    const compressionRatio = wouldBeNodes > 0 ? (finalNodeCount / wouldBeNodes) : 1;

    return { totalNodes, sharedNodes, compressionRatio };
  }

  private countNodes(): number {
    let count = 0;
    const traverse = (node: TrieNode) => {
      count++;
      for (const child of node.children.values()) {
        traverse(child);
      }
    };
    traverse(this.root);
    return count;
  }
}