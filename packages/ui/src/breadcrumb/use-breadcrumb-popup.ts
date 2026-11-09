import { Popover } from '@base-ui/react/popover';
import { type RefObject, useCallback, useId, useRef, useState } from 'react';
import type { BreadcrumbPopupHandleType, BreadcrumbPopupPayloadType } from './types.js';

/**
 * @access private
 */
export type BreadcrumbPopupState = {
	handle: BreadcrumbPopupHandleType;
	onOpenChange: (open: boolean, eventDetails: Popover.Root.ChangeEventDetails) => void;
	/**
	 * The popup element, so a crumb can tell a focus that went into its card from one that left.
	 */
	popupRef: RefObject<HTMLDivElement>;
	/**
	 * The id of the trigger of the `...` crumb, which a `ForceOpenProvider` holds the popup open on.
	 */
	ellipsisTriggerId: string;
};

/**
 * The state of the popup the trail shares. `onOpenChange` keeps a list the `...` crumb was pressed
 * open from giving way to a hover or a focus on a crumb.
 *
 * @access private
 */
export function useBreadcrumbPopup(): BreadcrumbPopupState {
	const [handle] = useState(() => Popover.createHandle<BreadcrumbPopupPayloadType>());
	const popupRef = useRef<HTMLDivElement>(null);
	const ellipsisTriggerId = useId();
	const pressed = useRef(false);

	const onOpenChange = useCallback(
		(open: boolean, eventDetails: Popover.Root.ChangeEventDetails): void => {
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
		[handle],
	);

	return { handle, onOpenChange, popupRef, ellipsisTriggerId };
}
