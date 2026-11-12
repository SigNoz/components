import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Input } from '../../input/input.js';
import { Field } from '../field.js';

describe('Field forwardRef', () => {
	it('forwards the ref to the root div', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Field label="Organisation" testId="field" ref={ref}>
				<Input aria-label="control" />
			</Field>,
		);

		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toBe(screen.getByTestId('field'));
		expect(ref.current).toHaveAttribute('data-slot', 'field');
	});

	it('forwards the ref of Field.Group to the fieldset', () => {
		const ref = createRef<HTMLFieldSetElement>();
		render(
			<Field.Group label="Amount" testId="group" ref={ref}>
				<Input aria-label="Value" />
			</Field.Group>,
		);

		expect(ref.current).toBeInstanceOf(HTMLFieldSetElement);
		expect(ref.current).toBe(screen.getByTestId('group'));
		expect(ref.current).toHaveAttribute('data-slot', 'field-group');
	});

	it('hands a callback ref the element and clears it on unmount', () => {
		const calls: Array<HTMLDivElement | null> = [];
		const { unmount } = render(
			<Field label="Organisation" testId="field" ref={(element) => void calls.push(element)}>
				<Input aria-label="control" />
			</Field>,
		);

		expect(calls[0]).toBe(screen.getByTestId('field'));

		unmount();

		expect(calls.at(-1)).toBeNull();
	});
});
