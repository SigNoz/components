import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { ColorPicker } from '../index.js';

describe('ColorPicker forwardRef', () => {
	it('forwards the ref to the trigger element', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<ColorPicker nativeButton side="bottom" align="start" testId="picker" ref={ref}>
				<button type="button">Color</button>
			</ColorPicker>,
		);

		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
		expect(ref.current).toBe(screen.getByTestId('picker'));
		expect(ref.current).toHaveAttribute('data-slot', 'color-picker-trigger');
	});

	it('forwards the ref through the tooltip anchor a reason mounts', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<ColorPicker
				nativeButton
				side="bottom"
				align="start"
				testId="picker"
				disabled
				disabledTooltip="Ask an admin"
				ref={ref}
			>
				<button type="button">Color</button>
			</ColorPicker>,
		);

		expect(ref.current).toBe(screen.getByTestId('picker'));
	});

	it('keeps the ref the trigger element has', () => {
		const ref = createRef<HTMLButtonElement>();
		const ownRef = createRef<HTMLButtonElement>();
		render(
			<ColorPicker nativeButton side="bottom" align="start" testId="picker" ref={ref}>
				<button type="button" ref={ownRef}>
					Color
				</button>
			</ColorPicker>,
		);

		expect(ownRef.current).toBe(screen.getByTestId('picker'));
		expect(ref.current).toBe(ownRef.current);
	});

	it('calls a callback ref with the trigger and with null on unmount', () => {
		const seen: Array<HTMLElement | null> = [];
		const { unmount } = render(
			<ColorPicker
				nativeButton
				side="bottom"
				align="start"
				testId="picker"
				ref={(node) => {
					seen.push(node);
				}}
			>
				<button type="button">Color</button>
			</ColorPicker>,
		);
		const trigger = screen.getByTestId('picker');

		unmount();

		expect(seen[0]).toBe(trigger);
		expect(seen.at(-1)).toBeNull();
	});
});
