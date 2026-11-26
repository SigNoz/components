import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useCommittedOpen } from '../use-committed-open.js';
import { useNestedDrawers } from '../use-nested-drawers.js';

function pendingAnswer(): { promise: Promise<boolean>; resolve: (agreed: boolean) => void } {
	let resolve: (agreed: boolean) => void = () => {};
	const promise = new Promise<boolean>((done) => {
		resolve = done;
	});

	return { promise, resolve };
}

describe('Nested drawer close ordering', () => {
	it('asks an inspector opened during a pending decision before the inspectors below it', async () => {
		const closeParent = vi.fn(() => true);
		const closeLower = vi.fn(() => true);
		const closeNew = vi.fn(() => false);
		const { promise, resolve } = pendingAnswer();
		const closeWaiting = vi.fn(() => promise);
		const { result } = renderHook(() =>
			useNestedDrawers({
				nestInParent: undefined,
				isOpen: true,
				readIsOpen: useCommittedOpen(true),
				requestClose: closeParent,
			}),
		);
		function register(close: () => boolean | Promise<boolean>): void {
			result.current.nest({
				close,
				isOpen: () => true,
				closeWithParent: () => {},
				parentOpened: () => {},
				removedOpen: () => false,
			});
		}

		register(closeLower);
		register(closeWaiting);
		const answer = result.current.closeWithNested('close-press');
		expect(closeWaiting).toHaveBeenCalledOnce();
		register(closeNew);
		resolve(true);

		await expect(answer).resolves.toBe(false);
		expect(closeNew).toHaveBeenCalledWith('close-press', expect.any(Set));
		expect(closeLower).not.toHaveBeenCalled();
		expect(closeParent).not.toHaveBeenCalled();
	});

	it('discards an agreement when the drawer reopens before the next task', async () => {
		const { promise, resolve } = pendingAnswer();
		const { result, rerender } = renderHook(
			({ open }) =>
				useNestedDrawers({
					nestInParent: undefined,
					isOpen: open,
					readIsOpen: useCommittedOpen(open),
					requestClose: () => promise,
				}),
			{ initialProps: { open: true } },
		);

		vi.useFakeTimers({ toFake: ['setTimeout'] });
		try {
			const answer = result.current.closeWithNested('close-press');
			resolve(true);
			await promise;
			await Promise.resolve();
			expect(vi.getTimerCount()).toBe(1);

			rerender({ open: false });
			rerender({ open: true });
			await vi.runAllTimersAsync();

			await expect(answer).resolves.toBe(false);
		} finally {
			vi.useRealTimers();
		}
	});
});
