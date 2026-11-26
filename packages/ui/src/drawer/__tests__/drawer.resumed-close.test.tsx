import { renderHook } from '@testing-library/react';
import { useState } from 'react';
import { expect, it, vi } from 'vitest';
import { useCommittedOpen } from '../use-committed-open.js';
import { useNestedDrawers } from '../use-nested-drawers.js';

it('skips the outer drawer when a resumed middle close removes it', async () => {
	const closeOuter = vi.fn(() => true);
	const { result } = renderHook(() => {
		const [open, setOpen] = useState(true);
		const outer = useNestedDrawers({
			nestInParent: undefined,
			isOpen: open,
			readIsOpen: useCommittedOpen(open),
			requestClose: closeOuter,
		});
		const middle = useNestedDrawers({
			nestInParent: outer.nest,
			isOpen: open,
			readIsOpen: useCommittedOpen(open),
			requestClose: () => {
				setOpen(false);
				return true;
			},
		});
		useNestedDrawers({
			nestInParent: middle.nest,
			isOpen: open,
			readIsOpen: useCommittedOpen(open),
			requestClose: () => Promise.resolve(true),
		});

		return { outer, open };
	});

	await expect(result.current.outer.closeWithNested('close-press')).resolves.toBe(true);
	expect(closeOuter).not.toHaveBeenCalled();
	expect(result.current.open).toBe(false);
});
