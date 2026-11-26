import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ForceOpenProvider } from '../../testing/index.js';
import { Tooltip } from '../presets/tooltip.js';
import { TooltipTone } from '../subcomponents/tooltip-tone.js';

const NEUTRAL = {
	background: 'rgb(1, 2, 3)',
	border: 'rgb(4, 5, 6)',
	label: 'rgb(7, 8, 9)',
};

const DANGER = {
	background: 'rgb(101, 102, 103)',
	border: 'rgb(104, 105, 106)',
	label: 'rgb(107, 108, 109)',
};

const NEUTRAL_DIVIDER = 'rgb(10, 11, 12)';
const DANGER_DIVIDER = 'rgb(110, 111, 112)';

/**
 * The design tokens are not loaded here, so the colours the popup reads are declared in the test,
 * one distinct value each. The popup is portalled into the body, so they go on the root.
 */
let tokens: HTMLStyleElement;

beforeEach(() => {
	tokens = document.createElement('style');
	tokens.textContent = `:root {
		--tooltip-background: ${NEUTRAL.background};
		--tooltip-border: ${NEUTRAL.border};
		--tooltip-label: ${NEUTRAL.label};
		--tooltip-divider: ${NEUTRAL_DIVIDER};
		--tooltip-danger-background: ${DANGER.background};
		--tooltip-danger-border: ${DANGER.border};
		--tooltip-danger-label: ${DANGER.label};
		--tooltip-danger-divider: ${DANGER_DIVIDER};
	}`;
	document.head.append(tokens);
});

afterEach(() => {
	tokens.remove();
});

function colours(element: Element): { background: string; border: string; label: string } {
	const style = getComputedStyle(element);
	return {
		background: style.backgroundColor,
		border: style.borderTopColor,
		label: style.color,
	};
}

describe('TooltipTone', () => {
	it('gives the popup the danger colours', () => {
		render(
			<Tooltip title={<TooltipTone tone="danger">Permission denied</TooltipTone>}>
				<button type="button">Hover</button>
			</Tooltip>,
			{ wrapper: ForceOpenProvider },
		);

		expect(colours(screen.getByRole('tooltip'))).toEqual(DANGER);
	});

	it('leaves a popup without one on the neutral colours', () => {
		render(
			<Tooltip title="Helpful information">
				<button type="button">Hover</button>
			</Tooltip>,
			{ wrapper: ForceOpenProvider },
		);

		expect(colours(screen.getByRole('tooltip'))).toEqual(NEUTRAL);
	});

	it('takes the danger override hooks from the call site', () => {
		tokens.textContent += `:root {
			--tooltip-danger-background-color: rgb(201, 202, 203);
			--tooltip-danger-border-color: rgb(204, 205, 206);
			--tooltip-danger-foreground: rgb(207, 208, 209);
		}`;

		render(
			<Tooltip title={<TooltipTone tone="danger">Permission denied</TooltipTone>}>
				<button type="button">Hover</button>
			</Tooltip>,
			{ wrapper: ForceOpenProvider },
		);

		expect(colours(screen.getByRole('tooltip'))).toEqual({
			background: 'rgb(201, 202, 203)',
			border: 'rgb(204, 205, 206)',
			label: 'rgb(207, 208, 209)',
		});
	});

	it('keeps the text and adds no box of its own', () => {
		render(
			<Tooltip title={<TooltipTone tone="danger">Permission denied</TooltipTone>}>
				<button type="button">Hover</button>
			</Tooltip>,
			{ wrapper: ForceOpenProvider },
		);

		const tooltip = screen.getByRole('tooltip');
		const tone = tooltip.querySelector('[data-slot="tooltip-tone"]');
		expect(tooltip).toHaveTextContent('Permission denied');
		expect(tone).toHaveAttribute('data-tone', 'danger');
		expect(getComputedStyle(tone as Element).display).toBe('contents');
		expect(tone?.getClientRects()).toHaveLength(0);
	});

	it('tones the whole popup when it is one entry of a stack', () => {
		render(
			<Tooltip title="Removes every rule">
				<Tooltip title={<TooltipTone tone="danger">You cannot delete this rule</TooltipTone>}>
					<button type="button">Hover</button>
				</Tooltip>
			</Tooltip>,
			{ wrapper: ForceOpenProvider },
		);

		const tooltips = screen.getAllByRole('tooltip');
		expect(tooltips).toHaveLength(1);
		expect(tooltips[0]?.querySelector('[data-slot="tooltip-stack"]')).toBeInTheDocument();
		expect(tooltips[0]).toHaveTextContent('Removes every ruleYou cannot delete this rule');
		expect(colours(tooltips[0] as Element)).toEqual(DANGER);
		const rule = tooltips[0]?.querySelector('[data-slot="tooltip-divider"]') as Element;
		expect(getComputedStyle(rule).backgroundColor).toBe(DANGER_DIVIDER);
	});

	it('leaves the other popups on the page neutral', () => {
		render(
			<>
				<Tooltip testId="danger" title={<TooltipTone tone="danger">Permission denied</TooltipTone>}>
					<button type="button">Danger</button>
				</Tooltip>
				<Tooltip testId="neutral" title="Helpful information">
					<button type="button">Neutral</button>
				</Tooltip>
			</>,
			{ wrapper: ForceOpenProvider },
		);

		expect(colours(screen.getByTestId('danger'))).toEqual(DANGER);
		expect(colours(screen.getByTestId('neutral'))).toEqual(NEUTRAL);
	});

	it('does not tone a popup portalled into a danger popup', () => {
		const { rerender } = render(
			<Tooltip testId="outer" title={<TooltipTone tone="danger">Permission denied</TooltipTone>}>
				<button type="button">Outer</button>
			</Tooltip>,
			{ wrapper: ForceOpenProvider },
		);
		const outer = screen.getByTestId('outer');

		rerender(
			<>
				<Tooltip testId="outer" title={<TooltipTone tone="danger">Permission denied</TooltipTone>}>
					<button type="button">Outer</button>
				</Tooltip>
				<Tooltip testId="inner" title="Helpful information" container={outer}>
					<button type="button">Inner</button>
				</Tooltip>
			</>,
		);

		const inner = screen.getByTestId('inner');
		expect(outer).toContainElement(inner);
		expect(colours(inner)).toEqual(NEUTRAL);
	});
});
