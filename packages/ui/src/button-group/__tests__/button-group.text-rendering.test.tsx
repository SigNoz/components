import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ButtonGroup } from '../button-group.js';
import { BASE, ITEMS } from './button-group.test-utils.js';

function textRendering(element: HTMLElement): string {
	return getComputedStyle(element).textRendering;
}

describe('ButtonGroup text rendering', () => {
	it('renders each item with geometricPrecision, which a native button does not inherit from the page', () => {
		render(
			<div style={{ textRendering: 'optimizeLegibility' }}>
				<ButtonGroup {...BASE} items={ITEMS} />
			</div>,
		);

		for (const button of screen.getAllByRole('button')) {
			expect(textRendering(button)).toBe('geometricprecision');
		}
	});

	it.each(['optimizeLegibility', 'optimizeSpeed'])(
		'takes --button-group-text-rendering: %s',
		(value) => {
			render(
				<div style={{ ['--button-group-text-rendering' as string]: value }}>
					<ButtonGroup {...BASE} items={ITEMS} />
				</div>,
			);

			for (const button of screen.getAllByRole('button')) {
				expect(textRendering(button)).toBe(value.toLowerCase());
			}
		},
	);

	it('leaves a link member on the page value, which a link inherits', () => {
		render(
			<div style={{ textRendering: 'optimizeLegibility' }}>
				<ButtonGroup
					{...BASE}
					items={[...ITEMS, { value: 'docs', label: 'Docs', render: <a href="/docs" /> }]}
				/>
			</div>,
		);

		const link = screen.getByRole('link', { name: 'Docs' });
		expect(textRendering(link)).toBe('optimizelegibility');
		expect(textRendering(within(link).getByText('Docs'))).toBe('optimizelegibility');
	});

	it('holds on the label inside the item', () => {
		render(<ButtonGroup {...BASE} items={ITEMS} />);

		expect(textRendering(screen.getByText('Day'))).toBe('geometricprecision');
	});
});
