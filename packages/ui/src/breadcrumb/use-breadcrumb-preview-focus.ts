import { type FocusEvent, useEffect, useRef } from 'react';
import { POPOVER_HOVER_DELAY } from '../popover/constants.js';
import type { BreadcrumbPopupState } from './use-breadcrumb-popup.js';

/**
 * @access private
 */
export type BreadcrumbPreviewFocus = {
	onFocus: (event: FocusEvent<HTMLElement>) => void;
	onBlur: (event: FocusEvent<HTMLElement>) => void;
};

/**
 * Opens the card of a crumb while the keyboard focus is on it, which a Base UI popover trigger does
 * not do by itself: it opens on hover and on a press, and a crumb takes no press.
 *
 * A focus that a click or a tap put there opens nothing, only one `:focus-visible` matches. The card
 * closes with the focus leaving its crumb, unless the focus went into the card, or to another crumb,
 * which has moved the popup to itself by then.
 *
 * @access private
 */
export function useBreadcrumbPreviewFocus(
	{ handle, popupRef }: BreadcrumbPopupState,
	triggerId: string,
): BreadcrumbPreviewFocus {
	const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	useEffect(() => () => clearTimeout(timeout.current), []);

	return {
		onFocus: (event) => {
			clearTimeout(timeout.current);

			if (!event.currentTarget.matches(':focus-visible')) {
				return;
			}

			if (handle.isOpen) {
				handle.open(triggerId);

				return;
			}

			timeout.current = setTimeout(() => handle.open(triggerId), POPOVER_HOVER_DELAY);
		},
		onBlur: (event) => {
			clearTimeout(timeout.current);

			// Base UI gives the popup `tabindex="-1"`, so a press anywhere in the card takes the focus
			// from the crumb before its click lands.
			if (popupRef.current?.contains(event.relatedTarget as Node | null)) {
				return;
			}

			const crumb = event.currentTarget;

			timeout.current = setTimeout(() => {
				if (
					crumb.hasAttribute('data-popup-open') &&
					!popupRef.current?.contains(crumb.ownerDocument.activeElement)
				) {
					handle.close();
				}
			}, 0);
		},
	};
}
