import { ChevronDown, Moon, Palette, Sun } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const THEMES = ['default', 'blue-demo'] as const;
type Theme = (typeof THEMES)[number];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ModeDecorator = (Story: any, context: { title?: string }) => {
	const isDesignSystemPages = context?.title?.startsWith('Design System');
	const [isDarkMode, setIsDarkMode] = useState(true);
	const [theme, setTheme] = useState<Theme>('default');
	const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
	const [mounted, setMounted] = useState(false);

	const toggleMode = useCallback(() => {
		setIsDarkMode(!isDarkMode);
		document.documentElement.classList.toggle('dark', !isDarkMode);
	}, [isDarkMode]);

	const selectTheme = useCallback((newTheme: Theme) => {
		setTheme(newTheme);
		document.documentElement.setAttribute('data-theme', newTheme);
		setIsThemeMenuOpen(false);
	}, []);

	useEffect(() => {
		document.documentElement.classList.add('dark');
		document.documentElement.setAttribute('data-theme', 'default');
		setMounted(true);
	}, []);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			if (!target.closest('[data-theme-selector]')) {
				setIsThemeMenuOpen(false);
			}
		};
		if (isThemeMenuOpen) {
			document.addEventListener('click', handleClickOutside);
			return () => document.removeEventListener('click', handleClickOutside);
		}
	}, [isThemeMenuOpen]);

	const buttonStyle = {
		backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
		borderColor: isDarkMode ? '#4b5563' : '#d1d5db',
		color: isDarkMode ? '#ffffff' : '#000000',
		padding: '0.375rem',
	};

	const controls = (
		<div className="fixed top-4 right-4 z-50 flex items-center gap-2">
			<div className="relative" data-theme-selector>
				<button
					type="button"
					onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
					className="flex items-center gap-1 rounded-2xl border shadow-lg hover:scale-105 transition-transform cursor-pointer"
					aria-label="Select theme"
					title="Select Theme"
					style={buttonStyle}
				>
					<Palette className="w-3 h-3" />
					<span className="text-xs capitalize">{theme}</span>
					<ChevronDown className="w-3 h-3" />
				</button>
				{isThemeMenuOpen && (
					<div
						className="absolute top-full right-0 mt-1 rounded-lg border shadow-lg overflow-hidden min-w-[120px]"
						style={{
							backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
							borderColor: isDarkMode ? '#4b5563' : '#d1d5db',
						}}
					>
						{THEMES.map((t) => (
							<button
								type="button"
								key={t}
								onClick={() => selectTheme(t)}
								className="w-full px-3 py-2 text-left text-xs capitalize hover:bg-opacity-80 transition-colors cursor-pointer"
								style={{
									backgroundColor:
										theme === t ? (isDarkMode ? '#374151' : '#e5e7eb') : 'transparent',
									color: isDarkMode ? '#ffffff' : '#000000',
								}}
							>
								{t}
							</button>
						))}
					</div>
				)}
			</div>
			<button
				type="button"
				onClick={toggleMode}
				className="rounded-2xl border shadow-lg hover:scale-105 transition-transform cursor-pointer"
				aria-label="Toggle dark mode"
				title="Toggle Dark Mode"
				style={buttonStyle}
			>
				{isDarkMode ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
			</button>
		</div>
	);

	return (
		<>
			{mounted && !isDesignSystemPages && createPortal(controls, document.body)}
			<Story />
		</>
	);
};
