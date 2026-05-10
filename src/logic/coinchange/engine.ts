export interface CoinChangeStep {
  type: 'init' | 'fill' | 'try-coin' | 'update' | 'complete';
  coins: number[];
  amount: number;
  dp: number[];
  currentAmount: number;
  currentCoin: number;
  coinsUsed: number[][];
  explanation: string;
  highlightLine: number;
}

export class CoinChangeEngine {
  solve(coins: number[], amount: number): CoinChangeStep[] {
    const steps: CoinChangeStep[] = [];
    const dp = new Array(amount + 1).fill(amount + 1);
    const coinsUsed: number[][] = Array.from({ length: amount + 1 }, () => []);
    dp[0] = 0;

    steps.push({
      type: 'init', coins: [...coins], amount,
      dp: [...dp], currentAmount: 0, currentCoin: 0,
      coinsUsed: coinsUsed.map(c => [...c]),
      explanation: `Initialize dp[0..${amount}] = ∞, dp[0] = 0. Coins: [${coins.join(', ')}].`,
      highlightLine: 1,
    });

    for (let i = 1; i <= amount; i++) {
      for (const coin of coins) {
        if (coin <= i && dp[i - coin] + 1 < dp[i]) {
          dp[i] = dp[i - coin] + 1;
          coinsUsed[i] = [...coinsUsed[i - coin], coin];

          steps.push({
            type: 'update', coins: [...coins], amount,
            dp: [...dp], currentAmount: i, currentCoin: coin,
            coinsUsed: coinsUsed.map(c => [...c]),
            explanation: `dp[${i}] = dp[${i}-${coin}] + 1 = ${dp[i]}. Using coin ${coin}. Coins: [${coinsUsed[i].join('+')}]`,
            highlightLine: 7,
          });
        }
      }

      if (i % Math.max(1, Math.floor(amount / 15)) === 0 || i === amount) {
        steps.push({
          type: 'fill', coins: [...coins], amount,
          dp: [...dp], currentAmount: i, currentCoin: 0,
          coinsUsed: coinsUsed.map(c => [...c]),
          explanation: `Processed amounts 1..${i}. dp[${i}] = ${dp[i] > amount ? '∞ (impossible)' : dp[i]}.`,
          highlightLine: 5,
        });
      }
    }

    const result = dp[amount] > amount ? -1 : dp[amount];
    steps.push({
      type: 'complete', coins: [...coins], amount,
      dp: [...dp], currentAmount: amount, currentCoin: 0,
      coinsUsed: coinsUsed.map(c => [...c]),
      explanation: result === -1
        ? `Cannot make amount ${amount} with given coins.`
        : `Minimum coins for ${amount}: ${result}. Combination: [${coinsUsed[amount].join(' + ')}]. Time: O(n·amount), Space: O(amount).`,
      highlightLine: 11,
    });

    return steps;
  }
}
