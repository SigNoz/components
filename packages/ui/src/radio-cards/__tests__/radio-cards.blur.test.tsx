import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RadioCardsField } from '../presets/radio-cards-field.js';
import { RadioCards } from '../radio-cards.js';
import { ITEMS } from './radio-cards.test-utils.js';

describe('RadioCards onBlur', () => {
	it('is called once when the focus leaves the group', async () => {
		const user = userEvent.setup();
		const onBlur = vi.fn();
		render(
			<>
				<RadioCards aria-label="Signal" items={ITEMS} defaultValue="logs" onBlur={onBlur} />
				<button type="button">Next</button>
			</>,
		);

		await user.tab();

		expect(screen.getByRole('radio', { name: 'Logs' })).toHaveFocus();
		expect(onBlur).not.toHaveBeenCalled();

		await user.tab();

		expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
		expect(onBlur).toHaveBeenCalledTimes(1);
	});

	it('is not called while the focus moves between the cards', async () => {
		const user = userEvent.setup();
		const onBlur = vi.fn();
		render(<RadioCards aria-label="Signal" items={ITEMS} defaultValue="logs" onBlur={onBlur} />);

		await user.tab();
		await user.keyboard('{ArrowDown}{ArrowDown}');

		expect(screen.getByRole('radio', { name: 'Metrics' })).toHaveFocus();
		expect(onBlur).not.toHaveBeenCalled();
	});

	it('is accepted by RadioCardsField', async () => {
		const user = userEvent.setup();
		const onBlur = vi.fn();
		render(
			<>
				<RadioCardsField label="Signal" items={ITEMS} onBlur={onBlur} />
				<button type="button">Next</button>
			</>,
		);

		await user.tab();
		await user.tab();

		expect(onBlur).toHaveBeenCalledTimes(1);
	});
});

describe('RadioCards.Multiple onBlur', () => {
	it('is called once when the focus leaves the group', async () => {
		const user = userEvent.setup();
		const onBlur = vi.fn();
		render(
			<>
				<RadioCards.Multiple aria-label="Signals" items={ITEMS} onBlur={onBlur} />
				<button type="button">Next</button>
			</>,
		);

		await user.tab();
		await user.tab();
		await user.tab();

		expect(screen.getByRole('checkbox', { name: 'Metrics' })).toHaveFocus();
		expect(onBlur).not.toHaveBeenCalled();

		await user.tab();

		expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
		expect(onBlur).toHaveBeenCalledTimes(1);
	});

	it('is not called while the focus moves from one card to the next', async () => {
		const user = userEvent.setup();
		const onBlur = vi.fn();
		render(<RadioCards.Multiple aria-label="Signals" items={ITEMS} onBlur={onBlur} />);

		await user.tab();
		await user.tab();

		expect(screen.getByRole('checkbox', { name: 'Traces' })).toHaveFocus();
		expect(onBlur).not.toHaveBeenCalled();
	});

	it('is accepted by RadioCardsField.Multiple', async () => {
		const user = userEvent.setup();
		const onBlur = vi.fn();
		render(
			<>
				<RadioCardsField.Multiple label="Signals" items={ITEMS} onBlur={onBlur} />
				<button type="button">Next</button>
			</>,
		);

		await user.tab();
		await user.tab();
		await user.tab();
		await user.tab();

		expect(onBlur).toHaveBeenCalledTimes(1);
	});
});
