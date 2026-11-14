import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Tooltip } from '../presets/tooltip.js';
import { TooltipAnchor } from '../subcomponents/tooltip-anchor.js';
import { useIsInsideTooltipTrigger } from '../tooltip-trigger-context.js';

function Probe() {
	return <span data-testid="probe">{String(useIsInsideTooltipTrigger())}</span>;
}

describe('useIsInsideTooltipTrigger', () => {
	it('is false with no tooltip around', () => {
		render(<Probe />);

		expect(screen.getByTestId('probe')).toHaveTextContent('false');
	});

	it('is true inside a trigger', () => {
		render(
			<TooltipAnchor content="Tip">
				<button type="button">
					<Probe />
				</button>
			</TooltipAnchor>,
		);

		expect(screen.getByTestId('probe')).toHaveTextContent('true');
	});

	it('is true inside the trigger of a Tooltip, even with no title', () => {
		render(
			<Tooltip title={undefined}>
				<button type="button">
					<Probe />
				</button>
			</Tooltip>,
		);

		expect(screen.getByTestId('probe')).toHaveTextContent('true');
	});

	it('is false inside the content, which is not the trigger', async () => {
		render(
			<TooltipAnchor open content={<Probe />}>
				Hover
			</TooltipAnchor>,
		);

		expect(await screen.findByTestId('probe')).toHaveTextContent('false');
	});

	it('is false next to a tooltip', () => {
		render(
			<>
				<Tooltip title="Tip">
					<button type="button">Hover</button>
				</Tooltip>
				<Probe />
			</>,
		);

		expect(screen.getByTestId('probe')).toHaveTextContent('false');
	});
});
