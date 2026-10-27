import { useId } from 'react';
import { formatTemperature } from '../lib/temperature';
import { getWeatherCondition } from '../lib/weatherCodes';
import type { City, CurrentWeather as CurrentWeatherData, Unit } from '../types/weather';

interface CurrentWeatherProps {
  city: City;
  current: CurrentWeatherData | null;
  unit: Unit;
}

const numberFormatter = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });

function formatMetric(value: number | null | undefined, suffix: string): string {
  return value == null || !Number.isFinite(value)
    ? 'indisponível'
    : `${numberFormatter.format(value)} ${suffix}`;
}

export default function CurrentWeather({ city, current, unit }: CurrentWeatherProps) {
  const headingId = useId();
  const condition = getWeatherCondition(current?.weatherCode ?? null);
  const interval = current?.precipitationIntervalSeconds;
  const hasInterval = interval != null && Number.isFinite(interval) && interval > 0;
  const precipitationLabel = hasInterval
    ? `Precipitação em ${numberFormatter.format(interval / 60)} min`
    : 'Precipitação (intervalo indisponível)';
  const readingTime = current?.observedAt?.match(/T(\d{2}:\d{2})(?::\d{2})?$/)?.[1];
  const metrics = [
    { label: 'Umidade relativa', value: formatMetric(current?.relativeHumidityPercent, '%') },
    { label: 'Vento a 10 m', value: formatMetric(current?.windSpeedKmh, 'km/h') },
    {
      label: precipitationLabel,
      value: formatMetric(hasInterval ? current?.precipitationMm : null, 'mm'),
    },
    { label: 'Pressão local', value: formatMetric(current?.surfacePressureHpa, 'hPa') },
  ];

  return (
    <section
      aria-labelledby={headingId}
      className="min-w-0 rounded-3xl border border-white/10 bg-white/5 p-6 text-white backdrop-blur-md sm:p-8"
    >
      <h2 id={headingId} className="break-words text-2xl font-semibold">
        Clima atual em {city.name}
      </h2>
      <p className="break-words text-sm text-white/80">
        {[city.admin1, city.country].filter(Boolean).join(' — ')}
      </p>
      <div className="my-6 flex flex-wrap items-center gap-6">
        <p className="break-words text-6xl font-semibold tracking-tight sm:text-7xl">
          {formatTemperature(current?.temperatureC ?? null, unit)}
        </p>
        <span role="img" aria-label={condition.description} className="text-6xl text-sun">
          {condition.icon}
        </span>
      </div>
      <p className="text-lg">{condition.description}</p>
      <p className="mt-1 break-words text-sm text-white/80">
        {readingTime ? `Leitura às ${readingTime}` : 'Horário da leitura indisponível'}
        {' · '}
        {city.timezone}
      </p>
      <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {metrics.map(({ label, value }) => (
          <div key={label} className="min-w-0 rounded-xl border border-white/10 bg-white/5 p-4">
            <dt className="break-words text-sm text-white/80">{label}</dt>
            <dd className="mt-1 break-words text-xl font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
