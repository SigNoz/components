import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Checkbox } from '../../checkbox/checkbox.js';
import { Input } from '../../input/input.js';
import { Select } from '../../select/select.js';
import { Switch } from '../../switch/switch.js';
import { Field } from '../field.js';
import { describedByIds } from './field.test-utils.js';

const FRAMEWORKS = [
	{ type: 'item' as const, value: 'react', label: 'React' },
	{ type: 'item' as const, value: 'vue', label: 'Vue' },
];

describe('Field around a Base UI control', () => {
	it('names a Switch with the label and describes it with the row and the tooltip text', () => {
		render(
			<Field
				label="Send alerts"
				description="By email"
				labelTooltip="Sent once a day"
				testId="field"
			>
				<Switch color="primary" />
			</Field>,
		);

		const control = screen.getByRole('switch', { name: 'Send alerts' });

		expect(describedByIds(control)[0]).toBe(screen.getByTestId('field-description').id);
		expect(control).toHaveAccessibleDescription('By email Sent once a day');
	});

	it('sets aria-invalid on a Switch for danger only', () => {
		const { rerender } = render(
			<Field label="Send alerts" error="Needs a channel">
				<Switch color="primary" />
			</Field>,
		);

		expect(screen.getByRole('switch', { name: 'Send alerts' })).toHaveAttribute(
			'aria-invalid',
			'true',
		);

		rerender(
			<Field label="Send alerts" status="warning" message="No channel yet">
				<Switch color="primary" />
			</Field>,
		);

		expect(screen.getByRole('switch', { name: 'Send alerts' })).not.toHaveAttribute('aria-invalid');
	});

	it('names a Checkbox with the label and sets aria-invalid for danger', () => {
		render(
			<Field label="Terms" error="Accept to continue" testId="field">
				<Checkbox color="primary" />
			</Field>,
		);

		const control = screen.getByRole('checkbox', { name: 'Terms' });

		expect(control).toHaveAttribute('aria-invalid', 'true');
		expect(control).toHaveAccessibleDescription('Accept to continue');
	});

	it('toggles a Checkbox from a click on the label', async () => {
		const user = userEvent.setup();
		render(
			<Field label="Terms" testId="field">
				<Checkbox color="primary" />
			</Field>,
		);

		await user.click(screen.getByTestId('field-label'));

		expect(screen.getByRole('checkbox', { name: 'Terms' })).toBeChecked();
	});

	it('names a Select trigger with the label and sets aria-invalid for danger', () => {
		render(
			<Field label="Framework" description="Pick one" error="Required" testId="field">
				<Select items={FRAMEWORKS} placeholder="Select a framework..." />
			</Field>,
		);

		const trigger = screen.getByRole('combobox', { name: 'Framework' });

		expect(trigger).toHaveAttribute('aria-invalid', 'true');
		expect(trigger).toHaveAccessibleDescription('Required');
	});
});

describe('Field aria-describedby around a Base UI control', () => {
	it('keeps the row ahead of the tooltip text when the row appears after the first render', () => {
		const { rerender } = render(
			<Field label="Terms" labelTooltip="Why we ask" testId="field">
				<Checkbox color="primary" />
			</Field>,
		);

		rerender(
			<Field label="Terms" labelTooltip="Why we ask" error="Accept to continue" testId="field">
				<Checkbox color="primary" />
			</Field>,
		);

		const control = screen.getByRole('checkbox', { name: 'Terms' });
		const ids = describedByIds(control);

		expect(ids[0]).toBe(screen.getByTestId('field-message').id);
		expect(control).toHaveAccessibleDescription('Accept to continue Why we ask');
	});

	it('keeps the order when the row goes away and comes back', () => {
		const { rerender } = render(
			<Field label="Terms" labelTooltip="Why we ask" error="Accept to continue" testId="field">
				<Checkbox color="primary" />
			</Field>,
		);

		rerender(
			<Field label="Terms" labelTooltip="Why we ask" testId="field">
				<Checkbox color="primary" />
			</Field>,
		);
		rerender(
			<Field label="Terms" labelTooltip="Why we ask" error="Accept to continue" testId="field">
				<Checkbox color="primary" />
			</Field>,
		);

		expect(screen.getByRole('checkbox', { name: 'Terms' })).toHaveAccessibleDescription(
			'Accept to continue Why we ask',
		);
	});
});

describe('Field label click', () => {
	function watchDefaultPrevented(): { prevented: boolean[]; stop: () => void } {
		const prevented: boolean[] = [];
		const listener = (event: Event): void => {
			if (event.target instanceof Element && event.target.closest('label') !== null) {
				prevented.push(event.defaultPrevented);
			}
		};

		document.addEventListener('click', listener);

		return { prevented, stop: () => document.removeEventListener('click', listener) };
	}

	it('focuses the Select trigger and does not open the list', async () => {
		const user = userEvent.setup();
		render(
			<Field label="Framework" testId="field">
				<Select items={FRAMEWORKS} placeholder="Select a framework..." />
			</Field>,
		);

		await user.click(screen.getByTestId('field-label'));

		const trigger = screen.getByRole('combobox', { name: 'Framework' });

		expect(trigger).toHaveFocus();
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
		expect(screen.queryByRole('listbox')).toBeNull();
	});

	it('focuses the Select trigger from a click on the text of the label', async () => {
		const user = userEvent.setup();
		render(
			<Field label="Framework" required testId="field">
				<Select items={FRAMEWORKS} placeholder="Select a framework..." />
			</Field>,
		);

		await user.click(
			screen.getByTestId('field-label').querySelector('[data-slot="field-label-text"]') as Element,
		);

		expect(screen.getByRole('combobox', { name: 'Framework' })).toHaveFocus();
		expect(screen.queryByRole('listbox')).toBeNull();
	});

	it('still opens the Select from a click on the trigger itself', async () => {
		const user = userEvent.setup();
		render(
			<Field label="Framework" testId="field">
				<Select items={FRAMEWORKS} placeholder="Select a framework..." />
			</Field>,
		);

		await user.click(screen.getByRole('combobox', { name: 'Framework' }));

		expect(await screen.findByRole('listbox')).toBeInTheDocument();
	});

	it('prevents the native click of a button trigger and leaves an input to the browser', async () => {
		const user = userEvent.setup();
		const { prevented, stop } = watchDefaultPrevented();
		render(
			<>
				<Field label="Framework" testId="select">
					<Select items={FRAMEWORKS} placeholder="Select a framework..." />
				</Field>
				<Field label="Organisation" testId="input">
					<Input />
				</Field>
			</>,
		);

		await user.click(screen.getByTestId('select-label'));
		await user.click(screen.getByTestId('input-label'));
		stop();

		expect(prevented).toEqual([true, false]);
	});

	it('focuses an Input and leaves the click to the browser', async () => {
		const user = userEvent.setup();
		const { prevented, stop } = watchDefaultPrevented();
		render(
			<Field label="Organisation" testId="field">
				<Input />
			</Field>,
		);

		await user.click(screen.getByTestId('field-label'));
		stop();

		expect(screen.getByRole('textbox', { name: 'Organisation' })).toHaveFocus();
		expect(prevented).toEqual([false]);
	});

	it('leaves a hand-written textarea and select to the browser', async () => {
		const user = userEvent.setup();
		const { prevented, stop } = watchDefaultPrevented();
		render(
			<>
				<Field label="Notes" htmlFor="notes" testId="notes">
					<textarea id="notes" />
				</Field>
				<Field label="Region" htmlFor="region" testId="region">
					<select id="region">
						<option>eu</option>
					</select>
				</Field>
			</>,
		);

		await user.click(screen.getByTestId('notes-label'));
		expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveFocus();

		await user.click(screen.getByTestId('region-label'));
		expect(screen.getByRole('combobox', { name: 'Region' })).toHaveFocus();
		stop();

		expect(prevented).toEqual([false, false]);
	});

	it('does nothing for a label that points at no element', async () => {
		const user = userEvent.setup();
		const { prevented, stop } = watchDefaultPrevented();
		render(
			<Field label="Organisation" htmlFor="missing" testId="field">
				<span>not a control</span>
			</Field>,
		);

		await user.click(screen.getByTestId('field-label'));
		stop();

		expect(prevented).toEqual([false]);
	});
});
