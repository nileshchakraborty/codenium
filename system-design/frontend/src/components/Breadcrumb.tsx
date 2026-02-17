import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbProps {
  problemTitle: string;
  categoryName?: string;
  onNavigateToHome: () => void;
  onNavigateToCategory?: () => void;
}

export function Breadcrumb({
  problemTitle,
  categoryName,
  onNavigateToHome,
  onNavigateToCategory
}: BreadcrumbProps) {
  return (
    <nav className="breadcrumb-nav">
      <button
        onClick={onNavigateToHome}
        className="breadcrumb-link"
      >
        <Home size={16} />
        <span>System Design</span>
      </button>
      
      {categoryName && (
        <>
          <ChevronRight size={16} className="breadcrumb-separator" />
          {onNavigateToCategory ? (
            <button
              onClick={onNavigateToCategory}
              className="breadcrumb-link"
            >
              {categoryName}
            </button>
          ) : (
            <span className="breadcrumb-category">{categoryName}</span>
          )}
        </>
      )}
      
      <ChevronRight size={16} className="breadcrumb-separator" />
      <span className="breadcrumb-current">{problemTitle}</span>
    </nav>
  );
}
