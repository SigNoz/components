import React from 'react';
import { useTheme } from './ThemeContext';

export const ThemeSwitcher: React.FC = () => {
	const {
		theme,
		themeColor,
		setTheme,
		setThemeColor,
		availableThemes,
		availableColors,
	} = useTheme();

	return (
		<div className="flex flex-col gap-4">
			<div>
				<h3>Current Theme: {theme}</h3>
				<div className="flex gap-2">
					{availableThemes.map((t) => (
						<button
							key={t}
							onClick={() => setTheme(t)}
							className={`px-4 py-2 rounded ${
								theme === t
									? 'bg-primary text-primary-foreground'
									: 'bg-secondary text-secondary-foreground'
							}`}
						>
							{t}
						</button>
					))}
				</div>
			</div>

			<div>
				<h3>Current Color: {themeColor}</h3>
				<div className="flex gap-2">
					{availableColors.map((color) => (
						<button
							key={color}
							onClick={() => setThemeColor(color)}
							className={`px-4 py-2 rounded ${
								themeColor === color
									? 'bg-primary text-primary-foreground'
									: 'bg-secondary text-secondary-foreground'
							}`}
						>
							{color}
						</button>
					))}
				</div>
			</div>
		</div>
	);
};
