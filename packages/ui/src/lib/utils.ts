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
 * The props a component takes its look from instead of `className` and `style`.
 *
 * @access private
 */
const STYLE_PROPS = ['className', 'style'] as const;

/**
 * `props` without `className` and `style`, for a component whose types reject both and that
 * spreads the rest onto its element. A value that gets past the types (a cast, an untyped spread,
 * a JavaScript caller) would otherwise replace the component's own class or inline style.
 *
 * @access private
 */
export function omitStyleProps<T extends object>(
	props: T,
	keys: readonly string[] = STYLE_PROPS,
): T {
	if (!keys.some((key) => key in props)) {
		return props;
	}

	const rest = { ...props } as Record<string, unknown>;

	for (const key of keys) {
		delete rest[key];
	}

	return rest as T;
}
