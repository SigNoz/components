import React from 'react';

import { Button } from '@signozhq/button';
import './App.css';
import { ThemeSwitcher } from '@signozhq/theme';
import { Checkbox } from '@signozhq/checkbox';
import { Switch } from '@signozhq/switch';
import { RadioGroup, RadioGroupItem } from '@signozhq/radio-group';

function App() {
	return (
		<div>
			<h1>Theme Switcher and Button</h1>
			<ThemeSwitcher />
			<Button variant="primary">hey</Button>
			<div className="flex items-center space-x-2">
				<Checkbox id="terms" />
				<label
					htmlFor="terms"
					className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					Accept terms and conditions
				</label>
			</div>
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
		</div>
	);
}

export default App;
