/**
 * Метод половинного деления (бисекции)
 * Находит корень уравнения f(x)=0 на отрезке [a, b]
 */
export function bisection(f, a, b, tol, maxIter) {
  const history = [];

  if (f(a) * f(b) > 0) {
    throw new Error('f(a) и f(b) должны иметь разные знаки');
  }

  for (let i = 0; i < maxIter; i++) {
    const c = (a + b) / 2;
    const fc = f(c);
    const residual = Math.abs(fc);

    history.push({ iteration: i + 1, x: c, residual });

    if (residual < tol || (b - a) / 2 < tol) {
      return { root: c, iterations: i + 1, history };
    }

    if (f(a) * fc < 0) {
      b = c;
    } else {
      a = c;
    }
  }

  return { root: (a + b) / 2, iterations: maxIter, history };
}
