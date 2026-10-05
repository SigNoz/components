import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ForceOpenProvider } from '../../testing/index.js';
import { Select } from '../index.js';
import type { SelectItemType } from '../types.js';
import { FRAMEWORKS, openSelect } from './select.test-utils.js';

describe('Select keyboard', () => {
	it('opens on ArrowDown, moves the highlight, picks with Enter and gives the focus back', async () => {
		const onChange = vi.fn();
		render(
			<Select
				placeholder="Select a framework..."
				aria-label="Framework"
				items={FRAMEWORKS}
				onChange={onChange}
			/>,
		);
		const trigger = screen.getByRole('combobox', { name: 'Framework' });

		trigger.focus();
		await userEvent.keyboard('{ArrowDown}');
		const listbox = await screen.findByRole('listbox');

		await waitFor(() => {
			expect(within(listbox).getByRole('option', { name: 'React' })).toHaveFocus();
		});

		await userEvent.keyboard('{ArrowDown}');

		expect(within(listbox).getByRole('option', { name: 'Vue' })).toHaveFocus();

		await userEvent.keyboard('{Enter}');

		expect(onChange).toHaveBeenCalledWith('vue');
		await waitFor(() => {
			expect(screen.queryByRole('listbox')).toBeNull();
		});
		expect(trigger).toHaveFocus();
	});

	it('stops at the ends and jumps with Home and End', async () => {
		render(
			<Select placeholder="Select a framework..." aria-label="Framework" items={FRAMEWORKS} />,
		);
		const trigger = screen.getByRole('combobox', { name: 'Framework' });

		trigger.focus();
		await userEvent.keyboard('{Enter}');
		const listbox = await screen.findByRole('listbox');
		const option = (name: string) => within(listbox).getByRole('option', { name });

		await waitFor(() => {
			expect(option('React')).toHaveFocus();
		});

		await userEvent.keyboard('{ArrowUp}');
		expect(option('React')).toHaveFocus();

		await userEvent.keyboard('{End}');
		expect(option('Svelte')).toHaveFocus();

		await userEvent.keyboard('{ArrowDown}');
		expect(option('Svelte')).toHaveFocus();

		await userEvent.keyboard('{Home}');
		expect(option('React')).toHaveFocus();
	});

	it('moves to the row that starts with a typed letter', async () => {
		render(
			<Select placeholder="Select a framework..." aria-label="Framework" items={FRAMEWORKS} />,
		);
		const listbox = await openSelect();

		await userEvent.keyboard('s');

		await waitFor(() => {
			expect(within(listbox).getByRole('option', { name: 'Svelte' })).toHaveAttribute(
				'data-highlighted',
			);
		});
	});

	it('matches a typed letter against the displayValue, or the text of a node label', async () => {
		const items: SelectItemType[] = [
			{ type: 'item', value: 'react', label: 'React' },
			{ type: 'item', value: 'pg', label: 'Main store', displayValue: 'Postgres' },
			{ type: 'item', value: 'kt', label: <strong>Kotlin</strong> },
		];
		const { unmount } = render(
			<Select placeholder="Select a framework..." aria-label="Framework" items={items} />,
		);
		let listbox = await openSelect();

		await userEvent.keyboard('p');

		await waitFor(() => {
			expect(within(listbox).getByRole('option', { name: 'Main store' })).toHaveAttribute(
				'data-highlighted',
			);
		});
		unmount();

		render(<Select placeholder="Select a framework..." aria-label="Framework" items={items} />);
		listbox = await openSelect();

		await userEvent.keyboard('k');

		await waitFor(() => {
			expect(within(listbox).getByRole('option', { name: 'Kotlin' })).toHaveAttribute(
				'data-highlighted',
			);
		});
	});

	it('lands on a disabled row with the arrow keys and does not pick it with Enter', async () => {
		const onChange = vi.fn();
		render(
			<Select
				placeholder="Select a framework..."
				aria-label="Framework"
				items={[
					{ type: 'item', value: 'react', label: 'React' },
					{
						type: 'item',
						value: 'vue',
						label: 'Vue',
						disabled: true,
						disabledTooltip: 'Not supported yet',
					},
				]}
				onChange={onChange}
			/>,
		);
		screen.getByRole('combobox', { name: 'Framework' }).focus();
		await userEvent.keyboard('{ArrowDown}');
		const listbox = await screen.findByRole('listbox');

		await waitFor(() => {
			expect(within(listbox).getByRole('option', { name: 'React' })).toHaveFocus();
		});
		await userEvent.keyboard('{ArrowDown}');

		expect(within(listbox).getByRole('option', { name: 'Vue' })).toHaveFocus();

		await userEvent.keyboard('{Enter}');

		expect(onChange).not.toHaveBeenCalled();
		expect(screen.getByRole('listbox')).toBeInTheDocument();
	});

	it('picks the row that starts with a letter typed on a closed single trigger', async () => {
		const onChange = vi.fn();
		render(
			<Select
				placeholder="Select a framework..."
				aria-label="Framework"
				items={FRAMEWORKS}
				onChange={onChange}
			/>,
		);

		screen.getByRole('combobox', { name: 'Framework' }).focus();
		await userEvent.keyboard('v');

		expect(onChange).toHaveBeenCalledWith('vue');
		expect(screen.queryByRole('listbox')).toBeNull();
	});

	it('closes on Tab', async () => {
		render(
			<>
				<Select placeholder="Select a framework..." aria-label="Framework" items={FRAMEWORKS} />
				<button type="button">Next</button>
			</>,
		);
		screen.getByRole('combobox', { name: 'Framework' }).focus();
		await userEvent.keyboard('{Enter}');
		await screen.findByRole('listbox');
		await userEvent.keyboard('{Tab}');

		await waitFor(() => {
			expect(screen.queryByRole('listbox')).toBeNull();
		});
	});

	it('closes on Escape and gives the focus back to the trigger', async () => {
		render(
			<Select placeholder="Select a framework..." aria-label="Framework" items={FRAMEWORKS} />,
		);
		const trigger = screen.getByRole('combobox', { name: 'Framework' });

		trigger.focus();
		await userEvent.keyboard('{Enter}');
		await screen.findByRole('listbox');
		await userEvent.keyboard('{Escape}');

		await waitFor(() => {
			expect(screen.queryByRole('listbox')).toBeNull();
		});
		expect(trigger).toHaveFocus();
	});

	it('keeps a multiple select open on Enter', async () => {
		const onChange = vi.fn();
		render(
			<Select
				multiple
				placeholder="Select frameworks..."
				aria-label="Frameworks"
				items={FRAMEWORKS}
				onChange={onChange}
			/>,
		);
		screen.getByRole('combobox', { name: 'Frameworks' }).focus();
		await userEvent.keyboard('{ArrowDown}');
		const listbox = await screen.findByRole('listbox');

		await waitFor(() => {
			expect(within(listbox).getByRole('option', { name: 'React' })).toHaveFocus();
		});
		await userEvent.keyboard('{Enter}');

		expect(onChange).toHaveBeenLastCalledWith(['react']);
		expect(screen.getByRole('listbox')).toBeInTheDocument();
	});
});

describe('Select disabled and read-only', () => {
	it('keeps a disabled select closed and focusable, and shows the reason', async () => {
		render(
			<Select
				placeholder="Select a framework..."
				aria-label="Framework"
				items={FRAMEWORKS}
				disabled
				disabledTooltip="You have no access"
			/>,
		);
		const trigger = screen.getByRole('combobox', { name: 'Framework' });

		expect(trigger).toHaveAttribute('aria-disabled', 'true');
		expect(trigger).not.toBeDisabled();

		await userEvent.hover(trigger);

		expect(await screen.findByText('You have no access')).toBeInTheDocument();

		await userEvent.click(trigger);
		await userEvent.keyboard('{ArrowDown}');

		expect(screen.queryByRole('listbox')).toBeNull();
		expect(trigger).toHaveFocus();
	});

	it('keeps a read-only select closed and its value as it is', async () => {
		const onChange = vi.fn();
		render(
			<Select
				placeholder="Select a framework..."
				aria-label="Framework"
				items={FRAMEWORKS}
				defaultValue="react"
				onChange={onChange}
				readOnly
				readOnlyTooltip="Managed by your admin"
			/>,
		);
		const trigger = screen.getByRole('combobox', { name: 'Framework' });

		expect(trigger).toHaveAttribute('aria-readonly', 'true');

		await userEvent.hover(trigger);

		expect(await screen.findByText('Managed by your admin')).toBeInTheDocument();

		await userEvent.click(trigger);
		await userEvent.keyboard('v');

		expect(screen.queryByRole('listbox')).toBeNull();
		expect(onChange).not.toHaveBeenCalled();
		expect(document.querySelector('[data-slot="select-value"]')).toHaveTextContent('React');
	});

	it('closes when it turns disabled while open, and stays closed once it turns back', async () => {
		function renderWith(disabled: boolean): ReactElement {
			return (
				<Select
					placeholder="Select a framework..."
					aria-label="Framework"
					items={FRAMEWORKS}
					disabled={disabled}
					disabledTooltip="You have no access"
				/>
			);
		}

		const { rerender } = render(renderWith(false));
		await openSelect();

		rerender(renderWith(true));

		await waitFor(() => {
			expect(screen.queryByRole('listbox')).toBeNull();
		});

		rerender(renderWith(false));

		expect(screen.queryByRole('listbox')).toBeNull();
	});

	it('hides the chip remove buttons while disabled or read-only', () => {
		render(
			<Select
				multiple
				placeholder="Select frameworks..."
				aria-label="Frameworks"
				items={FRAMEWORKS}
				defaultValue={['react']}
				readOnly
				readOnlyTooltip={undefined}
				testId="select"
			/>,
		);

		expect(screen.getByTestId('select-chip-react')).toBeInTheDocument();
		expect(screen.queryByTestId('select-chip-react-remove')).toBeNull();
	});

	it('shows only the disabled reason when both are set', async () => {
		render(
			<Select
				placeholder="Select a framework..."
				aria-label="Framework"
				items={FRAMEWORKS}
				disabled
				disabledTooltip="You have no access"
				readOnly
				readOnlyTooltip="Managed by your admin"
			/>,
		);

		await userEvent.hover(screen.getByRole('combobox', { name: 'Framework' }));

		expect(await screen.findByText('You have no access')).toBeInTheDocument();
		expect(screen.queryByText('Managed by your admin')).toBeNull();
	});

	it('closes an open popup when it turns disabled, and does not reopen it after', async () => {
		function Toggle({ disabled }: { disabled: boolean }) {
			return (
				<Select
					placeholder="Select a framework..."
					aria-label="Framework"
					items={FRAMEWORKS}
					disabled={disabled}
					disabledTooltip="You have no access"
				/>
			);
		}
		const { rerender } = render(<Toggle disabled={false} />);
		await openSelect();

		rerender(<Toggle disabled />);

		await waitFor(() => {
			expect(screen.queryByRole('listbox')).toBeNull();
		});

		rerender(<Toggle disabled={false} />);

		expect(screen.queryByRole('listbox')).toBeNull();
	});

	it('keeps the trigger and its focus when disabled toggles', () => {
		function Toggle({ disabled }: { disabled: boolean }) {
			return (
				<Select
					multiple
					placeholder="Select frameworks..."
					aria-label="Frameworks"
					items={FRAMEWORKS}
					defaultValue={['react']}
					disabled={disabled}
					disabledTooltip="You have no access"
				/>
			);
		}
		const { rerender } = render(<Toggle disabled={false} />);
		const trigger = screen.getByRole('combobox', { name: 'Frameworks' });

		trigger.focus();
		rerender(<Toggle disabled />);

		expect(screen.getByRole('combobox', { name: 'Frameworks' })).toBe(trigger);
		expect(trigger).toHaveFocus();

		rerender(<Toggle disabled={false} />);

		expect(screen.getByRole('combobox', { name: 'Frameworks' })).toBe(trigger);
		expect(trigger).toHaveFocus();
	});
});

describe('Select under ForceOpenProvider', () => {
	it('keeps the popup on screen whatever the user does', async () => {
		const onChange = vi.fn();
		render(
			<Select
				placeholder="Select a framework..."
				aria-label="Framework"
				items={FRAMEWORKS}
				onChange={onChange}
			/>,
			{ wrapper: ForceOpenProvider },
		);
		const listbox = await screen.findByRole('listbox');

		await userEvent.click(within(listbox).getByRole('option', { name: 'Vue' }));
		await userEvent.keyboard('{Escape}');

		expect(onChange).toHaveBeenCalledWith('vue');
		expect(screen.getByRole('listbox')).toBeInTheDocument();
	});

	it('leaves a disabled or read-only select closed', () => {
		render(
			<>
				<Select
					placeholder="Select a framework..."
					aria-label="Disabled"
					items={FRAMEWORKS}
					disabled
					disabledTooltip="No access"
				/>
				<Select
					placeholder="Select a framework..."
					aria-label="Read-only"
					items={FRAMEWORKS}
					readOnly
					readOnlyTooltip="Locked"
				/>
			</>,
			{ wrapper: ForceOpenProvider },
		);

		expect(screen.queryByRole('listbox')).toBeNull();
	});
});
