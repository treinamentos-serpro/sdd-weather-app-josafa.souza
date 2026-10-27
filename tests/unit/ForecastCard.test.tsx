import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import ForecastCard from '../../src/components/ForecastCard';
import type { ForecastDay } from '../../src/types/weather';

afterEach(cleanup);

const day: ForecastDay = {
  date: '2026-10-29',
  minC: 18,
  maxC: 27,
  weatherCode: 2,
  precipitationProbabilityPercent: 60,
};

describe('ForecastCard', () => {
  it('exibe rótulo, ícone acessível, temperaturas e probabilidade diária', () => {
    render(<ForecastCard day={day} unit="celsius" today="2026-10-29" />);
    expect(screen.getByRole('article', { name: 'Hoje (qui), 29/10' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Parcialmente nublado' })).toBeInTheDocument();
    for (const text of ['Máxima', 'Mínima', '27 °C', '18 °C', '60 %']) {
      expect(screen.getByText(text)).toBeInTheDocument();
    }
    expect(screen.getByText('Probabilidade máxima de chuva no dia')).toBeInTheDocument();
  });

  it('atualiza as duas temperaturas sem alterar a probabilidade ou os dados', () => {
    const snapshot = structuredClone(day);
    const { rerender } = render(<ForecastCard day={day} unit="celsius" today="2026-10-29" />);
    rerender(<ForecastCard day={day} unit="fahrenheit" today="2026-10-29" />);
    expect(screen.getByText('81 °F')).toBeInTheDocument();
    expect(screen.getByText('64 °F')).toBeInTheDocument();
    expect(screen.getByText('60 %')).toBeInTheDocument();
    expect(day).toEqual(snapshot);
  });

  it.each([
    null,
    -1,
    101,
    Number.NaN,
  ])('sinaliza probabilidade ausente/inválida %s', (probability) => {
    render(
      <ForecastCard
        day={{ ...day, precipitationProbabilityPercent: probability, minC: null, weatherCode: 999 }}
        unit="celsius"
        today="2026-10-29"
      />,
    );
    expect(screen.getAllByText('indisponível')).toHaveLength(2);
    expect(screen.getByText('27 °C')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Condição indisponível' })).toBeInTheDocument();
  });

  it.each([0, 100])('preserva a probabilidade válida %s', (probability) => {
    render(
      <ForecastCard
        day={{ ...day, precipitationProbabilityPercent: probability }}
        unit="celsius"
        today="2026-10-29"
      />,
    );
    expect(screen.getByText(`${probability} %`)).toBeInTheDocument();
  });
});
