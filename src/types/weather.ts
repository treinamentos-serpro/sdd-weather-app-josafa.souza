export type Unit = 'celsius' | 'fahrenheit';

export interface City {
  id: number;
  name: string;
  admin1: string | null;
  country: string | null;
  countryCode: string | null;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface CurrentWeather {
  temperatureC: number | null;
  weatherCode: number | null;
  /** Data e hora locais da leitura, interpretadas no fuso da cidade. */
  observedAt: string | null;
}

export interface ForecastDay {
  /** Data civil local no formato YYYY-MM-DD. */
  date: string;
  minC: number | null;
  maxC: number | null;
  weatherCode: number | null;
}

export interface WeatherData {
  city: City;
  current: CurrentWeather | null;
  /** Hoje local e os quatro dias seguintes, em ordem, após normalização. */
  days: ForecastDay[];
}
