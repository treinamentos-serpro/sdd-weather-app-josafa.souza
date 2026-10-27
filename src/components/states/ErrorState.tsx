interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  disabled?: boolean;
}

export default function ErrorState({ message, onRetry, disabled = false }: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white backdrop-blur-md">
      <p role="alert" className="break-words">
        {message}
      </p>
      <button
        type="button"
        onClick={onRetry}
        disabled={disabled}
        className="mt-4 min-h-11 rounded-xl bg-accent-600 px-4 py-2 font-semibold text-white hover:bg-accent-500 hover:text-night-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Tentar novamente
      </button>
    </div>
  );
}
