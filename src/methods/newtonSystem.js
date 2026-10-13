import { norm2, solve2x2 } from '../helpers/index.js';

/**
 * Метод Ньютона для системы нелинейных уравнений (СНУ)
 * Использует Якобиан и решение СЛАУ на каждой итерации
 *
 * F  — функция, возвращающая вектор невязок [F1, F2]
 * J  — функция, возвращающая матрицу Якоби [[dF1/dx, dF1/dy],[dF2/dx, dF2/dy]]
 * x0 — начальное приближение [x, y]
 */
export function newtonSystem(F, J, x0, eps, maxIter) {
  const history = [];
  let x = [...x0];

  for (let i = 0; i < maxIter; i++) {
    const fVec = F(x);
    const residual = norm2(fVec);

    history.push({ iteration: i + 1, x: [...x], residual });

    if (residual < eps) {
      return { root: [...x], iterations: i + 1, history };
    }

    const jMat = J(x);

    // Решение СЛАУ 2x2: jMat * delta = -fVec  (метод Крамера)
    const [dx, dy] = solve2x2(jMat, [-fVec[0], -fVec[1]]);

    x[0] += dx;
    x[1] += dy;
  }

  return { root: [...x], iterations: maxIter, history };
}
