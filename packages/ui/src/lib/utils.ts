import { type ClassValue, clsx } from 'clsx';
import { Fragment, isValidElement, type ReactNode } from 'react';

export function cn(...inputs: ClassValue[]) {
	return clsx(inputs);
}

/**
 * Whether a node puts anything on the screen. `null`, `undefined`, both booleans and the empty
 * string all render nothing, and so does an array or a fragment holding only those, so a component
 * holding one of them has been handed no content at all.
 *
 * Any other element counts as content, since what a component renders is only known once it has
 * rendered. A component that returns `null` still counts.
 */
export function hasRenderableContent(content: ReactNode): boolean {
	if (Array.isArray(content)) {
		return content.some(hasRenderableContent);
	}

	if (isValidElement<{ children?: ReactNode }>(content) && content.type === Fragment) {
		return hasRenderableContent(content.props.children);
	}

	// `true` is a valid node that renders nothing, the same as `false`.
	return content != null && typeof content !== 'boolean' && content !== '';
}

/**
 * The `data-testid` of one part of a component, `{testId}-{part}`, or `undefined` when the
 * component was given no `testId`.
 *
 * @access private
 */
export function partTestId(testId: string | undefined, part: string): string | undefined {
	return testId === undefined ? undefined : `${testId}-${part}`;
}

// https://github.com/sindresorhus/type-fest/blob/main/source/simplify.d.ts
export type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {};

/**
 * `className` and `style` as optional unknowns, for a component whose types reject both and that
 * spreads the rest onto its element. Widening its props with this lets it destructure the two away,
 * so a value that gets past the types (a cast, an untyped spread, a JavaScript caller) does not
 * replace the component's own class or inline style.
 *
 * @access private
 */
export type RejectedProps<K extends PropertyKey = 'className' | 'style'> = Partial<
	Record<K, unknown>
>;
