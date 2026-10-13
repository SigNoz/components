import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Popover } from '../popover.js';

describe('Popover forwardRef', () => {
	it('points the ref at the trigger element', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<Popover
				nativeButton
				side="bottom"
				align="start"
				trigger={<button type="button">Open</button>}
				ref={ref}
			>
				<p>Body</p>
			</Popover>,
		);

		expect(ref.current).toBe(screen.getByRole('button', { name: 'Open' }));
		expect(ref.current).toHaveAttribute('data-slot', 'popover-trigger');
	});
});
