import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NuqsTestingAdapter } from 'nuqs/adapters/testing';
import { describe, expect, it, onTestFinished, vi } from 'vitest';

import {
	ConfirmDrawer,
	ConfirmDrawerUrl,
	Drawer,
	DrawerClose,
	DrawerCloseButton,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	type DrawerDirection,
	DrawerSubtitle,
	DrawerTitle,
	DrawerTrigger,
	DrawerWrapper,
} from './index.js';
import { getContentVariants } from './utils.js';

function slot(name: string): HTMLElement {
	return document.querySelector(`[data-slot="${name}"]`) as HTMLElement;
}

describe('Drawer rendering', () => {
	it('renders each part under its drawer slot', () => {
		render(
			<Drawer open>
				<DrawerTrigger>Open</DrawerTrigger>
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>Title</DrawerTitle>
						<DrawerSubtitle>Subtitle</DrawerSubtitle>
					</DrawerHeader>
					<DrawerDescription>Body</DrawerDescription>
					<DrawerFooter>
						<DrawerClose>Dismiss</DrawerClose>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>,
		);

		for (const name of [
			'drawer-trigger',
			'drawer-overlay',
			'drawer-content',
			'drawer-header',
			'drawer-title',
			'drawer-subtitle',
			'drawer-description',
			'drawer-footer',
			'drawer-close',
		]) {
			expect(slot(name), name).toBeInTheDocument();
		}
	});

	it('keeps the dialog slot on the close button', () => {
		render(
			<Drawer open>
				<DrawerContent>
					<DrawerTitle>Title</DrawerTitle>
					<DrawerCloseButton />
				</DrawerContent>
			</Drawer>,
		);

		expect(screen.getByRole('button', { name: 'Close' })).toHaveAttribute(
			'data-slot',
			'dialog-close-button',
		);
	});

	it('slides in from the right at the base width by default', () => {
		render(
			<Drawer open>
				<DrawerContent>
					<DrawerTitle>Title</DrawerTitle>
				</DrawerContent>
			</Drawer>,
		);

		expect(slot('drawer-content')).toHaveAttribute('data-position', 'right');
		expect(slot('drawer-content')).toHaveAttribute('data-width', 'base');
		expect(slot('drawer-content')).toHaveAttribute('data-animation', 'slide');
		expect(slot('drawer-content')).toHaveAttribute('data-height-mode', 'full');
	});

	it.each<DrawerDirection>(['top', 'right', 'bottom', 'left'])(
		'marks the %s direction on the panel',
		(direction) => {
			render(
				<Drawer open>
					<DrawerContent direction={direction}>
						<DrawerTitle>Title</DrawerTitle>
					</DrawerContent>
				</Drawer>,
			);

			expect(slot('drawer-content')).toHaveAttribute('data-position', direction);
		},
	);

	it('passes width and testId to the panel', () => {
		render(
			<Drawer open>
				<DrawerContent width="wide" testId="panel">
					<DrawerTitle>Title</DrawerTitle>
				</DrawerContent>
			</Drawer>,
		);

		expect(screen.getByTestId('panel')).toHaveAttribute('data-width', 'wide');
	});

	it('leaves the overlay out when showOverlay is false', () => {
		render(
			<Drawer open>
				<DrawerContent showOverlay={false}>
					<DrawerTitle>Title</DrawerTitle>
				</DrawerContent>
			</Drawer>,
		);

		expect(slot('drawer-overlay')).toBeNull();
	});

	it('does not put offset on the panel', () => {
		render(
			<Drawer open>
				<DrawerContent offset={40}>
					<DrawerTitle>Title</DrawerTitle>
				</DrawerContent>
			</Drawer>,
		);

		expect(slot('drawer-content')).not.toHaveAttribute('offset');
	});
});

const DIRECTIONS: DrawerDirection[] = ['top', 'right', 'bottom', 'left'];

describe('Drawer animation', () => {
	it.each(
		DIRECTIONS.flatMap((direction) =>
			(['fade', 'zoom', 'slide'] as const).map((animation) => [direction, animation] as const),
		),
	)('builds valid transforms for a %s drawer with the %s animation', (direction, animation) => {
		const variants = getContentVariants(direction, animation);

		for (const name of ['initial', 'animate', 'exit'] as const) {
			const { transform } = variants[name] as { transform: string };
			expect(CSS.supports('transform', transform), `${name}: ${transform}`).toBe(true);
		}
	});

	it.each(
		DIRECTIONS.flatMap((direction) =>
			(['fade', 'zoom'] as const).map((animation) => [direction, animation] as const),
		),
	)('rests a %s drawer against its edge with the %s animation', async (direction, animation) => {
		render(
			<Drawer open>
				<DrawerContent direction={direction} animation={animation}>
					<DrawerTitle>Title</DrawerTitle>
				</DrawerContent>
			</Drawer>,
		);
		const panel = screen.getByRole('dialog', { name: 'Title' });

		await waitFor(() => expect(getComputedStyle(panel).opacity).toBe('1'));
		await waitFor(() =>
			expect(['none', 'matrix(1, 0, 0, 1, 0, 0)']).toContain(getComputedStyle(panel).transform),
		);

		const rect = panel.getBoundingClientRect();
		const viewport = document.documentElement.clientWidth;
		if (direction === 'left' || direction === 'top' || direction === 'bottom') {
			expect(rect.left).toBeCloseTo(0, 0);
		}
		if (direction === 'right') {
			expect(rect.right).toBeCloseTo(viewport, 0);
		}
		if (direction === 'top') {
			expect(rect.top).toBeCloseTo(0, 0);
		}
		if (direction === 'bottom') {
			expect(rect.bottom).toBeCloseTo(window.innerHeight, 0);
		}
	});
});

describe('Drawer interaction', () => {
	it('opens from the trigger and closes from a DrawerClose', async () => {
		const user = userEvent.setup();
		render(
			<Drawer>
				<DrawerTrigger>Open</DrawerTrigger>
				<DrawerContent>
					<DrawerTitle>Title</DrawerTitle>
					<DrawerClose>Dismiss</DrawerClose>
				</DrawerContent>
			</Drawer>,
		);
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: 'Open' }));
		expect(screen.getByRole('dialog', { name: 'Title' })).toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: 'Dismiss' }));
		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
	});

	it('closes from the close button and on Escape', async () => {
		const user = userEvent.setup();
		const onOpenChange = vi.fn();
		render(
			<Drawer open onOpenChange={onOpenChange}>
				<DrawerContent>
					<DrawerTitle>Title</DrawerTitle>
					<DrawerCloseButton />
				</DrawerContent>
			</Drawer>,
		);

		await user.click(screen.getByRole('button', { name: 'Close' }));
		expect(onOpenChange).toHaveBeenLastCalledWith(false);

		await user.keyboard('{Escape}');
		expect(onOpenChange).toHaveBeenCalledTimes(2);
	});
});

describe('DrawerWrapper', () => {
	it('opens from its trigger and closes from its close button', async () => {
		const user = userEvent.setup();
		render(
			<DrawerWrapper title="Settings" trigger={<button type="button">Open</button>}>
				Body
			</DrawerWrapper>,
		);

		await user.click(screen.getByRole('button', { name: 'Open' }));
		expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument();
		expect(slot('drawer-header')).toBeInTheDocument();
		expect(slot('drawer-description')).toHaveTextContent('Body');

		await user.click(screen.getByRole('button', { name: 'Close' }));
		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
	});

	it('stays open on a press on the overlay when disableOutsideClick is set', async () => {
		const user = userEvent.setup();
		const onOpenChange = vi.fn();
		render(
			<DrawerWrapper open onOpenChange={onOpenChange} title="Settings" disableOutsideClick>
				Body
			</DrawerWrapper>,
		);

		await user.click(slot('drawer-overlay'));

		expect(onOpenChange).not.toHaveBeenCalled();
		expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument();
	});

	it('can hide the close button', () => {
		render(
			<DrawerWrapper open onOpenChange={() => {}} title="Settings" showCloseButton={false}>
				Body
			</DrawerWrapper>,
		);

		expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
	});
});

function captureUnhandledRejections() {
	const reasons: unknown[] = [];
	const listener = (event: PromiseRejectionEvent) => {
		reasons.push(event.reason);
		event.preventDefault();
	};
	window.addEventListener('unhandledrejection', listener);
	onTestFinished(() => window.removeEventListener('unhandledrejection', listener));

	return reasons;
}

describe('ConfirmDrawer', () => {
	function renderConfirm(onConfirm: () => boolean | undefined | Promise<boolean | undefined>) {
		const onOpenChange = vi.fn();
		render(
			<ConfirmDrawer
				open
				onOpenChange={onOpenChange}
				onConfirm={onConfirm}
				title="Delete item"
				confirmText="Delete"
			>
				This cannot be undone.
			</ConfirmDrawer>,
		);

		return onOpenChange;
	}

	it('keeps the dialog slots it rendered before it was built on the drawer primitives', () => {
		renderConfirm(() => true);

		for (const name of [
			'dialog-overlay',
			'dialog-content',
			'dialog-header',
			'dialog-title',
			'dialog-description',
			'dialog-footer',
		]) {
			expect(slot(name), name).toBeInTheDocument();
		}
		expect(slot('drawer-content')).toBeNull();
	});

	it('closes once onConfirm resolves true', async () => {
		const user = userEvent.setup();
		const onOpenChange = renderConfirm(async () => true);

		await user.click(screen.getByRole('button', { name: 'Delete' }));

		await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
	});

	it('stays open when onConfirm resolves false', async () => {
		const user = userEvent.setup();
		const onConfirm = vi.fn(async () => false);
		const onOpenChange = renderConfirm(onConfirm);

		await user.click(screen.getByRole('button', { name: 'Delete' }));

		await waitFor(() => expect(onConfirm).toHaveBeenCalledOnce());
		expect(onOpenChange).not.toHaveBeenCalled();
	});

	it('leaves the loading state and stays open when onConfirm rejects', async () => {
		const user = userEvent.setup();
		const error = new Error('Request failed');
		const rejections = captureUnhandledRejections();
		let reject: (reason: Error) => void = () => {};
		const onOpenChange = renderConfirm(
			() =>
				new Promise((_, fail) => {
					reject = fail;
				}),
		);
		const confirm = screen.getByRole('button', { name: 'Delete' });

		await user.click(confirm);
		expect(confirm).toHaveAttribute('aria-busy', 'true');

		reject(error);

		await waitFor(() => expect(confirm).not.toHaveAttribute('aria-busy'));
		expect(confirm).toBeEnabled();
		await waitFor(() => expect(rejections).toContain(error));
		expect(onOpenChange).not.toHaveBeenCalled();
		expect(screen.getByRole('dialog', { name: 'Delete item' })).toBeInTheDocument();
	});
});

describe('ConfirmDrawerUrl', () => {
	it('leaves the loading state and stays open when onConfirm rejects', async () => {
		const user = userEvent.setup();
		const error = new Error('Request failed');
		const rejections = captureUnhandledRejections();
		render(
			<NuqsTestingAdapter searchParams="?confirm=true">
				<ConfirmDrawerUrl
					urlKey="confirm"
					onConfirm={() => Promise.reject(error)}
					title="Delete item"
					confirmText="Delete"
				>
					This cannot be undone.
				</ConfirmDrawerUrl>
			</NuqsTestingAdapter>,
		);
		const confirm = screen.getByRole('button', { name: 'Delete' });

		await user.click(confirm);

		await waitFor(() => expect(rejections).toContain(error));
		await waitFor(() => expect(confirm).not.toHaveAttribute('aria-busy'));
		expect(confirm).toBeEnabled();
		expect(screen.getByRole('dialog', { name: 'Delete item' })).toBeInTheDocument();
	});
});
