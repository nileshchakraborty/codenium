export function SharedFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200/60 dark:border-white/5 py-8 backdrop-blur-sm bg-white/40 dark:bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Built for <span className="text-indigo-600 dark:text-indigo-400">Visual Learners</span>
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
              © {new Date().getFullYear()} Codenium. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-6">
             <a 
              href="/credits" 
              className="text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors font-medium"
            >
              Credits
            </a>
            <div className="h-4 w-px bg-slate-200 dark:bg-white/10 hidden sm:block" />
            <a 
              href="/privacy" 
              className="text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors font-medium"
            >
              Privacy
            </a>
            <a 
              href="/terms" 
              className="text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors font-medium"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
