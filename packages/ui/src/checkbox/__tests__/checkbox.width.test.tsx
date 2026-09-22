import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Checkbox } from '../checkbox.js';

describe('Checkbox width and maxWidth', () => {
	it('writes width onto the wrapper as a custom property, numbers as px', () => {
		render(
			<Checkbox color="primary" containerTestId="container" width={240}>
				Accept the terms
			</Checkbox>,
		);

		const container = screen.getByTestId('container');
		expect(container.style.getPropertyValue('--checkbox-internal-width')).toBe('240px');
		expect(container.getBoundingClientRect().width).toBe(240);
	});

	it('keeps a string width as written', () => {
		render(
			<Checkbox color="primary" containerTestId="container" width="20rem">
				Accept the terms
			</Checkbox>,
		);

		expect(
			screen.getByTestId('container').style.getPropertyValue('--checkbox-internal-width'),
		).toBe('20rem');
	});

	it('writes maxWidth the same way', () => {
		render(
			<Checkbox color="primary" containerTestId="container" maxWidth={160}>
				Accept the terms
			</Checkbox>,
		);

		expect(
			screen.getByTestId('container').style.getPropertyValue('--checkbox-internal-max-width'),
		).toBe('160px');
	});

	it('composes with a consumer style instead of replacing it', () => {
		render(
			<Checkbox
				color="primary"
				containerTestId="container"
				width={240}
				containerStyle={{ marginBlock: '12px' }}
			>
				Accept the terms
			</Checkbox>,
		);

		const container = screen.getByTestId('container');
		expect(container.style.getPropertyValue('--checkbox-internal-width')).toBe('240px');
		expect(container).toHaveStyle({ marginBlock: '12px' });
	});

	it('lands on the bare checkbox when there is no wrapper, without resizing the box', () => {
		render(
			<Checkbox color="primary" testId="checkbox" aria-label="Accept the terms" width={240} />,
		);

		const root = screen.getByTestId('checkbox');
		expect(root.style.getPropertyValue('--checkbox-internal-width')).toBe('240px');
		// The box is sized by `--checkbox-size`, never by the row width: 16px plus the 2px
		// hit-area ring on each side.
		expect(root.getBoundingClientRect().width).toBe(20);
	});

	it('never writes the properties it was not given', () => {
		render(
			<Checkbox color="primary" containerTestId="container">
				Accept the terms
			</Checkbox>,
		);

		const container = screen.getByTestId('container');
		expect(container.style.getPropertyValue('--checkbox-internal-width')).toBe('');
		expect(container.style.getPropertyValue('--checkbox-internal-max-width')).toBe('');
	});
});
