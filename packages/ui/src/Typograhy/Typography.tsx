import type React from 'react';
import { cn } from '../lib/utils.js';
import styles from './typography.module.css';

type TypographySize =
	| 'xs'
	| 'sm'
	| 'base'
	| 'lg'
	| 'xl'
	| '2xl'
	| '3xl'
	| '4xl'
	| '5xl'
	| '6xl'
	| '7xl'
	| '8xl'
	| '9xl';

type TypographyWeight =
	| 'thin'
	| 'extralight'
	| 'light'
	| 'normal'
	| 'medium'
	| 'semibold'
	| 'bold'
	| 'extrabold'
	| 'black';

type TypographyElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'label';

type TypographyAlign = 'left' | 'center' | 'right';

type TypographyVariant = 'title' | 'text';

interface TypographyProps
	extends Pick<React.ComponentProps<'div'>, 'children' | 'className' | 'id' | 'style'> {
	/**
	 * The variant determines the semantic role of the typography.
	 * - `heading` renders as `h2` by default
	 * - `text` renders as `p` by default
	 * @default 'text'
	 */
	variant?: TypographyVariant;

	/**
	 * The HTML element to render.
	 * If not provided, defaults based on variant:
	 * - heading → h2
	 * - text → p
	 */
	as?: TypographyElement;

	/**
	 * Use the Slot pattern to merge props onto a child element.
	 * @default false
	 */
	asChild?: boolean;

	/**
	 * The font size token.
	 * @default 'base'
	 */
	size?: TypographySize;

	/**
	 * The font weight token.
	 * @default 'normal'
	 */
	weight?: TypographyWeight;

	/**
	 * Text alignment.
	 */
	align?: TypographyAlign;

	/**
	 * Truncate text with an ellipsis after a given number of lines.
	 * Set to `1` for single-line truncation.
	 */
	truncate?: number;

	/**
	 * Apply a muted/secondary color treatment.
	 * @default false
	 */
	muted?: boolean;

	/**
	 * The testId associated with the element.
	 */
	'data-testid'?: string;
}

const defaultTagMap: Record<TypographyVariant, TypographyElement> = {
	title: 'h2',
	text: 'p',
};

function Typography({
	variant = 'text',
	as,
	asChild = false,
	size = 'base',
	weight = 'normal',
	align,
	truncate,
	muted = false,
	className,
	children,
	style,
	...props
}: TypographyProps) {
	const Tag = as ?? defaultTagMap[variant];
	const Comp = Tag;

	const truncateStyle: React.CSSProperties | undefined =
		truncate !== undefined
			? ({
					'--typography-line-clamp': truncate,
				} as React.CSSProperties)
			: undefined;

	return (
		<Comp
			data-slot="typography"
			data-variant={variant}
			data-size={size}
			data-weight={weight}
			data-align={align || undefined}
			data-muted={muted || undefined}
			data-truncate={truncate !== undefined ? true : undefined}
			className={cn(styles.typography, className)}
			style={{ ...truncateStyle, ...style }}
			{...props}
		>
			{children}
		</Comp>
	);
}

Typography.displayName = 'Typography';

export { Typography };
export type {
	TypographyProps,
	TypographySize,
	TypographyWeight,
	TypographyElement,
	TypographyVariant,
	TypographyAlign,
};
