import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RadioCards } from '../radio-cards.js';
import { ITEMS } from './radio-cards.test-utils.js';

function submitted(): Array<[string, FormDataEntryValue]> {
	return [...new FormData(screen.getByTestId('form') as HTMLFormElement).entries()];
}

function card(name: string): HTMLElement {
	return screen.getByRole(screen.queryAllByRole('radio').length > 0 ? 'radio' : 'checkbox', {
		name,
	});
}

describe('RadioCards form reset', () => {
	it('brings an uncontrolled group back to defaultValue, without onChange', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<form data-testid="form">
				<RadioCards
					aria-label="Signal"
					items={ITEMS}
					name="signal"
					defaultValue="traces"
					onChange={onChange}
				/>
				<button type="reset">Reset</button>
			</form>,
		);

		await user.click(card('Logs'));

		expect(card('Logs')).toBeChecked();
		expect(submitted()).toEqual([['signal', 'logs']]);

		onChange.mockClear();
		await user.click(screen.getByRole('button', { name: 'Reset' }));

		await waitFor(() => {
			expect(card('Traces')).toBeChecked();
		});
		expect(card('Logs')).not.toBeChecked();
		expect(submitted()).toEqual([['signal', 'traces']]);
		expect(onChange).not.toHaveBeenCalled();
	});

	it('brings a group that started empty back to nothing checked', async () => {
		const user = userEvent.setup();
		render(
			<form data-testid="form">
				<RadioCards aria-label="Signal" items={ITEMS} name="signal" />
				<button type="reset">Reset</button>
			</form>,
		);

		await user.click(card('Metrics'));

		expect(submitted()).toEqual([['signal', 'metrics']]);

		await user.click(screen.getByRole('button', { name: 'Reset' }));

		await waitFor(() => {
			expect(card('Metrics')).not.toBeChecked();
		});
		expect(submitted()).toEqual([]);
	});

	it('resets a disabled group, as a native reset does', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		function Harness({ disabled }: { disabled: boolean }) {
			return (
				<form data-testid="form">
					<RadioCards
						aria-label="Signal"
						items={ITEMS}
						name="signal"
						defaultValue="traces"
						onChange={onChange}
						disabled={disabled}
						disabledTooltip="Saving"
					/>
					<button type="reset">Reset</button>
				</form>
			);
		}
		const { rerender } = render(<Harness disabled={false} />);

		await user.click(card('Logs'));
		rerender(<Harness disabled />);
		onChange.mockClear();
		await user.click(screen.getByRole('button', { name: 'Reset' }));

		await waitFor(() => {
			expect(card('Traces')).toBeChecked();
		});
		expect(onChange).not.toHaveBeenCalled();
	});

	it('resets a group rendered outside the form through form', async () => {
		const user = userEvent.setup();
		render(
			<>
				<form data-testid="form" id="onboarding">
					<button type="reset">Reset</button>
				</form>
				<RadioCards
					aria-label="Signal"
					items={ITEMS}
					name="signal"
					form="onboarding"
					defaultValue="traces"
				/>
			</>,
		);

		await user.click(card('Logs'));

		expect(submitted()).toEqual([['signal', 'logs']]);

		await user.click(screen.getByRole('button', { name: 'Reset' }));

		await waitFor(() => {
			expect(card('Traces')).toBeChecked();
		});
		expect(submitted()).toEqual([['signal', 'traces']]);
	});

	it('resets a group whose tooltip anchor came and went, which replaces its element', async () => {
		const user = userEvent.setup();
		function Group({ reason }: { reason: string | undefined }) {
			return (
				<form data-testid="form">
					<RadioCards
						aria-label="Signal"
						items={ITEMS}
						name="signal"
						defaultValue="traces"
						disabled={reason !== undefined}
						disabledTooltip={reason}
					/>
					<button type="reset">Reset</button>
				</form>
			);
		}
		const { rerender } = render(<Group reason={undefined} />);

		await user.click(card('Logs'));
		rerender(<Group reason="Saving" />);
		rerender(<Group reason={undefined} />);
		await user.click(screen.getByRole('button', { name: 'Reset' }));

		await waitFor(() => {
			expect(card('Traces')).toBeChecked();
		});
		expect(submitted()).toEqual([['signal', 'traces']]);
	});

	it('resets a group that mounted disabled and was enabled later', async () => {
		const user = userEvent.setup();
		function Group({ disabled }: { disabled: boolean }) {
			return (
				<form data-testid="form">
					<RadioCards
						aria-label="Signal"
						items={ITEMS}
						name="signal"
						defaultValue="traces"
						disabled={disabled}
						disabledTooltip="Loading"
					/>
					<button type="reset">Reset</button>
				</form>
			);
		}
		const { rerender } = render(<Group disabled />);

		rerender(<Group disabled={false} />);
		await user.click(card('Logs'));
		await user.click(screen.getByRole('button', { name: 'Reset' }));

		await waitFor(() => {
			expect(card('Traces')).toBeChecked();
		});
	});

	it('keeps a controlled value, which the form onReset owns', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<form data-testid="form">
				<RadioCards
					aria-label="Signal"
					items={ITEMS}
					name="signal"
					value="logs"
					onChange={onChange}
				/>
				<button type="reset">Reset</button>
			</form>,
		);

		await user.click(card('Traces'));
		onChange.mockClear();
		await user.click(screen.getByRole('button', { name: 'Reset' }));
		await new Promise((resolve) => setTimeout(resolve));

		expect(card('Logs')).toBeChecked();
		expect(card('Traces')).not.toBeChecked();
		expect(onChange).not.toHaveBeenCalled();
	});

	it('keeps the value when the form cancels the reset', async () => {
		const user = userEvent.setup();
		render(
			<form data-testid="form" onReset={(event) => event.preventDefault()}>
				<RadioCards aria-label="Signal" items={ITEMS} name="signal" defaultValue="traces" />
				<button type="reset">Reset</button>
			</form>,
		);

		await user.click(card('Logs'));
		await user.click(screen.getByRole('button', { name: 'Reset' }));
		await new Promise((resolve) => setTimeout(resolve));

		expect(card('Logs')).toBeChecked();
		expect(submitted()).toEqual([['signal', 'logs']]);
	});
});

describe('RadioCards.Multiple form reset', () => {
	it('brings an uncontrolled group back to defaultValue, without onChange', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<form data-testid="form">
				<RadioCards.Multiple
					aria-label="Signals"
					items={ITEMS}
					name="signals"
					defaultValue={['logs', 'traces']}
					onChange={onChange}
				/>
				<button type="reset">Reset</button>
			</form>,
		);

		await user.click(card('Metrics'));
		await user.click(card('Logs'));

		expect(submitted()).toEqual([
			['signals', 'traces'],
			['signals', 'metrics'],
		]);

		onChange.mockClear();
		await user.click(screen.getByRole('button', { name: 'Reset' }));

		await waitFor(() => {
			expect(card('Logs')).toBeChecked();
		});
		expect(card('Traces')).toBeChecked();
		expect(card('Metrics')).not.toBeChecked();
		expect(submitted()).toEqual([
			['signals', 'logs'],
			['signals', 'traces'],
		]);
		expect(onChange).not.toHaveBeenCalled();
	});

	it('resets a group where every card is disabled', async () => {
		const user = userEvent.setup();
		function Harness({ disabled }: { disabled: boolean }) {
			return (
				<form data-testid="form">
					<RadioCards.Multiple
						aria-label="Signals"
						items={ITEMS}
						name="signals"
						defaultValue={['logs']}
						disabled={disabled}
						disabledTooltip="Saving"
					/>
					<button type="reset">Reset</button>
				</form>
			);
		}
		const { rerender } = render(<Harness disabled={false} />);

		await user.click(card('Metrics'));
		rerender(<Harness disabled />);
		await user.click(screen.getByRole('button', { name: 'Reset' }));

		await waitFor(() => {
			expect(card('Metrics')).not.toBeChecked();
		});
		expect(card('Logs')).toBeChecked();
	});

	it('resets a group rendered outside the form through form', async () => {
		const user = userEvent.setup();
		render(
			<>
				<form data-testid="form" id="onboarding">
					<button type="reset">Reset</button>
				</form>
				<RadioCards.Multiple
					aria-label="Signals"
					items={ITEMS}
					name="signals"
					form="onboarding"
					defaultValue={['logs']}
				/>
			</>,
		);

		await user.click(card('Metrics'));

		expect(submitted()).toEqual([
			['signals', 'logs'],
			['signals', 'metrics'],
		]);

		await user.click(screen.getByRole('button', { name: 'Reset' }));

		await waitFor(() => {
			expect(card('Metrics')).not.toBeChecked();
		});
		expect(submitted()).toEqual([['signals', 'logs']]);
	});

	it('keeps a controlled value, which the form onReset owns', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<form data-testid="form">
				<RadioCards.Multiple
					aria-label="Signals"
					items={ITEMS}
					name="signals"
					value={['logs']}
					onChange={onChange}
				/>
				<button type="reset">Reset</button>
			</form>,
		);

		await user.click(card('Traces'));
		onChange.mockClear();
		await user.click(screen.getByRole('button', { name: 'Reset' }));
		await new Promise((resolve) => setTimeout(resolve));

		expect(card('Logs')).toBeChecked();
		expect(card('Traces')).not.toBeChecked();
		expect(onChange).not.toHaveBeenCalled();
	});

	it('keeps the value when the form cancels the reset', async () => {
		const user = userEvent.setup();
		render(
			<form data-testid="form" onReset={(event) => event.preventDefault()}>
				<RadioCards.Multiple
					aria-label="Signals"
					items={ITEMS}
					name="signals"
					defaultValue={['logs']}
				/>
				<button type="reset">Reset</button>
			</form>,
		);

		await user.click(card('Metrics'));
		await user.click(screen.getByRole('button', { name: 'Reset' }));
		await new Promise((resolve) => setTimeout(resolve));

		expect(card('Metrics')).toBeChecked();
		expect(submitted()).toEqual([
			['signals', 'logs'],
			['signals', 'metrics'],
		]);
	});
});
