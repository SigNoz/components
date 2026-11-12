import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Popover } from '../popover.js';
import type { PopoverHandle } from '../popover-handle.js';
import type { PopoverProps } from '../types.js';
import { usePopoverHandle } from '../use-popover-handle.js';

type Service = { id: string; name: string };

const SERVICES: Service[] = [
	{ id: 'frontend', name: 'Frontend' },
	{ id: 'checkout', name: 'Checkout' },
];

function Services({
	services = SERVICES,
	preview = false,
	content = 'text',
	onHandle,
}: {
	services?: Service[];
	preview?: boolean;
	content?: 'text' | 'link';
	onHandle?: (handle: PopoverHandle<Service>) => void;
}) {
	const card = usePopoverHandle<Service>();
	onHandle?.(card);

	return (
		<>
			<Popover handle={card} side="bottom" align="start" testId="services" aria-label="Service">
				{(service) =>
					content === 'link' ? (
						<a href={`#${service?.id}-docs`}>{service?.name} docs</a>
					) : (
						<p>{service === undefined ? 'Loading' : `${service.name} summary`}</p>
					)
				}
			</Popover>
			{services.map((service) =>
				preview ? (
					<Popover.Trigger
						key={service.id}
						handle={card}
						payload={service}
						nativeButton={false}
						preview
						delay={0}
					>
						<a id={`service-${service.id}`} href={`#${service.id}`}>
							{service.name}
						</a>
					</Popover.Trigger>
				) : (
					<Popover.Trigger key={service.id} handle={card} payload={service} nativeButton>
						<button id={`service-${service.id}`} type="button">
							{service.name}
						</button>
					</Popover.Trigger>
				),
			)}
		</>
	);
}

/** The SigNoz saved-views shape: a row that holds a link and a menu button, with one card for all. */
function Rows() {
	const card = usePopoverHandle<Service>();

	return (
		<>
			{SERVICES.map((service) => (
				<Popover.Trigger
					key={service.id}
					handle={card}
					payload={service}
					nativeButton={false}
					preview
					delay={0}
				>
					<div>
						<a href={`#${service.id}`}>{service.name}</a>
						<button type="button">{service.name} actions</button>
					</div>
				</Popover.Trigger>
			))}
			<Popover handle={card} side="right" align="start" testId="services">
				{(service) => <p>{service?.name} summary</p>}
			</Popover>
		</>
	);
}

/** A trigger a press opens the popup from, and a preview trigger of the same handle. */
function PressAndPreview({ onOpenChange }: { onOpenChange?: PopoverProps['onOpenChange'] }) {
	const card = usePopoverHandle<Service>();

	return (
		<>
			<Popover
				handle={card}
				side="bottom"
				align="start"
				testId="services"
				aria-label="Service"
				onOpenChange={onOpenChange}
			>
				{(service) => <p>{service?.name} summary</p>}
			</Popover>
			<Popover.Trigger handle={card} payload={SERVICES[0]} nativeButton>
				<button type="button">Frontend</button>
			</Popover.Trigger>
			<Popover.Trigger handle={card} payload={SERVICES[1]} nativeButton={false} preview delay={0}>
				<a href="#checkout">Checkout</a>
			</Popover.Trigger>
		</>
	);
}

/** Past the timer a blur closes the card with. */
async function waitPastTheBlur(): Promise<void> {
	await new Promise((resolve) => setTimeout(resolve, 50));
}

function popup(): HTMLElement {
	return screen.getByTestId('services-popup');
}

describe('Popover.Trigger', () => {
	it('is named by its dotted name in React DevTools', () => {
		// The part is typed by its call signature alone, which has no `displayName`.
		expect((Popover.Trigger as { displayName?: string }).displayName).toBe('Popover.Trigger');
	});

	it('opens the one popup with the payload of the trigger pressed', async () => {
		const user = userEvent.setup();
		render(<Services />);

		await user.click(screen.getByRole('button', { name: 'Checkout' }));

		expect(await screen.findByRole('dialog', { name: 'Service' })).toHaveTextContent(
			'Checkout summary',
		);
		expect(screen.getByRole('button', { name: 'Checkout' })).toHaveAttribute('data-popup-open');
	});

	it('keeps a popup that `showAt` placed from sliding, so it does not trail its anchor', async () => {
		let handle: PopoverHandle<Service> | undefined;
		render(<Services onHandle={(next) => (handle = next)} />);

		act(() => handle?.showAt({ x: 10, y: 10 }, SERVICES[0]));

		await waitFor(() => expect(popup()).toHaveTextContent('Frontend summary'));
		expect(popup()).not.toHaveAttribute('data-shared');
		expect(popup().parentElement).not.toHaveAttribute('data-shared');
	});

	it('keeps the popup when another trigger unmounts', async () => {
		const user = userEvent.setup();
		const { rerender } = render(<Services />);

		await user.click(screen.getByRole('button', { name: 'Frontend' }));
		await screen.findByText('Frontend summary');
		rerender(<Services services={SERVICES.slice(0, 1)} />);
		await waitPastTheBlur();

		expect(popup()).toHaveTextContent('Frontend summary');
	});

	it('closes when the trigger it is open for unmounts', async () => {
		const user = userEvent.setup();
		const { rerender } = render(<Services />);

		await user.click(screen.getByRole('button', { name: 'Checkout' }));
		await screen.findByText('Checkout summary');
		rerender(<Services services={SERVICES.slice(0, 1)} />);

		await waitFor(() => expect(screen.queryByTestId('services-popup')).not.toBeInTheDocument());
	});

	it('moves the popup to another trigger and swaps its content in the viewport', async () => {
		const user = userEvent.setup();
		render(<Services />);

		await user.click(screen.getByRole('button', { name: 'Frontend' }));
		await screen.findByText('Frontend summary');
		await user.click(screen.getByRole('button', { name: 'Checkout' }));

		await waitFor(() => expect(popup()).toHaveTextContent('Checkout summary'));
		expect(screen.getAllByTestId('services-popup')).toHaveLength(1);
		expect(popup().querySelector('[data-slot="popover-viewport"]')).not.toBeNull();
		expect(popup()).toHaveAttribute('data-shared');
	});

	it('lays the new content out at its final width while the popup grows to it', async () => {
		function Widths() {
			const card = usePopoverHandle<string>();

			return (
				<>
					<Popover handle={card} side="bottom" align="start" testId="services" aria-label="Service">
						{(text) => <p>{text}</p>}
					</Popover>
					<Popover.Trigger handle={card} payload="Brief" nativeButton>
						<button type="button">Short</button>
					</Popover.Trigger>
					<Popover.Trigger
						handle={card}
						payload="A summary wider than the popup it moves into"
						nativeButton
					>
						<button type="button">Wide</button>
					</Popover.Trigger>
				</>
			);
		}
		const user = userEvent.setup();
		render(<Widths />);

		await user.click(screen.getByRole('button', { name: 'Short' }));
		await screen.findByText('Brief');
		const lineHeight = screen.getByText('Brief').getBoundingClientRect().height;
		await user.click(screen.getByRole('button', { name: 'Wide' }));

		const viewport = popup().querySelector<HTMLElement>('[data-slot="popover-viewport"]');
		await waitFor(() => expect(viewport).toHaveAttribute('data-transitioning'), { interval: 5 });
		const current = viewport?.querySelector<HTMLElement>('[data-current]');
		const finalWidth = Number.parseFloat(
			getComputedStyle(popup()).getPropertyValue('--popup-width'),
		);

		expect(current?.getBoundingClientRect().width).toBeCloseTo(finalWidth - 2, 0);
		expect(
			screen.getByText('A summary wider than the popup it moves into').getBoundingClientRect()
				.height,
		).toBe(lineHeight);
	});

	it('opens on hover with `openOnHover`, and still on a press', async () => {
		const user = userEvent.setup();
		let card: PopoverHandle<Service> | undefined;

		function HoverServices({ onHandle }: { onHandle: (handle: PopoverHandle<Service>) => void }) {
			const handle = usePopoverHandle<Service>();
			onHandle(handle);

			return (
				<>
					{SERVICES.map((service) => (
						<Popover.Trigger
							key={service.id}
							handle={handle}
							payload={service}
							nativeButton
							openOnHover
							delay={0}
						>
							<button type="button">{service.name}</button>
						</Popover.Trigger>
					))}
					<Popover handle={handle} side="bottom" align="start" testId="services">
						{(service) => <p>{service?.name} summary</p>}
					</Popover>
				</>
			);
		}

		render(<HoverServices onHandle={(next) => (card = next)} />);

		await user.hover(screen.getByRole('button', { name: 'Checkout' }));
		await waitFor(() => expect(popup()).toHaveTextContent('Checkout summary'));

		act(() => card?.close());
		await waitFor(() => expect(screen.queryByTestId('services-popup')).not.toBeInTheDocument());
		await user.click(screen.getByRole('button', { name: 'Frontend' }));
		await waitFor(() => expect(popup()).toHaveTextContent('Frontend summary'));
	});

	it('opens for a trigger from code with `openTrigger`', async () => {
		let handle: PopoverHandle<Service> | undefined;
		render(<Services onHandle={(next) => (handle = next)} />);

		act(() => handle?.openTrigger('service-frontend'));

		expect(await screen.findByRole('dialog')).toHaveTextContent('Frontend summary');
	});

	it('shows the payload of `showAt` once the call site places it', async () => {
		const user = userEvent.setup();
		let handle: PopoverHandle<Service> | undefined;
		render(<Services onHandle={(next) => (handle = next)} />);

		await user.click(screen.getByRole('button', { name: 'Frontend' }));
		await screen.findByText('Frontend summary');
		act(() => handle?.showAt({ x: 10, y: 10 }, { id: 'cart', name: 'Cart' }));

		await waitFor(() => expect(popup()).toHaveTextContent('Cart summary'));
	});

	describe('preview', () => {
		it('opens a card with no role and no name on hover', async () => {
			const user = userEvent.setup();
			render(<Services preview />);

			await user.hover(screen.getByRole('link', { name: 'Frontend' }));

			await waitFor(() => expect(popup()).toHaveTextContent('Frontend summary'));
			expect(popup()).not.toHaveAttribute('role');
			expect(popup()).not.toHaveAttribute('aria-label');
			expect(popup()).toHaveAttribute('data-preview');
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		});

		it('leaves the element its own role, tab stop and click', async () => {
			render(<Services preview />);
			const link = screen.getByRole('link', { name: 'Frontend' });

			expect(link).not.toHaveAttribute('role');
			expect(link).not.toHaveAttribute('tabindex');
			expect(link).not.toHaveAttribute('aria-haspopup');
			expect(link).not.toHaveAttribute('aria-expanded');
		});

		it('opens on the keyboard focus, and keeps the focus on the trigger', async () => {
			const user = userEvent.setup();
			render(<Services preview />);

			await user.tab();

			await waitFor(() => expect(popup()).toHaveTextContent('Frontend summary'));
			expect(screen.getByRole('link', { name: 'Frontend' })).toHaveFocus();
		});

		it('closes when the keyboard focus leaves for something outside', async () => {
			const user = userEvent.setup();
			render(
				<>
					<Services preview />
					<button type="button">After</button>
				</>,
			);

			await user.tab();
			await waitFor(() => expect(popup()).toBeInTheDocument());
			await user.tab();
			await user.tab();

			await waitFor(() => expect(screen.queryByTestId('services-popup')).not.toBeInTheDocument());
		});

		it('opens for a row while the keyboard focus is on a link inside it, and stays as it moves along the row', async () => {
			const user = userEvent.setup();
			render(<Rows />);

			await user.tab();
			await waitFor(() => expect(popup()).toHaveTextContent('Frontend summary'));
			expect(screen.getByRole('link', { name: 'Frontend' })).toHaveFocus();

			await user.tab();
			expect(screen.getByRole('button', { name: 'Frontend actions' })).toHaveFocus();
			await waitPastTheBlur();
			expect(popup()).toHaveTextContent('Frontend summary');

			await user.tab();
			await waitFor(() => expect(popup()).toHaveTextContent('Checkout summary'));
		});

		it('goes into a card that holds a link with Tab, and on to the next trigger after it', async () => {
			const user = userEvent.setup();
			render(<Services preview content="link" />);

			await user.tab();
			await waitFor(() => expect(popup()).toHaveTextContent('Frontend docs'));
			await user.tab();
			expect(screen.getByRole('link', { name: 'Frontend docs' })).toHaveFocus();
			await user.tab();

			expect(screen.getByRole('link', { name: 'Checkout' })).toHaveFocus();
			await waitFor(() => expect(popup()).toHaveTextContent('Checkout docs'));
		});

		// Each `onOpenChange` keeps the popup on the trigger a press opened it from, the way a
		// breadcrumb keeps its pressed `...` list: no hover on another trigger takes it.
		it('closes a popup a press opened from another trigger, the way a press outside does', async () => {
			const user = userEvent.setup();
			render(
				<PressAndPreview
					onOpenChange={(open, details) => {
						if (open && details.reason !== 'trigger-press') {
							details.cancel();
						}
					}}
				/>,
			);

			await user.click(screen.getByRole('button', { name: 'Frontend' }));
			await waitFor(() => expect(popup()).toHaveTextContent('Frontend summary'));
			await user.click(screen.getByRole('link', { name: 'Checkout' }));

			await waitFor(() => expect(screen.queryByTestId('services-popup')).toBeNull());
		});

		it('reports that close to `onOpenChange`, which can cancel it', async () => {
			const user = userEvent.setup();
			const onOpenChange = vi.fn<NonNullable<PopoverProps['onOpenChange']>>((open, details) => {
				if (!open || details.reason !== 'trigger-press') {
					details.cancel();
				}
			});
			render(<PressAndPreview onOpenChange={onOpenChange} />);

			await user.click(screen.getByRole('button', { name: 'Frontend' }));
			await waitFor(() => expect(popup()).toHaveTextContent('Frontend summary'));
			onOpenChange.mockClear();
			await user.click(screen.getByRole('link', { name: 'Checkout' }));

			expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
			expect(popup()).toHaveTextContent('Frontend summary');
		});

		it('takes no press: a click on the trigger leaves its card open', async () => {
			const user = userEvent.setup();
			render(<Services preview />);
			const link = screen.getByRole('link', { name: 'Checkout' });

			await user.hover(link);
			await waitFor(() => expect(popup()).toHaveTextContent('Checkout summary'));
			await user.click(link);

			expect(popup()).toHaveTextContent('Checkout summary');
		});
	});
});
