import { useSyncExternalStore } from 'react';

// The store behind `Callout.CloseablePersisted` and `AlertStrip.CloseablePersisted`. Both read the
// same entries, so a callout and a strip with the same `storageKey` hide together.

// The value the SigNoz app already writes for its hand-rolled dismissals, so a migrated call site
// keeps the messages its users have closed.
const DISMISSED = 'true';

// Every mounted component, told when one of them saves a dismissal. The `storage` event only
// reaches the other tabs.
const listeners = new Set<() => void>();

// The keys closed in this session whose write the storage refused, so they stay hidden until a
// reload.
const closedInSession = new Set<string>();

function subscribeToDismissals(listener: () => void): () => void {
	listeners.add(listener);
	window.addEventListener('storage', listener);

	return () => {
		listeners.delete(listener);
		window.removeEventListener('storage', listener);
	};
}

function isDismissed(storageKey: string): boolean {
	if (closedInSession.has(storageKey)) {
		return true;
	}

	try {
		return window.localStorage.getItem(storageKey) === DISMISSED;
	} catch {
		// Storage can be blocked or missing, the component then behaves like its plain closeable.
		return false;
	}
}

// The server has no storage, so it renders the component, and hydration does the same. The saved
// entry takes over right after hydration, without a mismatch.
function isDismissedOnServer(): boolean {
	return false;
}

/**
 * Whether the entry under `storageKey` says the user dismissed it. It follows the entry: a
 * dismissal saved by another component with the same key, in this tab or another, and a new
 * `storageKey`.
 *
 * @access private
 */
export function useDismissed(storageKey: string): boolean {
	return useSyncExternalStore(
		subscribeToDismissals,
		() => isDismissed(storageKey),
		isDismissedOnServer,
	);
}

/**
 * Saves a dismissal under `storageKey` and tells every mounted component. Where storage is blocked
 * the dismissal lasts until a reload.
 *
 * @access private
 */
export function saveDismissal(storageKey: string): void {
	try {
		window.localStorage.setItem(storageKey, DISMISSED);
	} catch {
		closedInSession.add(storageKey);
	}

	for (const listener of listeners) {
		listener();
	}
}
