import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { Popover, PopoverAnchor, PopoverClose, PopoverContent, PopoverTrigger } from './index.js';

beforeAll(() => {
	global.ResizeObserver = class ResizeObserver {
		observe() {}
		unobserve() {}
		disconnect() {}
	};
});

/**
 * Assertions target the open/close contract, the public prop surface and the
 * dismissal callbacks rather than the primitive's own state attributes, so they
 * remain meaningful if the primitive underneath is replaced.
 */
function renderPopover(
	contentProps: React.ComponentProps<typeof PopoverContent> = {},
	rootProps: React.ComponentProps<typeof Popover> = {},
) {
	return render(
		<Popover {...rootProps}>
			<PopoverTrigger>Open</PopoverTrigger>
			<PopoverContent {...contentProps}>Popover body</PopoverContent>
		</Popover>,
	);
}

describe('Popover open state', () => {
	it('opens on trigger click and reports the change', () => {
		const onOpenChange = vi.fn();
		renderPopover({}, { onOpenChange });

		expect(screen.queryByText('Popover body')).not.toBeInTheDocument();
		fireEvent.click(screen.getByRole('button', { name: 'Open' }));

		expect(screen.getByText('Popover body')).toBeInTheDocument();
		expect(onOpenChange).toHaveBeenCalledWith(true);
	});

	it('renders content when open by default', () => {
		renderPopover({}, { defaultOpen: true });

		expect(screen.getByText('Popover body')).toBeInTheDocument();
	});

	it('honours the controlled open prop', () => {
		const { rerender } = render(
			<Popover open={false}>
				<PopoverTrigger>Open</PopoverTrigger>
				<PopoverContent>Popover body</PopoverContent>
			</Popover>,
		);
		expect(screen.queryByText('Popover body')).not.toBeInTheDocument();

		rerender(
			<Popover open>
				<PopoverTrigger>Open</PopoverTrigger>
				<PopoverContent>Popover body</PopoverContent>
			</Popover>,
		);
		expect(screen.getByText('Popover body')).toBeInTheDocument();
	});

	it('closes through PopoverClose', () => {
		render(
			<Popover defaultOpen>
				<PopoverTrigger>Open</PopoverTrigger>
				<PopoverContent>
					Popover body
					<PopoverClose>Dismiss</PopoverClose>
				</PopoverContent>
			</Popover>,
		);

		fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));

		expect(screen.queryByText('Popover body')).not.toBeInTheDocument();
	});
});

describe('Popover content props', () => {
	it('applies testId, className and style to the content', () => {
		renderPopover(
			{ testId: 'pop', className: 'custom', style: { opacity: 0.5 } },
			{ defaultOpen: true },
		);

		const content = screen.getByTestId('pop');
		expect(content).toHaveTextContent('Popover body');
		expect(content).toHaveClass('custom');
		expect(content).toHaveStyle({ opacity: '0.5' });
	});

	it('renders an arrow only when asked', () => {
		const { unmount } = renderPopover({}, { defaultOpen: true });
		expect(document.querySelector('[data-slot="popover-arrow"]')).toBeNull();
		unmount();

		renderPopover({ arrow: true }, { defaultOpen: true });
		expect(document.querySelector('[data-slot="popover-arrow"]')).not.toBeNull();
	});

	it('portals the content by default and renders it in place when withPortal is false', () => {
		const { container, unmount } = renderPopover({}, { defaultOpen: true });
		expect(container).not.toHaveTextContent('Popover body');
		unmount();

		const inline = renderPopover({ withPortal: false }, { defaultOpen: true });
		expect(inline.container).toHaveTextContent('Popover body');
	});

	it('keeps the content mounted while closed when forceMount is set', () => {
		renderPopover({ forceMount: true, testId: 'pop' });

		expect(screen.getByTestId('pop')).toBeInTheDocument();
	});

	it('covers the page when disableOutsidePointerEvents is set', () => {
		const { unmount } = renderPopover({}, { defaultOpen: true });
		expect(document.querySelector('[data-slot="popover-content"]')).not.toBeNull();
		const backdropCount = document.querySelectorAll('[role="presentation"]').length;
		unmount();

		renderPopover({ disableOutsidePointerEvents: true }, { defaultOpen: true });
		expect(document.querySelectorAll('[role="presentation"]').length).toBeGreaterThan(
			backdropCount,
		);
	});
});

describe('Popover dismissal callbacks', () => {
	it('calls onEscapeKeyDown when Escape closes the popover', () => {
		const onEscapeKeyDown = vi.fn();
		renderPopover({ onEscapeKeyDown }, { defaultOpen: true });

		fireEvent.keyDown(document, { key: 'Escape' });

		expect(onEscapeKeyDown).toHaveBeenCalledTimes(1);
		expect(screen.queryByText('Popover body')).not.toBeInTheDocument();
	});

	it('keeps the popover open when onEscapeKeyDown prevents the default', () => {
		const onOpenChange = vi.fn();
		renderPopover(
			{ onEscapeKeyDown: (event) => event.preventDefault() },
			{ defaultOpen: true, onOpenChange },
		);

		fireEvent.keyDown(document, { key: 'Escape' });

		expect(screen.getByText('Popover body')).toBeInTheDocument();
		expect(onOpenChange).not.toHaveBeenCalled();
	});

	it('reports an outside press to onPointerDownOutside and onInteractOutside', () => {
		const onPointerDownOutside = vi.fn();
		const onInteractOutside = vi.fn();
		render(
			<div>
				<button type="button">Outside</button>
				<Popover defaultOpen>
					<PopoverTrigger>Open</PopoverTrigger>
					<PopoverContent
						onPointerDownOutside={onPointerDownOutside}
						onInteractOutside={onInteractOutside}
					>
						Popover body
					</PopoverContent>
				</Popover>
			</div>,
		);

		fireEvent.click(screen.getByRole('button', { name: 'Outside' }));

		expect(onPointerDownOutside).toHaveBeenCalledTimes(1);
		expect(onInteractOutside).toHaveBeenCalledTimes(1);
		expect(screen.queryByText('Popover body')).not.toBeInTheDocument();
	});

	it('keeps the popover open when an outside press is prevented', () => {
		render(
			<div>
				<button type="button">Outside</button>
				<Popover defaultOpen>
					<PopoverTrigger>Open</PopoverTrigger>
					<PopoverContent onPointerDownOutside={(event) => event.preventDefault()}>
						Popover body
					</PopoverContent>
				</Popover>
			</div>,
		);

		fireEvent.click(screen.getByRole('button', { name: 'Outside' }));

		expect(screen.getByText('Popover body')).toBeInTheDocument();
	});
});

describe('Popover focus callbacks', () => {
	it('suppresses auto-focus when onOpenAutoFocus prevents the default', async () => {
		render(
			<Popover>
				<PopoverTrigger>Open</PopoverTrigger>
				<PopoverContent onOpenAutoFocus={(event) => event.preventDefault()}>
					<button type="button">Inside</button>
				</PopoverContent>
			</Popover>,
		);

		const trigger = screen.getByRole('button', { name: 'Open' });
		fireEvent.click(trigger);

		await waitFor(() => expect(screen.getByRole('button', { name: 'Inside' })).toBeInTheDocument());
		expect(screen.getByRole('button', { name: 'Inside' })).not.toHaveFocus();
	});

	it('focuses into the popover when auto-focus is not prevented', async () => {
		render(
			<Popover>
				<PopoverTrigger>Open</PopoverTrigger>
				<PopoverContent onOpenAutoFocus={() => {}}>
					<button type="button">Inside</button>
				</PopoverContent>
			</Popover>,
		);

		fireEvent.click(screen.getByRole('button', { name: 'Open' }));

		await waitFor(() => expect(screen.getByRole('button', { name: 'Inside' })).toHaveFocus());
	});

	it('calls onOpenAutoFocus when the popover opens', async () => {
		const onOpenAutoFocus = vi.fn();
		render(
			<Popover>
				<PopoverTrigger>Open</PopoverTrigger>
				<PopoverContent onOpenAutoFocus={onOpenAutoFocus}>Popover body</PopoverContent>
			</Popover>,
		);

		fireEvent.click(screen.getByRole('button', { name: 'Open' }));

		// Base UI resolves the initial-focus target in a microtask after opening.
		await waitFor(() => expect(onOpenAutoFocus).toHaveBeenCalledTimes(1));
	});
});

describe('PopoverAnchor', () => {
	it('renders the anchor content and still opens the popover', () => {
		render(
			<Popover>
				<PopoverAnchor testId="anchor">
					<span>Anchor row</span>
				</PopoverAnchor>
				<PopoverTrigger>Open</PopoverTrigger>
				<PopoverContent>Popover body</PopoverContent>
			</Popover>,
		);

		expect(screen.getByTestId('anchor')).toHaveTextContent('Anchor row');

		fireEvent.click(screen.getByRole('button', { name: 'Open' }));
		expect(screen.getByText('Popover body')).toBeInTheDocument();
	});

	it('renders the child element directly with asChild', () => {
		render(
			<Popover>
				<PopoverAnchor asChild testId="anchor">
					<section>Anchor section</section>
				</PopoverAnchor>
			</Popover>,
		);

		const anchor = screen.getByTestId('anchor');
		expect(anchor.tagName).toBe('SECTION');
	});
});

describe('PopoverTrigger asChild', () => {
	it('renders the child element instead of its own button', () => {
		render(
			<Popover>
				<PopoverTrigger asChild>
					<a href="/docs">Docs</a>
				</PopoverTrigger>
				<PopoverContent>Popover body</PopoverContent>
			</Popover>,
		);

		expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/docs');
		expect(screen.queryByRole('button')).not.toBeInTheDocument();
	});
});
