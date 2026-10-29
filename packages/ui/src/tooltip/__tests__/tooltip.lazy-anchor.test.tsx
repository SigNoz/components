import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { queryOpenTooltip } from '../../__tests__/test-utils.js';
import { TooltipLazyAnchor } from '../subcomponents/tooltip-lazy-anchor.js';
import { TooltipProvider } from '../subcomponents/tooltip-provider.js';

const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

function LazyText({ content, testId }: { content: string; testId: string }) {
	return (
		<TooltipLazyAnchor content={content}>
			<span data-testid={testId}>{testId}</span>
		</TooltipLazyAnchor>
	);
}

describe('TooltipLazyAnchor', () => {
	it('keeps the description and the handlers the child already has', async () => {
		const user = userEvent.setup();
		const onMouseEnter = vi.fn();
		const onMouseLeave = vi.fn();
		render(
			<>
				<span id="hint">Hint</span>
				<TooltipLazyAnchor content="Full text">
					<span
						data-testid="trigger"
						aria-describedby="hint"
						onMouseEnter={onMouseEnter}
						onMouseLeave={onMouseLeave}
					>
						Text
					</span>
				</TooltipLazyAnchor>
			</>,
		);
		const trigger = screen.getByTestId('trigger');

		await user.hover(trigger);
		const tooltip = await screen.findByRole('tooltip');

		expect(trigger).toHaveAttribute('aria-describedby', `hint ${tooltip.id}`);
		expect(onMouseEnter).toHaveBeenCalledTimes(1);

		await user.unhover(trigger);

		await waitFor(() => expect(trigger).toHaveAttribute('aria-describedby', 'hint'));
		expect(onMouseLeave).toHaveBeenCalledTimes(1);
	});

	it('opens on the first move of a pointer that was already inside', async () => {
		render(<LazyText content="Full text" testId="trigger" />);

		fireEvent.mouseMove(screen.getByTestId('trigger'));

		expect(await screen.findByRole('tooltip')).toHaveTextContent('Full text');
	});

	it('portals into the container of the provider', async () => {
		const user = userEvent.setup();
		const container = document.createElement('div');
		document.body.append(container);
		render(
			<TooltipProvider container={container} delay={0}>
				<LazyText content="Full text" testId="trigger" />
			</TooltipProvider>,
		);

		await user.hover(screen.getByTestId('trigger'));

		expect(container).toContainElement(await screen.findByRole('tooltip'));
		container.remove();
	});

	it('closes after the closeDelay of the provider', async () => {
		const user = userEvent.setup();
		render(
			<TooltipProvider delay={0} closeDelay={500}>
				<LazyText content="Full text" testId="trigger" />
			</TooltipProvider>,
		);
		const trigger = screen.getByTestId('trigger');

		await user.hover(trigger);
		await screen.findByRole('tooltip');
		await user.unhover(trigger);
		await wait(300);

		expect(queryOpenTooltip()).toBeInTheDocument();
		await waitFor(() => expect(queryOpenTooltip()).not.toBeInTheDocument());
	});

	it('opens the next one at once within the timeout of the provider after the last closed', async () => {
		const user = userEvent.setup();
		render(
			<TooltipProvider delay={600}>
				<LazyText content="First" testId="first" />
				<LazyText content="Second" testId="second" />
			</TooltipProvider>,
		);

		await user.hover(screen.getByTestId('first'));
		await screen.findByRole('tooltip');
		await user.unhover(screen.getByTestId('first'));
		await waitFor(() => expect(queryOpenTooltip()).not.toBeInTheDocument());
		await user.hover(screen.getByTestId('second'));

		await waitFor(() => expect(queryOpenTooltip()).toHaveTextContent('Second'), { timeout: 300 });
	});

	it('waits for the delay again with a timeout of 0 once the last one closed', async () => {
		const user = userEvent.setup();
		render(
			<TooltipProvider delay={600} timeout={0}>
				<LazyText content="First" testId="first" />
				<LazyText content="Second" testId="second" />
			</TooltipProvider>,
		);

		await user.hover(screen.getByTestId('first'));
		await screen.findByRole('tooltip');
		await user.unhover(screen.getByTestId('first'));
		await waitFor(() => expect(queryOpenTooltip()).not.toBeInTheDocument());
		await user.hover(screen.getByTestId('second'));
		await wait(300);

		expect(queryOpenTooltip()).not.toBeInTheDocument();
		await waitFor(() => expect(queryOpenTooltip()).toHaveTextContent('Second'));
	});
});
