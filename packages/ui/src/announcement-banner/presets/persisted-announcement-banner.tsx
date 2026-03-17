import React, { useCallback, useState } from 'react';

import { AnnouncementBanner, type AnnouncementBannerProps } from '../announcement-banner.js';

/**
 * Announcement banner that persists its dismiss state in localStorage.
 * Once dismissed, the banner stays hidden until the storage key changes.
 *
 * @example
 * ```tsx
 * <PersistedAnnouncementBanner
 *   storageKey="my-app-announcement-v1"
 *   type="info"
 *   onDismiss={() => console.log('Dismissed')}
 * >
 *   This banner persists its dismiss state across page reloads.
 * </PersistedAnnouncementBanner>
 * ```
 */
export type PersistedAnnouncementBannerProps = AnnouncementBannerProps & {
	/**
	 * The key to use for the localStorage item.
	 */
	storageKey: string;
	/**
	 * The callback to call when the banner is dismissed.
	 */
	onDismiss?: () => void;
};

function isDismissed(storageKey: string): boolean {
	return localStorage.getItem(storageKey) === 'true';
}

export const PersistedAnnouncementBanner = React.forwardRef<
	HTMLDivElement,
	PersistedAnnouncementBannerProps
>(({ storageKey, onDismiss, ...props }, ref) => {
	const [visible, setVisible] = useState(() => !isDismissed(storageKey));

	const handleClose = useCallback((): void => {
		localStorage.setItem(storageKey, 'true');
		setVisible(false);
		onDismiss?.();
	}, [storageKey, onDismiss]);

	if (!visible) {
		return null;
	}

	return <AnnouncementBanner ref={ref} {...props} onClose={handleClose} />;
});
