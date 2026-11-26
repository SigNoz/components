import { renderHook } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { useCommittedOpen } from '../use-committed-open.js';
import { useNestedDrawers } from '../use-nested-drawers.js';

it('keeps the trail owner pending after the deciding inspector unregisters', async () => {
	let agree = () => {};
	const saving = new Promise<boolean>((resolve) => {
		agree = () => resolve(true);
	});
	const closeOwner = vi.fn(() => true);
	const { result } = renderHook(() =>
		useNestedDrawers({
			nestInParent: undefined,
			isOpen: true,
			readIsOpen: useCommittedOpen(true),
			requestClose: closeOwner,
		}),
	);
	const unregister = result.current.nest({
		close: () => saving,
		isOpen: () => true,
		closeWithParent: () => {},
		parentOpened: () => {},
		removedOpen: () => false,
	});

	const first = result.current.closeNested('crumb-press');
	unregister();
	expect(result.current.closeNested('crumb-press')).toBe(false);
	expect(result.current.closeWithNested('close-press')).toBe(false);
	expect(closeOwner).not.toHaveBeenCalled();

	agree();
	await expect(first).resolves.toBe(true);
	expect(result.current.closeNested('crumb-press')).toBe(true);
});
