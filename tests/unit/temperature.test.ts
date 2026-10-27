import { describe, expect, it } from 'vitest';
import { formatTemperature } from '../../src/lib/temperature';

describe('formatTemperature', () => {
  it.each([
    [25, '25 °C', '77 °F'],
    [0, '0 °C', '32 °F'],
    [-40, '-40 °C', '-40 °F'],
    [22.4, '22 °C', '72 °F'],
    [-0.4, '0 °C', '31 °F'],
    [null, 'indisponível', 'indisponível'],
    [Number.NaN, 'indisponível', 'indisponível'],
  ])('formata %s nas duas unidades sem arredondar a origem', (value, celsius, fahrenheit) => {
    expect(formatTemperature(value, 'celsius')).toBe(celsius);
    expect(formatTemperature(value, 'fahrenheit')).toBe(fahrenheit);
    expect(formatTemperature(value, 'celsius')).toBe(celsius);
  });
});
