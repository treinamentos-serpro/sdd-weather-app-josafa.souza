import type { Unit } from '../types/weather';

const integerFormatter = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });

export function formatTemperature(valueC: number | null, unit: Unit): string {
  if (valueC === null || !Number.isFinite(valueC)) return 'indisponível';
  const value = unit === 'fahrenheit' ? (valueC * 9) / 5 + 32 : valueC;
  const rounded = integerFormatter.format(value).replace(/^-0$/, '0');
  return `${rounded} ${unit === 'fahrenheit' ? '°F' : '°C'}`;
}
