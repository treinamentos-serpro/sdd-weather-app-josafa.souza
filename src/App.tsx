import { useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import UnitToggle from './components/UnitToggle';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import { mockWeatherData } from './mocks/weatherData';
import type { Unit } from './types/weather';

const demoStates = ['idle', 'loading', 'empty', 'error', 'success'] as const;
type DemoState = (typeof demoStates)[number];
const stateLabels: Record<DemoState, string> = {
  idle: 'Inicial',
  loading: 'Carregando',
  empty: 'Sem resultados',
  error: 'Erro',
  success: 'Sucesso',
};

export default function App() {
  const [unit, setUnit] = useState<Unit>('celsius');
  const [status, setStatus] = useState<DemoState>('idle');

  function searchDemo(city: string) {
    const normalized = city.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase('pt-BR');
    setStatus(normalized === 'sao paulo' ? 'success' : 'empty');
  }

  return (
    <div className="min-h-screen bg-night-900 font-sans text-white">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center">
          <h1 className="text-2xl font-bold">Weather App</h1>
          <SearchBar onSearch={searchDemo} disabled={status === 'loading'} />
          <UnitToggle unit={unit} onChange={setUnit} />
        </header>
        <aside
          aria-label="Controles da demonstração"
          className="my-6 rounded-2xl border border-white/10 bg-white/5 p-4"
        >
          <p className="mb-3 text-sm text-white/80">
            Demonstração com dados fictícios fixos de São Paulo (29/10 a 02/11/2026), sem API.
            Busque São Paulo para exibir a fixture; outros nomes não possuem dados nesta
            demonstração. O estado de carregamento é estático e pode ser alterado no seletor.
          </p>
          <label htmlFor="demo-state" className="mb-2 block font-medium">
            Estado de demonstração
          </label>
          <select
            id="demo-state"
            value={status}
            onChange={(event) => {
              const next = demoStates.find((state) => state === event.target.value);
              if (!next) throw new RangeError('Estado de demonstração inválido');
              setStatus(next);
            }}
            className="min-h-11 w-full rounded-xl border border-white/20 bg-night-800 px-3 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 sm:w-auto"
          >
            {demoStates.map((state) => (
              <option key={state} value={state}>
                {stateLabels[state]}
              </option>
            ))}
          </select>
        </aside>
        <main id="main-content" className="min-w-0 space-y-6">
          {status === 'idle' && (
            <EmptyState
              title="Busque uma cidade"
              hint="Digite São Paulo para conhecer a demonstração."
            />
          )}
          {status === 'loading' && (
            <LoadingState message="Demonstração de carregamento dos dados…" />
          )}
          {status === 'empty' && (
            <EmptyState
              title="Nenhuma cidade encontrada na demonstração"
              hint="Apenas São Paulo está disponível nesta fixture. Confira a grafia e tente novamente."
            />
          )}
          {status === 'error' && (
            <ErrorState
              message="Erro simulado: não foi possível carregar os dados."
              onRetry={() => setStatus('success')}
            />
          )}
          {status === 'success' && (
            <>
              <CurrentWeather
                city={mockWeatherData.city}
                current={mockWeatherData.current}
                unit={unit}
              />
              <ForecastList days={mockWeatherData.days} unit={unit} today="2026-10-29" />
            </>
          )}
        </main>
        <footer className="mt-8 text-sm text-white/80">
          Dados de exemplo para desenvolvimento de UI. Não use esta demonstração para decisões
          meteorológicas.
        </footer>
      </div>
    </div>
  );
}
