import * as React from 'react';

/**
 * Shim for the events Radix passed to `onPointerDownOutside`, `onFocusOutside`
 * and `onInteractOutside`. Base UI reports outside interactions through the
 * root's `onOpenChange` event details instead, so this rebuilds the surface
 * callers actually used: reading the originating event, and cancelling the
 * dismissal via `preventDefault()`.
 */
export interface OutsideEvent {
	readonly type: 'pointerdownoutside' | 'focusoutside' | 'interactoutside';
	readonly detail: { readonly originalEvent: Event | undefined };
	readonly defaultPrevented: boolean;
	preventDefault(): void;
}

/**
 * Dismissal callbacks our `*Content` components accept as public props. Radix
 * exposed these on the content element; Base UI reports them on the root, so
 * they are registered upwards through {@link useRegisterDismissHandlers}.
 */
export interface DismissHandlers {
	onEscapeKeyDown?: (event: KeyboardEvent) => void;
	onPointerDownOutside?: (event: OutsideEvent) => void;
	onFocusOutside?: (event: OutsideEvent) => void;
	onInteractOutside?: (event: OutsideEvent) => void;
}

/**
 * Structural subset of Base UI's `onOpenChange` event details, declared here so
 * this helper stays independent of any single primitive's `reason` union.
 */
export interface DismissEventDetails {
	reason: string;
	event: Event | undefined;
	cancel: () => void;
}

export type DismissRegistry = React.MutableRefObject<DismissHandlers>;

const DismissRegistryContext = React.createContext<DismissRegistry | null>(null);

/**
 * Creates the registry a root component hands to {@link DismissRegistryProvider}.
 */
export function useDismissRegistry(): DismissRegistry {
	return React.useRef<DismissHandlers>({});
}

export function DismissRegistryProvider({
	registry,
	children,
}: {
	registry: DismissRegistry;
	children?: React.ReactNode;
}) {
	return (
		<DismissRegistryContext.Provider value={registry}>{children}</DismissRegistryContext.Provider>
	);
}

/**
 * Registers a content component's dismissal callbacks with the nearest root.
 * Deliberately runs on every render so the root always invokes the callbacks
 * from the latest render rather than the ones captured at mount.
 */
export function useRegisterDismissHandlers(handlers: DismissHandlers): void {
	const registry = React.useContext(DismissRegistryContext);

	React.useEffect(() => {
		if (registry === null) {
			return undefined;
		}
		registry.current = handlers;
		return () => {
			registry.current = {};
		};
	});
}

/**
 * Bridges a Base UI `onOpenChange` event to the registered callbacks, cancelling
 * Base UI's own dismissal when a callback calls `preventDefault()`.
 *
 * `close-watcher` is treated as an escape: browsers with `CloseWatcher` support
 * report Escape under that reason instead of `escape-key`. `focus-out` covers
 * what Radix reported as a focus moving outside the layer.
 */
export function runDismissHandlers(
	registry: DismissRegistry,
	open: boolean,
	details: DismissEventDetails,
): void {
	if (open) {
		return;
	}

	const { onEscapeKeyDown, onPointerDownOutside, onFocusOutside, onInteractOutside } =
		registry.current;

	if (onEscapeKeyDown && (details.reason === 'escape-key' || details.reason === 'close-watcher')) {
		const event = details.event as KeyboardEvent | undefined;
		if (event === undefined) {
			return;
		}
		const preventedBefore = event.defaultPrevented;
		onEscapeKeyDown(event);
		if (event.defaultPrevented && !preventedBefore) {
			details.cancel();
		}
		return;
	}

	const specific =
		details.reason === 'outside-press'
			? ([onPointerDownOutside, 'pointerdownoutside'] as const)
			: details.reason === 'focus-out'
				? ([onFocusOutside, 'focusoutside'] as const)
				: undefined;

	if (specific === undefined) {
		return;
	}

	let prevented = false;
	const notify = (
		handler: ((event: OutsideEvent) => void) | undefined,
		type: OutsideEvent['type'],
	) => {
		handler?.({
			type,
			detail: { originalEvent: details.event },
			get defaultPrevented() {
				return prevented;
			},
			preventDefault() {
				prevented = true;
			},
		});
	};

	notify(specific[0], specific[1]);
	notify(onInteractOutside, 'interactoutside');

	if (prevented) {
		details.cancel();
	}
}
