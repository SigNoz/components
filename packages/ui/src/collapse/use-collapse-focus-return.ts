import { type FocusEvent, type RefObject, useRef } from 'react';
import { useIsomorphicLayoutEffect } from '../lib/use-isomorphic-layout-effect.js';

/**
 * Moves focus to the header button when a section closes while the focus is inside its panel,
 * for example when a parent sets `expanded` to `false` after a save, so it never falls to the
 * page body.
 *
 * Runs in a layout effect, before the browser moves focus out of a panel that `hidden` hides or
 * that unmounted. Focus that left the panel before it closed is left alone.
 *
 * @access private
 */
export function useCollapseFocusReturn(open: boolean): {
	triggerRef: RefObject<HTMLButtonElement>;
	panelRef: RefObject<HTMLDivElement>;
	panelFocusProps: {
		onFocus: () => void;
		onBlur: (event: FocusEvent<HTMLDivElement>) => void;
	};
} {
	const triggerRef = useRef<HTMLButtonElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);
	const isFocusInPanel = useRef(false);

	useIsomorphicLayoutEffect(() => {
		if (open || !isFocusInPanel.current) {
			return;
		}

		isFocusInPanel.current = false;

		const trigger = triggerRef.current;

		if (trigger == null) {
			return;
		}

		const { activeElement, body } = trigger.ownerDocument;
		const panel = panelRef.current;
		const isLost =
			activeElement == null ||
			activeElement === body ||
			!activeElement.isConnected ||
			(panel != null && panel.contains(activeElement));

		if (isLost) {
			trigger.focus();
		}
	}, [open]);

	return {
		triggerRef,
		panelRef,
		panelFocusProps: {
			onFocus: () => {
				isFocusInPanel.current = true;
			},
			onBlur: (event) => {
				if (!event.currentTarget.contains(event.relatedTarget)) {
					isFocusInPanel.current = false;
				}
			},
		},
	};
}
