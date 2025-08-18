import { Queen, Position } from '../../types';

export class NQueensEngine {
  private n: number;
  private solutions: Queen[][] = [];
  private searchStats = {
    nodesVisited: 0,
    backtracks: 0,
    branchingFactor: 0
  };

  constructor(n: number) {
    this.n = n;
    this.solutions = [];
    this.resetStats();
  }

  private resetStats() {
    this.searchStats = {
      nodesVisited: 0,
      backtracks: 0,
      branchingFactor: 0
    };
  }

  isValidPlacement(queens: Queen[], newPos: Position): boolean {
    for (const queen of queens) {
      // Check row and column conflicts
      if (queen.row === newPos.row || queen.col === newPos.col) {
        return false;
      }
      // Check diagonal conflicts
      if (Math.abs(queen.row - newPos.row) === Math.abs(queen.col - newPos.col)) {
        return false;
      }
    }
    return true;
  }

  getAttackSquares(queen: Queen): Position[] {
    const attacks: Position[] = [];
    
    for (let i = 0; i < this.n; i++) {
      // Row attacks
      if (i !== queen.col) {
        attacks.push({ row: queen.row, col: i });
      }
      // Column attacks
      if (i !== queen.row) {
        attacks.push({ row: i, col: queen.col });
      }
    }

    // Diagonal attacks
    for (let i = 1; i < this.n; i++) {
      const positions = [
        { row: queen.row + i, col: queen.col + i },
        { row: queen.row + i, col: queen.col - i },
        { row: queen.row - i, col: queen.col + i },
        { row: queen.row - i, col: queen.col - i }
      ];

      for (const pos of positions) {
        if (pos.row >= 0 && pos.row < this.n && pos.col >= 0 && pos.col < this.n) {
          attacks.push(pos);
        }
      }
    }

    return attacks;
  }

  findAllSolutions(): Queen[][] {
    this.solutions = [];
    this.resetStats();
    this.backtrack([], 0);
    return this.solutions;
  }

  private backtrack(queens: Queen[], row: number): void {
    this.searchStats.nodesVisited++;

    if (row === this.n) {
      this.solutions.push([...queens]);
      return;
    }

    let validPlacements = 0;
    for (let col = 0; col < this.n; col++) {
      const newPos = { row, col };
      
      if (this.isValidPlacement(queens, newPos)) {
        validPlacements++;
        const newQueen: Queen = { ...newPos, id: `${row}-${col}` };
        queens.push(newQueen);
        
        this.backtrack(queens, row + 1);
        
        queens.pop();
        this.searchStats.backtracks++;
      }
    }

    if (validPlacements > 0) {
      this.searchStats.branchingFactor = 
        (this.searchStats.branchingFactor + validPlacements) / 2;
    }
  }

  getSearchStats() {
    return { ...this.searchStats };
  }

  hasSymmetry(solution: Queen[]): { rotation: boolean; reflection: boolean } {
    const rotated = this.rotateSolution(solution);
    const reflected = this.reflectSolution(solution);
    
    return {
      rotation: this.solutionsEqual(solution, rotated),
      reflection: this.solutionsEqual(solution, reflected)
    };
  }

  private rotateSolution(solution: Queen[]): Queen[] {
    return solution.map(queen => ({
      ...queen,
      row: queen.col,
      col: this.n - 1 - queen.row
    }));
  }

  private reflectSolution(solution: Queen[]): Queen[] {
    return solution.map(queen => ({
      ...queen,
      col: this.n - 1 - queen.col
    }));
  }

  private solutionsEqual(sol1: Queen[], sol2: Queen[]): boolean {
    if (sol1.length !== sol2.length) return false;
    
    const positions1 = sol1.map(q => `${q.row}-${q.col}`).sort();
    const positions2 = sol2.map(q => `${q.row}-${q.col}`).sort();
    
    return positions1.every((pos, i) => pos === positions2[i]);
  }

  getHintForPosition(queens: Queen[], row: number): number {
    let bestCol = -1;
    let minConflicts = Infinity;

    for (let col = 0; col < this.n; col++) {
      const conflicts = this.countConflicts(queens, { row, col });
      if (conflicts < minConflicts) {
        minConflicts = conflicts;
        bestCol = col;
      }
    }

    return bestCol;
  }

  private countConflicts(queens: Queen[], pos: Position): number {
    let conflicts = 0;
    for (const queen of queens) {
      if (queen.row === pos.row || 
          queen.col === pos.col || 
          Math.abs(queen.row - pos.row) === Math.abs(queen.col - pos.col)) {
        conflicts++;
      }
    }
    return conflicts;
  }
}