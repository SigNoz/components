import { useEffect, useRef, useState } from 'react';
import { useTooltipConfig } from './tooltip-config-context.js';

// Time the pointer has to cross from the trigger to the popup, so the popup can be hovered.
const HOVER_GRACE_MS = 100;

/**
 * @access private
 */
export type TooltipLazyOpen = {
	/**
	 * The element the popup is placed against. The popup is mounted while it is set, which is from
	 * the moment it opens until it has finished closing, and never while there is no content.
	 */
	anchor: HTMLElement | null;
	/**
	 * Never true while there is no content, so the trigger is not described by a popup that is gone.
	 */
	open: boolean;
	enterTrigger: (element: HTMLElement) => void;
	moveOverTrigger: (element: HTMLElement) => void;
	leaveTrigger: () => void;
	enterPopup: () => void;
	leavePopup: () => void;
	/**
	 * Closes at once, and keeps it closed until the pointer comes back.
	 */
	dismiss: () => void;
	/**
	 * Unmounts the popup once it has finished closing.
	 */
	onClosed: () => void;
};

/**
 * When a tooltip with no Base UI trigger opens and closes. Hover opens it after the `delay` of the
 * provider, or at once while another tooltip of the provider is open or closed less than its
 * `timeout` ago. It stays open while the pointer is over the trigger or the popup, with a grace
 * period to cross from one to the other. The popup mounts only when it opens, and a trigger with
 * no content never opens.
 *
 * @access private
 */
export function useTooltipLazyOpen(hasContent: boolean): TooltipLazyOpen {
	const { delay, closeDelay, timeout, group } = useTooltipConfig();
	const [anchor, setAnchor] = useState<HTMLElement | null>(null);
	const [open, setOpen] = useState(false);
	const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
	const stateRef = useRef({ trigger: false, popup: false, open: false });
	const hasContentRef = useRef(hasContent);

	useEffect(() => {
		hasContentRef.current = hasContent;
	}, [hasContent]);

	useEffect(() => () => clearTimeout(timerRef.current), []);

	const cancel = (): void => clearTimeout(timerRef.current);

	const schedule = (wait: number, run: () => void): void => {
		cancel();

		if (wait === 0) {
			run();

			return;
		}

		timerRef.current = setTimeout(run, wait);
	};

	const show = (element: HTMLElement): void => {
		if (!hasContentRef.current) {
			return;
		}

		stateRef.current.open = true;
		setAnchor(element);
		setOpen(true);
	};

	const hide = (): void => {
		stateRef.current.open = false;
		setOpen(false);

		if (!hasContentRef.current) {
			setAnchor(null);
		}
	};

	const settle = (wait: number): void => {
		const state = stateRef.current;

		if (state.trigger || state.popup) {
			return;
		}

		if (state.open) {
			schedule(wait, hide);
		} else {
			cancel();
		}
	};

	const enterTrigger = (element: HTMLElement): void => {
		const state = stateRef.current;
		state.trigger = true;

		if (state.open) {
			cancel();
		} else if (hasContentRef.current) {
			schedule(group?.isInstant(timeout) ? 0 : delay, () => show(element));
		}
	};

	return {
		anchor: hasContent ? anchor : null,
		open: open && hasContent,
		enterTrigger,
		moveOverTrigger: (element) => {
			if (!stateRef.current.trigger) {
				enterTrigger(element);
			}
		},
		leaveTrigger: () => {
			stateRef.current.trigger = false;
			settle(Math.max(closeDelay, HOVER_GRACE_MS));
		},
		enterPopup: () => {
			const state = stateRef.current;
			state.popup = true;

			if (state.open) {
				cancel();
			}
		},
		leavePopup: () => {
			stateRef.current.popup = false;
			settle(Math.max(closeDelay, HOVER_GRACE_MS));
		},
		dismiss: () => {
			cancel();
			hide();
		},
		onClosed: () => {
			if (!stateRef.current.open) {
				setAnchor(null);
			}
		},
	};
}
