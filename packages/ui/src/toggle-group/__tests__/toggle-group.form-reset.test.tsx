import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ToggleGroup } from '../toggle-group.js';
import type { ToggleGroupItemProps } from '../types.js';

const BAR = { variant: 'outlined', color: 'secondary', size: 'md' } as const;

const ITEMS: ToggleGroupItemProps[] = [
	{ value: 'list', label: 'List' },
	{ value: 'grid', label: 'Grid' },
	{ value: 'table', label: 'Table' },
];

function submitted(): Array<[string, FormDataEntryValue]> {
	return [...new FormData(screen.getByTestId('form') as HTMLFormElement).entries()];
}

function button(name: string): HTMLElement {
	return screen.getByRole('button', { name });
}

describe('ToggleGroup form reset', () => {
	it('brings an uncontrolled single bar back to defaultValue, without onChange', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<form data-testid="form">
				<ToggleGroup
					type="single"
					{...BAR}
					items={ITEMS}
					name="layout"
					defaultValue="grid"
					onChange={onChange}
				/>
				<button type="reset">Reset</button>
			</form>,
		);

		await user.click(button('Table'));

		expect(button('Table')).toHaveAttribute('aria-pressed', 'true');
		expect(submitted()).toEqual([['layout', 'table']]);

		onChange.mockClear();
		await user.click(button('Reset'));

		await waitFor(() => {
			expect(button('Grid')).toHaveAttribute('aria-pressed', 'true');
		});
		expect(button('Table')).toHaveAttribute('aria-pressed', 'false');
		expect(submitted()).toEqual([['layout', 'grid']]);
		expect(onChange).not.toHaveBeenCalled();
	});

	it('brings a bar that started with nothing pressed back to nothing pressed', async () => {
		const user = userEvent.setup();
		render(
			<form data-testid="form">
				<ToggleGroup type="single" {...BAR} items={ITEMS} name="layout" />
				<button type="reset">Reset</button>
			</form>,
		);

		await user.click(button('List'));

		expect(submitted()).toEqual([['layout', 'list']]);

		await user.click(button('Reset'));

		await waitFor(() => {
			expect(button('List')).toHaveAttribute('aria-pressed', 'false');
		});
		expect(submitted()).toEqual([]);
	});

	it('brings an uncontrolled multiple bar back to defaultValue, without onChange', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<form data-testid="form">
				<ToggleGroup
					type="multiple"
					{...BAR}
					items={ITEMS}
					name="layouts"
					defaultValue={['list', 'table']}
					onChange={onChange}
				/>
				<button type="reset">Reset</button>
			</form>,
		);

		await user.click(button('Grid'));
		await user.click(button('List'));

		expect(submitted()).toEqual([
			['layouts', 'grid'],
			['layouts', 'table'],
		]);

		onChange.mockClear();
		await user.click(button('Reset'));

		await waitFor(() => {
			expect(button('List')).toHaveAttribute('aria-pressed', 'true');
		});
		expect(button('Grid')).toHaveAttribute('aria-pressed', 'false');
		expect(submitted()).toEqual([
			['layouts', 'list'],
			['layouts', 'table'],
		]);
		expect(onChange).not.toHaveBeenCalled();
	});

	it('keeps a controlled value, which the form onReset owns', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<form data-testid="form">
				<ToggleGroup
					type="single"
					{...BAR}
					items={ITEMS}
					name="layout"
					value="grid"
					onChange={onChange}
				/>
				<button type="reset">Reset</button>
			</form>,
		);

		await user.click(button('Table'));

		expect(onChange).toHaveBeenCalledWith('table');

		onChange.mockClear();
		await user.click(button('Reset'));
		await new Promise((resolve) => setTimeout(resolve));

		expect(button('Grid')).toHaveAttribute('aria-pressed', 'true');
		expect(submitted()).toEqual([['layout', 'grid']]);
		expect(onChange).not.toHaveBeenCalled();
	});

	it('keeps the value when the form cancels the reset', async () => {
		const user = userEvent.setup();
		render(
			<form data-testid="form" onReset={(event) => event.preventDefault()}>
				<ToggleGroup type="single" {...BAR} items={ITEMS} name="layout" defaultValue="grid" />
				<button type="reset">Reset</button>
			</form>,
		);

		await user.click(button('Table'));
		await user.click(button('Reset'));
		await new Promise((resolve) => setTimeout(resolve));

		expect(button('Table')).toHaveAttribute('aria-pressed', 'true');
		expect(submitted()).toEqual([['layout', 'table']]);
	});
});
