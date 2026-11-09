import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { ForceOpenProvider } from '../../testing/index.js';
import { Tooltip } from '../presets/tooltip.js';
import { TooltipPopup } from '../subcomponents/tooltip-popup.js';
import { TooltipPortal } from '../subcomponents/tooltip-portal.js';
import { TooltipPositioner } from '../subcomponents/tooltip-positioner.js';
import { TooltipProvider, TooltipProviderIfMissing } from '../subcomponents/tooltip-provider.js';
import { TooltipRoot } from '../subcomponents/tooltip-root.js';

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
	it('portals into document.body by default', async () => {
		const { container: root } = render(
			<Tooltip title="Helpful information">
				<button type="button">Hover</button>
			</Tooltip>,
			{ wrapper: ForceOpenProvider },
		);

		const tooltip = await screen.findByRole('tooltip');
		expect(root).not.toContainElement(tooltip);
		expect(document.body).toContainElement(tooltip);
	});

	it('portals into the container element it was given', async () => {
		const container = makeContainer();
		render(
			<Tooltip container={container} title="Helpful information">
				<button type="button">Hover</button>
			</Tooltip>,
			{ wrapper: ForceOpenProvider },
		);

		expect(container).toContainElement(await screen.findByRole('tooltip'));
	});

	it('portals into the element a ref points at', async () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<>
				<div ref={ref} data-testid="container" />
				<Tooltip container={ref} title="Helpful information">
					<button type="button">Hover</button>
				</Tooltip>
			</>,
			{ wrapper: ForceOpenProvider },
		);

		expect(screen.getByTestId('container')).toContainElement(await screen.findByRole('tooltip'));
	});

	it('inherits the container from the provider', async () => {
		const container = makeContainer();
		render(
			<TooltipProvider container={container}>
				<Tooltip title="Helpful information">
					<button type="button">Hover</button>
				</Tooltip>
			</TooltipProvider>,
			{ wrapper: ForceOpenProvider },
		);

		expect(container).toContainElement(await screen.findByRole('tooltip'));
	});

	it('prefers its own container over the one of the provider', async () => {
		const fromProvider = makeContainer();
		const own = makeContainer();
		render(
			<TooltipProvider container={fromProvider}>
				<Tooltip container={own} title="Helpful information">
					<button type="button">Hover</button>
				</Tooltip>
			</TooltipProvider>,
			{ wrapper: ForceOpenProvider },
		);

		expect(own).toContainElement(await screen.findByRole('tooltip'));
		expect(fromProvider).toBeEmptyDOMElement();
	});

	it('takes the container of the closest provider', async () => {
		const outer = makeContainer();
		const inner = makeContainer();
		render(
			<TooltipProvider container={outer}>
				<TooltipProvider container={inner}>
					<Tooltip title="Helpful information">
						<button type="button">Hover</button>
					</Tooltip>
				</TooltipProvider>
			</TooltipProvider>,
			{ wrapper: ForceOpenProvider },
		);

		expect(inner).toContainElement(await screen.findByRole('tooltip'));
		expect(outer).toBeEmptyDOMElement();
	});

	it('keeps the provider container when a component adds a provider of its own', async () => {
		const container = makeContainer();
		render(
			<TooltipProvider container={container}>
				<TooltipProviderIfMissing>
					<Tooltip title="Helpful information">
						<button type="button">Hover</button>
					</Tooltip>
				</TooltipProviderIfMissing>
			</TooltipProvider>,
			{ wrapper: ForceOpenProvider },
		);

		expect(container).toContainElement(await screen.findByRole('tooltip'));
	});

	it('portals the primitives into the container the portal was given', () => {
		const container = makeContainer();
		render(
			<TooltipRoot open>
				<TooltipPortal container={container}>
					<TooltipPositioner anchor={makeContainer()}>
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
					<TooltipPortal>
						<TooltipPositioner anchor={makeContainer()}>
							<TooltipPopup>Helpful information</TooltipPopup>
						</TooltipPositioner>
					</TooltipPortal>
				</TooltipRoot>
			</TooltipProvider>,
		);

		expect(container).toContainElement(screen.getByRole('tooltip'));
	});
});
