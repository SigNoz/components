import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { Tooltip } from '../presets/tooltip.js';
import { TooltipAnchor } from '../subcomponents/tooltip-anchor.js';
import { TooltipContent } from '../subcomponents/tooltip-content.js';
import { TooltipPopup } from '../subcomponents/tooltip-popup.js';
import { TooltipPortal } from '../subcomponents/tooltip-portal.js';
import { TooltipPositioner } from '../subcomponents/tooltip-positioner.js';
import { TooltipRoot } from '../subcomponents/tooltip-root.js';

const anchors: HTMLElement[] = [];

function makeAnchor(): HTMLElement {
	const anchor = document.createElement('button');
	document.body.append(anchor);
	anchors.push(anchor);

	return anchor;
}

afterEach(() => {
	for (const anchor of anchors.splice(0)) {
		anchor.remove();
	}
});

describe('Tooltip forwardRef', () => {
	it('forwards the ref to the trigger element', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<Tooltip ref={ref} title="Tooltip">
				<button type="button">Trigger</button>
			</Tooltip>,
		);

		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
		expect(ref.current).toBe(screen.getByRole('button'));
	});

	it('forwards the ref while there is no title', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<Tooltip ref={ref} title={undefined}>
				<button type="button">Trigger</button>
			</Tooltip>,
		);

		expect(ref.current).toBe(screen.getByRole('button'));
	});

	it('forwards the ref to the cloned element of a stacked tooltip', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<Tooltip title="Outer">
				<Tooltip ref={ref} title="Inner">
					<button type="button">Trigger</button>
				</Tooltip>
			</Tooltip>,
		);

		expect(ref.current).toBe(screen.getByRole('button'));
	});

	it('keeps the ref of the cloned element next to the forwarded one', () => {
		const forwarded = createRef<HTMLButtonElement>();
		const own = createRef<HTMLButtonElement>();
		render(
			<Tooltip title="Outer">
				<Tooltip ref={forwarded} title="Inner">
					<button ref={own} type="button">
						Trigger
					</button>
				</Tooltip>
			</Tooltip>,
		);

		expect(forwarded.current).toBe(screen.getByRole('button'));
		expect(own.current).toBe(screen.getByRole('button'));
	});

	it('calls a callback ref with the trigger and with null on unmount', () => {
		const seen: Array<HTMLButtonElement | null> = [];
		const { unmount } = render(
			<Tooltip
				title="Tooltip"
				ref={(node) => {
					seen.push(node);
				}}
			>
				<button type="button">Trigger</button>
			</Tooltip>,
		);
		const trigger = screen.getByRole('button');

		unmount();

		expect(seen[0]).toBe(trigger);
		expect(seen.at(-1)).toBeNull();
	});

	it('TooltipAnchor forwards the ref to the button it wraps text in', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<TooltipAnchor ref={ref} content="Tooltip">
				Trigger
			</TooltipAnchor>,
		);

		expect(ref.current).toBe(screen.getByRole('button'));
	});

	it('TooltipAnchor keeps the ref of its element child next to the forwarded one', () => {
		const forwarded = createRef<HTMLButtonElement>();
		const own = createRef<HTMLButtonElement>();
		render(
			<TooltipAnchor ref={forwarded} content="Tooltip">
				<button ref={own} type="button">
					Trigger
				</button>
			</TooltipAnchor>,
		);

		expect(forwarded.current).toBe(screen.getByRole('button'));
		expect(own.current).toBe(screen.getByRole('button'));
	});

	it('TooltipContent forwards the ref to the popup', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<TooltipRoot open>
				<TooltipContent ref={ref} anchor={makeAnchor()}>
					Content
				</TooltipContent>
			</TooltipRoot>,
		);

		expect(ref.current).toBe(screen.getByRole('tooltip'));
	});

	it('TooltipPositioner and TooltipPopup forward their refs', () => {
		const positionerRef = createRef<HTMLDivElement>();
		const popupRef = createRef<HTMLDivElement>();
		render(
			<TooltipRoot open>
				<TooltipPortal>
					<TooltipPositioner ref={positionerRef} anchor={makeAnchor()}>
						<TooltipPopup ref={popupRef}>Content</TooltipPopup>
					</TooltipPositioner>
				</TooltipPortal>
			</TooltipRoot>,
		);

		expect(positionerRef.current).toHaveAttribute('data-slot', 'tooltip-positioner');
		expect(popupRef.current).toBe(screen.getByRole('tooltip'));
	});
});
