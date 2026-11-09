import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Popover } from '../popover.js';
import type { PopoverHandle } from '../popover-handle.js';
import { usePopoverHandle } from '../use-popover-handle.js';

type Service = { id: string; name: string };

const SERVICES: Service[] = [
	{ id: 'frontend', name: 'Frontend' },
	{ id: 'checkout', name: 'Checkout' },
];

function Services({
	preview = false,
	onHandle,
}: {
	preview?: boolean;
	onHandle?: (handle: PopoverHandle<Service>) => void;
}) {
	const card = usePopoverHandle<Service>();
	onHandle?.(card);

	return (
		<>
			<Popover handle={card} side="bottom" align="start" testId="services" aria-label="Service">
				{(service) => <p>{service === undefined ? 'Loading' : `${service.name} summary`}</p>}
			</Popover>
			{SERVICES.map((service) =>
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

function popup(): HTMLElement {
	return screen.getByTestId('services-popup');
}

describe('Popover.Trigger', () => {
	it('opens the one popup with the payload of the trigger pressed', async () => {
		const user = userEvent.setup();
		render(<Services />);

		await user.click(screen.getByRole('button', { name: 'Checkout' }));

		expect(await screen.findByRole('dialog', { name: 'Service' })).toHaveTextContent(
			'Checkout summary',
		);
		expect(screen.getByRole('button', { name: 'Checkout' })).toHaveAttribute('data-popup-open');
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
		expect(popup()).toHaveAttribute('data-viewport');
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
