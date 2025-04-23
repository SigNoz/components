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
			<div className="space-y-2 border border-dashed border-indigo-400 p-4 rounded-md">
				<Checkbox id="default" labelName="Default checkbox" />
				<Checkbox id="hover" labelName="Hover checkbox" />
				<Checkbox id="filled" labelName="Filled checkbox" defaultChecked />
				<Checkbox id="disabled" labelName="Disabled checkbox" disabled />
				<Checkbox
					id="disabled-filled"
					labelName="Disabled Filled"
					disabled
					checked
				/>
			</div>
			<Switch id="test" labelName={'Airplane mode'} disabled={false} />
			<Switch id="test2" labelName={'bluetooth'} disabled={false} />

			<RadioGroup defaultValue="">
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
