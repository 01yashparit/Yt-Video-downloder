import { CircleCheck, Info, TriangleAlert } from 'lucide-react';

export interface ToastItem {
  id: number;
  kind: 'success' | 'error' | 'info';
  text: string;
}

export function Toasts({ items }: { items: ToastItem[] }) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-24 z-40 flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:bottom-auto sm:right-4 sm:top-20 sm:items-end"
    >
      {items.map((t) => (
        <div key={t.id} className="line solid rise flex max-w-sm items-center gap-2 rounded-xl px-4 py-3 text-sm shadow-lg">
          {t.kind === 'success' && <CircleCheck className="size-4 shrink-0 text-emerald-500" aria-hidden="true" />}
          {t.kind === 'error' && <TriangleAlert className="size-4 shrink-0 text-red-500" aria-hidden="true" />}
          {t.kind === 'info' && <Info className="size-4 shrink-0 text-sky-500" aria-hidden="true" />}
          <span>{t.text}</span>
        </div>
      ))}
    </div>
  );
}
