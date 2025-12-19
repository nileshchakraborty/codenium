import { useEffect, useState, type ReactNode } from 'react';
import { ThemeContext, type Theme } from './themeContextDef';

function getSystemTheme(): Theme {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

function getInitialTheme(): Theme {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('codenium-theme');
        // Only use stored value if it's valid
        if (stored === 'dark' || stored === 'light') {
            return stored;
        }
    }
    // Fall back to system preference
    return getSystemTheme();
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(getInitialTheme);

    // Apply theme to document
    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('codenium-theme', theme);
    }, [theme]);

    // Listen for system preference changes (only if no stored preference)
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e: MediaQueryListEvent) => {
            // Only auto-switch if user hasn't set a preference
            const stored = localStorage.getItem('codenium-theme');
            if (!stored) {
                setThemeState(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const toggleTheme = () => {
        setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// useTheme hook is now in ./useTheme.ts for Fast Refresh compatibility
