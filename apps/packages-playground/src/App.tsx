import React from 'react';
import './App.css';
import { ThemeSwitcher, useTheme } from '@signozhq/theme';
import { Button } from '@signozhq/button';
import { Typography } from '@signozhq/design-tokens';
import { Spacing } from '@signozhq/design-tokens';

function App() {
	const { theme, currentThemeColors } = useTheme();

	return (
		<>
			<h1>Theme Switcher and Button</h1>
			<ThemeSwitcher />

			<Button theme={theme} variant="default">
				hey
			</Button>

			<h1>Design tokens</h1>
			<p
				style={{
					background: currentThemeColors.TEXT_COLOR,
					letterSpacing: Spacing.MARGIN_10,
					fontSize: Typography.FONTSIZE_3XL,
				}}
			>
				hey
			</p>
		</>
	);
}

export default App;
