import { describe, expect, it, vi } from 'vitest';
import { PopupHandle } from './popup-handle.js';

describe('OpenStateStore, through PopupHandle', () => {
	it('starts closed with nothing to show', () => {
		const handle = new PopupHandle<string>();

		expect(handle.isOpen).toBe(false);
		expect(handle.getSnapshot()).toEqual({ open: false, anchor: null, payload: undefined });
	});

	it('opens with what it was shown with, and tells its subscribers', () => {
		const handle = new PopupHandle<string>();
		const listener = vi.fn();
		const anchor = document.createElement('div');
		handle.subscribe(listener);

		handle.showAt(anchor, 'row 1');

		expect(handle.isOpen).toBe(true);
		expect(handle.getSnapshot()).toEqual({ open: true, anchor, payload: 'row 1' });
		expect(listener).toHaveBeenCalledOnce();
	});

	it('keeps what it was shown with when it closes, for the exit animation', () => {
		const handle = new PopupHandle<string>();
		const anchor = { x: 4, y: 8 };
		handle.showAt(anchor, 'row 1');

		handle.close();

		expect(handle.isOpen).toBe(false);
		expect(handle.getSnapshot()).toEqual({ open: false, anchor, payload: 'row 1' });
	});

	it('hands out a new snapshot on a change and the same one while nothing changes', () => {
		const handle = new PopupHandle<string>();
		const closed = handle.getSnapshot();

		expect(handle.getSnapshot()).toBe(closed);

		handle.showAt({ x: 1, y: 1 }, 'row 1');

		expect(handle.getSnapshot()).not.toBe(closed);
		expect(handle.getSnapshot()).toBe(handle.getSnapshot());
	});

	it('does nothing when it is closed while it is already closed', () => {
		const handle = new PopupHandle();
		const listener = vi.fn();
		const onOpenChange = vi.fn();
		const closed = handle.getSnapshot();
		handle.subscribe(listener);
		handle.setOpenListener(onOpenChange);

		handle.close();
		handle.setOpen(false);

		expect(listener).not.toHaveBeenCalled();
		expect(onOpenChange).not.toHaveBeenCalled();
		expect(handle.getSnapshot()).toBe(closed);
	});

	it('opens and closes in place with setOpen, and keeps the rest', () => {
		const handle = new PopupHandle<string>();
		const anchor = { x: 2, y: 3 };
		handle.showAt(anchor, 'row 1');
		handle.close();

		handle.setOpen(true);

		expect(handle.getSnapshot()).toEqual({ open: true, anchor, payload: 'row 1' });

		const listener = vi.fn();
		handle.subscribe(listener);
		handle.setOpen(true);

		expect(listener).not.toHaveBeenCalled();
	});

	it('tells its subscribers about a payload swap, which is not an open change', () => {
		const handle = new PopupHandle<string>();
		const listener = vi.fn();
		handle.showAt({ x: 1, y: 1 }, 'row 1');
		handle.subscribe(listener);

		handle.showAt({ x: 5, y: 5 }, 'row 2');

		expect(listener).toHaveBeenCalledOnce();
		expect(handle.getSnapshot()).toEqual({ open: true, anchor: { x: 5, y: 5 }, payload: 'row 2' });
	});

	it('reports to the open listener when it opens or closes, not when the payload swaps', () => {
		const handle = new PopupHandle<string>();
		const onOpenChange = vi.fn();
		handle.setOpenListener(onOpenChange);

		handle.showAt({ x: 1, y: 1 }, 'row 1');
		handle.showAt({ x: 2, y: 2 }, 'row 2');
		handle.close();
		handle.close();
		handle.showAt({ x: 3, y: 3 }, 'row 3');

		expect(onOpenChange.mock.calls).toEqual([[true], [false], [true]]);
	});

	it('stops telling a subscriber that unsubscribed, and still tells the others', () => {
		const handle = new PopupHandle();
		const gone = vi.fn();
		const stays = vi.fn();
		const unsubscribe = handle.subscribe(gone);
		handle.subscribe(stays);

		unsubscribe();
		handle.showAt({ x: 1, y: 1 });

		expect(gone).not.toHaveBeenCalled();
		expect(stays).toHaveBeenCalledOnce();
	});

	it('calls only the latest open listener, and none once it is cleared', () => {
		const handle = new PopupHandle();
		const first = vi.fn();
		const second = vi.fn();
		handle.setOpenListener(first);
		handle.setOpenListener(second);

		handle.showAt({ x: 1, y: 1 });

		expect(first).not.toHaveBeenCalled();
		expect(second).toHaveBeenCalledExactlyOnceWith(true);

		handle.setOpenListener(undefined);
		handle.close();

		expect(second).toHaveBeenCalledOnce();
	});

	it('tells the open listener after the subscribers, with the state already changed', () => {
		const handle = new PopupHandle();
		const seen: string[] = [];
		handle.subscribe(() => seen.push(`subscriber open=${handle.isOpen}`));
		handle.setOpenListener((open) => seen.push(`listener open=${open} isOpen=${handle.isOpen}`));

		handle.showAt({ x: 1, y: 1 });

		expect(seen).toEqual(['subscriber open=true', 'listener open=true isOpen=true']);
	});
});
