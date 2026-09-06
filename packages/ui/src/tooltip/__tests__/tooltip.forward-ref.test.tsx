import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Tooltip } from '../presets/tooltip.js';
import { TooltipContent } from '../subcomponents/tooltip-content.js';
import { TooltipPopup } from '../subcomponents/tooltip-popup.js';
import { TooltipPortal } from '../subcomponents/tooltip-portal.js';
import { TooltipPositioner } from '../subcomponents/tooltip-positioner.js';
import { TooltipRoot } from '../subcomponents/tooltip-root.js';
import { TooltipTrigger } from '../subcomponents/tooltip-trigger.js';

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

	it('forwards the ref while there is no title, so no trigger is mounted by Base UI', () => {
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

	it('TooltipTrigger forwards the ref', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<TooltipRoot>
				<TooltipTrigger ref={ref}>Trigger</TooltipTrigger>
			</TooltipRoot>,
		);

		expect(ref.current).toBe(screen.getByRole('button'));
	});

	it('TooltipContent forwards the ref to the popup', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<TooltipRoot open>
				<TooltipTrigger>Trigger</TooltipTrigger>
				<TooltipContent ref={ref}>Content</TooltipContent>
			</TooltipRoot>,
		);

		expect(ref.current).toBe(screen.getByRole('tooltip'));
	});

	it('TooltipPositioner and TooltipPopup forward their refs', () => {
		const positionerRef = createRef<HTMLDivElement>();
		const popupRef = createRef<HTMLDivElement>();
		render(
			<TooltipRoot open>
				<TooltipTrigger>Trigger</TooltipTrigger>
				<TooltipPortal>
					<TooltipPositioner ref={positionerRef}>
						<TooltipPopup ref={popupRef}>Content</TooltipPopup>
					</TooltipPositioner>
				</TooltipPortal>
			</TooltipRoot>,
		);

		expect(positionerRef.current).toHaveAttribute('data-slot', 'tooltip-positioner');
		expect(popupRef.current).toBe(screen.getByRole('tooltip'));
	});
});
