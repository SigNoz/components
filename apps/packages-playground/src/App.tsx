import './App.css';

import { ThemeSwitcher, useTheme } from '@signozhq/theme';
import Button from '@signozhq/button';
import { Typography } from '@signozhq/design-tokens';
import { Spacing } from '@signozhq/design-tokens';
import { ColorTailwind } from '@signozhq/design-tokens';
import { ArrowBigRightDash, Wrench } from 'lucide-react';

function App() {
	const { currentThemeColors } = useTheme();
	console.log(ColorTailwind);

	return (
		<>
			<h1>Theme Switcher and Button</h1>
			<ThemeSwitcher />

			<Button
				backgroundColor="robin-500"
				textColor="vanilla-100"
				size="md"
				prefixIcon={<Wrench />}
				suffixIcon={<ArrowBigRightDash />}
			>
				Click Me
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
