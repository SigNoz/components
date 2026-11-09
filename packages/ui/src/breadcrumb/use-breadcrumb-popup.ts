import { useCallback, useId, useRef } from 'react';
import { useForceOpen } from '../lib/force-open.js';
import type { PopoverProps } from '../popover/types.js';
import { usePopoverHandle } from '../popover/use-popover-handle.js';
import type { BreadcrumbPopupHandleType, BreadcrumbPopupPayloadType } from './types.js';

type OpenChangeDetails = Parameters<NonNullable<PopoverProps['onOpenChange']>>[1];

/**
 * @access private
 */
export type BreadcrumbPopupState = {
	handle: BreadcrumbPopupHandleType;
	onOpenChange: (open: boolean, eventDetails: OpenChangeDetails) => void;
	/**
	 * The id of the trigger of the `...` crumb, which a `ForceOpenProvider` holds the popup open on.
	 */
	ellipsisTriggerId: string;
	/**
	 * Whether a `ForceOpenProvider` holds the popup on the list of the `...` crumb.
	 */
	forced: boolean;
};

/**
 * The state of the popup the trail shares. `onOpenChange` keeps a list the `...` crumb was pressed
 * open from giving way to a hover or a focus on a crumb, and under a `ForceOpenProvider` keeps it
 * on that list.
 *
 * @access private
 */
export function useBreadcrumbPopup(): BreadcrumbPopupState {
	const handle = usePopoverHandle<BreadcrumbPopupPayloadType>();
	const ellipsisTriggerId = useId();
	const forced = useForceOpen();
	const pressed = useRef(false);

	const onOpenChange = useCallback(
		(open: boolean, eventDetails: OpenChangeDetails): void => {
			// Held: nothing closes the list, and no crumb takes the popup from it.
			if (forced) {
				if (!open || eventDetails.trigger?.id !== ellipsisTriggerId) {
					eventDetails.cancel();
				}

				return;
			}

			if (!open) {
				pressed.current = false;

				return;
			}

			if (eventDetails.reason === 'trigger-press') {
				pressed.current = true;

				return;
			}

			// Before the change lands, `isOpen` still says what is shown now. A press that outlived its
			// popup (its root unmounted with it open) holds nothing.
			if (pressed.current && handle.isOpen) {
				eventDetails.cancel();

				return;
			}

			pressed.current = false;
		},
		[handle, forced, ellipsisTriggerId],
	);

	return { handle, onOpenChange, ellipsisTriggerId, forced };
}
