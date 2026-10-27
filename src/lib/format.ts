const weekdayFormatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', timeZone: 'UTC' });
const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  timeZone: 'UTC',
});

function parseLocalDate(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new RangeError(`Data local inválida: ${value}`);
  }
  const date = new Date(`${value}T12:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new RangeError(`Data local inválida: ${value}`);
  }
  return date;
}

export function formatForecastDay(date: string, today: string): string {
  const parsedDate = parseLocalDate(date);
  parseLocalDate(today);
  const weekday = weekdayFormatter.format(parsedDate).replace(/\.$/, '');
  const label = date === today ? `Hoje (${weekday})` : weekday;
  return `${label}, ${dateFormatter.format(parsedDate)}`;
}
