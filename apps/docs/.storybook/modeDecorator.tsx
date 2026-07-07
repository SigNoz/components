import { ChevronDown, Moon, Palette, Sun } from '@signozhq/icons';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './modeDecorator.module.css';

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
	};

	const controls = (
		<div className={styles.controls}>
			<div className={styles.themeSelector} data-theme-selector>
				<button
					type="button"
					onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
					className={styles.button}
					aria-label="Select theme"
					title="Select Theme"
					style={buttonStyle}
				>
					<Palette className={styles.icon} />
					<span className={styles.label}>{theme}</span>
					<ChevronDown className={styles.icon} />
				</button>
				{isThemeMenuOpen && (
					<div
						className={styles.dropdown}
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
								className={styles.dropdownItem}
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
				className={styles.button}
				aria-label="Toggle dark mode"
				title="Toggle Dark Mode"
				style={buttonStyle}
			>
				{isDarkMode ? <Sun className={styles.icon} /> : <Moon className={styles.icon} />}
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
