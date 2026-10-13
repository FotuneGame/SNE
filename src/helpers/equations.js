// Уравнения варианта.

// Часть 1: -3·lg(x) + x² − 2 = 0, x ∈ [1; 5]
export const f = (x) => -3 * Math.log10(x) + x * x - 2;
export const df = (x) => -3 / (x * Math.LN10) + 2 * x;

// Часть 2: cos(y) + x = 1.5;  2y − sin(x − 0.5) = 1
// Вектор невязок F(x, y)
export const F = ([x, y]) => [
  Math.cos(y) + x - 1.5,
  2 * y - Math.sin(x - 0.5) - 1
];

// Матрица Якоби
// J = | ∂F1/∂x   ∂F1/∂y |   =  |  1            -sin(y) |
//     | ∂F2/∂x   ∂F2/∂y |      | -cos(x-0.5)    2      |
export const J = ([x, y]) => [
  [1, -Math.sin(y)],
  [-Math.cos(x - 0.5), 2]
];
