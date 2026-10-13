/**
 * Метод секущих
 * Находит корень уравнения f(x)=0, начиная с двух точек x0, x1
 */
export function secant(f, x0, x1, tol, maxIter) {
  const history = [];
  let f0 = f(x0);
  let f1 = f(x1);

  for (let i = 0; i < maxIter; i++) {
    if (Math.abs(f1 - f0) < 1e-15) break;

    const x2 = x1 - f1 * (x1 - x0) / (f1 - f0);
    const f2 = f(x2);
    const residual = Math.abs(f2);

    history.push({ iteration: i + 1, x: x2, residual });

    if (residual < tol) {
      return { root: x2, iterations: i + 1, history };
    }

    x0 = x1;
    f0 = f1;
    x1 = x2;
    f1 = f2;
  }

  return { root: x1, iterations: history.length, history };
}
