/**
 * Метод Ньютона (касательных)
 * Находит корень уравнения f(x)=0, используя производную f'(x)
 */
export function newton(f, df, x0, tol, maxIter) {
  const history = [];
  let x = x0;

  for (let i = 0; i < maxIter; i++) {
    const fx = f(x);
    const residual = Math.abs(fx);

    history.push({ iteration: i + 1, x, residual });

    if (residual < tol) {
      return { root: x, iterations: i + 1, history };
    }

    const dfx = df(x);
    if (Math.abs(dfx) < 1e-15) {
      throw new Error('Производная равна нулю, метод не сходится');
    }

    x = x - fx / dfx;
  }

  return { root: x, iterations: maxIter, history };
}
