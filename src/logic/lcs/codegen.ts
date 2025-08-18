import { Language } from '../../types';

export const generateLCSCode = (strings: string[], language: Language, spaceOptimized: boolean = false): string => {
  const numStrings = strings.length;
  
  if (spaceOptimized && numStrings === 2) {
    return generateSpaceOptimizedCode(strings, language);
  }
  
  switch (language) {
    case 'cpp':
      return generateCppCode(strings, numStrings);
    case 'python':
      return generatePythonCode(strings, numStrings);
    case 'javascript':
      return generateJavaScriptCode(strings, numStrings);
    default:
      return '';
  }
};

const generateSpaceOptimizedCode = (strings: string[], language: Language): string => {
  const [str1, str2] = strings;
  
  switch (language) {
    case 'cpp':
      return `#include <iostream>
#include <vector>
#include <string>
using namespace std;

int lcsSpaceOptimized(string str1, string str2) {
    int m = str1.length(), n = str2.length();
    if (m > n) swap(str1, str2), swap(m, n);
    
    vector<int> prev(m + 1, 0), curr(m + 1, 0);
    
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (str1[j-1] == str2[i-1]) {
                curr[j] = prev[j-1] + 1;
            } else {
                curr[j] = max(prev[j], curr[j-1]);
            }
        }
        prev = curr;
        fill(curr.begin(), curr.end(), 0);
    }
    
    return prev[m];
}

int main() {
    string str1 = "${str1}";
    string str2 = "${str2}";
    cout << "LCS Length: " << lcsSpaceOptimized(str1, str2) << endl;
    return 0;
}`;

    case 'python':
      return `def lcs_space_optimized(str1, str2):
    if len(str1) > len(str2):
        str1, str2 = str2, str1
    
    m, n = len(str1), len(str2)
    prev = [0] * (m + 1)
    curr = [0] * (m + 1)
    
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if str1[j-1] == str2[i-1]:
                curr[j] = prev[j-1] + 1
            else:
                curr[j] = max(prev[j], curr[j-1])
        prev, curr = curr, [0] * (m + 1)
    
    return prev[m]

# Usage
str1 = "${str1}"
str2 = "${str2}"
result = lcs_space_optimized(str1, str2)
print(f"LCS Length: {result}")`;

    case 'javascript':
      return `function lcsSpaceOptimized(str1, str2) {
    if (str1.length > str2.length) {
        [str1, str2] = [str2, str1];
    }
    
    const m = str1.length, n = str2.length;
    let prev = new Array(m + 1).fill(0);
    let curr = new Array(m + 1).fill(0);
    
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            if (str1[j-1] === str2[i-1]) {
                curr[j] = prev[j-1] + 1;
            } else {
                curr[j] = Math.max(prev[j], curr[j-1]);
            }
        }
        [prev, curr] = [curr, new Array(m + 1).fill(0)];
    }
    
    return prev[m];
}

// Usage
const str1 = "${str1}";
const str2 = "${str2}";
const result = lcsSpaceOptimized(str1, str2);
console.log(\`LCS Length: \${result}\`);`;

    default:
      return '';
  }
};

const generateCppCode = (strings: string[], numStrings: number): string => {
  if (numStrings === 2) {
    return `#include <iostream>
#include <vector>
#include <string>
using namespace std;

pair<int, string> lcs(string str1, string str2) {
    int m = str1.length(), n = str2.length();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (str1[i-1] == str2[j-1]) {
                dp[i][j] = dp[i-1][j-1] + 1;
            } else {
                dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
            }
        }
    }
    
    // Reconstruct LCS
    string lcsStr = "";
    int i = m, j = n;
    while (i > 0 && j > 0) {
        if (str1[i-1] == str2[j-1]) {
            lcsStr = str1[i-1] + lcsStr;
            i--; j--;
        } else if (dp[i-1][j] > dp[i][j-1]) {
            i--;
        } else {
            j--;
        }
    }
    
    return {dp[m][n], lcsStr};
}

int main() {
    string str1 = "${strings[0]}";
    string str2 = "${strings[1]}";
    auto result = lcs(str1, str2);
    cout << "LCS: " << result.second << " (Length: " << result.first << ")" << endl;
    return 0;
}`;
  }

  return `// 3D LCS Implementation for ${numStrings} strings
#include <iostream>
#include <vector>
#include <string>
using namespace std;

int lcs3D(string str1, string str2, string str3) {
    int l1 = str1.length(), l2 = str2.length(), l3 = str3.length();
    vector<vector<vector<int>>> dp(l1 + 1, 
        vector<vector<int>>(l2 + 1, 
            vector<int>(l3 + 1, 0)));
    
    for (int i = 1; i <= l1; i++) {
        for (int j = 1; j <= l2; j++) {
            for (int k = 1; k <= l3; k++) {
                if (str1[i-1] == str2[j-1] && str2[j-1] == str3[k-1]) {
                    dp[i][j][k] = dp[i-1][j-1][k-1] + 1;
                } else {
                    dp[i][j][k] = max({dp[i-1][j][k], dp[i][j-1][k], dp[i][j][k-1]});
                }
            }
        }
    }
    
    return dp[l1][l2][l3];
}

int main() {
    ${strings.map((str, i) => `string str${i + 1} = "${str}";`).join('\n    ')}
    int result = lcs3D(${strings.slice(0, 3).map((_, i) => `str${i + 1}`).join(', ')});
    cout << "LCS Length: " << result << endl;
    return 0;
}`;
};

const generatePythonCode = (strings: string[], numStrings: number): string => {
  if (numStrings === 2) {
    return `def lcs(str1, str2):
    m, n = len(str1), len(str2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if str1[i-1] == str2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    # Reconstruct LCS
    lcs_str = ""
    i, j = m, n
    while i > 0 and j > 0:
        if str1[i-1] == str2[j-1]:
            lcs_str = str1[i-1] + lcs_str
            i -= 1
            j -= 1
        elif dp[i-1][j] > dp[i][j-1]:
            i -= 1
        else:
            j -= 1
    
    return dp[m][n], lcs_str

# Usage
str1 = "${strings[0]}"
str2 = "${strings[1]}"
length, lcs_result = lcs(str1, str2)
print(f"LCS: {lcs_result} (Length: {length})")`;
  }

  return `def lcs_3d(str1, str2, str3):
    l1, l2, l3 = len(str1), len(str2), len(str3)
    dp = [[[0 for _ in range(l3 + 1)] for _ in range(l2 + 1)] for _ in range(l1 + 1)]
    
    for i in range(1, l1 + 1):
        for j in range(1, l2 + 1):
            for k in range(1, l3 + 1):
                if str1[i-1] == str2[j-1] == str3[k-1]:
                    dp[i][j][k] = dp[i-1][j-1][k-1] + 1
                else:
                    dp[i][j][k] = max(dp[i-1][j][k], dp[i][j-1][k], dp[i][j][k-1])
    
    return dp[l1][l2][l3]

# Usage
${strings.map((str, i) => `str${i + 1} = "${str}"`).join('\n')}
result = lcs_3d(${strings.slice(0, 3).map((_, i) => `str${i + 1}`).join(', ')})
print(f"LCS Length: {result}")`;
};

const generateJavaScriptCode = (strings: string[], numStrings: number): string => {
  if (numStrings === 2) {
    return `function lcs(str1, str2) {
    const m = str1.length, n = str2.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (str1[i-1] === str2[j-1]) {
                dp[i][j] = dp[i-1][j-1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
            }
        }
    }
    
    // Reconstruct LCS
    let lcsStr = "";
    let i = m, j = n;
    while (i > 0 && j > 0) {
        if (str1[i-1] === str2[j-1]) {
            lcsStr = str1[i-1] + lcsStr;
            i--; j--;
        } else if (dp[i-1][j] > dp[i][j-1]) {
            i--;
        } else {
            j--;
        }
    }
    
    return [dp[m][n], lcsStr];
}

// Usage
const str1 = "${strings[0]}";
const str2 = "${strings[1]}";
const [length, lcsResult] = lcs(str1, str2);
console.log(\`LCS: \${lcsResult} (Length: \${length})\`);`;
  }

  return `function lcs3D(str1, str2, str3) {
    const l1 = str1.length, l2 = str2.length, l3 = str3.length;
    const dp = Array(l1 + 1).fill(null).map(() =>
        Array(l2 + 1).fill(null).map(() =>
            Array(l3 + 1).fill(0)
        )
    );
    
    for (let i = 1; i <= l1; i++) {
        for (let j = 1; j <= l2; j++) {
            for (let k = 1; k <= l3; k++) {
                if (str1[i-1] === str2[j-1] && str2[j-1] === str3[k-1]) {
                    dp[i][j][k] = dp[i-1][j-1][k-1] + 1;
                } else {
                    dp[i][j][k] = Math.max(
                        dp[i-1][j][k], 
                        dp[i][j-1][k], 
                        dp[i][j][k-1]
                    );
                }
            }
        }
    }
    
    return dp[l1][l2][l3];
}

// Usage
${strings.map((str, i) => `const str${i + 1} = "${str}";`).join('\n')}
const result = lcs3D(${strings.slice(0, 3).map((_, i) => `str${i + 1}`).join(', ')});
console.log(\`LCS Length: \${result}\`);`;
};