import React, { createContext, useState, useEffect, useContext } from 'react';

// Типы для темы
type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
    mode: ThemeMode;
    toggleTheme: () => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Получение темы из localStorage или использование светлой темы по умолчанию
    const [mode, setMode] = useState<ThemeMode>(() => {
        const savedTheme = localStorage.getItem('theme');
        return (savedTheme as ThemeMode) || 'light';
    });

    // Переключение темы
    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    // Сохранение темы в localStorage при изменении
    useEffect(() => {
        localStorage.setItem('theme', mode);

        // Применение класса к body для глобальных стилей
        if (mode === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }, [mode]);

    return (
        <ThemeContext.Provider value={{
            mode,
            toggleTheme,
            isDark: mode === 'dark'
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Хук для использования темы
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};