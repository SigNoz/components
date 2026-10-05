import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './badge/badge.js';
import { Button } from './button/button.js';
import { ButtonGroup } from './button-group/index.js';
import { Calendar } from './calendar/calendar.js';
import { Callout } from './callout/callout.js';
import { Checkbox } from './checkbox/checkbox.js';
import { Combobox } from './combobox/index.js';
import { Dropdown } from './dropdown/index.js';
import { openDropdown } from './dropdown/__tests__/dropdown.test-utils.js';
import { Progress } from './progress/progress.js';
import { RadioGroup } from './radio-group/radio-group.js';
import { Select } from './select/index.js';
import { Slider } from './slider/index.js';
import { Switch } from './switch/switch.js';
import { ForceOpenProvider } from './testing/index.js';
import { ToggleGroup } from './toggle-group/index.js';
import { Tooltip } from './tooltip/presets/tooltip.js';

// The types reject `className` and `style` on these components. This is the value that gets past
// them anyway: a cast, an untyped spread, a JavaScript caller.
const STRAY = { className: 'stray', style: { color: 'rgb(255, 0, 0)' } } as object;

function expectNoStrayStyle(element: HTMLElement | null): void {
	expect(element).not.toBeNull();
	expect(element).not.toHaveClass('stray');
	expect(element?.style.color).toBe('');
}

describe('className and style that get past the types', () => {
	it('do not reach Badge', () => {
		render(
			<Badge variant="solid" color="primary" testId="badge" {...STRAY}>
				Active
			</Badge>,
		);

		expectNoStrayStyle(screen.getByTestId('badge'));
	});

	it('do not reach Button', () => {
		render(
			<Button variant="solid" color="primary" size="md" testId="button" {...STRAY}>
				Save
			</Button>,
		);

		expectNoStrayStyle(screen.getByTestId('button'));
	});

	it('do not reach ButtonGroup', () => {
		render(
			<ButtonGroup
				variant="outlined"
				color="secondary"
				size="md"
				items={[{ value: 'day', label: 'Day', onClick: () => {} }]}
				testId="group"
				{...STRAY}
			/>,
		);

		expectNoStrayStyle(screen.getByTestId('group'));
	});

	it('do not reach Calendar, nor its per-part class names and styles', () => {
		render(
			<Calendar
				mode="single"
				testId="calendar"
				{...STRAY}
				{...({
					classNames: { day: 'stray' },
					styles: { day: { color: 'rgb(255, 0, 0)' } },
				} as object)}
			/>,
		);

		expectNoStrayStyle(screen.getByTestId('calendar'));
		expect(document.querySelector('.stray')).toBeNull();
	});

	it('do not reach Callout or its variants', () => {
		const icon = <svg />;
		render(
			<>
				<Callout color="primary" size="sm" icon={icon} testId="callout" {...STRAY}>
					a{' '}
					<Callout.Link href="/docs" testId="callout-link" {...STRAY}>
						docs
					</Callout.Link>
				</Callout>
				<Callout.Expandable
					color="primary"
					size="sm"
					icon={icon}
					title="t"
					defaultExpanded
					testId="expandable"
					{...STRAY}
				>
					a
				</Callout.Expandable>
				<Callout.Closeable
					color="primary"
					size="sm"
					icon={icon}
					testId="closeable"
					closed={false}
					onClose={() => {}}
					{...STRAY}
				>
					a
				</Callout.Closeable>
				<Callout.CloseablePersisted
					storageKey="k"
					color="primary"
					size="sm"
					icon={icon}
					testId="persisted"
					{...STRAY}
				>
					a
				</Callout.CloseablePersisted>
				<Callout.Action
					color="primary"
					size="sm"
					icon={icon}
					testId="action"
					action={
						<Callout.Button testId="callout-button" {...STRAY}>
							Refresh
						</Callout.Button>
					}
					{...STRAY}
				>
					a
				</Callout.Action>
			</>,
		);

		for (const testId of [
			'callout',
			'callout-link',
			'expandable',
			'closeable',
			'persisted',
			'action',
			'callout-button',
		]) {
			expectNoStrayStyle(screen.getByTestId(testId));
		}
	});

	it('do not reach Checkbox', () => {
		render(<Checkbox color="primary" testId="checkbox" {...STRAY} />);

		expectNoStrayStyle(screen.getByTestId('checkbox'));
	});

	it('do not reach Switch', () => {
		render(<Switch color="primary" testId="switch" {...STRAY} />);

		expectNoStrayStyle(screen.getByTestId('switch'));
	});

	it('do not reach Combobox', () => {
		render(
			<Combobox
				placeholder="Select a framework..."
				searchInputProps={{ placeholder: 'Search' }}
				aria-label="Framework"
				items={[{ type: 'item', value: 'react', label: 'React' }]}
				testId="combobox"
				{...STRAY}
			/>,
		);

		expectNoStrayStyle(screen.getByTestId('combobox'));
		expectNoStrayStyle(document.querySelector('[data-slot="combobox"]'));
	});

	it('do not reach Select', () => {
		render(
			<Select
				placeholder="Select a framework..."
				aria-label="Framework"
				items={[{ type: 'item', value: 'react', label: 'React' }]}
				testId="select"
				{...STRAY}
			/>,
		);

		expectNoStrayStyle(screen.getByTestId('select'));
		expectNoStrayStyle(document.querySelector('[data-slot="select"]'));
	});

	it('do not reach Progress', () => {
		render(<Progress color="primary" percent={40} testId="progress" {...STRAY} />);

		expectNoStrayStyle(screen.getByTestId('progress'));
	});

	it('do not reach Slider nor Slider.Range', () => {
		render(
			<>
				<Slider color="primary" aria-label="Volume" testId="slider" {...STRAY} />
				<Slider.Range color="primary" aria-label="Duration" testId="range" {...STRAY} />
			</>,
		);

		expectNoStrayStyle(screen.getByTestId('slider'));
		expectNoStrayStyle(screen.getByTestId('range'));
	});

	it('do not reach RadioGroup', () => {
		render(
			<RadioGroup
				color="primary"
				items={[{ label: 'Staging', value: 'staging' }]}
				testId="group"
				{...STRAY}
			/>,
		);

		expectNoStrayStyle(screen.getByTestId('group'));
	});

	it('do not reach ToggleGroup', () => {
		render(
			<ToggleGroup
				type="single"
				variant="outlined"
				color="secondary"
				size="md"
				items={[{ value: 'list', label: 'List' }]}
				testId="toggle-group"
				{...STRAY}
			/>,
		);

		expectNoStrayStyle(screen.getByTestId('toggle-group'));
	});

	it('do not reach the Tooltip popup', () => {
		render(
			<Tooltip title="Helpful information" {...STRAY}>
				<button type="button">Hover</button>
			</Tooltip>,
			{ wrapper: ForceOpenProvider },
		);

		expectNoStrayStyle(screen.getByRole('tooltip'));
		expectNoStrayStyle(screen.getByRole('button'));
	});

	it('do not reach the Dropdown popup', async () => {
		render(
			<Dropdown
				nativeButton
				side="bottom"
				align="start"
				items={[{ type: 'item', value: 'rename', label: 'Rename' }]}
				{...STRAY}
			>
				<button type="button">Actions</button>
			</Dropdown>,
		);

		expectNoStrayStyle(await openDropdown());
	});
});
