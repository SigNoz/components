import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Command } from '../index.js';
import { ITEMS } from './command.test-utils.js';

describe('Command forwardRef', () => {
	it('forwards the ref to the dialog panel', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Command
				label="Command palette"
				open
				onOpenChange={() => {}}
				searchInputProps={{ placeholder: 'Search…' }}
				items={ITEMS}
				testId="command"
				ref={ref}
			/>,
		);

		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toBe(screen.getByRole('dialog'));
		expect(ref.current).toHaveAttribute('data-slot', 'command');
	});
});
