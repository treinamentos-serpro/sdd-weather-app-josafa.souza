import { describe, expect, it } from 'vitest';
import { formatForecastDay } from '../../src/lib/format';

describe('formatForecastDay', () => {
  it('identifica Hoje usando a data local explícita, não o relógio do dispositivo', () => {
    expect(formatForecastDay('2026-10-29', '2026-10-29')).toBe('Hoje (qui), 29/10');
    expect(formatForecastDay('2026-10-30', '2026-10-29')).toBe('sex, 30/10');
    expect(formatForecastDay('2026-11-01', '2026-10-29')).toBe('dom, 01/11');
    expect(formatForecastDay('2026-01-01', '2025-12-31')).toBe('qui, 01/01');
  });

  it.each(['', '2026-02-30', '2026-13-01', '29/10/2026'])('rejeita data inválida %s', (date) => {
    expect(() => formatForecastDay(date, '2026-10-29')).toThrow(RangeError);
    expect(() => formatForecastDay('2026-10-29', date)).toThrow(RangeError);
  });
});
