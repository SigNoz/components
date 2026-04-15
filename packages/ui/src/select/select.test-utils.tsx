import { render } from '@testing-library/react';
import { Select } from './components/select.js';
import { SelectContent } from './components/select-content.js';
import { SelectItem } from './components/select-item.js';
import { SelectTrigger } from './components/select-trigger.js';

export function renderSingleSelect({
	value,
	defaultValue,
	onChange,
	disabled,
	placeholder = 'Pick an option',
}: {
	value?: string;
	defaultValue?: string;
	onChange?: (v: string | string[]) => void;
	disabled?: boolean;
	placeholder?: string;
} = {}): ReturnType<typeof render> {
	return render(
		<Select value={value} defaultValue={defaultValue} onChange={onChange} disabled={disabled}>
			<SelectTrigger placeholder={placeholder} />
			<SelectContent withPortal={false}>
				<SelectItem value="apple">Apple</SelectItem>
				<SelectItem value="banana">Banana</SelectItem>
				<SelectItem value="cherry">Cherry</SelectItem>
			</SelectContent>
		</Select>
	);
}

export function renderMultiSelect({
	value,
	defaultValue,
	onChange,
}: {
	value?: string[];
	defaultValue?: string[];
	onChange?: (v: string | string[]) => void;
} = {}): ReturnType<typeof render> {
	return render(
		<Select multiple value={value} defaultValue={defaultValue} onChange={onChange}>
			<SelectTrigger placeholder="Pick options" />
			<SelectContent withPortal={false}>
				<SelectItem value="red">Red</SelectItem>
				<SelectItem value="green">Green</SelectItem>
				<SelectItem value="blue">Blue</SelectItem>
			</SelectContent>
		</Select>
	);
}

export const selectSimpleItems = [
	{ value: 'react', label: 'React' },
	{ value: 'vue', label: 'Vue' },
	{ value: 'angular', label: 'Angular' },
];
