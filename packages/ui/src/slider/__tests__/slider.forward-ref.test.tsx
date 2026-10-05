import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Slider } from '../index.js';

describe('Slider forwardRef', () => {
	it('forwards the ref to the root', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Slider color="primary" defaultValue={50} aria-label="Volume" testId="volume" ref={ref} />,
		);

		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current).toBe(screen.getByTestId('volume'));
		expect(ref.current).toHaveAttribute('data-slot', 'slider');
	});

	it('forwards the ref of Slider.Range to the root', () => {
		const ref = createRef<HTMLDivElement>();
		render(<Slider.Range color="primary" aria-label="Duration" testId="duration" ref={ref} />);

		expect(ref.current).toBe(screen.getByTestId('duration'));
	});

	it('forwards the ref through the tooltip trigger a reason mounts', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<Slider
				color="primary"
				defaultValue={50}
				disabled
				disabledTooltip="Pick a source first"
				aria-label="Volume"
				testId="volume"
				ref={ref}
			/>,
		);

		expect(ref.current).toBe(screen.getByTestId('volume'));
	});

	it('names Slider.Range in DevTools', () => {
		expect(Slider.Range.displayName).toBe('Slider.Range');
	});
});
