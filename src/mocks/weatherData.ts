import type { WeatherData } from '../types/weather';

/** Fixture sintética da spec 4.1; datas fixas, não representa previsão real. */
export const mockWeatherData: WeatherData = {
  city: {
    id: 3448439,
    name: 'São Paulo',
    admin1: 'São Paulo',
    country: 'Brasil',
    countryCode: 'BR',
    latitude: -23.5475,
    longitude: -46.6361,
    timezone: 'America/Sao_Paulo',
  },
  current: {
    temperatureC: 25,
    weatherCode: 2,
    observedAt: '2026-10-29T09:45',
  },
  days: [
    { date: '2026-10-29', minC: 18, maxC: 27, weatherCode: 2 },
    { date: '2026-10-30', minC: 17, maxC: 26, weatherCode: 61 },
    { date: '2026-10-31', minC: 16, maxC: 24, weatherCode: 3 },
    { date: '2026-11-01', minC: 15, maxC: 22, weatherCode: 0 },
    { date: '2026-11-02', minC: 17, maxC: 25, weatherCode: 80 },
  ],
};
