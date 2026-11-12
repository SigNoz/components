import { type FocusEvent, type RefObject, useCallback, useEffect, useRef } from 'react';
import { containsNode } from './focus-leave.js';

/**
 * The `onBlur` of a control that is a trigger plus a portalled popup, which fires once when the
 * focus has left the two of them, not each time it crosses from one to the other.
 *
 * Base UI moves the focus out of the trigger into the popup on open, back on close, and from the
 * last row through focus guards on `Tab`, so a blur whose `relatedTarget` is inside either part is
 * ignored. Any other blur is judged one task later, once the guards have handed the focus on: it
 * counts only if `document.activeElement` is still outside both parts. That is also why a row that
 * unmounts under the focus, which Chrome reports as a blur with no `relatedTarget`, stays quiet
 * when the popup takes the focus back.
 *
 * A press outside the open popup counts whatever the focus does next. Base UI gives it back to the
 * trigger when the press lands on something that cannot take it, and how soon depends on the exit
 * animation, so the focus alone would make the blur fire or not by timing. A blur that goes from
 * one part to the other ends that press: nothing left the control, so a later blur is judged by the
 * focus alone again.
 *
 * React clears the `currentTarget` of an event once its dispatch is over, and the call comes after
 * that. So the handler gets an object that reads through to the dispatched event, with
 * `currentTarget` set to the wrapper: the element the `onBlur` belongs to, whichever part the blur
 * came from.
 *
 * `handleBlur` goes on the element that wraps the trigger and on the popup, `rootRef` on that
 * wrapper, or on the trigger itself for a control with no wrapper, and `popupRef` on the popup.
 * `trackOpenChange` takes every open change of the popup.
 *
 * @access private
 */
export function useControlBlur<Root extends HTMLElement = HTMLDivElement>(
	onBlur: ((event: FocusEvent<HTMLElement>) => void) | undefined,
): {
	rootRef: RefObject<Root>;
	popupRef: RefObject<HTMLDivElement>;
	handleBlur: (event: FocusEvent<HTMLElement>) => void;
	trackOpenChange: (open: boolean, reason: string) => void;
} {
	const rootRef = useRef<Root>(null);
	const popupRef = useRef<HTMLDivElement>(null);
	const onBlurRef = useRef(onBlur);
	const pendingRef = useRef<number | null>(null);
	const closedByPressRef = useRef(false);

	useEffect(() => {
		onBlurRef.current = onBlur;
	});

	useEffect(
		() => () => {
			if (pendingRef.current !== null) {
				window.clearTimeout(pendingRef.current);
			}
		},
		[],
	);

	const isInside = useCallback((node: EventTarget | null): boolean => {
		return containsNode(rootRef.current, node) || containsNode(popupRef.current, node);
	}, []);

	const handleBlur = useCallback(
		(event: FocusEvent<HTMLElement>): void => {
			if (onBlurRef.current === undefined || pendingRef.current !== null) {
				return;
			}

			if (isInside(event.relatedTarget)) {
				closedByPressRef.current = false;
				return;
			}

			const root = rootRef.current ?? event.currentTarget;
			const { ownerDocument } = root;
			const deferredEvent = Object.create(event, {
				currentTarget: { value: root, enumerable: true },
			}) as FocusEvent<HTMLElement>;

			pendingRef.current = window.setTimeout(() => {
				pendingRef.current = null;

				const closedByPress = closedByPressRef.current;

				closedByPressRef.current = false;

				if (closedByPress || !isInside(ownerDocument.activeElement)) {
					onBlurRef.current?.(deferredEvent);
				}
			}, 0);
		},
		[isInside],
	);

	const trackOpenChange = useCallback((open: boolean, reason: string): void => {
		if (open) {
			closedByPressRef.current = false;
		} else if (reason === 'outside-press') {
			closedByPressRef.current = true;
		}
	}, []);

	return { rootRef, popupRef, handleBlur, trackOpenChange };
}
