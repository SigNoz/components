import { useInsertionEffect, useState, useSyncExternalStore } from 'react';

/**
 * What a popup is positioned against when it is shown imperatively: an element, a rectangle, or
 * a point in viewport coordinates.
 *
 * A point is the case a chart click produces: there is no element at the pointer, only an `x`
 * and a `y`.
 */
export type PopupAnchorTarget = Element | DOMRect | { x: number; y: number };

/**
 * @access private
 */
export interface PopupHandleState<Payload> {
	open: boolean;
	anchor: PopupAnchorTarget | null;
	payload: Payload | undefined;
}

const CLOSED: PopupHandleState<never> = { open: false, anchor: null, payload: undefined };

/**
 * The open state of a popup shown from outside React, and the subscription React reads it
 * through. `PopupHandle` and `DialogHandle` add the method that shows their popup.
 *
 * The state lives outside React so the popup can be shown from an event handler, a chart
 * callback or an effect. The component subscribes to it.
 *
 * @access private
 */
export abstract class OpenStateStore<State extends { open: boolean }> {
	private state: State;

	private listeners = new Set<() => void>();

	private openListener: ((open: boolean) => void) | undefined;

	protected constructor(initial: State) {
		this.state = initial;
	}

	/**
	 * Hides the popup. What it was shown with is kept until it is shown again, so a closing
	 * animation still has something to render.
	 */
	close(): void {
		if (!this.state.open) {
			return;
		}

		this.set({ ...this.state, open: false });
	}

	/**
	 * Whether the popup is currently shown.
	 */
	get isOpen(): boolean {
		return this.state.open;
	}

	/**
	 * Opens or closes and keeps everything else, for a press on the component's own trigger or a
	 * close request from inside it.
	 *
	 * @access private
	 */
	setOpen(open: boolean): void {
		if (open === this.state.open) {
			return;
		}

		this.set({ ...this.state, open });
	}

	/**
	 * @access private
	 */
	subscribe = (listener: () => void): (() => void) => {
		this.listeners.add(listener);

		return () => {
			this.listeners.delete(listener);
		};
	};

	/**
	 * @access private
	 */
	getSnapshot = (): State => this.state;

	/**
	 * @access private
	 */
	setOpenListener(listener: ((open: boolean) => void) | undefined): void {
		this.openListener = listener;
	}

	protected set(next: State): void {
		const wasOpen = this.state.open;

		this.state = next;
		for (const listener of this.listeners) {
			listener();
		}

		if (next.open !== wasOpen) {
			this.openListener?.(next.open);
		}
	}
}

/**
 * Shows a popup that no trigger press can produce, and closes one whose trigger cannot know it is
 * finished.
 *
 * The surface it serves is one the application already knows about: a click that landed at a
 * point on a chart, an input that took focus, a row the pointer entered, a save that succeeded.
 * `showAt` says where to put it and what to put in it; `close` dismisses it.
 */
export class PopupHandle<Payload = void> extends OpenStateStore<PopupHandleState<Payload>> {
	constructor() {
		super(CLOSED as PopupHandleState<Payload>);
	}

	/**
	 * Shows the popup against `target`, rendering `payload` as its content.
	 *
	 * Calling it again while open moves the popup and swaps the content, which is what a hover
	 * card walking down a list of rows does.
	 */
	showAt(target: PopupAnchorTarget, payload?: Payload): void {
		this.set({ open: true, anchor: target, payload });
	}
}

/**
 * Creates a store that lives for as long as the component that owns it, and reports every open
 * and close to `onOpenChange`.
 *
 * @access private
 */
export function useOpenStateStore<Store extends OpenStateStore<{ open: boolean }>>(
	create: () => Store,
	onOpenChange: ((open: boolean) => void) | undefined,
): Store {
	const [store] = useState(create);

	// An insertion effect, not a layout effect: React runs every insertion effect of a commit
	// before any layout effect, so a layout effect of a child that opens the store, on mount or
	// on an update, already reaches the `onOpenChange` of this render. A layout effect here
	// would run after the child's, and its cleanup would leave the store with no listener at
	// the moment the child opens it.
	useInsertionEffect(() => {
		store.setOpenListener(onOpenChange);

		return () => store.setOpenListener(undefined);
	}, [store, onOpenChange]);

	return store;
}

/**
 * Subscribes to a store's state, or reports `closed` when there is no store.
 *
 * @access private
 */
export function useOpenStateSnapshot<State extends { open: boolean }>(
	store: OpenStateStore<State> | undefined,
	closed: State,
): State {
	const subscribe = store?.subscribe ?? noopSubscribe;
	const getSnapshot = store?.getSnapshot ?? (() => closed);

	return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * Creates a {@link PopupHandle} that lives for as long as the component that owns it.
 *
 * `onOpenChange` is called whenever the popup opens or closes, whichever caused it: `showAt`,
 * `close`, a press on the component's own trigger, Escape, or an outside press.
 *
 * @access private
 */
export function usePopupHandle<Payload = void>(
	onOpenChange?: (open: boolean) => void,
): PopupHandle<Payload> {
	return useOpenStateStore(() => new PopupHandle<Payload>(), onOpenChange);
}

/**
 * Subscribes to a handle's state, or reports a closed popup when there is no handle.
 *
 * @access private
 */
export function usePopupHandleState<Payload>(
	handle: PopupHandle<Payload> | undefined,
): PopupHandleState<Payload> {
	return useOpenStateSnapshot(handle, CLOSED as PopupHandleState<Payload>);
}

function noopSubscribe(): () => void {
	return () => {};
}

/**
 * Where a dismissal is heading: the element pressed, or for a focus move the element focus is
 * going to. A `focus-out` event names the element *losing* focus, which is the anchor itself, so
 * reading `target` there would call every focus move a move inside the anchor.
 *
 * `undefined` for the reasons that are not a press or a focus move, such as Escape, which no
 * anchor should hold open.
 *
 * @access private
 */
export function dismissedTowards(details: {
	reason?: string | undefined;
	event?: Event | undefined;
}): EventTarget | null | undefined {
	if (details.reason === 'focus-out') {
		return (details.event as FocusEvent | undefined)?.relatedTarget;
	}

	return details.reason === 'outside-press' ? details.event?.target : undefined;
}

/**
 * Whether an event landed inside the element a popup was shown at.
 *
 * The anchor is neither the trigger nor the popup, so Base UI reports a press on it as a press
 * outside. For the field a typeahead belongs to, or the row a card follows, it is the surface the
 * popup is for.
 *
 * @access private
 */
export function isEventInsideAnchor(
	anchor: PopupAnchorTarget | null | undefined,
	target: EventTarget | null | undefined,
): boolean {
	return anchor instanceof Element && target instanceof Node && anchor.contains(target);
}

/**
 * Turns an anchor target into something Base UI's positioner accepts. An element is passed
 * through; a rectangle or a point becomes a virtual element, which is how a popup is placed where
 * nothing exists.
 *
 * @access private
 */
export function resolveAnchorTarget(
	target: PopupAnchorTarget | null | undefined,
): Element | { getBoundingClientRect: () => DOMRect } | undefined {
	if (target == null) {
		return undefined;
	}

	if (target instanceof Element) {
		return target;
	}

	const rect = target instanceof DOMRect ? target : new DOMRect(target.x, target.y, 0, 0);

	return { getBoundingClientRect: () => rect };
}
