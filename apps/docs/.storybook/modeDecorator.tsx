import { ChevronDown, Moon, Palette, Sun } from '@signozhq/icons';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './modeDecorator.css';

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

	const controls = (
		<div className={isDarkMode ? 'sb-mode-controls sb-mode-controls--dark' : 'sb-mode-controls'}>
			<div className="sb-mode-selector" data-theme-selector>
				<button
					type="button"
					onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
					aria-label="Select theme"
					title="Select Theme"
					className="sb-mode-button"
				>
					<Palette size={12} />
					<span className="sb-mode-button__label">{theme}</span>
					<ChevronDown size={12} />
				</button>
				{isThemeMenuOpen && (
					<div className="sb-mode-menu">
						{THEMES.map((t) => (
							<button
								type="button"
								key={t}
								onClick={() => selectTheme(t)}
								className={
									theme === t
										? 'sb-mode-menu__item sb-mode-menu__item--active'
										: 'sb-mode-menu__item'
								}
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
				aria-label="Toggle dark mode"
				title="Toggle Dark Mode"
				className="sb-mode-button"
			>
				{isDarkMode ? <Sun size={12} /> : <Moon size={12} />}
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
