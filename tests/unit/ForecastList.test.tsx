import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import ForecastList from '../../src/components/ForecastList';
import { mockWeatherData } from '../../src/mocks/weatherData';

afterEach(cleanup);

describe('ForecastList', () => {
  it('renderiza cinco datas em ordem com valores associados a cada data', () => {
    render(<ForecastList days={mockWeatherData.days} unit="celsius" today="2026-10-29" />);
    expect(screen.getByRole('region', { name: 'Previsão de cinco dias' })).toBeInTheDocument();
    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(5);
    expect(cards.map((card) => within(card).getByRole('heading').textContent)).toEqual([
      'Hoje (qui), 29/10',
      'sex, 30/10',
      'sáb, 31/10',
      'dom, 01/11',
      'seg, 02/11',
    ]);
    expect(within(cards[1]).getByText('17 °C')).toBeInTheDocument();
    expect(within(cards[1]).getByText('26 °C')).toBeInTheDocument();
  });

  it('mantém a posição e os dias vizinhos quando um dia está indisponível', () => {
    const days = mockWeatherData.days.map((day) =>
      day.date === '2026-10-30' ? { ...day, minC: null, maxC: null, weatherCode: null } : day,
    );
    render(<ForecastList days={days} unit="fahrenheit" today="2026-10-29" />);
    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(5);
    expect(within(cards[1]).getAllByText('indisponível')).toHaveLength(3);
    expect(within(cards[2]).getByText('75 °F')).toBeInTheDocument();
  });

  it('comunica previsão vazia sem inventar cinco dias', () => {
    render(<ForecastList days={[]} unit="celsius" today="2026-10-29" />);
    expect(screen.getByRole('status')).toHaveTextContent('Previsão indisponível');
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });
});
