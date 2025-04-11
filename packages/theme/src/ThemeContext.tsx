import React, {
	createContext,
	useState,
	useContext,
	ReactNode,
	useEffect,
	useMemo,
} from 'react';
import { ThemeColors } from './ThemeColor';

export type ThemeColor = 'blue' | 'green' | 'amber' | 'cherry' | 'aqua';
export type Theme = 'light' | 'dark';

interface ThemeContextType {
	theme: Theme;
	themeColor: ThemeColor;
	setTheme: (theme: Theme) => void;
	setThemeColor: (color: ThemeColor) => void;
	availableThemes: Theme[];
	availableColors: ThemeColor[];
	currentThemeColors: (typeof ThemeColors)[Theme];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [theme, setThemeState] = useState<Theme>(() => {
		if (typeof window !== 'undefined') {
			const storedTheme = localStorage.getItem('theme') as Theme;
			if (storedTheme) return storedTheme;

			if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
				return 'dark';
			}
		}
		return 'light';
	});

	const [themeColor, setThemeColor] = useState<ThemeColor>(() => {
		if (typeof window !== 'undefined') {
			return (localStorage.getItem('themeColor') as ThemeColor) || 'blue';
		}
		return 'blue';
	});

	const currentThemeColors = useMemo(() => {
		return ThemeColors[theme];
	}, [theme]);

	const availableThemes: Theme[] = ['light', 'dark'];
	const availableColors: ThemeColor[] = [
		'blue',
		'green',
		'amber',
		'cherry',
		'aqua',
	];

	useEffect(() => {
		const root = window.document.documentElement;
		root.classList.remove('light', 'dark');
		root.classList.add(theme);
		root.setAttribute('data-theme-color', themeColor);
		localStorage.setItem('theme', theme);
		localStorage.setItem('themeColor', themeColor);
	}, [theme, themeColor]);

	return (
		<ThemeContext.Provider
			value={{
				theme,
				themeColor,
				setTheme: setThemeState,
				setThemeColor,
				availableThemes,
				availableColors,
				currentThemeColors,
			}}
		>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
};
