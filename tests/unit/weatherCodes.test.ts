import { describe, expect, it } from 'vitest';
import { getWeatherCondition } from '../../src/lib/weatherCodes';

describe('getWeatherCondition', () => {
  it.each([
    0, 1, 2, 3, 45, 48, 51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86,
    95, 96, 99,
  ])('possui descrição e ícone para o código %s', (code) => {
    const condition = getWeatherCondition(code);
    expect(condition.description).not.toBe('Condição indisponível');
    expect(condition.description.length).toBeGreaterThan(0);
    expect(condition.icon.length).toBeGreaterThan(0);
  });

  it.each([null, 999])('usa fallback para %s', (code) => {
    expect(getWeatherCondition(code)).toEqual({ description: 'Condição indisponível', icon: '○' });
  });
});
