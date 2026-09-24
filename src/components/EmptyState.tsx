interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 animate-fade-in">
      {icon && (
        <div className="w-16 h-16 rounded-full bg-ink-100 flex items-center justify-center mb-5 text-ink-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-ink-800 mb-1.5">{title}</h3>
      {message && <p className="text-sm text-ink-500 max-w-sm">{message}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-5">
        <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-ink-800 mb-1.5">Something went wrong</h3>
      <p className="text-sm text-ink-500 max-w-sm mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="h-10 px-5 rounded-lg text-sm font-medium bg-ink-900 text-white hover:bg-ink-800"
        >
          Try again
        </button>
      )}
    </div>
  );
}
