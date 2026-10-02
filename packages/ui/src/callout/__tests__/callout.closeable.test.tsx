import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactElement, type ReactNode, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Callout } from '../callout.js';

const icon = <svg />;

afterEach(() => window.localStorage.clear());

// Owns `closed` as a consumer does: the close button sets it, `Show`, placed before the callout,
// resets it.
function ClosedByState({
	children = 'a',
	onClose,
}: {
	children?: ReactNode;
	onClose?: () => void;
}): ReactElement {
	const [closed, setClosed] = useState(false);

	return (
		<>
			<button type="button" onClick={() => setClosed(false)}>
				Show
			</button>
			<Callout.Closeable
				color="warning"
				size="sm"
				icon={icon}
				testId="c"
				closed={closed}
				onClose={() => {
					onClose?.();
					setClosed(true);
				}}
			>
				{children}
			</Callout.Closeable>
		</>
	);
}

describe('Callout.Closeable', () => {
	it('renders a Dismiss button and hides once onClose sets closed', async () => {
		const user = userEvent.setup();
		render(<ClosedByState>Trial ends soon</ClosedByState>);

		expect(screen.getByTestId('c-close')).toHaveAccessibleName('Dismiss');
		await user.click(screen.getByRole('button', { name: 'Dismiss' }));

		expect(screen.queryByTestId('c')).not.toBeInTheDocument();
	});

	it('renders nothing while closed', () => {
		render(
			<Callout.Closeable color="warning" size="sm" icon={icon} testId="c" closed onClose={vi.fn()}>
				a
			</Callout.Closeable>,
		);

		expect(screen.queryByTestId('c')).not.toBeInTheDocument();
	});

	it('shows again once closed is back to false', async () => {
		const user = userEvent.setup();
		render(<ClosedByState />);

		await user.click(screen.getByRole('button', { name: 'Dismiss' }));
		await user.click(screen.getByRole('button', { name: 'Show' }));

		expect(screen.getByTestId('c')).toBeInTheDocument();
	});

	it('stays on screen when onClose leaves closed false', async () => {
		const user = userEvent.setup();
		const onClose = vi.fn();
		render(
			<Callout.Closeable
				color="warning"
				size="sm"
				icon={icon}
				testId="c"
				closed={false}
				onClose={onClose}
			>
				a
			</Callout.Closeable>,
		);

		await user.click(screen.getByRole('button', { name: 'Dismiss' }));

		expect(onClose).toHaveBeenCalledTimes(1);
		expect(screen.getByTestId('c')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Dismiss' })).toHaveFocus();
	});

	it('names the close button with closeAriaLabel', () => {
		render(
			<Callout.Closeable
				color="warning"
				size="sm"
				icon={icon}
				testId="c"
				closed={false}
				onClose={vi.fn()}
				closeAriaLabel="Dismiss the trial notice"
			>
				Trial ends soon
			</Callout.Closeable>,
		);

		expect(screen.getByTestId('c-close')).toHaveAccessibleName('Dismiss the trial notice');
	});

	it('dismisses with the keyboard', async () => {
		const user = userEvent.setup();
		render(<ClosedByState />);

		await user.tab();
		await user.tab();
		await user.keyboard('{Enter}');

		expect(screen.queryByTestId('c')).not.toBeInTheDocument();
	});

	it('moves focus to the next element after a keyboard dismiss', async () => {
		const user = userEvent.setup();
		render(
			<>
				<button type="button">Before</button>
				<ClosedByState />
				<button type="button" disabled>
					Disabled
				</button>
				<button type="button">After</button>
			</>,
		);

		screen.getByRole('button', { name: 'Dismiss' }).focus();
		await user.keyboard('{Enter}');

		expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
	});

	it('moves focus to the element before when nothing follows', async () => {
		const user = userEvent.setup();
		render(<ClosedByState />);

		screen.getByRole('button', { name: 'Dismiss' }).focus();
		await user.keyboard('{Enter}');

		expect(screen.getByRole('button', { name: 'Show' })).toHaveFocus();
	});

	it('keeps focus where onClose moved it', async () => {
		const user = userEvent.setup();
		render(
			<>
				<input aria-label="Search" />
				<ClosedByState onClose={() => screen.getByRole('textbox', { name: 'Search' }).focus()} />
			</>,
		);

		screen.getByRole('button', { name: 'Dismiss' }).focus();
		await user.keyboard('{Enter}');

		expect(screen.getByRole('textbox', { name: 'Search' })).toHaveFocus();
	});

	it('renders nothing for empty children', () => {
		const { container } = render(
			<Callout.Closeable color="warning" size="sm" icon={icon} closed={false} onClose={vi.fn()}>
				{null}
			</Callout.Closeable>,
		);

		expect(container).toBeEmptyDOMElement();
	});
});

describe('Callout.CloseablePersisted', () => {
	it('stays hidden after a remount until the entry is cleared', async () => {
		const user = userEvent.setup();
		const { unmount } = render(
			<Callout.CloseablePersisted storageKey="k" color="primary" size="sm" icon={icon} testId="c">
				a
			</Callout.CloseablePersisted>,
		);
		await user.click(screen.getByRole('button', { name: 'Dismiss' }));
		unmount();

		const { unmount: unmountAgain } = render(
			<Callout.CloseablePersisted storageKey="k" color="primary" size="sm" icon={icon} testId="c">
				a
			</Callout.CloseablePersisted>,
		);
		expect(screen.queryByTestId('c')).not.toBeInTheDocument();
		unmountAgain();

		window.localStorage.removeItem('k');
		render(
			<Callout.CloseablePersisted storageKey="k" color="primary" size="sm" icon={icon} testId="c">
				a
			</Callout.CloseablePersisted>,
		);
		expect(screen.getByTestId('c')).toBeInTheDocument();
	});

	it('writes "true", the value the app already stores for its dismissals', async () => {
		const user = userEvent.setup();
		render(
			<Callout.CloseablePersisted storageKey="k" color="primary" size="sm" icon={icon}>
				a
			</Callout.CloseablePersisted>,
		);

		await user.click(screen.getByRole('button', { name: 'Dismiss' }));

		expect(window.localStorage.getItem('k')).toBe('true');
	});

	it('stays hidden for an entry the app wrote before the migration', () => {
		window.localStorage.setItem('k', 'true');
		render(
			<Callout.CloseablePersisted storageKey="k" color="primary" size="sm" icon={icon} testId="c">
				a
			</Callout.CloseablePersisted>,
		);

		expect(screen.queryByTestId('c')).not.toBeInTheDocument();
	});

	it('follows a new storageKey', async () => {
		const user = userEvent.setup();
		const { rerender } = render(
			<Callout.CloseablePersisted storageKey="a" color="primary" size="sm" icon={icon} testId="c">
				x
			</Callout.CloseablePersisted>,
		);
		await user.click(screen.getByRole('button', { name: 'Dismiss' }));
		expect(screen.queryByTestId('c')).not.toBeInTheDocument();

		rerender(
			<Callout.CloseablePersisted storageKey="b" color="primary" size="sm" icon={icon} testId="c">
				x
			</Callout.CloseablePersisted>,
		);
		expect(screen.getByTestId('c')).toBeInTheDocument();

		rerender(
			<Callout.CloseablePersisted storageKey="a" color="primary" size="sm" icon={icon} testId="c">
				x
			</Callout.CloseablePersisted>,
		);
		expect(screen.queryByTestId('c')).not.toBeInTheDocument();
	});

	it('keys the dismissal by storageKey', async () => {
		const user = userEvent.setup();
		const { unmount } = render(
			<Callout.CloseablePersisted storageKey="a" color="primary" size="sm" icon={icon}>
				x
			</Callout.CloseablePersisted>,
		);
		await user.click(screen.getByRole('button', { name: 'Dismiss' }));
		unmount();

		render(
			<Callout.CloseablePersisted storageKey="b" color="primary" size="sm" icon={icon} testId="c">
				x
			</Callout.CloseablePersisted>,
		);

		expect(screen.getByTestId('c')).toBeInTheDocument();
	});

	it('still calls onClose', async () => {
		const user = userEvent.setup();
		const onClose = vi.fn();
		render(
			<Callout.CloseablePersisted
				storageKey="k"
				color="primary"
				size="sm"
				icon={icon}
				onClose={onClose}
			>
				a
			</Callout.CloseablePersisted>,
		);

		await user.click(screen.getByRole('button', { name: 'Dismiss' }));

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('hides every callout with the same storageKey', async () => {
		const user = userEvent.setup();
		render(
			<>
				<Callout.CloseablePersisted storageKey="k" color="primary" size="sm" icon={icon} testId="a">
					a
				</Callout.CloseablePersisted>
				<Callout.CloseablePersisted storageKey="k" color="primary" size="sm" icon={icon} testId="b">
					a
				</Callout.CloseablePersisted>
			</>,
		);

		await user.click(within(screen.getByTestId('a')).getByRole('button', { name: 'Dismiss' }));

		expect(screen.queryByTestId('a')).not.toBeInTheDocument();
		expect(screen.queryByTestId('b')).not.toBeInTheDocument();
	});

	it('follows a dismissal saved in another tab', () => {
		render(
			<Callout.CloseablePersisted storageKey="k" color="primary" size="sm" icon={icon} testId="c">
				a
			</Callout.CloseablePersisted>,
		);

		// Another tab writes the entry, and this tab only hears the `storage` event.
		act(() => {
			window.localStorage.setItem('k', 'true');
			window.dispatchEvent(new StorageEvent('storage', { key: 'k', newValue: 'true' }));
		});

		expect(screen.queryByTestId('c')).not.toBeInTheDocument();
	});

	it('falls back to session-only when storage throws', async () => {
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
				<Callout.CloseablePersisted
					storageKey="blocked"
					color="primary"
					size="sm"
					icon={icon}
					testId="c"
				>
					a
				</Callout.CloseablePersisted>,
			);

			expect(screen.getByTestId('c')).toBeInTheDocument();
			await user.click(screen.getByRole('button', { name: 'Dismiss' }));
			expect(screen.queryByTestId('c')).not.toBeInTheDocument();
		} finally {
			getItem.mockRestore();
			setItem.mockRestore();
		}
	});
});
