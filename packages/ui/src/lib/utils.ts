import { type ClassValue, clsx } from 'clsx';
import type { ReactNode } from 'react';

export function cn(...inputs: ClassValue[]) {
	return clsx(inputs);
}

/**
 * Whether a node puts anything on the screen. `null`, `undefined`, both booleans and the empty
 * string all render nothing, so a component holding one of them has been handed no content at all.
 */
export function hasRenderableContent(content: ReactNode): boolean {
	// `true` is a valid node that renders nothing, the same as `false`.
	return content != null && typeof content !== 'boolean' && content !== '';
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
