import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import {
	TooltipContent,
	TooltipProvider,
	TooltipRoot,
	TooltipSimple,
	TooltipTrigger,
} from './index.js';

/**
 * Assertions target the rendered content, the public prop contract and the
 * dismissal callbacks rather than the primitive's own state attributes, so they
 * remain meaningful if the primitive underneath is replaced.
 */
function renderTooltip(
	contentProps: React.ComponentProps<typeof TooltipContent> = {},
	rootProps: React.ComponentProps<typeof TooltipRoot> = {},
) {
	return render(
		<TooltipProvider delayDuration={0}>
			<TooltipRoot {...rootProps}>
				<TooltipTrigger>Trigger</TooltipTrigger>
				<TooltipContent {...contentProps}>Tooltip body</TooltipContent>
			</TooltipRoot>
		</TooltipProvider>,
	);
}

describe('Tooltip rendering', () => {
	it('renders the trigger and keeps the content unmounted while closed', () => {
		renderTooltip();

		expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument();
		expect(screen.queryByText('Tooltip body')).not.toBeInTheDocument();
	});

	it('renders the content when open', () => {
		renderTooltip({}, { open: true });

		expect(screen.getByText('Tooltip body')).toBeInTheDocument();
	});

	it('applies testId to the content', () => {
		renderTooltip({ testId: 'tip' }, { open: true });

		expect(screen.getByTestId('tip')).toHaveTextContent('Tooltip body');
	});

	it('forwards className and style to the content', () => {
		renderTooltip({ className: 'custom', style: { opacity: 0.5 } }, { open: true });

		const content = screen.getByText('Tooltip body');
		expect(content).toHaveClass('custom');
		expect(content).toHaveStyle({ opacity: '0.5' });
	});

	it('renders an arrow only when asked', () => {
		const { unmount } = renderTooltip({}, { open: true });
		expect(document.querySelector('svg')).toBeNull();
		unmount();

		renderTooltip({ arrow: true }, { open: true });
		expect(document.querySelector('svg')).not.toBeNull();
	});

	it('portals the content by default and renders it in place when withPortal is false', () => {
		const { container, unmount } = renderTooltip({}, { open: true });
		expect(container).not.toHaveTextContent('Tooltip body');
		unmount();

		const inline = renderTooltip({ withPortal: false }, { open: true });
		expect(inline.container).toHaveTextContent('Tooltip body');
	});

	it('keeps the content mounted while closed when forceMount is set', () => {
		renderTooltip({ forceMount: true, testId: 'tip' });

		expect(screen.getByTestId('tip')).toBeInTheDocument();
	});
});

describe('Tooltip open state', () => {
	it('reports open changes through onOpenChange', () => {
		const onOpenChange = vi.fn();
		renderTooltip({}, { defaultOpen: true, onOpenChange });

		fireEvent.keyDown(document, { key: 'Escape' });

		expect(onOpenChange).toHaveBeenCalledWith(false);
		expect(screen.queryByText('Tooltip body')).not.toBeInTheDocument();
	});

	it('supports controlled open state', () => {
		function Controlled() {
			const [open, setOpen] = useState(false);
			return (
				<TooltipProvider delayDuration={0}>
					<button type="button" onClick={() => setOpen(true)}>
						Show
					</button>
					<TooltipRoot open={open} onOpenChange={setOpen}>
						<TooltipTrigger>Trigger</TooltipTrigger>
						<TooltipContent>Tooltip body</TooltipContent>
					</TooltipRoot>
				</TooltipProvider>
			);
		}
		render(<Controlled />);

		expect(screen.queryByText('Tooltip body')).not.toBeInTheDocument();
		fireEvent.click(screen.getByRole('button', { name: 'Show' }));
		expect(screen.getByText('Tooltip body')).toBeInTheDocument();
	});
});

describe('Tooltip dismissal callbacks', () => {
	it('calls onEscapeKeyDown when Escape closes the tooltip', () => {
		const onEscapeKeyDown = vi.fn();
		renderTooltip({ onEscapeKeyDown }, { defaultOpen: true });

		fireEvent.keyDown(document, { key: 'Escape' });

		expect(onEscapeKeyDown).toHaveBeenCalledTimes(1);
		expect(screen.queryByText('Tooltip body')).not.toBeInTheDocument();
	});

	it('keeps the tooltip open when onEscapeKeyDown prevents the default', () => {
		const onOpenChange = vi.fn();
		renderTooltip(
			{ onEscapeKeyDown: (event) => event.preventDefault() },
			{ defaultOpen: true, onOpenChange },
		);

		fireEvent.keyDown(document, { key: 'Escape' });

		expect(screen.getByText('Tooltip body')).toBeInTheDocument();
		expect(onOpenChange).not.toHaveBeenCalled();
	});
});

describe('TooltipTrigger asChild', () => {
	it('renders the child element instead of its own button', () => {
		render(
			<TooltipProvider delayDuration={0}>
				<TooltipRoot>
					<TooltipTrigger asChild>
						<a href="/docs">Docs</a>
					</TooltipTrigger>
					<TooltipContent>Tooltip body</TooltipContent>
				</TooltipRoot>
			</TooltipProvider>,
		);

		const trigger = screen.getByRole('link', { name: 'Docs' });
		expect(trigger).toHaveAttribute('href', '/docs');
		expect(screen.queryByRole('button')).not.toBeInTheDocument();
	});
});

describe('TooltipSimple', () => {
	it('renders the title as the tooltip content', () => {
		render(
			<TooltipProvider delayDuration={0}>
				<TooltipSimple title="Helpful information" open>
					<button type="button">Hover me</button>
				</TooltipSimple>
			</TooltipProvider>,
		);

		expect(screen.getByRole('button', { name: 'Hover me' })).toBeInTheDocument();
		expect(screen.getByText('Helpful information')).toBeInTheDocument();
	});
});

describe('Tooltip accessibility model', () => {
	/**
	 * BREAKING (Base UI migration): Base UI treats tooltips as visual-only hints —
	 * the popup carries no `role="tooltip"` and the trigger is not given an
	 * `aria-describedby` pointing at it, which Radix did. Triggers whose only
	 * accessible name came from the tooltip must now carry their own `aria-label`.
	 */
	it('does not describe the trigger with the tooltip content', () => {
		renderTooltip({}, { open: true });

		expect(screen.getByRole('button', { name: 'Trigger' })).not.toHaveAttribute('aria-describedby');
	});
});
