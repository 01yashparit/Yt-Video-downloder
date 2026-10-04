import { Download, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="topbar sticky top-0 z-30 pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex max-w-4xl items-center gap-2 px-4 py-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-linear-to-br from-red-600 to-orange-500 text-white">
          <Download className="size-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-bold leading-tight sm:text-lg">YouTube Downloader</h1>
          <p className="muted truncate text-xs">Local Media Downloader</p>
        </div>
        <div className="line muted flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 font-mono text-[11px]">
          <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
          <span>Local Engine</span>
        </div>
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="line grid size-11 shrink-0 place-items-center rounded-xl transition active:scale-95"
        >
          {theme === 'dark' ? <Sun className="size-5" aria-hidden="true" /> : <Moon className="size-5" aria-hidden="true" />}
        </button>
      </div>
    </header>
  );
}
