import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ToggleGroupField } from '../presets/toggle-group-field.js';
import { ToggleGroup } from '../toggle-group.js';
import type { ToggleGroupItemProps } from '../types.js';

const BAR = { variant: 'outlined', color: 'secondary', size: 'md' } as const;

const ITEMS: ToggleGroupItemProps[] = [
	{ value: 'list', label: 'List' },
	{ value: 'grid', label: 'Grid' },
	{ value: 'table', label: 'Table' },
];

const FIRST_DISABLED: ToggleGroupItemProps[] = [
	{ value: 'list', label: 'List', disabled: true, disabledTooltip: 'Not for this view' },
	{ value: 'grid', label: 'Grid' },
	{ value: 'table', label: 'Table' },
];

function spyOnConsole() {
	return {
		error: vi.spyOn(console, 'error').mockImplementation(() => {}),
		warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
	};
}

function expectNothingPressed(): void {
	for (const button of screen.getAllByRole('button')) {
		expect(button).toHaveAttribute('aria-pressed', 'false');
	}
}

function pressed(name: string): void {
	expect(screen.getByRole('button', { name })).toHaveAttribute('aria-pressed', 'true');
}

afterEach(() => {
	vi.restoreAllMocks();
});

describe('ToggleGroup single nullable', () => {
	it('shows nothing pressed for a null value', () => {
		const logged = spyOnConsole();
		render(<ToggleGroup type="single" {...BAR} items={ITEMS} nullable value={null} />);

		expectNothingPressed();
		expect(logged.error).not.toHaveBeenCalled();
		expect(logged.warn).not.toHaveBeenCalled();
	});

	it('keeps a bar uncontrolled while the value is undefined, as without nullable', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<ToggleGroup
				type="single"
				{...BAR}
				items={ITEMS}
				nullable
				value={undefined}
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('button', { name: 'Grid' }));

		expect(onChange).toHaveBeenCalledWith('grid');
		pressed('Grid');
	});

	it('takes a value after null with no warning', () => {
		const logged = spyOnConsole();
		const { rerender } = render(
			<ToggleGroup type="single" {...BAR} items={ITEMS} nullable value={null} />,
		);

		rerender(<ToggleGroup type="single" {...BAR} items={ITEMS} nullable value="grid" />);

		pressed('Grid');

		rerender(<ToggleGroup type="single" {...BAR} items={ITEMS} nullable value={null} />);

		expectNothingPressed();
		expect(logged.error).not.toHaveBeenCalled();
		expect(logged.warn).not.toHaveBeenCalled();
	});

	it('reports null when the pressed button is released with allowClear', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<ToggleGroup
				type="single"
				{...BAR}
				items={ITEMS}
				nullable
				allowClear
				value="grid"
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('button', { name: 'Grid' }));

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith(null);
	});

	it('follows a form state that starts null, and goes back to null on a release', async () => {
		const user = userEvent.setup();
		const logged = spyOnConsole();
		const reported: Array<string | null> = [];

		function Controlled(): JSX.Element {
			const [value, setValue] = useState<string | null>(null);

			return (
				<ToggleGroupField
					label="Layout"
					type="single"
					{...BAR}
					items={ITEMS}
					nullable
					allowClear
					name="layout"
					value={value}
					onBlur={() => {}}
					onChange={(next) => {
						reported.push(next);
						setValue(next);
					}}
				/>
			);
		}

		render(<Controlled />);

		await user.click(screen.getByRole('button', { name: 'Table' }));

		pressed('Table');

		await user.click(screen.getByRole('button', { name: 'Table' }));

		expectNothingPressed();
		expect(reported).toEqual(['table', null]);
		expect(logged.error).not.toHaveBeenCalled();
		expect(logged.warn).not.toHaveBeenCalled();
	});

	it('reports null for an uncontrolled bar too', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<ToggleGroup
				type="single"
				{...BAR}
				items={ITEMS}
				nullable
				allowClear
				defaultValue="list"
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('button', { name: 'List' }));

		expect(onChange).toHaveBeenCalledWith(null);
		expectNothingPressed();
	});

	it('keeps the pressed button pressed without allowClear', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<ToggleGroup
				type="single"
				{...BAR}
				items={ITEMS}
				nullable
				defaultValue="list"
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('button', { name: 'List' }));

		expect(onChange).not.toHaveBeenCalled();
		pressed('List');
	});

	it('keeps an uncontrolled bar uncontrolled while no value is written', async () => {
		const user = userEvent.setup();
		render(<ToggleGroup type="single" {...BAR} items={ITEMS} nullable />);

		await user.click(screen.getByRole('button', { name: 'Grid' }));

		pressed('Grid');
	});

	it('treats the empty string as the empty bar too', () => {
		render(<ToggleGroup type="single" {...BAR} items={ITEMS} nullable value="" />);

		expectNothingPressed();
	});

	it('submits nothing for an empty value and the pressed button for a value', () => {
		const { rerender } = render(
			<form aria-label="Preferences">
				<ToggleGroup type="single" {...BAR} items={ITEMS} nullable name="layout" value={null} />
			</form>,
		);
		const form = screen.getByRole('form') as HTMLFormElement;

		expect(new FormData(form).getAll('layout')).toEqual([]);

		rerender(
			<form aria-label="Preferences">
				<ToggleGroup type="single" {...BAR} items={ITEMS} nullable name="layout" value="grid" />
			</form>,
		);

		expect(new FormData(form).getAll('layout')).toEqual(['grid']);

		rerender(
			<form aria-label="Preferences">
				<ToggleGroup type="single" {...BAR} items={ITEMS} nullable name="layout" value={null} />
			</form>,
		);

		expect(new FormData(form).getAll('layout')).toEqual([]);
	});

	it.each([
		['undefined', undefined],
		['null', null],
	])('gives the first button that is not disabled to the ref of a field with %s', (_, empty) => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<ToggleGroupField
				label="Layout"
				type="single"
				{...BAR}
				items={FIRST_DISABLED}
				nullable
				value={empty}
				ref={ref}
			/>,
		);

		ref.current?.focus();

		expect(screen.getByRole('button', { name: 'Grid' })).toHaveFocus();
	});

	it('gives the pressed button to the ref once the value arrives', () => {
		const ref = createRef<HTMLButtonElement>();
		const { rerender } = render(
			<ToggleGroupField
				label="Layout"
				type="single"
				{...BAR}
				items={ITEMS}
				nullable
				value={null}
				ref={ref}
			/>,
		);

		rerender(
			<ToggleGroupField
				label="Layout"
				type="single"
				{...BAR}
				items={ITEMS}
				nullable
				value="table"
				ref={ref}
			/>,
		);
		ref.current?.focus();

		expect(screen.getByRole('button', { name: 'Table' })).toHaveFocus();
	});
});

describe('ToggleGroup single without nullable', () => {
	it('still reports the empty string when the pressed button is released', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<ToggleGroup
				type="single"
				{...BAR}
				items={ITEMS}
				allowClear
				value="grid"
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('button', { name: 'Grid' }));

		expect(onChange).toHaveBeenCalledWith('');
	});

	it('keeps a bar uncontrolled while the value is undefined', async () => {
		const user = userEvent.setup();
		render(<ToggleGroup type="single" {...BAR} items={ITEMS} value={undefined} />);

		await user.click(screen.getByRole('button', { name: 'Grid' }));

		pressed('Grid');
	});
});

describe('ToggleGroup multiple nullable', () => {
	it('shows nothing pressed for a null value', () => {
		const logged = spyOnConsole();
		render(<ToggleGroup type="multiple" {...BAR} items={ITEMS} nullable value={null} />);

		expectNothingPressed();
		expect(logged.error).not.toHaveBeenCalled();
		expect(logged.warn).not.toHaveBeenCalled();
	});

	it('keeps a bar uncontrolled while the value is undefined, as without nullable', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<ToggleGroup
				type="multiple"
				{...BAR}
				items={ITEMS}
				nullable
				value={undefined}
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('button', { name: 'Grid' }));

		expect(onChange).toHaveBeenCalledWith(['grid']);
		pressed('Grid');
	});

	it('takes a list after null with no warning', () => {
		const logged = spyOnConsole();
		const { rerender } = render(
			<ToggleGroup type="multiple" {...BAR} items={ITEMS} nullable value={null} />,
		);

		rerender(
			<ToggleGroup type="multiple" {...BAR} items={ITEMS} nullable value={['list', 'table']} />,
		);

		pressed('List');
		pressed('Table');
		expect(logged.error).not.toHaveBeenCalled();
		expect(logged.warn).not.toHaveBeenCalled();
	});

	it('follows a form state that starts null, and reports the empty array on a release', async () => {
		const user = userEvent.setup();
		const logged = spyOnConsole();
		const reported: string[][] = [];

		function Controlled(): JSX.Element {
			const [value, setValue] = useState<string[] | null>(null);

			return (
				<ToggleGroupField
					label="Layout"
					type="multiple"
					{...BAR}
					items={ITEMS}
					nullable
					allowClear
					name="layouts"
					value={value}
					onBlur={() => {}}
					onChange={(next) => {
						reported.push(next);
						setValue(next);
					}}
				/>
			);
		}

		render(<Controlled />);

		await user.click(screen.getByRole('button', { name: 'Table' }));

		pressed('Table');

		await user.click(screen.getByRole('button', { name: 'Table' }));

		expectNothingPressed();
		expect(reported).toEqual([['table'], []]);
		expect(logged.error).not.toHaveBeenCalled();
		expect(logged.warn).not.toHaveBeenCalled();
	});

	it('submits nothing for an empty value and one entry per pressed button for a list', () => {
		const { rerender } = render(
			<form aria-label="Preferences">
				<ToggleGroup type="multiple" {...BAR} items={ITEMS} nullable name="layouts" value={null} />
			</form>,
		);
		const form = screen.getByRole('form') as HTMLFormElement;

		expect(new FormData(form).getAll('layouts')).toEqual([]);

		rerender(
			<form aria-label="Preferences">
				<ToggleGroup
					type="multiple"
					{...BAR}
					items={ITEMS}
					nullable
					name="layouts"
					value={['table', 'list']}
				/>
			</form>,
		);

		expect(new FormData(form).getAll('layouts')).toEqual(['list', 'table']);
	});

	it.each([
		['undefined', undefined],
		['null', null],
	])('gives the first button that is not disabled to the ref of a field with %s', (_, empty) => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<ToggleGroupField
				label="Layout"
				type="multiple"
				{...BAR}
				items={FIRST_DISABLED}
				nullable
				value={empty}
				ref={ref}
			/>,
		);

		ref.current?.focus();

		expect(screen.getByRole('button', { name: 'Grid' })).toHaveFocus();
	});
});
