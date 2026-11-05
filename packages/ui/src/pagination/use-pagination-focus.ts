import { type RefObject, useRef } from 'react';
import { useIsomorphicLayoutEffect } from '../lib/use-isomorphic-layout-effect.js';
import type { PaginationVariant } from './types.js';

/**
 * @access private
 */
export type PaginationFocusTarget = 'page' | 'previous' | 'next';

type UsePaginationFocusOptions = {
	root: RefObject<HTMLElement>;
	variant: PaginationVariant;
	page: number;
	hasPrevious: boolean;
	hasNext: boolean;
	disabled: boolean;
};

/**
 * @access private
 */
export type PaginationFocus = {
	previousRef: RefObject<HTMLButtonElement>;
	nextRef: RefObject<HTMLButtonElement>;
	registerPage: (page: number, node: HTMLElement | null) => void;
	follow: (target: PaginationFocusTarget, to: number) => void;
};

/**
 * Keeps focus on the control the user pressed once the page changes, so the same key can be
 * pressed again. The DOM node of a page button moves between slots, so the target is looked up
 * after the commit instead of trusting the node that held focus.
 *
 * @access private
 */
export function usePaginationFocus({
	root,
	variant,
	page,
	hasPrevious,
	hasNext,
	disabled,
}: UsePaginationFocusOptions): PaginationFocus {
	const previousRef = useRef<HTMLButtonElement>(null);
	const nextRef = useRef<HTMLButtonElement>(null);
	const pagesRef = useRef(new Map<number, HTMLElement>());
	const pendingRef = useRef<{
		target: PaginationFocusTarget;
		from: number;
		to: number;
		origin: Element | null;
	} | null>(null);

	function registerPage(pageNumber: number, node: HTMLElement | null): void {
		if (node === null) {
			pagesRef.current.delete(pageNumber);
		} else {
			pagesRef.current.set(pageNumber, node);
		}
	}

	function follow(target: PaginationFocusTarget, to: number): void {
		pendingRef.current = {
			target,
			from: page,
			to,
			origin: root.current?.ownerDocument.activeElement ?? null,
		};
	}

	// Where focus goes for a target that is no longer there: the numbered arrows disable and hand
	// focus to the current page, the compact ones hide and hand it to the other arrow.
	function resolve(target: PaginationFocusTarget): HTMLElement | null {
		if (target === 'page') {
			return pagesRef.current.get(page) ?? null;
		}

		const isPrevious = target === 'previous';

		if (isPrevious ? hasPrevious : hasNext) {
			return (isPrevious ? previousRef : nextRef).current;
		}

		if (variant === 'numbered') {
			return pagesRef.current.get(page) ?? null;
		}

		return (isPrevious ? hasNext : hasPrevious)
			? (isPrevious ? nextRef : previousRef).current
			: null;
	}

	useIsomorphicLayoutEffect(() => {
		const rootElement = root.current;

		if (rootElement === null) {
			return;
		}

		const doc = rootElement.ownerDocument;
		const active = doc.activeElement;
		const pending = pendingRef.current;

		if (pending !== null && pending.from !== page) {
			pendingRef.current = null;

			// A page other than the pressed one comes from somewhere else, such as the URL, after the
			// consumer ignored the press. A user who moved on while the page was loading keeps the focus
			// where they put it.
			if (
				page === pending.to &&
				(active === null || active === doc.body || active === pending.origin)
			) {
				resolve(pending.target)?.focus();
			}

			return;
		}

		// A numbered arrow at the end of the range stays focusable while the pagination is disabled,
		// so the user can read `disabledTooltip` on it, and focus stays there.
		if (variant === 'numbered' && disabled) {
			return;
		}

		if (active !== null && active === previousRef.current && !hasPrevious) {
			resolve('previous')?.focus();
		} else if (active !== null && active === nextRef.current && !hasNext) {
			resolve('next')?.focus();
		}
	});

	return { previousRef, nextRef, registerPage, follow };
}
