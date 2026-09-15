import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { RadioGroup } from '../index.js';
import type { RadioGroupItemType } from '../types.js';

const ITEMS: RadioGroupItemType[] = [
	{ label: 'Staging', value: 'staging' },
	{ label: 'Production', value: 'production' },
];

describe('RadioGroup forwardRef', () => {
	it('forwards the ref to the rendered group element', () => {
		const ref = createRef<HTMLDivElement>();
		render(<RadioGroup color="primary" items={ITEMS} ref={ref} />);

		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toBe(screen.getByRole('radiogroup'));
		expect(ref.current).toHaveAttribute('data-slot', 'radio-group');
	});

	it('forwards the ref through the tooltip trigger a reason mounts', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<RadioGroup
				color="primary"
				items={ITEMS}
				disabled
				disabledTooltip="Ask an admin"
				ref={ref}
			/>,
		);

		expect(ref.current).toBe(screen.getByRole('radiogroup'));
	});

	it('calls a callback ref with the group and with null on unmount', () => {
		const seen: Array<HTMLDivElement | null> = [];
		const { unmount } = render(
			<RadioGroup
				color="primary"
				items={ITEMS}
				ref={(node) => {
					seen.push(node);
				}}
			/>,
		);
		const group = screen.getByRole('radiogroup');

		unmount();

		expect(seen[0]).toBe(group);
		expect(seen.at(-1)).toBeNull();
	});
});
