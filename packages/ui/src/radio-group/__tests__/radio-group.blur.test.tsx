import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { userEvent as browserUser } from 'vitest/browser';
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

	// Real clicks: the browser's own press on text that cannot take the focus is what moved the
	// focus to <body> on its way to the next radio.
	it('is not called while clicks move the focus from one radio text to another', async () => {
		const onBlur = vi.fn();
		render(<RadioGroup color="primary" items={ITEMS} aria-label="Retention" onBlur={onBlur} />);

		await browserUser.click(screen.getByText('7 days'));
		await browserUser.click(screen.getByText('30 days'));

		expect(screen.getByRole('radio', { name: '30 days' })).toHaveFocus();
		expect(screen.getByRole('radio', { name: '30 days' })).toBeChecked();
		expect(onBlur).not.toHaveBeenCalled();
	});

	it('is called once when the focus leaves after clicks on the radio texts', async () => {
		const onBlur = vi.fn();
		render(
			<>
				<RadioGroup color="primary" items={ITEMS} aria-label="Retention" onBlur={onBlur} />
				<button type="button">Next</button>
			</>,
		);

		await browserUser.click(screen.getByText('7 days'));
		await browserUser.click(screen.getByText('30 days'));
		await browserUser.click(screen.getByRole('button', { name: 'Next' }));

		expect(onBlur).toHaveBeenCalledTimes(1);
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
