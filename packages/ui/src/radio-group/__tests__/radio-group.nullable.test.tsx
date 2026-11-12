import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RadioGroup, RadioGroupField } from '../index.js';
import type { RadioGroupItemType } from '../types.js';

const ITEMS: RadioGroupItemType[] = [
	{ label: '7 days', value: '7' },
	{ label: '30 days', value: '30' },
	{ label: '90 days', value: '90' },
];

function spyOnConsole() {
	return {
		error: vi.spyOn(console, 'error').mockImplementation(() => {}),
		warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
	};
}

function expectNoRadioChecked(): void {
	for (const radio of screen.getAllByRole('radio')) {
		expect(radio).not.toBeChecked();
	}
}

afterEach(() => {
	vi.restoreAllMocks();
});

describe('RadioGroup nullable', () => {
	it('shows no radio checked for a null value', () => {
		const logged = spyOnConsole();
		render(
			<RadioGroup color="primary" items={ITEMS} aria-label="Retention" nullable value={null} />,
		);

		expectNoRadioChecked();
		expect(logged.error).not.toHaveBeenCalled();
		expect(logged.warn).not.toHaveBeenCalled();
	});

	it('keeps a group uncontrolled while the value is undefined, as without nullable', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<RadioGroup
				color="primary"
				items={ITEMS}
				aria-label="Retention"
				nullable
				value={undefined}
				onChange={onChange}
			/>,
		);

		expectNoRadioChecked();

		await user.click(screen.getByRole('radio', { name: '30 days' }));

		expect(onChange).toHaveBeenCalledWith('30');
		expect(screen.getByRole('radio', { name: '30 days' })).toBeChecked();
	});

	it('takes a value after null and shows the empty group again with no warning', () => {
		const logged = spyOnConsole();
		const { rerender } = render(
			<RadioGroup color="primary" items={ITEMS} aria-label="Retention" nullable value={null} />,
		);

		rerender(
			<RadioGroup color="primary" items={ITEMS} aria-label="Retention" nullable value="30" />,
		);

		expect(screen.getByRole('radio', { name: '30 days' })).toBeChecked();

		rerender(
			<RadioGroup color="primary" items={ITEMS} aria-label="Retention" nullable value={null} />,
		);

		expectNoRadioChecked();
		expect(logged.error).not.toHaveBeenCalled();
		expect(logged.warn).not.toHaveBeenCalled();
	});

	it('keeps an uncontrolled group uncontrolled while no value is written', async () => {
		const user = userEvent.setup();
		render(<RadioGroup color="primary" items={ITEMS} aria-label="Retention" nullable />);

		await user.click(screen.getByRole('radio', { name: '30 days' }));

		expect(screen.getByRole('radio', { name: '30 days' })).toBeChecked();
	});

	it('takes the default of an uncontrolled group', () => {
		render(
			<RadioGroup
				color="primary"
				items={ITEMS}
				aria-label="Retention"
				nullable
				defaultValue="90"
			/>,
		);

		expect(screen.getByRole('radio', { name: '90 days' })).toBeChecked();
	});

	it('gives the first radio to the ref of a field with an undefined value', () => {
		const ref = createRef<HTMLInputElement>();
		render(
			<RadioGroupField
				label="Retention"
				color="primary"
				items={ITEMS}
				nullable
				value={undefined}
				ref={ref}
			/>,
		);

		ref.current?.focus();

		expect(screen.getByRole('radio', { name: '7 days' })).toHaveFocus();
	});

	it('gives the first radio to the ref of a field with a null value', () => {
		const ref = createRef<HTMLInputElement>();
		render(
			<RadioGroupField
				label="Retention"
				color="primary"
				items={ITEMS}
				nullable
				value={null}
				ref={ref}
			/>,
		);

		ref.current?.focus();

		expect(screen.getByRole('radio', { name: '7 days' })).toHaveFocus();
	});
});

describe('RadioGroup without nullable', () => {
	it('keeps a group uncontrolled while the value is undefined', async () => {
		const user = userEvent.setup();
		render(<RadioGroup color="primary" items={ITEMS} aria-label="Retention" value={undefined} />);

		await user.click(screen.getByRole('radio', { name: '30 days' }));

		expect(screen.getByRole('radio', { name: '30 days' })).toBeChecked();
	});

	it('keeps a null value as the empty controlled group', async () => {
		const user = userEvent.setup();
		render(<RadioGroup color="primary" items={ITEMS} aria-label="Retention" value={null} />);

		await user.click(screen.getByRole('radio', { name: '30 days' }));

		expectNoRadioChecked();
	});
});
