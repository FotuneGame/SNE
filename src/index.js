import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Методы
import { bisection } from './methods/bisection.js';
import { secant } from './methods/secant.js';
import { monteCarlo } from './methods/monteCarlo.js';
import { newton } from './methods/newton.js';
import { newtonSystem } from './methods/newtonSystem.js';
import { residualChart } from './generateChart.js';

// Вспомогательные функции
import { f, df, F, J, norm2, readInput } from './helpers/index.js';

const __dirname = join(dirname(fileURLToPath(import.meta.url)), '..');

// ========== Входные данные ==========
const input = readInput();
const outputDir = join(__dirname, 'output');
if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

// ===================================================================
//  ЧАСТЬ 1: Скалярное уравнение  -3·lg(x) + x² − 2 = 0,  x ∈ [1;5]
// ===================================================================
console.log('=== ЧАСТЬ 1: Скалярное уравнение ===\n');
console.log('Уравнение: -3·lg(x) + x² − 2 = 0,  x ∈ [1; 5]\n');

const { a, b, tolerance, maxIterations, monteCarloSamples } = input.part1;

// 1. Метод половинного деления
const resBisection = bisection(f, a, b, tolerance, maxIterations);
console.log(`Метод бисекции:    x = ${resBisection.root.toFixed(8)},  итераций: ${resBisection.iterations},  невязка: ${Math.abs(f(resBisection.root)).toExponential(3)}`);

// 2. Метод секущих
const resSecant = secant(f, a, b, tolerance, maxIterations);
console.log(`Метод секущих:     x = ${resSecant.root.toFixed(8)},  итераций: ${resSecant.iterations},  невязка: ${Math.abs(f(resSecant.root)).toExponential(3)}`);

// 3. Метод Монте-Карло
const resMC = monteCarlo(f, a, b, tolerance, maxIterations, monteCarloSamples);
console.log(`Метод Монте-Карло: x = ${resMC.root.toFixed(8)},  улучшений: ${resMC.iterations},  невязка: ${Math.abs(f(resMC.root)).toExponential(3)}`);

// 4. Метод Ньютона
const x0Newton = (a + b) / 2;
const resNewton = newton(f, df, x0Newton, tolerance, maxIterations);
console.log(`Метод Ньютона:     x = ${resNewton.root.toFixed(8)},  итераций: ${resNewton.iterations},  невязка: ${Math.abs(f(resNewton.root)).toExponential(3)}`);

// SVG-график часть 1
const svg1 = residualChart(
  'Скалярное уравнение: невязка от итерации',
  '|f(x)|',
  [
    { name: 'Бисекция',    color: '#2563eb', values: resBisection.history.map((h) => h.residual) },
    { name: 'Секущие',     color: '#dc2626', dash: '6 4', values: resSecant.history.map((h) => h.residual) },
    { name: 'Монте-Карло', color: '#16a34a', dash: '3 3', values: resMC.history.map((h) => h.residual) },
    { name: 'Ньютон',      color: '#d97706', dash: '8 2', values: resNewton.history.map((h) => h.residual) }
  ]
);
writeFileSync(join(outputDir, 'part1.svg'), svg1, 'utf-8');

// ===================================================================
//  ЧАСТЬ 2: СНУ методом Ньютона
//    cos(y) + x = 1.5
//    2y - sin(x - 0.5) = 1
// ===================================================================
console.log('\n=== ЧАСТЬ 2: Система нелинейных уравнений ===\n');
console.log('cos(y) + x = 1.5');
console.log('2y - sin(x - 0.5) = 1\n');

const resSystem = newtonSystem(F, J, input.part2.x0, input.part2.tolerance, input.part2.maxIterations);
console.log(`Метод Ньютона (СНУ):  x = ${resSystem.root[0].toFixed(8)},  y = ${resSystem.root[1].toFixed(8)}`);
console.log(`Итераций: ${resSystem.iterations},  невязка: ${norm2(F(resSystem.root)).toExponential(3)}`);

// Проверка
const check = F(resSystem.root);
console.log(`Проверка: F1 = ${check[0].toExponential(3)},  F2 = ${check[1].toExponential(3)}`);

// SVG-график часть 2
const svg2 = residualChart(
  'СНУ: невязка от итерации (метод Ньютона)',
  '‖F(x,y)‖₂',
  [
    { name: 'Ньютон (СНУ)', color: '#7c3aed', values: resSystem.history.map((h) => h.residual) }
  ]
);
writeFileSync(join(outputDir, 'part2.svg'), svg2, 'utf-8');

// ===================================================================
//  Сохранение результатов в JSON
// ===================================================================
const results = {
  part1: {
    equation: '-3*lg(x) + x^2 - 2 = 0',
    interval: [a, b],
    methods: {
      bisection:  { root: resBisection.root,  iterations: resBisection.iterations,  residual: Math.abs(f(resBisection.root)) },
      secant:     { root: resSecant.root,     iterations: resSecant.iterations,     residual: Math.abs(f(resSecant.root)) },
      monteCarlo: { root: resMC.root,         improvements: resMC.iterations,       residual: Math.abs(f(resMC.root)), totalSamples: monteCarloSamples },
      newton:     { root: resNewton.root,     iterations: resNewton.iterations,     residual: Math.abs(f(resNewton.root)) }
    }
  },
  part2: {
    system: ['cos(y) + x = 1.5', '2y - sin(x - 0.5) = 1'],
    method: 'Newton (system)',
    root: { x: resSystem.root[0], y: resSystem.root[1] },
    iterations: resSystem.iterations,
    residual: norm2(check)
  }
};

writeFileSync(join(outputDir, 'results.json'), JSON.stringify(results, null, 2), 'utf-8');

console.log('\n✓ Графики сохранены: output/part1.svg, output/part2.svg');
console.log('✓ Результаты: output/results.json');
