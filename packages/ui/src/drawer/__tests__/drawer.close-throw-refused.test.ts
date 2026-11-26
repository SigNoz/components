import { act, renderHook } from '@testing-library/react';
import { useState } from 'react';
import { expect, it, vi } from 'vitest';
import type { CloseAnswer } from '../drawer-stack-context.js';
import type { DrawerCloseReasonType } from '../types.js';
import { useCommittedOpen } from '../use-committed-open.js';
import { useNestedDrawers } from '../use-nested-drawers.js';

const failure = new Error('Close failed');

it.each([
	{
		description: 'the drawer below throws after a drawer over it answered later',
		innerAnswer: (): CloseAnswer => Promise.resolve(true),
		closeOuter: (): CloseAnswer => {
			throw failure;
		},
	},
	{
		description: 'the promise of the drawer below rejects',
		innerAnswer: (): CloseAnswer => true,
		closeOuter: (): CloseAnswer => Promise.reject(failure),
	},
	{
		description: 'the drawer below throws at once',
		innerAnswer: (): CloseAnswer => true,
		closeOuter: (): CloseAnswer => {
			throw failure;
		},
	},
])(
	'sends parent-close to a drawer that agreed when $description',
	async ({ innerAnswer, closeOuter }) => {
		const closeInner = vi.fn((_reason: DrawerCloseReasonType) => innerAnswer());
		const { result } = renderHook(() => {
			const [outerOpen, setOuterOpen] = useState(true);
			const outer = useNestedDrawers({
				nestInParent: undefined,
				isOpen: outerOpen,
				readIsOpen: useCommittedOpen(outerOpen),
				requestClose: (reason) => (reason === 'close-press' ? closeOuter() : true),
			});
			useNestedDrawers({
				nestInParent: outer.nest,
				isOpen: true,
				readIsOpen: useCommittedOpen(true),
				requestClose: closeInner,
			});

			return { outer, setOuterOpen };
		});

		// A throw at once leaves the press synchronously, and a later one rejects its promise.
		await expect((async () => result.current.outer.closeWithNested('close-press'))()).rejects.toBe(
			failure,
		);
		act(() => {
			result.current.setOuterOpen(false);
		});

		expect(closeInner.mock.calls).toEqual([['close-press'], ['parent-close']]);
	},
);
