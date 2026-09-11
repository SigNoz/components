import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TooltipStack } from '../subcomponents/tooltip-stack.js';

describe('TooltipStack', () => {
	it('renders nothing without content', () => {
		const { container } = render(
			<TooltipStack
				items={[
					{ id: 'a', content: null },
					{ id: 'b', content: '' },
					{ id: 'c', content: false },
					{ id: 'd', content: undefined },
				]}
			/>,
		);

		expect(container).toBeEmptyDOMElement();
	});

	it('renders a lone item bare, without wrapper or divider', () => {
		const { container } = render(<TooltipStack items={[{ id: 'a', content: 'Only' }]} />);

		expect(container).toHaveTextContent('Only');
		expect(container.querySelector('[data-slot="tooltip-stack"]')).toBeNull();
		expect(container.querySelector('[data-slot="tooltip-divider"]')).toBeNull();
	});

	it('renders several items in order, with a divider between each pair', () => {
		render(
			<TooltipStack
				items={[
					{ id: 'a', content: <span data-testid="a">A</span> },
					{ id: 'b', content: <span data-testid="b">B</span> },
					{ id: 'c', content: <span data-testid="c">C</span> },
				]}
			/>,
		);

		const stack = document.querySelector('[data-slot="tooltip-stack"]');
		expect(stack).toHaveTextContent('ABC');
		expect(stack?.querySelectorAll('[data-slot="tooltip-divider"]')).toHaveLength(2);
		expect(stack?.children[0]).toBe(screen.getByTestId('a'));
		expect(stack?.children[1]).toHaveAttribute('data-slot', 'tooltip-divider');
		expect(stack?.children[2]).toBe(screen.getByTestId('b'));
	});

	it('skips empty items, so no divider is left dangling', () => {
		render(
			<TooltipStack
				items={[
					{ id: 'a', content: 'A' },
					{ id: 'b', content: null },
					{ id: 'c', content: '' },
					{ id: 'd', content: 'D' },
				]}
			/>,
		);

		const stack = document.querySelector('[data-slot="tooltip-stack"]');
		expect(stack).toHaveTextContent('AD');
		expect(stack?.querySelectorAll('[data-slot="tooltip-divider"]')).toHaveLength(1);
	});

	it('collapses to the bare item when every other one is empty', () => {
		const { container } = render(
			<TooltipStack
				items={[
					{ id: 'a', content: null },
					{ id: 'b', content: 'Only' },
				]}
			/>,
		);

		expect(container).toHaveTextContent('Only');
		expect(container.querySelector('[data-slot="tooltip-stack"]')).toBeNull();
	});
});
