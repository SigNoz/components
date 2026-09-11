import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { Tooltip } from '../presets/tooltip.js';
import { TooltipPopup } from '../subcomponents/tooltip-popup.js';
import { TooltipPortal } from '../subcomponents/tooltip-portal.js';
import { TooltipPositioner } from '../subcomponents/tooltip-positioner.js';
import { TooltipProvider, TooltipProviderIfMissing } from '../subcomponents/tooltip-provider.js';
import { TooltipRoot } from '../subcomponents/tooltip-root.js';
import { TooltipTrigger } from '../subcomponents/tooltip-trigger.js';

const containers: HTMLElement[] = [];

function makeContainer(): HTMLDivElement {
	const container = document.createElement('div');
	document.body.append(container);
	containers.push(container);

	return container;
}

afterEach(() => {
	for (const container of containers.splice(0)) {
		container.remove();
	}
});

describe('Tooltip portal container', () => {
	it('portals into document.body by default', () => {
		const { container: root } = render(
			<Tooltip open title="Helpful information">
				<button type="button">Hover</button>
			</Tooltip>,
		);

		const tooltip = screen.getByRole('tooltip');
		expect(root).not.toContainElement(tooltip);
		expect(document.body).toContainElement(tooltip);
	});

	it('portals into the container element it was given', () => {
		const container = makeContainer();
		render(
			<Tooltip open container={container} title="Helpful information">
				<button type="button">Hover</button>
			</Tooltip>,
		);

		expect(container).toContainElement(screen.getByRole('tooltip'));
	});

	it('portals into the element a ref points at', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<>
				<div ref={ref} data-testid="container" />
				<Tooltip open container={ref} title="Helpful information">
					<button type="button">Hover</button>
				</Tooltip>
			</>,
		);

		expect(screen.getByTestId('container')).toContainElement(screen.getByRole('tooltip'));
	});

	it('inherits the container from the provider', () => {
		const container = makeContainer();
		render(
			<TooltipProvider container={container}>
				<Tooltip open title="Helpful information">
					<button type="button">Hover</button>
				</Tooltip>
			</TooltipProvider>,
		);

		expect(container).toContainElement(screen.getByRole('tooltip'));
	});

	it('prefers its own container over the one of the provider', () => {
		const fromProvider = makeContainer();
		const own = makeContainer();
		render(
			<TooltipProvider container={fromProvider}>
				<Tooltip open container={own} title="Helpful information">
					<button type="button">Hover</button>
				</Tooltip>
			</TooltipProvider>,
		);

		expect(own).toContainElement(screen.getByRole('tooltip'));
		expect(fromProvider).toBeEmptyDOMElement();
	});

	it('takes the container of the closest provider', () => {
		const outer = makeContainer();
		const inner = makeContainer();
		render(
			<TooltipProvider container={outer}>
				<TooltipProvider container={inner}>
					<Tooltip open title="Helpful information">
						<button type="button">Hover</button>
					</Tooltip>
				</TooltipProvider>
			</TooltipProvider>,
		);

		expect(inner).toContainElement(screen.getByRole('tooltip'));
		expect(outer).toBeEmptyDOMElement();
	});

	it('keeps the provider container when a component adds a provider of its own', () => {
		const container = makeContainer();
		render(
			<TooltipProvider container={container}>
				<TooltipProviderIfMissing>
					<Tooltip open title="Helpful information">
						<button type="button">Hover</button>
					</Tooltip>
				</TooltipProviderIfMissing>
			</TooltipProvider>,
		);

		expect(container).toContainElement(screen.getByRole('tooltip'));
	});

	it('portals the primitives into the container the portal was given', () => {
		const container = makeContainer();
		render(
			<TooltipRoot open>
				<TooltipTrigger>Hover</TooltipTrigger>
				<TooltipPortal container={container}>
					<TooltipPositioner>
						<TooltipPopup>Helpful information</TooltipPopup>
					</TooltipPositioner>
				</TooltipPortal>
			</TooltipRoot>,
		);

		expect(container).toContainElement(screen.getByRole('tooltip'));
	});

	it('lets the portal inherit the provider container as well', () => {
		const container = makeContainer();
		render(
			<TooltipProvider container={container}>
				<TooltipRoot open>
					<TooltipTrigger>Hover</TooltipTrigger>
					<TooltipPortal>
						<TooltipPositioner>
							<TooltipPopup>Helpful information</TooltipPopup>
						</TooltipPositioner>
					</TooltipPortal>
				</TooltipRoot>
			</TooltipProvider>,
		);

		expect(container).toContainElement(screen.getByRole('tooltip'));
	});
});
