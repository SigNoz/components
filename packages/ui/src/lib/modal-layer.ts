import { useState, useSyncExternalStore } from 'react';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect.js';

// The open layers that put a backdrop over the whole page, such as a `Dialog`. A `Toaster` reads
// whether there is one, so its stacks drop the space they keep for the page's own chrome, which the
// backdrop covers.

const layers = new Set<symbol>();
const listeners = new Set<() => void>();

function notify(): void {
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

function hasLayer(): boolean {
	return layers.size > 0;
}

function hasLayerOnServer(): boolean {
	return false;
}

/**
 * Reports that the caller is a modal layer while `isOpen` is `true`, until it turns `false` or the
 * caller unmounts. Pass `false` for a layer that leaves the page usable, such as an inspector
 * `Drawer`.
 *
 * @access private
 */
export function useReportModalLayer(isOpen: boolean): void {
	const [key] = useState(() => Symbol('modal-layer'));

	useIsomorphicLayoutEffect(() => {
		if (!isOpen) {
			return;
		}

		layers.add(key);
		notify();

		return () => {
			layers.delete(key);
			notify();
		};
	}, [key, isOpen]);
}

/**
 * Whether any modal layer is open.
 *
 * @access private
 */
export function useIsModalLayerOpen(): boolean {
	return useSyncExternalStore(subscribe, hasLayer, hasLayerOnServer);
}
