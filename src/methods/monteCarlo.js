/**
 * Метод Монте-Карло
 * Находит корень уравнения f(x)=0 случайным перебором точек на [a, b]
 */
export function monteCarlo(f, a, b, eps, maxIter, numSamples) {
  const history = [];
  let bestX = a;
  let bestResidual = Math.abs(f(a));

  for (let i = 0; i < numSamples; i++) {
    const x = a + Math.random() * (b - a);
    const residual = Math.abs(f(x));

    if (residual < bestResidual) {
      bestX = x;
      bestResidual = residual;
      history.push({ iteration: history.length + 1, x: bestX, residual: bestResidual });
    }

    if (bestResidual < eps) break;
  }

  return { root: bestX, iterations: history.length, totalSamples: numSamples, history };
}
