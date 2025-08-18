import { Language } from '../../types';

export const generateTrieCode = (language: Language, operations: string[] = []): string => {
  switch (language) {
    case 'cpp':
      return `#include <iostream>
#include <unordered_map>
#include <vector>
#include <string>
using namespace std;

class TrieNode {
public:
    unordered_map<char, TrieNode*> children;
    bool isEndOfWord;
    
    TrieNode() {
        isEndOfWord = false;
    }
};

class Trie {
private:
    TrieNode* root;
    
public:
    Trie() {
        root = new TrieNode();
    }
    
    void insert(string word) {
        TrieNode* current = root;
        
        for (char c : word) {
            if (current->children.find(c) == current->children.end()) {
                current->children[c] = new TrieNode();
            }
            current = current->children[c];
        }
        
        current->isEndOfWord = true;
    }
    
    bool search(string word) {
        TrieNode* current = root;
        
        for (char c : word) {
            if (current->children.find(c) == current->children.end()) {
                return false;
            }
            current = current->children[c];
        }
        
        return current->isEndOfWord;
    }
    
    bool startsWith(string prefix) {
        TrieNode* current = root;
        
        for (char c : prefix) {
            if (current->children.find(c) == current->children.end()) {
                return false;
            }
            current = current->children[c];
        }
        
        return true;
    }
    
    vector<string> getSuggestions(string prefix) {
        vector<string> suggestions;
        TrieNode* current = root;
        
        // Navigate to prefix
        for (char c : prefix) {
            if (current->children.find(c) == current->children.end()) {
                return suggestions;
            }
            current = current->children[c];
        }
        
        // Collect all words from this node
        collectWords(current, prefix, suggestions);
        return suggestions;
    }
    
private:
    void collectWords(TrieNode* node, string prefix, vector<string>& words) {
        if (node->isEndOfWord) {
            words.push_back(prefix);
        }
        
        for (auto& pair : node->children) {
            collectWords(pair.second, prefix + pair.first, words);
        }
    }
};

int main() {
    Trie trie;
    
    // Example operations
    ${operations.map(op => `trie.${op};`).join('\n    ')}
    
    return 0;
}`;

    case 'python':
      return `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word):
        current = self.root
        
        for char in word:
            if char not in current.children:
                current.children[char] = TrieNode()
            current = current.children[char]
        
        current.is_end_of_word = True
    
    def search(self, word):
        current = self.root
        
        for char in word:
            if char not in current.children:
                return False
            current = current.children[char]
        
        return current.is_end_of_word
    
    def starts_with(self, prefix):
        current = self.root
        
        for char in prefix:
            if char not in current.children:
                return False
            current = current.children[char]
        
        return True
    
    def get_suggestions(self, prefix):
        suggestions = []
        current = self.root
        
        # Navigate to prefix
        for char in prefix:
            if char not in current.children:
                return suggestions
            current = current.children[char]
        
        # Collect all words from this node
        self._collect_words(current, prefix, suggestions)
        return suggestions
    
    def _collect_words(self, node, prefix, words):
        if node.is_end_of_word:
            words.append(prefix)
        
        for char, child in node.children.items():
            self._collect_words(child, prefix + char, words)

# Example usage
trie = Trie()

# Example operations
${operations.map(op => `trie.${op}`).join('\n')}

# Test functionality
print("Trie operations completed successfully!")`;

    case 'javascript':
      return `class TrieNode {
    constructor() {
        this.children = new Map();
        this.isEndOfWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }
    
    insert(word) {
        let current = this.root;
        
        for (const char of word) {
            if (!current.children.has(char)) {
                current.children.set(char, new TrieNode());
            }
            current = current.children.get(char);
        }
        
        current.isEndOfWord = true;
    }
    
    search(word) {
        let current = this.root;
        
        for (const char of word) {
            if (!current.children.has(char)) {
                return false;
            }
            current = current.children.get(char);
        }
        
        return current.isEndOfWord;
    }
    
    startsWith(prefix) {
        let current = this.root;
        
        for (const char of prefix) {
            if (!current.children.has(char)) {
                return false;
            }
            current = current.children.get(char);
        }
        
        return true;
    }
    
    getSuggestions(prefix) {
        const suggestions = [];
        let current = this.root;
        
        // Navigate to prefix
        for (const char of prefix) {
            if (!current.children.has(char)) {
                return suggestions;
            }
            current = current.children.get(char);
        }
        
        // Collect all words from this node
        this._collectWords(current, prefix, suggestions);
        return suggestions;
    }
    
    _collectWords(node, prefix, words) {
        if (node.isEndOfWord) {
            words.push(prefix);
        }
        
        for (const [char, child] of node.children) {
            this._collectWords(child, prefix + char, words);
        }
    }
    
    getMemoryStats() {
        let nodeCount = 0;
        let edgeCount = 0;
        
        const traverse = (node) => {
            nodeCount++;
            for (const child of node.children.values()) {
                edgeCount++;
                traverse(child);
            }
        };
        
        traverse(this.root);
        
        return {
            nodes: nodeCount,
            edges: edgeCount,
            estimatedBytes: nodeCount * 100 + edgeCount * 50
        };
    }
}

// Example usage
const trie = new Trie();

// Example operations
${operations.map(op => `trie.${op};`).join('\n')}

console.log("Trie operations completed successfully!");
console.log("Memory stats:", trie.getMemoryStats());`;

    default:
      return '';
  }
};

export const generateTrieOperations = (words: string[]): string[] => {
  const operations: string[] = [];
  
  // Insert operations
  words.forEach(word => {
    operations.push(`insert("${word}")`);
  });
  
  // Search operations
  words.forEach(word => {
    operations.push(`search("${word}")`);
  });
  
  // StartsWith operations
  const prefixes = Array.from(new Set(words.map(word => word.substring(0, Math.min(3, word.length)))));
  prefixes.forEach(prefix => {
    operations.push(`startsWith("${prefix}")`);
  });
  
  return operations;
};