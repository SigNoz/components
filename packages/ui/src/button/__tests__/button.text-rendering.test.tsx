import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from '../button.js';

function textRendering(element: HTMLElement): string {
	return getComputedStyle(element).textRendering;
}

describe('Button text rendering', () => {
	it('renders with geometricPrecision, which a native button does not inherit from the page', () => {
		render(
			<div style={{ textRendering: 'optimizeLegibility' }}>
				<Button size="md" variant="solid" color="primary">
					Save changes
				</Button>
			</div>,
		);

		expect(textRendering(screen.getByRole('button'))).toBe('geometricprecision');
	});

	it.each(['optimizeLegibility', 'optimizeSpeed'])('takes --button-text-rendering: %s', (value) => {
		render(
			<div style={{ ['--button-text-rendering' as string]: value }}>
				<Button size="md" variant="solid" color="primary">
					Save changes
				</Button>
			</div>,
		);

		expect(textRendering(screen.getByRole('button'))).toBe(value.toLowerCase());
	});

	it('holds on the label inside the button', () => {
		render(
			<Button size="sm" variant="solid" color="primary">
				Save changes
			</Button>,
		);

		expect(textRendering(screen.getByText('Save changes'))).toBe('geometricprecision');
	});
});
