import { LoaderCircle, RefreshCw } from "lucide-react";

interface PageStateProps {
  loading: boolean;
  error: string | null;
  loadingMessage?: string;
  onRetry?: () => void;
}

export default function PageState({
  loading,
  error,
  loadingMessage = "Loading...",
  onRetry,
}: PageStateProps) {
  if (loading) {
    return (
      <div className="flex min-h-[55vh] flex-col items-center justify-center px-4 text-center" role="status">
        <LoaderCircle className="h-10 w-10 animate-spin text-yellow-400" />
        <p className="mt-3 text-sm font-medium text-white/70">{loadingMessage}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[55vh] flex-col items-center justify-center px-4 text-center" role="alert">
        <div className="w-full max-w-md rounded-2xl border border-red-400/20 bg-red-500/10 p-6">
          <h2 className="text-lg font-semibold text-white">Unable to load this page</h2>
          <p className="mt-2 break-words text-sm text-white/65">{error}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mx-auto mt-5 flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-white/10 px-5 py-2.5 font-medium text-white transition-colors hover:bg-white/15"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
}
