import { useId } from 'react';
import { formatForecastDay } from '../lib/format';
import { formatTemperature } from '../lib/temperature';
import { getWeatherCondition } from '../lib/weatherCodes';
import type { ForecastDay, Unit } from '../types/weather';

interface ForecastCardProps {
  day: ForecastDay;
  unit: Unit;
  today: string;
}

const probabilityFormatter = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });

export default function ForecastCard({ day, unit, today }: ForecastCardProps) {
  const headingId = useId();
  const condition = getWeatherCondition(day.weatherCode);
  const probability = day.precipitationProbabilityPercent;
  const probabilityLabel =
    probability !== null && Number.isFinite(probability) && probability >= 0 && probability <= 100
      ? `${probabilityFormatter.format(probability)} %`
      : 'indisponível';

  return (
    <article
      aria-labelledby={headingId}
      className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-4 text-white backdrop-blur-md"
    >
      <h3 id={headingId} className="break-words font-semibold">
        <time dateTime={day.date}>{formatForecastDay(day.date, today)}</time>
      </h3>
      <span role="img" aria-label={condition.description} className="my-4 block text-4xl text-sun">
        {condition.icon}
      </span>
      <p className="break-words text-sm text-white/80">{condition.description}</p>
      <dl className="mt-4 space-y-3">
        <div>
          <dt className="text-sm text-white/80">Máxima</dt>
          <dd className="break-words text-xl font-semibold">{formatTemperature(day.maxC, unit)}</dd>
        </div>
        <div>
          <dt className="text-sm text-white/80">Mínima</dt>
          <dd className="break-words text-lg">{formatTemperature(day.minC, unit)}</dd>
        </div>
        <div>
          <dt className="break-words text-sm text-white/80">
            Probabilidade máxima de chuva no dia
          </dt>
          <dd className="break-words">{probabilityLabel}</dd>
        </div>
      </dl>
    </article>
  );
}
