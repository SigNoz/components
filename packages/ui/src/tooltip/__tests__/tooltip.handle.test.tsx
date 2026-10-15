import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Tooltip } from '../presets/tooltip.js';
import { useTooltipHandle } from '../use-tooltip-handle.js';

type Row = { name: string };

/**
 * The shape a hover card over a list takes: the pointer is on a row, but the card is positioned
 * on a rail of its own and its content comes from whichever row is hovered.
 */
function Rail(): JSX.Element {
	const card = useTooltipHandle<Row>();

	return (
		<>
			{['one', 'two'].map((name) => (
				<div
					key={name}
					data-testid={`row-${name}`}
					onMouseEnter={(event) => card.showAt(event.currentTarget, { name })}
					onMouseLeave={() => card.close()}
				>
					{name}
				</div>
			))}
			<Tooltip side="right" align="start" title={(row) => <p>Row {row?.name}</p>}>
				<span data-testid="rail" />
			</Tooltip>
		</>
	);
}

function HandledRail(): JSX.Element {
	const card = useTooltipHandle<Row>();

	return (
		<>
			<div
				data-testid="row"
				onMouseEnter={(event) => card.showAt(event.currentTarget, { name: 'alpha' })}
				onMouseLeave={() => card.close()}
			>
				alpha
			</div>
			<Tooltip handle={card} side="right" align="start" title={(row) => <p>Row {row?.name}</p>}>
				<span data-testid="rail" />
			</Tooltip>
		</>
	);
}

function fireEnter(element: HTMLElement): void {
	element.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
}

describe('Tooltip handle', () => {
	it('shows nothing until the handle says so', () => {
		render(<HandledRail />);

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	it('shows the payload of the row the pointer entered', async () => {
		render(<HandledRail />);

		fireEnter(screen.getByTestId('row'));

		expect(await screen.findByRole('tooltip')).toHaveTextContent('Row alpha');
	});

	it('hides again when the handle closes it', async () => {
		render(<HandledRail />);
		fireEnter(screen.getByTestId('row'));
		await screen.findByRole('tooltip');

		screen.getByTestId('row').dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));

		await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
	});

	it('is pointer-driven as usual when no handle is passed', () => {
		render(<Rail />);

		// Without a handle the rows do not drive it, so nothing shows from their hover.
		fireEnter(screen.getByTestId('row-one'));

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});
});
