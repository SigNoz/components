import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Field } from '../../field/field.js';
import { RadioGroup, RadioGroupField } from '../index.js';
import type { RadioGroupItemType } from '../types.js';

const ITEMS: RadioGroupItemType[] = [
	{ label: '7 days', value: '7' },
	{ label: '30 days', value: '30' },
	{ label: '90 days', value: '90' },
];

describe('RadioGroupField ref', () => {
	it('focuses the checked radio', () => {
		const ref = createRef<HTMLInputElement>();
		render(
			<RadioGroupField label="Retention" color="primary" items={ITEMS} value="30" ref={ref} />,
		);

		ref.current?.focus();

		expect(screen.getByRole('radio', { name: '30 days' })).toHaveFocus();
	});

	it('focuses the first radio while none is checked', () => {
		const ref = createRef<HTMLInputElement>();
		render(<RadioGroupField label="Retention" color="primary" items={ITEMS} ref={ref} />);

		ref.current?.focus();

		expect(screen.getByRole('radio', { name: '7 days' })).toHaveFocus();
	});

	it('skips a disabled radio while none is checked', () => {
		const ref = createRef<HTMLInputElement>();
		render(
			<RadioGroupField
				label="Retention"
				color="primary"
				ref={ref}
				items={[
					{ label: '7 days', value: '7', disabled: true, disabledTooltip: 'Ask an admin' },
					{ label: '30 days', value: '30' },
				]}
			/>,
		);

		ref.current?.focus();

		expect(screen.getByRole('radio', { name: '30 days' })).toHaveFocus();
	});

	it('has no element to give while the group is disabled', () => {
		const ref = createRef<HTMLInputElement>();
		render(
			<RadioGroupField
				label="Retention"
				color="primary"
				items={ITEMS}
				ref={ref}
				disabled
				disabledTooltip="Ask an admin"
			/>,
		);

		expect(ref.current).toBeNull();
	});

	it('follows the checked radio, for a callback ref that keeps the last element it got', async () => {
		const user = userEvent.setup();
		const seen: Array<HTMLInputElement | null> = [];
		render(
			<RadioGroupField
				label="Retention"
				color="primary"
				items={ITEMS}
				defaultValue="7"
				ref={(node) => {
					seen.push(node);
				}}
			/>,
		);

		await user.click(screen.getByRole('radio', { name: '90 days' }));
		(document.activeElement as HTMLElement).blur();
		seen.findLast((node) => node !== null)?.focus();

		expect(screen.getByRole('radio', { name: '90 days' })).toHaveFocus();
	});

	it('hands the element to a new ref and takes it back from the old one', () => {
		const first = createRef<HTMLInputElement>();
		const second = createRef<HTMLInputElement>();
		const { rerender } = render(
			<RadioGroupField label="Retention" color="primary" items={ITEMS} value="30" ref={first} />,
		);

		expect(first.current).not.toBeNull();

		rerender(
			<RadioGroupField label="Retention" color="primary" items={ITEMS} value="30" ref={second} />,
		);

		expect(first.current).toBeNull();

		second.current?.focus();

		expect(screen.getByRole('radio', { name: '30 days' })).toHaveFocus();
	});

	it('keeps following the checked radio after the ref changed', async () => {
		const user = userEvent.setup();
		const first = createRef<HTMLInputElement>();
		const second = createRef<HTMLInputElement>();
		const { rerender } = render(
			<RadioGroupField
				label="Retention"
				color="primary"
				items={ITEMS}
				defaultValue="7"
				ref={first}
			/>,
		);

		rerender(
			<RadioGroupField
				label="Retention"
				color="primary"
				items={ITEMS}
				defaultValue="7"
				ref={second}
			/>,
		);
		await user.click(screen.getByRole('radio', { name: '90 days' }));
		(document.activeElement as HTMLElement).blur();
		second.current?.focus();

		expect(screen.getByRole('radio', { name: '90 days' })).toHaveFocus();
		expect(first.current).toBeNull();
	});

	it('is called with null once the field unmounts', () => {
		const ref = vi.fn();
		const { unmount } = render(
			<RadioGroupField label="Retention" color="primary" items={ITEMS} ref={ref} />,
		);

		unmount();

		expect(ref).toHaveBeenLastCalledWith(null);
	});
});

describe('RadioGroup ref', () => {
	it('stays the root div, alone and inside a Field.Group', () => {
		const alone = createRef<HTMLDivElement>();
		const inside = createRef<HTMLDivElement>();
		render(
			<>
				<RadioGroup color="primary" items={ITEMS} aria-label="Alone" ref={alone} />
				<Field.Group label="Inside">
					<RadioGroup color="primary" items={ITEMS} ref={inside} />
				</Field.Group>
			</>,
		);

		expect(alone.current).toBe(screen.getByRole('radiogroup', { name: 'Alone' }));
		expect(inside.current).toBe(screen.getByRole('radiogroup', { name: 'Inside' }));
		expect(inside.current).toBeInstanceOf(HTMLDivElement);
	});
});
