import { render } from '@testing-library/react';
import { type ReactNode, StrictMode, useEffect, useLayoutEffect } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { type PopupHandle, usePopupHandle } from './popup-handle.js';

type Action = 'open' | 'close' | null;

interface DrivesTheHandleProps {
	handle: PopupHandle;
	action: Action;
}

/**
 * Shows or hides the popup from a layout effect, which runs before the layout effects of the
 * component that owns the handle.
 */
function DrivesTheHandle({ handle, action }: DrivesTheHandleProps): ReactNode {
	useLayoutEffect(() => {
		if (action === 'open') {
			handle.showAt({ x: 1, y: 1 });
		} else if (action === 'close') {
			handle.close();
		}
	}, [handle, action]);

	return null;
}

interface OwnerProps {
	onOpenChange: (open: boolean) => void;
	action: Action;
}

function Owner({ onOpenChange, action }: OwnerProps): ReactNode {
	const handle = usePopupHandle(onOpenChange);

	return <DrivesTheHandle handle={handle} action={action} />;
}

describe('useOpenStateStore, through usePopupHandle', () => {
	it('reports a change made by a layout effect of a child on the first mount', () => {
		const onOpenChange = vi.fn();

		render(<Owner onOpenChange={onOpenChange} action="open" />);

		expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
	});

	it('reports an open made by a layout effect of a child to the onOpenChange of the same render', () => {
		const first = vi.fn();
		const second = vi.fn();
		const { rerender } = render(<Owner onOpenChange={first} action={null} />);

		rerender(<Owner onOpenChange={second} action="open" />);

		expect(first).not.toHaveBeenCalled();
		expect(second).toHaveBeenCalledExactlyOnceWith(true);
	});

	it('reports a close made by a layout effect of a child to the onOpenChange of the same render', () => {
		const first = vi.fn();
		const second = vi.fn();
		const { rerender } = render(<Owner onOpenChange={first} action="open" />);

		rerender(<Owner onOpenChange={second} action="close" />);

		expect(first).toHaveBeenCalledExactlyOnceWith(true);
		expect(second).toHaveBeenCalledExactlyOnceWith(false);
	});

	it('reports a change made by a layout effect of a child in strict mode', () => {
		const first = vi.fn();
		const second = vi.fn();
		const { rerender } = render(
			<StrictMode>
				<Owner onOpenChange={first} action={null} />
			</StrictMode>,
		);

		rerender(
			<StrictMode>
				<Owner onOpenChange={second} action="open" />
			</StrictMode>,
		);

		expect(first).not.toHaveBeenCalled();
		expect(second).toHaveBeenCalledOnce();
		expect(second).toHaveBeenLastCalledWith(true);
	});

	it('stops reporting once the owner unmounted', () => {
		const onOpenChange = vi.fn();
		const handleRef: { current: PopupHandle | null } = { current: null };

		function Capture(): ReactNode {
			const handle = usePopupHandle(onOpenChange);

			useEffect(() => {
				handleRef.current = handle;
			}, [handle]);

			return null;
		}

		const { unmount } = render(<Capture />);

		unmount();
		handleRef.current?.showAt({ x: 1, y: 1 });

		expect(onOpenChange).not.toHaveBeenCalled();
	});
});
