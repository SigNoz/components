import { type CSSProperties, type RefObject, useCallback, useEffect, useState } from 'react';
import type { BreadcrumbEllipsisOptions } from '../breadcrumb/types.js';
import {
	type CloseAnswer,
	type DrawerStackContextValue,
	useParentDrawerStack,
} from './drawer-stack-context.js';
import type {
	DrawerClosePositionType,
	DrawerCloseReasonType,
	DrawerCrumbType,
	DrawerStackType,
	DrawerTrailSelectReasonType,
	DrawerTrailStepType,
	DrawerTypeType,
} from './types.js';
import { useCommittedOpen } from './use-committed-open.js';
import { useElementWidth } from '../lib/use-element-width.js';
import { useInert } from './use-inert.js';
import { useLatestCallback } from './use-latest-callback.js';
import { useNestedDrawers } from './use-nested-drawers.js';
import { buildTrail, leaveTrail } from './utils.js';

type UseDrawerStackOptions = {
	stack: DrawerStackType | undefined;
	type: DrawerTypeType;
	title: string;
	crumb: DrawerCrumbType | undefined;
	steps: readonly DrawerTrailStepType[];
	onTrailSelect: ((index: number, reason: DrawerTrailSelectReasonType) => void) | undefined;
	trailEllipsis: BreadcrumbEllipsisOptions | undefined;
	closePosition: DrawerClosePositionType | undefined;
	isOpen: boolean;
	panel: HTMLElement | null;
	popupRef: RefObject<HTMLElement | null>;
	/**
	 * Asks this drawer alone to close, through `onClose` or the handle. Answers whether it agreed:
	 * `false` when `onClose` called `cancel()` or its promise rejected.
	 */
	requestClose: (reason: DrawerCloseReasonType) => CloseAnswer;
};

type DrawerStackState = {
	isNested: boolean;
	nestedIn: DrawerStackType | undefined;
	/**
	 * Whether it is a drawer of a breadcrumb trail after the first.
	 */
	inTrail: boolean;
	/**
	 * The type that sets the backdrop and the focus trap: the first drawer's in a breadcrumb trail.
	 */
	layerType: DrawerTypeType;
	/**
	 * Where its close button sits: the first drawer's in a breadcrumb trail.
	 */
	closePosition: DrawerClosePositionType;
	/**
	 * Its own `stack` while a nested drawer is open over it.
	 */
	covered: DrawerStackType | undefined;
	/**
	 * Whether the drawers open over it are all inspectors, which leave it usable.
	 */
	coveredByInspector: boolean;
	style: CSSProperties | undefined;
	value: DrawerStackContextValue;
	/**
	 * In a trail, `Esc` is a step back and every other reason leaves the whole trail, the drawer on
	 * top first. Every drawer open over one that closes is asked to close before it.
	 */
	requestCloseFromPanel: (reason: DrawerCloseReasonType) => void;
};

/**
 * How a drawer stacks with the drawers it is declared in and the ones declared inside it: the
 * breadcrumb trail it ends, its width from its parent, and whether a nested drawer covers it. Under
 * a task or a step of its trail it takes no input; under an inspector overlay it stays usable.
 * Before it closes, or shows an earlier step of its own `trail`, it asks the drawers open over it
 * to close, the one on top first, so each one gets its own `onClose`, and it stays open when one of
 * them calls `cancel()`.
 *
 * @access private
 */
export function useDrawerStack({
	stack,
	type,
	title,
	crumb,
	steps,
	onTrailSelect,
	trailEllipsis,
	closePosition,
	isOpen,
	panel,
	popupRef,
	requestClose,
}: UseDrawerStackOptions): DrawerStackState {
	const resolvedStack = stack === 'breadcrumb' ? 'breadcrumb' : 'overlay';
	const parent = useParentDrawerStack();
	const trailParent = parent?.stack === 'breadcrumb' ? parent : null;
	// A trail is one drawer to the user, so its first drawer sets the backdrop, the focus trap and
	// where the close button sits.
	const layerType = trailParent?.trailType ?? type;
	const resolvedClosePosition =
		trailParent?.trailClosePosition ?? (closePosition === 'start' ? 'start' : 'end');

	const readIsOpen = useCommittedOpen(isOpen);
	const { nest, closeNested, closeWithNested } = useNestedDrawers({
		nestInParent: parent?.nest,
		isOpen,
		readIsOpen,
		requestClose,
	});
	// The drawers nested in this one close in a `flushSync` that renders the app again, so the
	// `onTrailSelect` of the render a step was built in may read state that is gone by then.
	const selectStep = useLatestCallback(onTrailSelect);
	const trail = buildTrail({
		parentTrail: trailParent?.trail ?? [],
		steps,
		crumb,
		title,
		close: closeWithNested,
		closeNested,
		isOpen: readIsOpen,
		onTrailSelect: selectStep,
	});

	const requestCloseFromPanel = (reason: DrawerCloseReasonType): void => {
		if (reason === 'escape-key' && steps.length > 0) {
			onTrailSelect?.(steps.length - 1, reason);
			return;
		}
		if (trail.length === 1 || reason === 'escape-key') {
			void closeWithNested(reason);
			return;
		}
		leaveTrail(trail, reason);
	};

	const [blockingCoverCount, setBlockingCoverCount] = useState(0);
	const [inspectorCoverCount, setInspectorCoverCount] = useState(0);
	const cover = useCallback((blocksInput: boolean) => {
		const setCount = blocksInput ? setBlockingCoverCount : setInspectorCoverCount;
		setCount((count) => count + 1);
		return () => {
			setCount((count) => count - 1);
		};
	}, []);
	const isCovered = blockingCoverCount > 0 || inspectorCoverCount > 0;
	useInert(popupRef, blockingCoverCount > 0);

	const coverParent = parent?.cover;
	// A step of a trail hides the drawer it opens from, and a task is modal. An inspector overlay
	// leaves the drawer under it usable, as it leaves the page.
	const blocksParent = layerType === 'task' || trailParent !== null;
	useEffect(() => {
		if (!isOpen || !coverParent) {
			return undefined;
		}

		return coverParent(blocksParent);
	}, [isOpen, coverParent, blocksParent]);

	const parentWidth = useElementWidth(parent?.panel ?? null);

	return {
		isNested: parent !== null,
		nestedIn: parent?.stack,
		inTrail: trailParent !== null,
		layerType,
		closePosition: resolvedClosePosition,
		covered: isCovered ? resolvedStack : undefined,
		coveredByInspector: blockingCoverCount === 0 && inspectorCoverCount > 0,
		style:
			parentWidth === undefined
				? undefined
				: ({ '--drawer-internal-stack-inline-size': `${parentWidth}px` } as CSSProperties),
		value: {
			stack: resolvedStack,
			panel,
			trail,
			trailType: layerType,
			trailEllipsis: trailParent ? trailParent.trailEllipsis : trailEllipsis,
			trailClosePosition: resolvedClosePosition,
			cover,
			nest,
		},
		requestCloseFromPanel,
	};
}
