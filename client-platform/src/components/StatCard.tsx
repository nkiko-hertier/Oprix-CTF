import clsx from 'clsx';
import type { LucideIcon } from 'lucide-react';

type StatCardProps = {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  className?: string;
};

export function StatCard({ label, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <div className={clsx('rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg', className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
        </div>
        <div className="rounded-full bg-brand-500/10 p-3 text-brand-300">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {trend ? <p className="mt-4 text-xs text-emerald-300">{trend}</p> : null}
    </div>
  );
}
