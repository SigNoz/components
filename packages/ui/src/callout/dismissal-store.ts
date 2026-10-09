// The store behind `Callout.CloseablePersisted`, read through `useSyncExternalStore`.

// The value the SigNoz app already writes for its hand-rolled dismissals, so a migrated call site
// keeps the callouts its users have closed.
const DISMISSED = 'true';

// Every mounted callout, told when one of them saves a dismissal. The `storage` event only reaches
// the other tabs.
const listeners = new Set<() => void>();

// The keys closed in this session whose write the storage refused, so they stay hidden until a
// reload.
const closedInSession = new Set<string>();

/**
 * @access private
 */
export function subscribeToDismissals(listener: () => void): () => void {
	listeners.add(listener);
	window.addEventListener('storage', listener);

	return () => {
		listeners.delete(listener);
		window.removeEventListener('storage', listener);
	};
}

/**
 * @access private
 */
export function isDismissed(storageKey: string): boolean {
	if (closedInSession.has(storageKey)) {
		return true;
	}

	try {
		return window.localStorage.getItem(storageKey) === DISMISSED;
	} catch {
		// Storage can be blocked or missing, the callout then behaves like `Callout.Closeable`.
		return false;
	}
}

/**
 * The server has no storage, so it renders the callout, and hydration does the same. The saved
 * entry takes over right after hydration, without a mismatch.
 *
 * @access private
 */
export function isDismissedOnServer(): boolean {
	return false;
}

/**
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
