import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useId,
	useMemo,
	useState,
} from 'react';
import { useIsInsideTooltipTrigger } from './tooltip-trigger-context.js';

/**
 * One piece of content inside a tooltip popup. A tooltip renders its own content
 * first and every registered entry after it, with a divider in between.
 *
 * @access private
 */
export type TooltipContentStackEntry = {
	id: string;
	content: ReactNode;
};

type TooltipContentStackApi = {
	/**
	 * True once a tooltip above collects content. Components that would open a
	 * tooltip of their own add to that one instead of anchoring a second tooltip
	 * to the same element.
	 */
	hasStack: boolean;
	register: (id: string, content: ReactNode) => void;
	unregister: (id: string) => void;
};

const NO_ENTRIES: TooltipContentStackEntry[] = [];

/**
 * Whether a node is worth opening a tooltip for. `null`, `undefined`, `false` and
 * an empty string all render nothing, so they are treated as no content at all.
 *
 * @access private
 */
export function hasTooltipContent(content: ReactNode): boolean {
	return content != null && content !== false && content !== '';
}

const noop = (): void => {};

// The API is split from the entries so that the components adding content do not
// re-render when the content of the stack changes: only the tooltip rendering the
// popup reads the entries.
const TooltipContentStackApiContext = createContext<TooltipContentStackApi>({
	hasStack: false,
	register: noop,
	unregister: noop,
});

const TooltipContentStackEntriesContext = createContext<TooltipContentStackEntry[]>(NO_ENTRIES);

/**
 * True when a `TooltipContentStackProvider` is already above in the tree.
 *
 * @access private
 */
export function useHasTooltipContentStack(): boolean {
	return useContext(TooltipContentStackApiContext).hasStack;
}

/**
 * @access private
 */
export function TooltipContentStackProvider({ children }: { children: ReactNode }): ReactNode {
	const [entries, setEntries] = useState<TooltipContentStackEntry[]>(NO_ENTRIES);

	const api = useMemo<TooltipContentStackApi>(
		() => ({
			hasStack: true,
			register: (id, content) =>
				setEntries((current) => {
					const index = current.findIndex((entry) => entry.id === id);

					if (index === -1) {
						return [...current, { id, content }];
					}

					if (current[index]?.content === content) {
						return current;
					}

					const next = current.slice();
					next[index] = { id, content };

					return next;
				}),
			unregister: (id) =>
				setEntries((current) =>
					current.some((entry) => entry.id === id)
						? current.filter((entry) => entry.id !== id)
						: current,
				),
		}),
		[],
	);

	return (
		<TooltipContentStackApiContext.Provider value={api}>
			<TooltipContentStackEntriesContext.Provider value={entries}>
				{children}
			</TooltipContentStackEntriesContext.Provider>
		</TooltipContentStackApiContext.Provider>
	);
}

/**
 * @access private
 */
export function TooltipContentStackProviderIfMissing({
	children,
}: {
	children: ReactNode;
}): ReactNode {
	const hasStack = useHasTooltipContentStack();

	if (hasStack) {
		return children;
	}

	return <TooltipContentStackProvider>{children}</TooltipContentStackProvider>;
}

/**
 * The content other components stacked onto this tooltip, in mount order.
 *
 * @access private
 */
export function useTooltipContentStackEntries(): TooltipContentStackEntry[] {
	return useContext(TooltipContentStackEntriesContext);
}

/**
 * Adds `content` to the tooltip above when the caller sits inside its trigger,
 * and reports whether it did. A caller that is stacked renders nothing itself:
 * its content shows up in the popup of the tooltip it is inside.
 *
 * @access private
 */
export function useRegisterTooltipContent(content: ReactNode): boolean {
	const { hasStack, register, unregister } = useContext(TooltipContentStackApiContext);
	const insideTrigger = useIsInsideTooltipTrigger();
	const id = useId();
	const stacked = hasStack && insideTrigger;

	useEffect(() => {
		if (!stacked || !hasTooltipContent(content)) {
			unregister(id);

			return;
		}

		register(id, content);
	}, [stacked, content, id, register, unregister]);

	useEffect(() => () => unregister(id), [id, unregister]);

	return stacked;
}
