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

function expectPressed(name: string, isPressed = true): void {
	expect(screen.getByRole('button', { name })).toHaveAttribute('aria-pressed', String(isPressed));
}

afterEach(() => {
	vi.restoreAllMocks();
});

describe('ToggleGroup single value rule', () => {
	it('starts at the default and keeps its own state while value is undefined', async () => {
		const user = userEvent.setup();
		const logged = spyOnConsole();
		const onChange = vi.fn();
		render(
			<ToggleGroup type="single" {...BAR} items={ITEMS} defaultValue="list" onChange={onChange} />,
		);

		expectPressed('List');

		await user.click(screen.getByRole('button', { name: 'Grid' }));

		expect(onChange).toHaveBeenCalledWith('grid');
		expectPressed('Grid');
		expectPressed('List', false);
		expect(logged.warn).not.toHaveBeenCalled();
		expect(logged.error).not.toHaveBeenCalled();
	});

	it('follows a value that arrives later and warns once', () => {
		const logged = spyOnConsole();
		const { rerender } = render(
			<ToggleGroup type="single" {...BAR} items={ITEMS} defaultValue="list" />,
		);

		rerender(<ToggleGroup type="single" {...BAR} items={ITEMS} defaultValue="list" value="grid" />);

		expectPressed('Grid');
		expectPressed('List', false);

		rerender(
			<ToggleGroup type="single" {...BAR} items={ITEMS} defaultValue="list" value="table" />,
		);

		expectPressed('Table');
		expect(logged.warn).toHaveBeenCalledTimes(1);
		expect(logged.warn).toHaveBeenCalledWith(expect.stringContaining('ToggleGroup'));
		expect(logged.error).not.toHaveBeenCalled();
	});

	it('shows nothing pressed once a value turns undefined, and stays controlled', async () => {
		const user = userEvent.setup();
		const logged = spyOnConsole();
		const onChange = vi.fn();
		const { rerender } = render(
			<ToggleGroup
				type="single"
				{...BAR}
				items={ITEMS}
				defaultValue="list"
				value="grid"
				onChange={onChange}
			/>,
		);

		rerender(
			<ToggleGroup
				type="single"
				{...BAR}
				items={ITEMS}
				defaultValue="list"
				value={undefined}
				onChange={onChange}
			/>,
		);

		expectNothingPressed();

		await user.click(screen.getByRole('button', { name: 'Table' }));

		expect(onChange).toHaveBeenCalledWith('table');
		expectNothingPressed();
		expect(logged.warn).not.toHaveBeenCalled();
		expect(logged.error).not.toHaveBeenCalled();
	});

	it('submits the pressed button of an uncontrolled bar, and nothing once a value empties it', async () => {
		const user = userEvent.setup();
		const { rerender } = render(
			<form aria-label="Preferences">
				<ToggleGroup type="single" {...BAR} items={ITEMS} name="layout" defaultValue="list" />
			</form>,
		);
		const form = screen.getByRole('form') as HTMLFormElement;

		expect(new FormData(form).getAll('layout')).toEqual(['list']);

		await user.click(screen.getByRole('button', { name: 'Grid' }));

		expect(new FormData(form).getAll('layout')).toEqual(['grid']);

		rerender(
			<form aria-label="Preferences">
				<ToggleGroup type="single" {...BAR} items={ITEMS} name="layout" value="table" />
			</form>,
		);

		expect(new FormData(form).getAll('layout')).toEqual(['table']);

		rerender(
			<form aria-label="Preferences">
				<ToggleGroup type="single" {...BAR} items={ITEMS} name="layout" value={undefined} />
			</form>,
		);

		expect(new FormData(form).getAll('layout')).toEqual([]);
	});

	it('moves the ref off a pressed button once the value turns undefined', () => {
		const ref = createRef<HTMLButtonElement>();
		const { rerender } = render(
			<ToggleGroupField
				label="Layout"
				type="single"
				{...BAR}
				items={ITEMS}
				value="grid"
				ref={ref}
			/>,
		);

		rerender(
			<ToggleGroupField
				label="Layout"
				type="single"
				{...BAR}
				items={ITEMS}
				value={undefined}
				ref={ref}
			/>,
		);
		ref.current?.focus();

		expect(screen.getByRole('button', { name: 'List' })).toHaveFocus();
	});

	it('follows a form state that starts undefined, with one warning at the first press', async () => {
		const user = userEvent.setup();
		const logged = spyOnConsole();

		function Controlled(): JSX.Element {
			const [value, setValue] = useState<string | undefined>(undefined);

			return (
				<ToggleGroupField
					label="Layout"
					type="single"
					{...BAR}
					items={ITEMS}
					name="layout"
					value={value}
					onChange={setValue}
					onBlur={() => {}}
				/>
			);
		}

		render(<Controlled />);

		await user.click(screen.getByRole('button', { name: 'Grid' }));
		await user.click(screen.getByRole('button', { name: 'Table' }));

		expectPressed('Table');
		expectPressed('Grid', false);
		expect(logged.warn).toHaveBeenCalledTimes(1);
		expect(logged.error).not.toHaveBeenCalled();
	});
});

describe('ToggleGroup multiple value rule', () => {
	it('starts at the default and keeps its own state while value is undefined', async () => {
		const user = userEvent.setup();
		const logged = spyOnConsole();
		const onChange = vi.fn();
		render(
			<ToggleGroup
				type="multiple"
				{...BAR}
				items={ITEMS}
				defaultValue={['list']}
				onChange={onChange}
			/>,
		);

		expectPressed('List');

		await user.click(screen.getByRole('button', { name: 'Grid' }));

		expect(onChange).toHaveBeenCalledWith(['list', 'grid']);
		expectPressed('List');
		expectPressed('Grid');
		expect(logged.warn).not.toHaveBeenCalled();
		expect(logged.error).not.toHaveBeenCalled();
	});

	it('follows a value that arrives later and warns once', () => {
		const logged = spyOnConsole();
		const { rerender } = render(<ToggleGroup type="multiple" {...BAR} items={ITEMS} />);

		rerender(<ToggleGroup type="multiple" {...BAR} items={ITEMS} value={['list', 'table']} />);

		expectPressed('List');
		expectPressed('Table');

		rerender(<ToggleGroup type="multiple" {...BAR} items={ITEMS} value={['grid']} />);

		expectPressed('Grid');
		expectPressed('List', false);
		expect(logged.warn).toHaveBeenCalledTimes(1);
		expect(logged.warn).toHaveBeenCalledWith(expect.stringContaining('ToggleGroup'));
		expect(logged.error).not.toHaveBeenCalled();
	});

	it('shows nothing pressed once a value turns undefined, and stays controlled', async () => {
		const user = userEvent.setup();
		const logged = spyOnConsole();
		const onChange = vi.fn();
		const { rerender } = render(
			<ToggleGroup
				type="multiple"
				{...BAR}
				items={ITEMS}
				value={['list', 'grid']}
				onChange={onChange}
			/>,
		);

		rerender(
			<ToggleGroup type="multiple" {...BAR} items={ITEMS} value={undefined} onChange={onChange} />,
		);

		expectNothingPressed();

		await user.click(screen.getByRole('button', { name: 'Table' }));

		expect(onChange).toHaveBeenCalledWith(['table']);
		expectNothingPressed();
		expect(logged.warn).not.toHaveBeenCalled();
		expect(logged.error).not.toHaveBeenCalled();
	});

	it('submits one entry per pressed button of an uncontrolled bar, and nothing once a value empties it', async () => {
		const user = userEvent.setup();
		const { rerender } = render(
			<form aria-label="Preferences">
				<ToggleGroup
					type="multiple"
					{...BAR}
					items={ITEMS}
					name="layouts"
					defaultValue={['list']}
				/>
			</form>,
		);
		const form = screen.getByRole('form') as HTMLFormElement;

		await user.click(screen.getByRole('button', { name: 'Table' }));

		expect(new FormData(form).getAll('layouts')).toEqual(['list', 'table']);

		rerender(
			<form aria-label="Preferences">
				<ToggleGroup type="multiple" {...BAR} items={ITEMS} name="layouts" value={['grid']} />
			</form>,
		);

		expect(new FormData(form).getAll('layouts')).toEqual(['grid']);

		rerender(
			<form aria-label="Preferences">
				<ToggleGroup type="multiple" {...BAR} items={ITEMS} name="layouts" value={undefined} />
			</form>,
		);

		expect(new FormData(form).getAll('layouts')).toEqual([]);
	});
});
