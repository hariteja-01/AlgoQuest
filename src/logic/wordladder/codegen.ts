import { Language } from '../../types';

const sanitizeWord = (value: string) => value.toLowerCase().replace(/[^a-z]/g, '');

export const generateWordLadderCode = (
  startWord: string,
  endWord: string,
  dictionary: string[],
  language: Language
): string => {
  const safeStart = sanitizeWord(startWord) || 'cold';
  const safeEnd = sanitizeWord(endWord) || 'warm';
  const safeWords = Array.from(
    new Set(dictionary.map(sanitizeWord).filter(Boolean))
  );
  const wordsList = safeWords.length > 0 ? safeWords : [safeStart, safeEnd].filter(Boolean);

  const jsWords = wordsList.map((word) => `"${word}"`).join(', ');
  const javaWords = wordsList.map((word) => `"${word}"`).join(', ');
  const cppWords = wordsList.map((word) => `"${word}"`).join(', ');

  if (language === 'cpp') return `#include <iostream>
#include <vector>
#include <string>
#include <unordered_set>
#include <unordered_map>
#include <queue>
#include <algorithm>
using namespace std;

bool differsByOne(const string& a, const string& b) {
    if (a.size() != b.size()) return false;
    int diff = 0;
    for (size_t i = 0; i < a.size(); i++) {
        if (a[i] != b[i] && ++diff > 1) return false;
    }
    return diff == 1;
}

vector<string> prepareDictionary(const string& start, const string& end, const vector<string>& words) {
    int len = start.empty() ? (int)end.size() : (int)start.size();
    unordered_set<string> unique;
    for (const auto& w : words) {
        if ((int)w.size() == len) unique.insert(w);
    }
    if ((int)start.size() == len) unique.insert(start);
    if ((int)end.size() == len) unique.insert(end);
    return vector<string>(unique.begin(), unique.end());
}

vector<string> bfsWordLadder(const string& start, const string& end, const vector<string>& words) {
    vector<string> prepared = prepareDictionary(start, end, words);
    unordered_set<string> visited;
    unordered_map<string, string> parent;
    queue<string> q;

    visited.insert(start);
    parent[start] = "";
    q.push(start);

    while (!q.empty()) {
        string current = q.front();
        q.pop();
        if (current == end) break;
        for (const auto& word : prepared) {
            if (visited.count(word)) continue;
            if (!differsByOne(current, word)) continue;
            visited.insert(word);
            parent[word] = current;
            q.push(word);
        }
    }

    vector<string> path;
    if (parent.find(end) != parent.end()) {
        string cur = end;
        while (!cur.empty()) {
            path.push_back(cur);
            cur = parent[cur];
        }
        reverse(path.begin(), path.end());
    }
    return path;
}

int main() {
    vector<string> words = {${cppWords}};
    string start = "${safeStart}";
    string end = "${safeEnd}";
    auto path = bfsWordLadder(start, end, words);
    for (const auto& word : path) {
        cout << word << " ";
    }
    return 0;
}`;

  if (language === 'java') return `import java.util.*;

class Solution {
    private static boolean differsByOne(String a, String b) {
        if (a.length() != b.length()) return false;
        int diff = 0;
        for (int i = 0; i < a.length(); i++) {
            if (a.charAt(i) != b.charAt(i) && ++diff > 1) return false;
        }
        return diff == 1;
    }

    private static List<String> prepareDictionary(String start, String end, List<String> words) {
        int len = start.isEmpty() ? end.length() : start.length();
        Set<String> unique = new HashSet<>();
        for (String w : words) {
            if (w.length() == len) unique.add(w);
        }
        if (start.length() == len) unique.add(start);
        if (end.length() == len) unique.add(end);
        return new ArrayList<>(unique);
    }

    public static List<String> bfsWordLadder(String start, String end, List<String> words) {
        List<String> prepared = prepareDictionary(start, end, words);
        Set<String> visited = new HashSet<>();
        Map<String, String> parent = new HashMap<>();
        Queue<String> queue = new ArrayDeque<>();

        visited.add(start);
        parent.put(start, "");
        queue.add(start);

        while (!queue.isEmpty()) {
            String current = queue.poll();
            if (current.equals(end)) break;
            for (String word : prepared) {
                if (visited.contains(word)) continue;
                if (!differsByOne(current, word)) continue;
                visited.add(word);
                parent.put(word, current);
                queue.add(word);
            }
        }

        List<String> path = new ArrayList<>();
        if (parent.containsKey(end)) {
            String cur = end;
            while (!cur.isEmpty()) {
                path.add(cur);
                cur = parent.get(cur);
            }
            Collections.reverse(path);
        }
        return path;
    }
}

class Demo {
    public static void main(String[] args) {
        List<String> words = Arrays.asList(${javaWords});
        List<String> path = Solution.bfsWordLadder("${safeStart}", "${safeEnd}", words);
        System.out.println(path);
    }
}`;

  if (language === 'csharp') return `using System;
using System.Collections.Generic;
using System.Linq;

public class Solution {
    private static bool DiffersByOne(string a, string b) {
        if (a.Length != b.Length) return false;
        int diff = 0;
        for (int i = 0; i < a.Length; i++) {
            if (a[i] != b[i] && ++diff > 1) return false;
        }
        return diff == 1;
    }

    private static List<string> PrepareDictionary(string start, string end, List<string> words) {
        int len = string.IsNullOrEmpty(start) ? end.Length : start.Length;
        var unique = new HashSet<string>();
        foreach (var w in words) {
            if (w.Length == len) unique.Add(w);
        }
        if (start.Length == len) unique.Add(start);
        if (end.Length == len) unique.Add(end);
        return unique.ToList();
    }

    public static List<string> BfsWordLadder(string start, string end, List<string> words) {
        var prepared = PrepareDictionary(start, end, words);
        var visited = new HashSet<string>();
        var parent = new Dictionary<string, string>();
        var queue = new Queue<string>();

        visited.Add(start);
        parent[start] = string.Empty;
        queue.Enqueue(start);

        while (queue.Count > 0) {
            var current = queue.Dequeue();
            if (current == end) break;
            foreach (var word in prepared) {
                if (visited.Contains(word)) continue;
                if (!DiffersByOne(current, word)) continue;
                visited.Add(word);
                parent[word] = current;
                queue.Enqueue(word);
            }
        }

        var path = new List<string>();
        if (parent.ContainsKey(end)) {
            var cur = end;
            while (!string.IsNullOrEmpty(cur)) {
                path.Add(cur);
                cur = parent[cur];
            }
            path.Reverse();
        }
        return path;
    }
}

public class Demo {
    public static void Main() {
        var words = new List<string> { ${javaWords} };
        var path = Solution.BfsWordLadder("${safeStart}", "${safeEnd}", words);
        Console.WriteLine(string.Join(" ", path));
    }
}`;

  if (language === 'python') return `from collections import deque

def differs_by_one(a, b):
    if len(a) != len(b):
        return False
    diff = 0
    for i in range(len(a)):
        if a[i] != b[i]:
            diff += 1
            if diff > 1:
                return False
    return diff == 1


def prepare_dictionary(start, end, words):
    length = len(start) if start else len(end)
    unique = {w for w in words if len(w) == length}
    if len(start) == length:
        unique.add(start)
    if len(end) == length:
        unique.add(end)
    return list(unique)


def bfs_word_ladder(start, end, words):
    prepared = prepare_dictionary(start, end, words)
    visited = {start}
    parent = {start: None}
    queue = deque([start])

    while queue:
        current = queue.popleft()
        if current == end:
            break
        for word in prepared:
            if word in visited:
                continue
            if not differs_by_one(current, word):
                continue
            visited.add(word)
            parent[word] = current
            queue.append(word)

    path = []
    if end in parent:
        cur = end
        while cur:
            path.append(cur)
            cur = parent.get(cur)
        path.reverse()
    return path


words = [${jsWords}]
print(bfs_word_ladder("${safeStart}", "${safeEnd}", words))`;

  return `function differsByOne(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i] && ++diff > 1) return false;
  }
  return diff === 1;
}

function prepareDictionary(start, end, words) {
  const length = start.length || end.length;
  const unique = new Set(words.filter((w) => w.length === length));
  if (start.length === length) unique.add(start);
  if (end.length === length) unique.add(end);
  return Array.from(unique);
}

function bfsWordLadder(start, end, words) {
  const prepared = prepareDictionary(start, end, words);
  const visited = new Set([start]);
  const parent = new Map([[start, null]]);
  const queue = [start];

  while (queue.length > 0) {
    const current = queue.shift();
    if (current === end) break;
    for (const word of prepared) {
      if (visited.has(word)) continue;
      if (!differsByOne(current, word)) continue;
      visited.add(word);
      parent.set(word, current);
      queue.push(word);
    }
  }

  const path = [];
  if (parent.has(end)) {
    let cur = end;
    while (cur) {
      path.unshift(cur);
      cur = parent.get(cur);
    }
  }
  return path;
}

const words = [${jsWords}];
console.log(bfsWordLadder("${safeStart}", "${safeEnd}", words));`;
};
