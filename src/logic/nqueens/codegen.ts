import { Language } from '../../types';

export const generateNQueensCode = (n: number, language: Language): string => {
  switch (language) {
    case 'cpp':
      return `#include <iostream>
#include <vector>
using namespace std;

class NQueensSolver {
private:
    int n;
    vector<vector<int>> solutions;
    
    bool isSafe(vector<int>& queens, int row, int col) {
        for (int i = 0; i < row; i++) {
            if (queens[i] == col || 
                queens[i] - i == col - row || 
                queens[i] + i == col + row) {
                return false;
            }
        }
        return true;
    }
    
    void solve(vector<int>& queens, int row) {
        if (row == n) {
            solutions.push_back(queens);
            return;
        }
        
        for (int col = 0; col < n; col++) {
            if (isSafe(queens, row, col)) {
                queens[row] = col;
                solve(queens, row + 1);
                queens[row] = -1; // backtrack
            }
        }
    }
    
public:
    NQueensSolver(int size) : n(size) {}
    
    vector<vector<int>> solveNQueens() {
        vector<int> queens(n, -1);
        solve(queens, 0);
        return solutions;
    }
};

int main() {
    NQueensSolver solver(${n});
    auto solutions = solver.solveNQueens();
    
    cout << "Found " << solutions.size() << " solutions for ${n}-Queens" << endl;
    return 0;
}`;

    case 'python':
      return `class NQueensSolver:
    def __init__(self, n):
        self.n = n
        self.solutions = []
    
    def is_safe(self, queens, row, col):
        for i in range(row):
            if (queens[i] == col or 
                queens[i] - i == col - row or 
                queens[i] + i == col + row):
                return False
        return True
    
    def solve(self, queens, row):
        if row == self.n:
            self.solutions.append(queens[:])
            return
        
        for col in range(self.n):
            if self.is_safe(queens, row, col):
                queens[row] = col
                self.solve(queens, row + 1)
                queens[row] = -1  # backtrack
    
    def solve_n_queens(self):
        queens = [-1] * self.n
        self.solve(queens, 0)
        return self.solutions

# Usage
solver = NQueensSolver(${n})
solutions = solver.solve_n_queens()
print(f"Found {len(solutions)} solutions for ${n}-Queens")

for i, solution in enumerate(solutions):
    print(f"Solution {i + 1}: {solution}")`;

    case 'javascript':
      return `class NQueensSolver {
    constructor(n) {
        this.n = n;
        this.solutions = [];
    }
    
    isSafe(queens, row, col) {
        for (let i = 0; i < row; i++) {
            if (queens[i] === col || 
                queens[i] - i === col - row || 
                queens[i] + i === col + row) {
                return false;
            }
        }
        return true;
    }
    
    solve(queens, row) {
        if (row === this.n) {
            this.solutions.push([...queens]);
            return;
        }
        
        for (let col = 0; col < this.n; col++) {
            if (this.isSafe(queens, row, col)) {
                queens[row] = col;
                this.solve(queens, row + 1);
                queens[row] = -1; // backtrack
            }
        }
    }
    
    solveNQueens() {
        const queens = new Array(this.n).fill(-1);
        this.solve(queens, 0);
        return this.solutions;
    }
}

// Usage
const solver = new NQueensSolver(${n});
const solutions = solver.solveNQueens();

console.log(\`Found \${solutions.length} solutions for ${n}-Queens\`);

solutions.forEach((solution, index) => {
    console.log(\`Solution \${index + 1}: \${solution}\`);
});`;

    default:
      return '';
  }
};