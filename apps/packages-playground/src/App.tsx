import './App.css';
import { ThemeSwitcher, useTheme } from '@signozhq/theme';
import { Button } from '@signozhq/button';
import { Switch } from '@signozhq/switch';
import { RadioGroup, RadioGroupItem } from '@signozhq/radio-group';

import { Typography } from '@signozhq/design-tokens';
import { Spacing } from '@signozhq/design-tokens';

function App() {
	const { theme, currentThemeColors } = useTheme();

	return (
		<>
			<h1>Theme Switcher and Button</h1>
			<ThemeSwitcher />

			<Button theme={theme} variant="primary">
				hey
			</Button>
			<Switch id="test" labelName={'Airplane mode'} disabled={false} />
			<Switch id="test" labelName={'Airplane mode'} disabled={false} />

			<RadioGroup defaultValue="option-one">
				<div className="flex items-center space-x-2">
					<RadioGroupItem value="option-one" id="option-one" />
					<label htmlFor="option-one">Option One</label>
				</div>
				<div className="flex items-center space-x-2">
					<RadioGroupItem value="option-two" id="option-two" />
					<label htmlFor="option-two">Option Two</label>
				</div>
			</RadioGroup>
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
