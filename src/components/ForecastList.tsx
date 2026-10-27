import { useId } from 'react';
import type { ForecastDay, Unit } from '../types/weather';
import ForecastCard from './ForecastCard';

interface ForecastListProps {
  days: readonly ForecastDay[];
  unit: Unit;
  today: string;
}

export default function ForecastList({ days, unit, today }: ForecastListProps) {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className="min-w-0 text-white">
      <h2 id={headingId} className="mb-4 text-2xl font-semibold">
        Previsão de cinco dias
      </h2>
      {days.length === 0 ? (
        <p role="status">Previsão indisponível</p>
      ) : (
        <ul className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {days.map((day) => (
            <li key={day.date} className="min-w-0">
              <ForecastCard day={day} unit={unit} today={today} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
