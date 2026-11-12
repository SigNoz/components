import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RadioGroup, RadioGroupField } from '../index.js';
import type { RadioGroupItemType } from '../types.js';

const ITEMS: RadioGroupItemType[] = [
	{ label: '7 days', value: '7' },
	{ label: '30 days', value: '30' },
];

describe('RadioGroup onBlur', () => {
	it('is called once when the focus leaves the group', async () => {
		const user = userEvent.setup();
		const onBlur = vi.fn();
		render(
			<>
				<RadioGroup
					color="primary"
					items={ITEMS}
					defaultValue="7"
					aria-label="Retention"
					onBlur={onBlur}
				/>
				<button type="button">Next</button>
			</>,
		);

		await user.tab();

		expect(screen.getByRole('radio', { name: '7 days' })).toHaveFocus();
		expect(onBlur).not.toHaveBeenCalled();

		await user.tab();

		expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
		expect(onBlur).toHaveBeenCalledTimes(1);
		expect(onBlur.mock.calls[0][0].relatedTarget).toBe(
			screen.getByRole('button', { name: 'Next' }),
		);
	});

	it('is not called while the focus moves between the radios', async () => {
		const user = userEvent.setup();
		const onBlur = vi.fn();
		render(
			<RadioGroup
				color="primary"
				items={ITEMS}
				defaultValue="7"
				aria-label="Retention"
				onBlur={onBlur}
			/>,
		);

		await user.tab();
		await user.keyboard('{ArrowDown}');

		expect(screen.getByRole('radio', { name: '30 days' })).toHaveFocus();
		expect(onBlur).not.toHaveBeenCalled();
	});

	it('is called when the focus leaves from the radio it moved to', async () => {
		const user = userEvent.setup();
		const onBlur = vi.fn();
		render(
			<>
				<RadioGroup
					color="primary"
					items={ITEMS}
					defaultValue="7"
					aria-label="Retention"
					onBlur={onBlur}
				/>
				<button type="button">Next</button>
			</>,
		);

		await user.tab();
		await user.keyboard('{ArrowDown}');
		await user.tab();

		expect(onBlur).toHaveBeenCalledTimes(1);
	});

	it('is accepted by RadioGroupField', async () => {
		const user = userEvent.setup();
		const onBlur = vi.fn();
		render(
			<>
				<RadioGroupField label="Retention" color="primary" items={ITEMS} onBlur={onBlur} />
				<button type="button">Next</button>
			</>,
		);

		await user.tab();
		await user.tab();

		expect(onBlur).toHaveBeenCalledTimes(1);
	});
});
