import { CheckIcon, CopyIcon } from '@radix-ui/react-icons';
import copy from 'copy-text-to-clipboard';
import type React from 'react';
import { useState } from 'react';
import { cn } from '../lib/utils.js';
import styles from './typography.module.css';

type TypographySize =
	// Semantic sizes (Ant Design compatible)
	| 'small'
	| 'base'
	| 'medium'
	| 'large'
	// Legacy sizes (for compatibility)
	| 'xs'
	| 'sm'
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

type TypographyElement =
	| 'h1'
	| 'h2'
	| 'h3'
	| 'h4'
	| 'h5'
	| 'h6'
	| 'p'
	| 'span'
	| 'div'
	| 'label'
	| 'a';

type TypographyAlign = 'left' | 'center' | 'right';

type TypographyVariant = 'title' | 'text';

type TypographyColor = 'muted' | 'danger' | 'warning' | 'success';

type TypographyLevel = 1 | 2 | 3 | 4 | 5;

interface TypographyProps
	extends Pick<React.ComponentProps<'div'>, 'children' | 'className' | 'id' | 'style'> {
	/**
	 * The variant determines the semantic role of the typography.
	 * - `title` renders as heading element
	 * - `text` renders as `p` by default
	 * @default 'text'
	 */
	variant?: TypographyVariant;

	/**
	 * The HTML element to render.
	 * If not provided, defaults based on variant and level.
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
	 * @deprecated Use `color="muted"` instead
	 */
	muted?: boolean;

	/**
	 * Semantic color variant.
	 */
	color?: TypographyColor;

	/**
	 * Apply bold font weight.
	 * @default false
	 */
	strong?: boolean;

	/**
	 * Apply italic font style.
	 * @default false
	 */
	italic?: boolean;

	/**
	 * Apply inline code styling.
	 * @default false
	 */
	code?: boolean;

	/**
	 * Apply disabled styling.
	 * @default false
	 */
	disabled?: boolean;

	/**
	 * Enable copy to clipboard functionality.
	 * @default false
	 */
	copyable?: boolean;

	/**
	 * Heading level (1-5). Only applies when variant="title".
	 * Sets both the HTML element (h1-h5) and default styling.
	 */
	level?: TypographyLevel;

	/**
	 * Link href. When provided, renders as anchor element.
	 */
	href?: string;

	/**
	 * Link target attribute.
	 */
	target?: '_blank' | '_self' | '_parent' | '_top';

	/**
	 * Link rel attribute.
	 */
	rel?: string;

	/**
	 * The testId associated with the element.
	 */
	testId?: string;
}

const levelTagMap: Record<TypographyLevel, TypographyElement> = {
	1: 'h1',
	2: 'h2',
	3: 'h3',
	4: 'h4',
	5: 'h5',
};

const defaultTagMap: Record<TypographyVariant, TypographyElement> = {
	title: 'h2',
	text: 'p',
};

/**
 * A flexible typography component for rendering text with consistent styling.
 * Supports variants (title/text), semantic colors, truncation, and copy-to-clipboard.
 *
 * @example Basic text
 * ```tsx
 * <Typography>Default paragraph text</Typography>
 * ```
 *
 * @example Title with level
 * ```tsx
 * <Typography variant="title" level={1}>Page Heading</Typography>
 * <Typography variant="title" level={2}>Section Heading</Typography>
 * ```
 *
 * @example Text with styling props
 * ```tsx
 * <Typography size="lg" weight="semibold">Large semibold text</Typography>
 * <Typography color="muted">Secondary text</Typography>
 * <Typography color="danger">Error message</Typography>
 * ```
 *
 * @example Truncation
 * ```tsx
 * <Typography truncate={1}>Single line with ellipsis overflow...</Typography>
 * ```
 *
 * @example Code styling with copy
 * ```tsx
 * <Typography code copyable>npm install @signoz/ui</Typography>
 * ```
 *
 * @example Link
 * ```tsx
 * <Typography href="https://signoz.io" target="_blank">Visit SigNoz</Typography>
 * ```
 */
function Typography({
	variant = 'text',
	as,
	asChild = false,
	size,
	weight,
	align,
	truncate,
	muted = false,
	color,
	strong = false,
	italic = false,
	code = false,
	disabled = false,
	copyable = false,
	level,
	href,
	target,
	rel,
	className,
	children,
	style,
	testId,
	...props
}: TypographyProps) {
	const [copied, setCopied] = useState(false);

	// Determine the element to render
	let Tag: TypographyElement;
	if (as) {
		Tag = as;
	} else if (href) {
		Tag = 'a';
	} else if (variant === 'title' && level) {
		Tag = levelTagMap[level];
	} else {
		Tag = defaultTagMap[variant];
	}

	const isLink = Tag === 'a' || href;

	const truncateStyle: React.CSSProperties | undefined =
		truncate !== undefined
			? ({
					'--typography-line-clamp': truncate,
				} as React.CSSProperties)
			: undefined;

	const handleCopy = () => {
		const text = typeof children === 'string' ? children : '';
		if (copy(text)) {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const linkProps = isLink ? { href, target, rel } : {};

	return (
		<Tag
			data-slot="typography"
			data-variant={variant}
			data-size={size || undefined}
			data-weight={weight || undefined}
			data-align={align || undefined}
			data-muted={muted || undefined}
			data-truncate={truncate !== undefined ? true : undefined}
			data-color={color || undefined}
			data-strong={strong || undefined}
			data-italic={italic || undefined}
			data-code={code || undefined}
			data-disabled={disabled || undefined}
			data-level={level || undefined}
			data-link={isLink || undefined}
			data-testid={testId}
			className={cn(styles.typography, className)}
			style={{ ...truncateStyle, ...style }}
			{...linkProps}
			{...props}
		>
			{children}
			{copyable && (
				<button
					type="button"
					onClick={handleCopy}
					className={styles.copyButton}
					aria-label={copied ? 'Copied' : 'Copy to clipboard'}
				>
					{copied ? <CheckIcon /> : <CopyIcon />}
				</button>
			)}
		</Tag>
	);
}

Typography.displayName = 'Typography';

// Compound components
interface TypographyTextProps extends Omit<TypographyProps, 'variant' | 'level'> {}

function TypographyText(props: TypographyTextProps) {
	return <Typography variant="text" {...props} />;
}
TypographyText.displayName = 'Typography.Text';

interface TypographyTitleProps extends Omit<TypographyProps, 'variant'> {}

function TypographyTitle({ level = 1, ...props }: TypographyTitleProps) {
	return <Typography variant="title" level={level} {...props} />;
}
TypographyTitle.displayName = 'Typography.Title';

interface TypographyLinkProps extends Omit<TypographyProps, 'variant' | 'level'> {
	href?: string;
}

function TypographyLink(props: TypographyLinkProps) {
	return <Typography as="a" {...props} />;
}
TypographyLink.displayName = 'Typography.Link';

/**
 * Shorthand for rendering body text. Equivalent to `<Typography variant="text">`.
 *
 * @example
 * ```tsx
 * <Typography.Text>Body text content</Typography.Text>
 * <Typography.Text color="muted">Secondary information</Typography.Text>
 * <Typography.Text strong>Important text</Typography.Text>
 * ```
 */
Typography.Text = TypographyText;

/**
 * Shorthand for rendering headings. Equivalent to `<Typography variant="title">`.
 * The `level` prop controls both the HTML element (h1-h5) and default styling.
 *
 * @example
 * ```tsx
 * <Typography.Title level={1}>Page Title</Typography.Title>
 * <Typography.Title level={2}>Section Heading</Typography.Title>
 * <Typography.Title level={3} color="muted">Subsection</Typography.Title>
 * ```
 */
Typography.Title = TypographyTitle;

/**
 * Shorthand for rendering links. Renders as an anchor element with link styling.
 *
 * @example
 * ```tsx
 * <Typography.Link href="/docs">Documentation</Typography.Link>
 * <Typography.Link href="https://signoz.io" target="_blank" rel="noopener noreferrer">
 *   Visit SigNoz
 * </Typography.Link>
 * ```
 */
Typography.Link = TypographyLink;

export { Typography };

export type {
	TypographyProps,
	TypographySize,
	TypographyWeight,
	TypographyElement,
	TypographyVariant,
	TypographyAlign,
	TypographyColor,
	TypographyLevel,
	TypographyTextProps,
	TypographyTitleProps,
	TypographyLinkProps,
};
