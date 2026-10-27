import { useId, useState } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  disabled?: boolean;
}

export default function SearchBar({ onSearch, disabled = false }: SearchBarProps) {
  const inputId = useId();
  const [query, setQuery] = useState('');
  return (
    <form
      role="search"
      aria-label="Busca de cidade"
      onSubmit={(event) => {
        event.preventDefault();
        const city = query.trim();
        if (!disabled && city) onSearch(city);
      }}
      className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-md"
    >
      <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-white">
        Nome da cidade
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          disabled={disabled}
          className="min-h-11 min-w-0 flex-1 rounded-xl border border-white/20 bg-night-900 px-3 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-400 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled || !query.trim()}
          className="min-h-11 rounded-xl bg-accent-600 px-4 font-semibold text-white hover:bg-accent-500 hover:text-night-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Buscar
        </button>
      </div>
    </form>
  );
}
