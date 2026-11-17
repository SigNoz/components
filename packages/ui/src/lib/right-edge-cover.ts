import { useState, useSyncExternalStore } from 'react';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.js';

// How much of the right side of the window each open panel covers, such as a `Drawer`. A `Toaster`
// reads the widest, so its right stacks sit beside the panel instead of over its header.

const covers = new Map<symbol, number>();
const listeners = new Set<() => void>();
let widest = 0;

function notify(): void {
	widest = Math.max(0, ...covers.values());
	for (const listener of listeners) {
		listener();
	}
}

function subscribe(listener: () => void): () => void {
	listeners.add(listener);

	return () => {
		listeners.delete(listener);
	};
}

function getWidest(): number {
	return widest;
}

function getWidestOnServer(): number {
	return 0;
}

/**
 * Reports that the caller covers the right side of the window over `width` pixels, counted from
 * the right edge, until `width` is `undefined` or the caller unmounts.
 *
 * @access private
 */
export function useCoverRightEdge(width: number | undefined): void {
	const [key] = useState(() => Symbol('right-edge-cover'));

	useIsomorphicLayoutEffect(() => {
		if (width === undefined || width <= 0) {
			return;
		}

		covers.set(key, width);
		notify();

		return () => {
			covers.delete(key);
			notify();
		};
	}, [key, width]);
}

/**
 * How many pixels, counted from the right edge of the window, the widest open panel covers. `0`
 * while none is open.
 *
 * @access private
 */
export function useRightEdgeCover(): number {
	return useSyncExternalStore(subscribe, getWidest, getWidestOnServer);
}
