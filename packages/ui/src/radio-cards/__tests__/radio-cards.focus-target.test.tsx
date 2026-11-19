import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Field } from '../../field/field.js';
import { RadioCardsField } from '../presets/radio-cards-field.js';
import { RadioCards } from '../radio-cards.js';
import type { RadioCardsItemType } from '../types.js';
import { ITEMS } from './radio-cards.test-utils.js';

const FIRST_DISABLED: RadioCardsItemType[] = [
	{ label: 'Logs', value: 'logs', disabled: true, disabledTooltip: 'No logs yet' },
	{ label: 'Traces', value: 'traces' },
	{ label: 'Metrics', value: 'metrics' },
];

describe('RadioCardsField ref', () => {
	it('focuses the checked card', () => {
		const ref = createRef<HTMLInputElement>();
		render(<RadioCardsField label="Signal" items={ITEMS} value="traces" ref={ref} />);

		ref.current?.focus();

		expect(screen.getByRole('radio', { name: 'Traces' })).toHaveFocus();
	});

	it('focuses the first card while none is checked, skipping a disabled one', () => {
		const ref = createRef<HTMLInputElement>();
		render(<RadioCardsField label="Signal" items={FIRST_DISABLED} ref={ref} />);

		ref.current?.focus();

		expect(screen.getByRole('radio', { name: 'Traces' })).toHaveFocus();
	});

	it('has no element to give while the group is disabled', () => {
		const ref = createRef<HTMLInputElement>();
		render(
			<RadioCardsField
				label="Signal"
				items={ITEMS}
				ref={ref}
				disabled
				disabledTooltip="Ask an admin"
			/>,
		);

		expect(ref.current).toBeNull();
	});

	it('hands the element to a new ref and takes it back from the old one', () => {
		const first = createRef<HTMLInputElement>();
		const second = createRef<HTMLInputElement>();
		const { rerender } = render(
			<RadioCardsField label="Signal" items={ITEMS} value="traces" ref={first} />,
		);

		expect(first.current).not.toBeNull();

		rerender(<RadioCardsField label="Signal" items={ITEMS} value="traces" ref={second} />);

		expect(first.current).toBeNull();

		second.current?.focus();

		expect(screen.getByRole('radio', { name: 'Traces' })).toHaveFocus();
	});

	it('is called with null once the field unmounts', () => {
		const ref = vi.fn();
		const { unmount } = render(<RadioCardsField label="Signal" items={ITEMS} ref={ref} />);

		unmount();

		expect(ref).toHaveBeenLastCalledWith(null);
	});
});

describe('RadioCardsField.Multiple ref', () => {
	it('focuses the first card while none is checked', () => {
		const ref = createRef<HTMLInputElement>();
		render(<RadioCardsField.Multiple label="Tools" items={ITEMS} ref={ref} />);

		ref.current?.focus();

		expect(screen.getByRole('checkbox', { name: 'Logs' })).toHaveFocus();
	});

	it('focuses the first checked card', () => {
		const ref = createRef<HTMLInputElement>();
		render(
			<RadioCardsField.Multiple
				label="Tools"
				items={ITEMS}
				value={['traces', 'metrics']}
				ref={ref}
			/>,
		);

		ref.current?.focus();

		expect(screen.getByRole('checkbox', { name: 'Traces' })).toHaveFocus();
	});

	it('skips a disabled card', () => {
		const ref = createRef<HTMLInputElement>();
		render(<RadioCardsField.Multiple label="Tools" items={FIRST_DISABLED} ref={ref} />);

		ref.current?.focus();

		expect(screen.getByRole('checkbox', { name: 'Traces' })).toHaveFocus();
	});

	it('skips a checked card that is disabled', () => {
		const ref = createRef<HTMLInputElement>();
		render(
			<RadioCardsField.Multiple
				label="Tools"
				items={FIRST_DISABLED}
				value={['logs', 'metrics']}
				ref={ref}
			/>,
		);

		ref.current?.focus();

		expect(screen.getByRole('checkbox', { name: 'Metrics' })).toHaveFocus();
	});
});

describe('RadioCards ref', () => {
	it('stays the root div, alone and inside a Field.Group', () => {
		const alone = createRef<HTMLDivElement>();
		const inside = createRef<HTMLDivElement>();
		render(
			<>
				<RadioCards aria-label="Alone" items={ITEMS} ref={alone} />
				<Field.Group label="Inside">
					<RadioCards items={ITEMS} ref={inside} />
				</Field.Group>
			</>,
		);

		expect(alone.current).toBe(screen.getByRole('radiogroup', { name: 'Alone' }));
		expect(inside.current).toBe(screen.getByRole('radiogroup', { name: 'Inside' }));
	});

	it('stays the root div of RadioCards.Multiple, alone and inside a Field.Group', () => {
		const alone = createRef<HTMLDivElement>();
		const inside = createRef<HTMLDivElement>();
		render(
			<>
				<RadioCards.Multiple aria-label="Alone" items={ITEMS} ref={alone} />
				<Field.Group label="Inside">
					<RadioCards.Multiple items={ITEMS} ref={inside} />
				</Field.Group>
			</>,
		);

		expect(alone.current).toBe(screen.getByRole('group', { name: 'Alone' }));
		expect(inside.current).toHaveAttribute('data-multiple');
		expect(inside.current).toBeInstanceOf(HTMLDivElement);
	});
});
