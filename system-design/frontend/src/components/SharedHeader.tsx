import CodeniumLogo from '../assets/logo.svg';

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
    <header className="mb-6 sm:mb-8 border-b border-slate-200 dark:border-slate-800 pb-4 sm:pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <img src={CodeniumLogo} alt="Codenium" className="w-8 h-8 sm:w-10 sm:h-10" />
            <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
              Codenium
            </h1>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6 ml-8">
            <button
              onClick={() => onNavigate('/')}
              className={`text-sm font-semibold pb-1 transition-all ${currentRoute === 'algo' ? 'text-indigo-500 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-indigo-400'}`}
            >
              Algo & DS
            </button>
            <button
              onClick={() => onNavigate('/system-design')}
              className={`text-sm font-semibold pb-1 transition-all ${currentRoute === 'system-design' ? 'text-indigo-500 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-indigo-400'}`}
            >
              System Design
            </button>
          </nav>

          {/* Controls Row */}
          <div className="flex items-center gap-3 sm:gap-4 justify-between lg:justify-end w-full lg:w-auto">
            {/* Login Button */}
            {LoginButtonComponent && <LoginButtonComponent />}

            {/* Theme Toggle + Stats */}
            <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-2 lg:pb-0 custom-scrollbar mask-fade-right">
              {ThemeToggleComponent && <ThemeToggleComponent />}
              
              {showStats && stats && (
                <>
                  <div className="flex flex-col items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 min-w-[60px] sm:min-w-[80px] shadow-sm flex-shrink-0">
                    <span className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">{stats.total}</span>
                    <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wide">Total</span>
                  </div>
                  <div className="flex flex-col items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl min-w-[50px] sm:min-w-[70px] flex-shrink-0">
                    <span className="text-base sm:text-xl font-bold text-emerald-600 dark:text-emerald-400">{stats.easy}</span>
                    <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wide">Easy</span>
                  </div>
                  <div className="flex flex-col items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl min-w-[50px] sm:min-w-[70px] flex-shrink-0">
                    <span className="text-base sm:text-xl font-bold text-amber-600 dark:text-amber-400">{stats.medium}</span>
                    <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wide">Med</span>
                  </div>
                  <div className="flex flex-col items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl min-w-[50px] sm:min-w-[70px] flex-shrink-0">
                    <span className="text-base sm:text-xl font-bold text-rose-600 dark:text-rose-400">{stats.hard}</span>
                    <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wide">Hard</span>
                  </div>

                  {/* Progress stats if provided */}
                  {stats.solved !== undefined && stats.attempted !== undefined && (
                    <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl flex-shrink-0">
                      <div className="flex items-center gap-1.5" title="Completed">
                        <span className="text-sm font-bold text-emerald-500">{stats.solved}</span>
                      </div>
                      <div className="w-px h-5 bg-slate-300 dark:bg-slate-700" />
                      <div className="flex items-center gap-1.5" title="In Progress">
                        <span className="text-sm font-bold text-amber-500">{stats.attempted}</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
