import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const baseClasses = 'bg-white/10 rounded';
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded',
  };
  
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-[wave_1.6s_ease-in-out_infinite]',
    none: '',
  };
  
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;
  
  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
    />
  );
}

/**
 * Skeleton for card-like components
 */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('bg-white/10 p-4 rounded-lg space-y-3', className)}>
      <Skeleton variant="rectangular" height={20} width="60%" />
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="rectangular" height={40} width="40%" />
    </div>
  );
}

/**
 * Skeleton for list items
 */
export function SkeletonListItem({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-4 p-4 bg-white/10 rounded-lg', className)}>
      <Skeleton variant="circular" width={48} height={48} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="rectangular" height={16} width="40%" />
        <Skeleton variant="text" width="60%" />
      </div>
    </div>
  );
}

export default Skeleton;

