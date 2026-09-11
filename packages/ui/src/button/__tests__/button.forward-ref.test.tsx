import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Button } from '../index.js';
import { Tooltip, TooltipProvider } from '../../tooltip/index.js';

describe('Button forwardRef', () => {
	it('forwards the ref to the rendered button element', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<Button size="md" variant="solid" color="primary" ref={ref}>
				Click
			</Button>,
		);

		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
		expect(ref.current).toBe(screen.getByRole('button'));
		expect(ref.current).toHaveAttribute('data-slot', 'button');
	});

	it('forwards the ref through the tooltip trigger the ellipsis mode mounts', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<Button size="md" variant="solid" color="primary" textOverflow="ellipsis" ref={ref}>
				Click
			</Button>,
		);

		expect(ref.current).toBe(screen.getByRole('button'));
	});

	it('forwards the ref without a tooltip trigger in the way', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<Button size="md" variant="solid" color="primary" textOverflow="none" ref={ref}>
				Click
			</Button>,
		);

		expect(ref.current).toBe(screen.getByRole('button'));
	});

	it('forwards the ref from inside a wrapping tooltip', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<TooltipProvider>
				<Tooltip title="Outer reason">
					<Button size="md" variant="solid" color="primary" ref={ref}>
						Click
					</Button>
				</Tooltip>
			</TooltipProvider>,
		);

		expect(ref.current).toBe(screen.getByRole('button'));
	});

	it('calls a callback ref with the button and with null on unmount', () => {
		const seen: Array<HTMLButtonElement | null> = [];
		const { unmount } = render(
			<Button
				size="md"
				variant="solid"
				color="primary"
				ref={(node) => {
					seen.push(node);
				}}
			>
				Click
			</Button>,
		);
		const button = screen.getByRole('button');

		unmount();

		expect(seen[0]).toBe(button);
		expect(seen.at(-1)).toBeNull();
	});
});
