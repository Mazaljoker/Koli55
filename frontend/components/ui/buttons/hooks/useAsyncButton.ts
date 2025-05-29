import { useState, useCallback } from "react";

interface UseAsyncButtonOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  loadingText?: string;
}

interface UseAsyncButtonReturn {
  loading: boolean;
  error: Error | null;
  execute: (action: () => Promise<void>) => Promise<void>;
  reset: () => void;
}

/**
 * Hook to manage async button states uniformly across the app
 * Provides loading state, error handling, and success callbacks
 */
export function useAsyncButton(
  options: UseAsyncButtonOptions = {}
): UseAsyncButtonReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (action: () => Promise<void>) => {
      if (loading) return; // Prevent double execution

      setLoading(true);
      setError(null);

      try {
        await action();
        options.onSuccess?.();
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Une erreur est survenue");
        setError(error);
        options.onError?.(error);
      } finally {
        setLoading(false);
      }
    },
    [loading, options]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return {
    loading,
    error,
    execute,
    reset,
  };
}
