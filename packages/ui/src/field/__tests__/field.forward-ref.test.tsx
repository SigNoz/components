import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Field } from '../field.js';

describe('Field forwardRef', () => {
	it('forwards the ref to the root', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Field label="Organisation" testId="field" ref={ref}>
				<input aria-label="control" />
			</Field>,
		);

		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toBe(screen.getByTestId('field'));
		expect(ref.current).toHaveAttribute('data-slot', 'field');
	});
});
