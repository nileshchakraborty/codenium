export function SharedFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} Codenium. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a 
              href="#" 
              className="text-sm text-slate-500 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="text-sm text-slate-500 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
            >
              Terms of Service
            </a>
            <a 
              href="#" 
              className="text-sm text-slate-500 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
            >
              Docs
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
