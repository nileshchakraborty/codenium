import CodeniumLogo from '../assets/logo.svg';

import { CheckCircle, Pencil } from 'lucide-react';

interface SharedHeaderProps {
  currentRoute: 'algo' | 'system-design';
  onNavigate: (route: '/' | '/system-design') => void;
  showStats?: boolean;
  stats?: {
    total: number;
    easy: number;
    medium: number;
    hard: number;
    solved?: number;
    attempted?: number;
  };
  ThemeToggleComponent?: React.ComponentType;
  LoginButtonComponent?: React.ComponentType;
}

export function SharedHeader({
  currentRoute,
  onNavigate,
  showStats = false,
  stats,
  ThemeToggleComponent,
  LoginButtonComponent
}: SharedHeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/50 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-20 group-hover:opacity-40 blur-md transition-opacity" />
              <img src={CodeniumLogo} alt="Codenium" className="relative w-9 h-9 sm:w-10 sm:h-10 transform group-hover:scale-105 transition-transform duration-300" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 tracking-tight">
              Codenium
            </h1>
          </div>

          {/* Center Navigation - Desktop */}
          <nav className="flex items-center p-1 bg-slate-100/80 dark:bg-slate-800/50 rounded-full border border-slate-200/60 dark:border-white/10 z-50 backdrop-blur-md">
            <button 
              onClick={() => onNavigate('/')}
              className={`relative px-8 py-3 text-sm font-bold rounded-full transition-all duration-300 cursor-pointer ${currentRoute === 'algo' ? 'bg-white dark:bg-indigo-600/90 text-indigo-600 dark:text-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] ring-1 ring-black/5' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-white/5'}`}
            >
              Algo & DS
            </button>
            <button 
              onClick={() => onNavigate('/system-design')}
              className={`relative px-8 py-3 text-sm font-bold rounded-full transition-all duration-300 cursor-pointer ${currentRoute === 'system-design' ? 'bg-white dark:bg-indigo-600/90 text-indigo-600 dark:text-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] ring-1 ring-black/5' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-white/5'}`}
            >
              System Design
            </button>
          </nav>

          {/* Mobile Navigation - Compact */}
          <nav className="md:hidden flex items-center p-1 bg-slate-100/80 dark:bg-slate-900/50 rounded-full border border-slate-200 dark:border-white/5 backdrop-blur-md">
            <button 
              onClick={() => onNavigate('/')}
              className={`px-4 py-2 text-xs font-semibold rounded-full transition-all ${currentRoute === 'algo' ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
            >
              Algo
            </button>
            <button 
              onClick={() => onNavigate('/system-design')}
              className={`px-4 py-2 text-xs font-semibold rounded-full transition-all ${currentRoute === 'system-design' ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
            >
              Systems
            </button>
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
             {showStats && stats && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100/50 dark:bg-slate-900/50 rounded-full border border-slate-200 dark:border-white/5">
                <div className="flex items-center gap-2 pr-3 border-r border-slate-200 dark:border-white/10">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white">{stats.total}</span>
                </div>
                <div className="flex items-center gap-3 pl-1">
                  <div className="flex items-center gap-1.5" title="Easy">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{stats.easy}</span>
                  </div>
                  <div className="flex items-center gap-1.5" title="Medium">
                    <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
                    <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{stats.medium}</span>
                  </div>
                  <div className="flex items-center gap-1.5" title="Hard">
                    <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]" />
                    <span className="text-sm font-bold text-rose-600 dark:text-rose-400">{stats.hard}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Progress Mini-Bar (Authenticated) */}
            {showStats && stats && stats.solved !== undefined && stats.attempted !== undefined && (
              <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 bg-slate-100/50 dark:bg-slate-900/50 rounded-full border border-slate-200 dark:border-white/5">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-emerald-500" />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{stats.solved}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Pencil size={12} className="text-amber-500" />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{stats.attempted}</span>
                  </div>
              </div>
            )}

            <div className="flex items-center gap-2">
               {ThemeToggleComponent && <ThemeToggleComponent />}
               {LoginButtonComponent && <LoginButtonComponent />}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
