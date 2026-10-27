import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import CurrentWeather from '../../src/components/CurrentWeather';
import { mockWeatherData } from '../../src/mocks/weatherData';
import type { CurrentWeather as CurrentWeatherData } from '../../src/types/weather';

afterEach(cleanup);

const current: CurrentWeatherData = {
  temperatureC: 25,
  weatherCode: 2,
  observedAt: '2026-10-29T09:45',
  relativeHumidityPercent: 72,
  windSpeedKmh: 12.5,
  precipitationMm: 0,
  precipitationIntervalSeconds: 900,
  surfacePressureHpa: 925.4,
};

describe('CurrentWeather', () => {
  it('exibe cidade, condição acessível, leitura e métricas com unidades explícitas', () => {
    render(<CurrentWeather city={mockWeatherData.city} current={current} unit="celsius" />);
    expect(screen.getByRole('region', { name: 'Clima atual em São Paulo' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Parcialmente nublado' })).toBeInTheDocument();
    for (const text of [
      '25 °C',
      '72 %',
      '12,5 km/h',
      '0 mm',
      '925,4 hPa',
      'Precipitação em 15 min',
      'Pressão local',
    ])
      expect(screen.getByText(text)).toBeInTheDocument();
    expect(screen.getByText(/Leitura às 09:45/)).toHaveTextContent('America/Sao_Paulo');
  });

  it('deriva Fahrenheit sem alterar dados ou unidades métricas', () => {
    const snapshot = structuredClone(current);
    const { rerender } = render(
      <CurrentWeather city={mockWeatherData.city} current={current} unit="celsius" />,
    );
    rerender(<CurrentWeather city={mockWeatherData.city} current={current} unit="fahrenheit" />);
    expect(screen.getByText('77 °F')).toBeInTheDocument();
    expect(screen.getByText('12,5 km/h')).toBeInTheDocument();
    expect(current).toEqual(snapshot);
  });

  it('mantém campos válidos em resposta parcial e usa fallback de condição', () => {
    render(
      <CurrentWeather
        city={mockWeatherData.city}
        current={{
          ...current,
          weatherCode: 999,
          temperatureC: null,
          relativeHumidityPercent: null,
          precipitationIntervalSeconds: null,
        }}
        unit="celsius"
      />,
    );
    expect(screen.getByRole('img', { name: 'Condição indisponível' })).toBeInTheDocument();
    expect(screen.getByText('12,5 km/h')).toBeInTheDocument();
    expect(screen.getAllByText('indisponível')).toHaveLength(3);
    expect(screen.queryByText('0 mm')).not.toBeInTheDocument();
  });

  it('trata ausência de toda a seção sem fabricar números', () => {
    render(<CurrentWeather city={mockWeatherData.city} current={null} unit="celsius" />);
    expect(screen.getAllByText('indisponível')).toHaveLength(5);
    expect(screen.getByText(/Horário da leitura indisponível/)).toBeInTheDocument();
    expect(screen.queryByText('0 °C')).not.toBeInTheDocument();
  });
});
