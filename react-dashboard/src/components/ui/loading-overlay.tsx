import { LoadingSpinner } from './loading-spinner';
import { cn } from '@/lib/utils';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  className?: string;
  fullScreen?: boolean;
}

export function LoadingOverlay({
  isLoading,
  message,
  className,
  fullScreen = false,
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div
      className={cn(
        'absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50',
        fullScreen && 'fixed',
        className
      )}
    >
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner size="lg" />
        {message && (
          <p className="text-white text-sm font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}

export default LoadingOverlay;

