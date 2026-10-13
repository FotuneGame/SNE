import { readFileSync } from 'fs';

// Чтение входных данных из input/data.json (путь не зависит от рабочей папки)
export const readInput = () =>
  JSON.parse(readFileSync(new URL('../../input/data.json', import.meta.url), 'utf-8'));
