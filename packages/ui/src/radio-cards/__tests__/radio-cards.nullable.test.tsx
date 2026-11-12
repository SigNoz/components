import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RadioCardsField } from '../presets/radio-cards-field.js';
import { RadioCards } from '../radio-cards.js';
import type { RadioCardsItemType } from '../types.js';
import { ITEMS } from './radio-cards.test-utils.js';

const FIRST_DISABLED: RadioCardsItemType[] = [
	{ label: 'Logs', value: 'logs', disabled: true, disabledTooltip: 'No logs yet' },
	{ label: 'Traces', value: 'traces' },
	{ label: 'Metrics', value: 'metrics' },
];

function spyOnConsole() {
	return {
		error: vi.spyOn(console, 'error').mockImplementation(() => {}),
		warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
	};
}

function expectNothingChecked(role: 'radio' | 'checkbox'): void {
	for (const card of screen.getAllByRole(role)) {
		expect(card).not.toBeChecked();
	}
}

afterEach(() => {
	vi.restoreAllMocks();
});

describe('RadioCards nullable', () => {
	it('shows no card checked for a null value', () => {
		const logged = spyOnConsole();
		render(<RadioCards aria-label="Signal" items={ITEMS} nullable value={null} />);

		expectNothingChecked('radio');
		expect(logged.error).not.toHaveBeenCalled();
		expect(logged.warn).not.toHaveBeenCalled();
	});

	it('keeps a group uncontrolled while the value is undefined, as without nullable', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<RadioCards
				aria-label="Signal"
				items={ITEMS}
				nullable
				value={undefined}
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('radio', { name: 'Traces' }));

		expect(onChange).toHaveBeenCalledWith('traces');
		expect(screen.getByRole('radio', { name: 'Traces' })).toBeChecked();
	});

	it('takes a value after null with no warning', () => {
		const logged = spyOnConsole();
		const { rerender } = render(
			<RadioCards aria-label="Signal" items={ITEMS} nullable value={null} />,
		);

		rerender(<RadioCards aria-label="Signal" items={ITEMS} nullable value="traces" />);

		expect(screen.getByRole('radio', { name: 'Traces' })).toBeChecked();
		expect(logged.error).not.toHaveBeenCalled();
		expect(logged.warn).not.toHaveBeenCalled();
	});

	it('follows a form state that starts null, and reports null on a clear', async () => {
		const user = userEvent.setup();
		const logged = spyOnConsole();
		const reported: Array<string | null> = [];

		function Controlled(): JSX.Element {
			const [value, setValue] = useState<string | null>(null);

			return (
				<RadioCardsField
					label="Signal"
					items={ITEMS}
					nullable
					allowClear
					name="signal"
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

		await user.click(screen.getByRole('radio', { name: 'Traces' }));

		expect(screen.getByRole('radio', { name: 'Traces' })).toBeChecked();

		await user.click(screen.getByRole('radio', { name: 'Traces' }));

		expectNothingChecked('radio');
		expect(reported).toEqual(['traces', null]);
		expect(logged.error).not.toHaveBeenCalled();
		expect(logged.warn).not.toHaveBeenCalled();
	});

	it('reports null on a clear of an uncontrolled group too', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<RadioCards
				aria-label="Signal"
				items={ITEMS}
				nullable
				allowClear
				defaultValue="traces"
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('radio', { name: 'Traces' }));

		expect(onChange).toHaveBeenCalledWith(null);
		expectNothingChecked('radio');
	});

	it('keeps the checked card checked without allowClear', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<RadioCards
				aria-label="Signal"
				items={ITEMS}
				nullable
				defaultValue="traces"
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('radio', { name: 'Traces' }));

		expect(onChange).not.toHaveBeenCalled();
		expect(screen.getByRole('radio', { name: 'Traces' })).toBeChecked();
	});

	it('keeps an uncontrolled group uncontrolled while no value is written', async () => {
		const user = userEvent.setup();
		render(<RadioCards aria-label="Signal" items={ITEMS} nullable />);

		await user.click(screen.getByRole('radio', { name: 'Traces' }));

		expect(screen.getByRole('radio', { name: 'Traces' })).toBeChecked();
	});

	it('submits nothing for an empty value and the card for a checked one', () => {
		const { rerender } = render(
			<form aria-label="Signals">
				<RadioCards aria-label="Signal" items={ITEMS} nullable name="signal" value={null} />
			</form>,
		);
		const form = screen.getByRole('form') as HTMLFormElement;

		expect(new FormData(form).getAll('signal')).toEqual([]);

		rerender(
			<form aria-label="Signals">
				<RadioCards aria-label="Signal" items={ITEMS} nullable name="signal" value="metrics" />
			</form>,
		);

		expect(new FormData(form).getAll('signal')).toEqual(['metrics']);
	});

	it.each([
		['undefined', undefined],
		['null', null],
	])('gives the first card that is not disabled to the ref of a field with %s', (_, empty) => {
		const ref = createRef<HTMLInputElement>();
		render(
			<RadioCardsField label="Signal" items={FIRST_DISABLED} nullable value={empty} ref={ref} />,
		);

		ref.current?.focus();

		expect(screen.getByRole('radio', { name: 'Traces' })).toHaveFocus();
	});

	it('gives the checked card to the ref once the value arrives', () => {
		const ref = createRef<HTMLInputElement>();
		const { rerender } = render(
			<RadioCardsField label="Signal" items={ITEMS} nullable value={null} ref={ref} />,
		);

		rerender(<RadioCardsField label="Signal" items={ITEMS} nullable value="metrics" ref={ref} />);
		ref.current?.focus();

		expect(screen.getByRole('radio', { name: 'Metrics' })).toHaveFocus();
	});
});

describe('RadioCards.Multiple nullable', () => {
	it('shows no card checked for a null value', () => {
		const logged = spyOnConsole();
		render(<RadioCards.Multiple aria-label="Tools" items={ITEMS} nullable value={null} />);

		expectNothingChecked('checkbox');
		expect(logged.error).not.toHaveBeenCalled();
		expect(logged.warn).not.toHaveBeenCalled();
	});

	it('keeps a group uncontrolled while the value is undefined, as without nullable', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<RadioCards.Multiple
				aria-label="Tools"
				items={ITEMS}
				nullable
				value={undefined}
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole('checkbox', { name: 'Traces' }));

		expect(onChange).toHaveBeenCalledWith(['traces']);
		expect(screen.getByRole('checkbox', { name: 'Traces' })).toBeChecked();
	});

	it('takes a list after null with no warning', () => {
		const logged = spyOnConsole();
		const { rerender } = render(
			<RadioCards.Multiple aria-label="Tools" items={ITEMS} nullable value={null} />,
		);

		rerender(
			<RadioCards.Multiple aria-label="Tools" items={ITEMS} nullable value={['logs', 'metrics']} />,
		);

		expect(screen.getByRole('checkbox', { name: 'Logs' })).toBeChecked();
		expect(screen.getByRole('checkbox', { name: 'Metrics' })).toBeChecked();
		expect(logged.error).not.toHaveBeenCalled();
		expect(logged.warn).not.toHaveBeenCalled();
	});

	it('follows a form state that starts null, and reports the empty array on a clear', async () => {
		const user = userEvent.setup();
		const logged = spyOnConsole();
		const reported: string[][] = [];

		function Controlled(): JSX.Element {
			const [value, setValue] = useState<string[] | null>(null);

			return (
				<RadioCardsField.Multiple
					label="Tools"
					items={ITEMS}
					nullable
					allowClear
					name="tools"
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

		await user.click(screen.getByRole('checkbox', { name: 'Traces' }));

		expect(screen.getByRole('checkbox', { name: 'Traces' })).toBeChecked();

		await user.click(screen.getByRole('checkbox', { name: 'Traces' }));

		expectNothingChecked('checkbox');
		expect(reported).toEqual([['traces'], []]);
		expect(logged.error).not.toHaveBeenCalled();
		expect(logged.warn).not.toHaveBeenCalled();
	});

	it('keeps an uncontrolled group uncontrolled while no value is written', async () => {
		const user = userEvent.setup();
		render(<RadioCards.Multiple aria-label="Tools" items={ITEMS} nullable />);

		await user.click(screen.getByRole('checkbox', { name: 'Traces' }));

		expect(screen.getByRole('checkbox', { name: 'Traces' })).toBeChecked();
	});

	it('submits nothing for an empty value and one entry per checked card for a list', () => {
		const { rerender } = render(
			<form aria-label="Tools form">
				<RadioCards.Multiple aria-label="Tools" items={ITEMS} nullable name="tools" value={null} />
			</form>,
		);
		const form = screen.getByRole('form') as HTMLFormElement;

		expect(new FormData(form).getAll('tools')).toEqual([]);

		rerender(
			<form aria-label="Tools form">
				<RadioCards.Multiple
					aria-label="Tools"
					items={ITEMS}
					nullable
					name="tools"
					value={['metrics', 'logs']}
				/>
			</form>,
		);

		expect(new FormData(form).getAll('tools')).toEqual(['logs', 'metrics']);
	});

	it.each([
		['undefined', undefined],
		['null', null],
	])('gives the first card that is not disabled to the ref of a field with %s', (_, empty) => {
		const ref = createRef<HTMLInputElement>();
		render(
			<RadioCardsField.Multiple
				label="Tools"
				items={FIRST_DISABLED}
				nullable
				value={empty}
				ref={ref}
			/>,
		);

		ref.current?.focus();

		expect(screen.getByRole('checkbox', { name: 'Traces' })).toHaveFocus();
	});
});
