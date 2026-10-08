import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type ReactElement, type ReactNode, type RefObject, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AlertStrip } from '../alert-strip.js';

afterEach(() => window.localStorage.clear());

// Owns `closed` as a consumer does: the close button sets it, `Show`, placed before the strip,
// resets it.
function ClosedByState({
	children = 'a',
	onClose,
	finalFocus,
}: {
	children?: ReactNode;
	onClose?: () => void;
	finalFocus?: RefObject<HTMLElement | null>;
}): ReactElement {
	const [closed, setClosed] = useState(false);

	return (
		<>
			<button type="button" onClick={() => setClosed(false)}>
				Show
			</button>
			<AlertStrip.Closeable
				color="warning"
				side="bottom"
				testId="s"
				closed={closed}
				onClose={() => {
					onClose?.();
					setClosed(true);
				}}
				finalFocus={finalFocus}
			>
				{children}
			</AlertStrip.Closeable>
		</>
	);
}

describe('AlertStrip.Closeable', () => {
	it('renders a Dismiss button and hides once onClose sets closed', async () => {
		const user = userEvent.setup();
		render(<ClosedByState>Trial ends soon</ClosedByState>);

		expect(screen.getByTestId('s-close')).toHaveAttribute('data-slot', 'alert-strip-close');
		expect(screen.getByTestId('s-close')).toHaveAccessibleName('Dismiss');
		await user.click(screen.getByRole('button', { name: 'Dismiss' }));

		expect(screen.queryByTestId('s')).not.toBeInTheDocument();
	});

	it('renders nothing while closed', () => {
		render(
			<AlertStrip.Closeable color="warning" side="bottom" testId="s" closed onClose={vi.fn()}>
				a
			</AlertStrip.Closeable>,
		);

		expect(screen.queryByTestId('s')).not.toBeInTheDocument();
	});

	it('shows again once closed is back to false', async () => {
		const user = userEvent.setup();
		render(<ClosedByState />);

		await user.click(screen.getByRole('button', { name: 'Dismiss' }));
		await user.click(screen.getByRole('button', { name: 'Show' }));

		expect(screen.getByTestId('s')).toBeInTheDocument();
	});

	it('names the close button with closeAriaLabel', () => {
		render(
			<AlertStrip.Closeable
				color="warning"
				side="bottom"
				testId="s"
				closed={false}
				onClose={vi.fn()}
				closeAriaLabel="Dismiss the trial notice"
			>
				Trial ends soon
			</AlertStrip.Closeable>,
		);

		expect(screen.getByTestId('s-close')).toHaveAccessibleName('Dismiss the trial notice');
	});

	it('takes focus after the controls of the content, and dismisses with the keyboard', async () => {
		const user = userEvent.setup();
		render(
			<ClosedByState>
				Trial ends soon. <AlertStrip.Link href="/billing">Upgrade</AlertStrip.Link>
			</ClosedByState>,
		);

		await user.tab();
		await user.tab();
		expect(screen.getByRole('link', { name: 'Upgrade' })).toHaveFocus();
		await user.tab();
		expect(screen.getByRole('button', { name: 'Dismiss' })).toHaveFocus();
		await user.keyboard('{Enter}');

		expect(screen.queryByTestId('s')).not.toBeInTheDocument();
	});

	it('puts the suffix before the close button, in the DOM and in the focus order', async () => {
		const user = userEvent.setup();
		render(
			<AlertStrip.Closeable
				color="warning"
				side="bottom"
				testId="s"
				closed={false}
				onClose={vi.fn()}
				suffix={<AlertStrip.Button>Upgrade</AlertStrip.Button>}
			>
				Trial ends soon. <AlertStrip.Link href="/billing">Read the plans</AlertStrip.Link>
			</AlertStrip.Closeable>,
		);

		expect(screen.getByTestId('s-suffix').nextElementSibling).toBe(screen.getByTestId('s-close'));
		await user.tab();
		expect(screen.getByRole('link', { name: 'Read the plans' })).toHaveFocus();
		await user.tab();
		expect(screen.getByRole('button', { name: 'Upgrade' })).toHaveFocus();
		await user.tab();
		expect(screen.getByRole('button', { name: 'Dismiss' })).toHaveFocus();
	});

	it('moves focus to finalFocus once onClose closes it', async () => {
		const user = userEvent.setup();
		const finalFocus = createRef<HTMLButtonElement>();
		render(
			<>
				<ClosedByState finalFocus={finalFocus} />
				<button type="button">After</button>
				<button ref={finalFocus} type="button">
					Target
				</button>
			</>,
		);

		screen.getByRole('button', { name: 'Dismiss' }).focus();
		await user.keyboard('{Enter}');

		expect(screen.getByRole('button', { name: 'Target' })).toHaveFocus();
	});

	it('moves no focus without finalFocus', async () => {
		const user = userEvent.setup();
		render(
			<>
				<ClosedByState />
				<button type="button">After</button>
			</>,
		);

		screen.getByRole('button', { name: 'Dismiss' }).focus();
		await user.keyboard('{Enter}');

		expect(screen.queryByTestId('s')).not.toBeInTheDocument();
		expect(document.body).toHaveFocus();
	});

	it('takes no focus that was not in the strip', () => {
		const finalFocus = createRef<HTMLButtonElement>();
		render(
			<>
				<ClosedByState finalFocus={finalFocus} />
				<button ref={finalFocus} type="button">
					Target
				</button>
			</>,
		);

		// A mouse click in Safari, which does not focus the button.
		fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));

		expect(screen.queryByTestId('s')).not.toBeInTheDocument();
		expect(document.body).toHaveFocus();
	});

	it('renders nothing for empty children', () => {
		const { container } = render(
			<AlertStrip.Closeable color="warning" side="bottom" closed={false} onClose={vi.fn()}>
				{null}
			</AlertStrip.Closeable>,
		);

		expect(container).toBeEmptyDOMElement();
	});
});

describe('AlertStrip.CloseablePersisted', () => {
	it('stays hidden after a remount until the entry is cleared', async () => {
		const user = userEvent.setup();
		const { unmount } = render(
			<AlertStrip.CloseablePersisted storageKey="k" color="warning" side="bottom" testId="s">
				a
			</AlertStrip.CloseablePersisted>,
		);
		await user.click(screen.getByRole('button', { name: 'Dismiss' }));
		unmount();

		const { unmount: unmountAgain } = render(
			<AlertStrip.CloseablePersisted storageKey="k" color="warning" side="bottom" testId="s">
				a
			</AlertStrip.CloseablePersisted>,
		);
		expect(screen.queryByTestId('s')).not.toBeInTheDocument();
		unmountAgain();

		window.localStorage.removeItem('k');
		render(
			<AlertStrip.CloseablePersisted storageKey="k" color="warning" side="bottom" testId="s">
				a
			</AlertStrip.CloseablePersisted>,
		);
		expect(screen.getByTestId('s')).toBeInTheDocument();
	});

	it('stays hidden for an entry PersistedAnnouncementBanner wrote', () => {
		window.localStorage.setItem('no-auth-banner-v1', 'true');
		render(
			<AlertStrip.CloseablePersisted
				storageKey="no-auth-banner-v1"
				color="warning"
				side="bottom"
				testId="s"
			>
				a
			</AlertStrip.CloseablePersisted>,
		);

		expect(screen.queryByTestId('s')).not.toBeInTheDocument();
	});

	it('writes "true" and still calls onClose', async () => {
		const user = userEvent.setup();
		const onClose = vi.fn();
		render(
			<AlertStrip.CloseablePersisted storageKey="k" color="warning" side="bottom" onClose={onClose}>
				a
			</AlertStrip.CloseablePersisted>,
		);

		await user.click(screen.getByRole('button', { name: 'Dismiss' }));

		expect(window.localStorage.getItem('k')).toBe('true');
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('moves focus to finalFocus once the dismissal hides it', async () => {
		const user = userEvent.setup();
		const finalFocus = createRef<HTMLButtonElement>();
		render(
			<>
				<AlertStrip.CloseablePersisted
					storageKey="k"
					color="warning"
					side="bottom"
					finalFocus={finalFocus}
				>
					a
				</AlertStrip.CloseablePersisted>
				<button ref={finalFocus} type="button">
					Target
				</button>
			</>,
		);

		screen.getByRole('button', { name: 'Dismiss' }).focus();
		await user.keyboard('{Enter}');

		expect(screen.getByRole('button', { name: 'Target' })).toHaveFocus();
	});

	it('hides every strip with the same storageKey', async () => {
		const user = userEvent.setup();
		render(
			<>
				<AlertStrip.CloseablePersisted storageKey="k" color="warning" side="bottom" testId="a">
					a
				</AlertStrip.CloseablePersisted>
				<AlertStrip.CloseablePersisted storageKey="k" color="warning" side="bottom" testId="b">
					a
				</AlertStrip.CloseablePersisted>
			</>,
		);

		await user.click(within(screen.getByTestId('a')).getByRole('button', { name: 'Dismiss' }));

		expect(screen.queryByTestId('a')).not.toBeInTheDocument();
		expect(screen.queryByTestId('b')).not.toBeInTheDocument();
	});

	it('follows a dismissal saved in another tab', () => {
		render(
			<AlertStrip.CloseablePersisted storageKey="k" color="warning" side="bottom" testId="s">
				a
			</AlertStrip.CloseablePersisted>,
		);

		// Another tab writes the entry, and this tab only hears the `storage` event.
		act(() => {
			window.localStorage.setItem('k', 'true');
			window.dispatchEvent(new StorageEvent('storage', { key: 'k', newValue: 'true' }));
		});

		expect(screen.queryByTestId('s')).not.toBeInTheDocument();
	});

	it('shows, and hides until a reload, when storage throws', async () => {
		const user = userEvent.setup();
		const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
			throw new Error('blocked');
		});
		const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
			throw new Error('blocked');
		});

		try {
			// A key of its own: the session-only dismissal lasts until the page reloads.
			render(
				<AlertStrip.CloseablePersisted
					storageKey="strip-blocked"
					color="warning"
					side="bottom"
					testId="s"
				>
					a
				</AlertStrip.CloseablePersisted>,
			);

			expect(screen.getByTestId('s')).toBeInTheDocument();
			await user.click(screen.getByRole('button', { name: 'Dismiss' }));
			expect(screen.queryByTestId('s')).not.toBeInTheDocument();
		} finally {
			getItem.mockRestore();
			setItem.mockRestore();
		}
	});
});
