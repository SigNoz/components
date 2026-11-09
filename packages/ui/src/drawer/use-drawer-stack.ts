import { type CSSProperties, type RefObject, useCallback, useEffect, useState } from 'react';
import type { BreadcrumbEllipsisOptions } from '../breadcrumb/types.js';
import { type DrawerStackContextValue, useParentDrawerStack } from './drawer-stack-context.js';
import type {
	DrawerCloseReasonType,
	DrawerCrumbType,
	DrawerStackType,
	DrawerTrailSelectReasonType,
	DrawerTrailStepType,
	DrawerTypeType,
} from './types.js';
import { useCommittedOpen } from './use-committed-open.js';
import { useElementWidth } from './use-element-width.js';
import { useInert } from './use-inert.js';
import { buildTrail, leaveTrail } from './utils.js';

type UseDrawerStackOptions = {
	stack: DrawerStackType | undefined;
	type: DrawerTypeType;
	title: string;
	crumb: DrawerCrumbType | undefined;
	steps: readonly DrawerTrailStepType[];
	onTrailSelect: ((index: number, reason: DrawerTrailSelectReasonType) => void) | undefined;
	trailEllipsis: BreadcrumbEllipsisOptions | undefined;
	isOpen: boolean;
	panel: HTMLElement | null;
	popupRef: RefObject<HTMLElement | null>;
	/**
	 * Asks this drawer alone to close, through `onClose` or the handle.
	 */
	requestClose: (reason: DrawerCloseReasonType) => void;
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
	 * Its own `stack` while a nested drawer is open over it.
	 */
	covered: DrawerStackType | undefined;
	style: CSSProperties | undefined;
	value: DrawerStackContextValue;
	/**
	 * In a trail, `Esc` is a step back and every other reason leaves the whole trail, the drawer on
	 * top first.
	 */
	requestCloseFromPanel: (reason: DrawerCloseReasonType) => void;
};

/**
 * How a drawer stacks with the drawers it is declared in and the ones declared inside it: the
 * breadcrumb trail it ends, its width from its parent, and whether a nested drawer covers it, in
 * which case it takes no input.
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
	isOpen,
	panel,
	popupRef,
	requestClose,
}: UseDrawerStackOptions): DrawerStackState {
	const resolvedStack = stack === 'breadcrumb' ? 'breadcrumb' : 'overlay';
	const parent = useParentDrawerStack();
	const trailParent = parent?.stack === 'breadcrumb' ? parent : null;
	// A trail is one drawer to the user, so its first drawer sets the backdrop and the focus trap.
	const layerType = trailParent?.trailType ?? type;

	const readIsOpen = useCommittedOpen(isOpen);
	const trail = buildTrail({
		parentTrail: trailParent?.trail ?? [],
		steps,
		crumb,
		title,
		close: requestClose,
		isOpen: readIsOpen,
		onTrailSelect,
	});

	const requestCloseFromPanel = (reason: DrawerCloseReasonType): void => {
		if (reason === 'escape-key' && steps.length > 0) {
			onTrailSelect?.(steps.length - 1, reason);
			return;
		}
		if (trail.length === 1 || reason === 'escape-key') {
			requestClose(reason);
			return;
		}
		leaveTrail(trail, reason);
	};

	const [coverCount, setCoverCount] = useState(0);
	const cover = useCallback(() => {
		setCoverCount((count) => count + 1);
		return () => {
			setCoverCount((count) => count - 1);
		};
	}, []);
	const isCovered = coverCount > 0;
	useInert(popupRef, isCovered);

	const coverParent = parent?.cover;
	useEffect(() => {
		if (!isOpen || !coverParent) {
			return undefined;
		}

		return coverParent();
	}, [isOpen, coverParent]);

	const parentWidth = useElementWidth(parent?.panel ?? null);

	return {
		isNested: parent !== null,
		nestedIn: parent?.stack,
		inTrail: trailParent !== null,
		layerType,
		covered: isCovered ? resolvedStack : undefined,
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
			cover,
		},
		requestCloseFromPanel,
	};
}
