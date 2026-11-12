import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Form } from '../form.js';

describe('Form forwardRef', () => {
	it('forwards the ref to the <form>', () => {
		const ref = createRef<HTMLFormElement>();
		render(
			<Form onSubmit={() => {}} testId="form" ref={ref}>
				<input aria-label="Email" />
			</Form>,
		);

		expect(ref.current).toBeInstanceOf(HTMLFormElement);
		expect(ref.current).toBe(screen.getByTestId('form'));
		expect(ref.current).toHaveAttribute('data-slot', 'form');
	});

	it('hands a callback ref the form and clears it on unmount', () => {
		const calls: Array<HTMLFormElement | null> = [];
		const { unmount } = render(
			<Form onSubmit={() => {}} testId="form" ref={(element) => void calls.push(element)}>
				<input aria-label="Email" />
			</Form>,
		);

		expect(calls[0]).toBe(screen.getByTestId('form'));

		unmount();

		expect(calls.at(-1)).toBeNull();
	});

	it('lets the ref submit the form through requestSubmit', () => {
		const ref = createRef<HTMLFormElement>();
		let prevented: boolean | undefined;
		render(
			<Form
				onSubmit={(event) => {
					prevented = event.defaultPrevented;
				}}
				ref={ref}
			>
				<input aria-label="Email" />
			</Form>,
		);

		ref.current?.requestSubmit();

		expect(prevented).toBe(true);
	});
});
