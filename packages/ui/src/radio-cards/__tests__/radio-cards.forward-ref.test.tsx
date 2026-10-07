import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { RadioCards } from '../index.js';
import { ITEMS } from './radio-cards.test-utils.js';

describe('RadioCards forwardRef', () => {
	it('forwards the ref to the radiogroup', () => {
		const ref = createRef<HTMLDivElement>();
		render(<RadioCards aria-label="Signal" items={ITEMS} ref={ref} />);

		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toBe(screen.getByRole('radiogroup'));
		expect(ref.current).toHaveAttribute('data-slot', 'radio-cards');
	});

	it('forwards the ref through the tooltip trigger a reason mounts', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<RadioCards
				aria-label="Signal"
				items={ITEMS}
				disabled
				disabledTooltip="Ask an admin"
				ref={ref}
			/>,
		);

		expect(ref.current).toBe(screen.getByRole('radiogroup'));
	});

	it('forwards the Multiple ref to the group', () => {
		const ref = createRef<HTMLDivElement>();
		render(<RadioCards.Multiple aria-label="Tools" items={ITEMS} ref={ref} />);

		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toBe(screen.getByRole('group'));
		expect(ref.current).toHaveAttribute('data-slot', 'radio-cards');
	});
});
