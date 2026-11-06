import { useSyncExternalStore } from 'react';
import { isMacPlatform } from './utils.js';

function subscribe(): () => void {
	return () => {};
}

function getServerSnapshot(): boolean {
	return false;
}

/**
 * Whether the platform modifier is `⌘`. `false` on the server and during hydration, so the
 * markup matches, then the real value.
 *
 * @access private
 */
export function useIsMac(): boolean {
	return useSyncExternalStore(subscribe, isMacPlatform, getServerSnapshot);
}
