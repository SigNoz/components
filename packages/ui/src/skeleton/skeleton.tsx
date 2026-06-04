import * as React from 'react';
import { cn } from '../lib/utils.js';
import styles from './skeleton.module.scss';

// Base Skeleton

export interface SkeletonProps {
	/**
	 * Whether to show an animated pulse effect.
	 *
	 * @example
	 * ```tsx
	 * <Skeleton active />
	 * ```
	 */
	active?: boolean;

	/**
	 * Show or hide the title placeholder, or configure its width.
	 * Set to `false` to hide it entirely.
	 *
	 * @example
	 * ```tsx
	 * <Skeleton title={{ width: '60%' }} />
	 * <Skeleton title={false} />
	 * ```
	 */
	title?: boolean | { width?: string | number };

	/**
	 * Show or hide paragraph rows, or configure row count and widths.
	 * `width` can be a single value applied to all rows, or an array
	 * of per-row widths.
	 *
	 * @example
	 * ```tsx
	 * <Skeleton paragraph={{ rows: 4 }} />
	 * <Skeleton paragraph={{ rows: 4, width: '60%' }} />
	 * <Skeleton paragraph={{ rows: 4, width: ['100%', '95%', '80%', '60%'] }} />
	 * ```
	 */
	paragraph?: boolean | { rows?: number; width?: string | number | (string | number)[] };

	/**
	 * The id of the skeleton container element.
	 */
	id?: string;

	/**
	 * Test id for the skeleton container, rendered as `data-testid`.
	 */
	testId?: string;

	/**
	 * Inline styles applied to the skeleton container.
	 */
	style?: React.CSSProperties;

	/**
	 * Additional CSS classes applied to the skeleton container.
	 */
	className?: string;
}

/**
 * Skeleton component for displaying loading placeholders while content is being fetched.
 * Supports animated pulse, configurable title and paragraph rows, and sub-components
 * for inputs, buttons, and avatars.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Skeleton active />
 * ```
 *
 * @example
 * ```tsx
 * // With title and paragraph rows
 * <Skeleton active title={{ width: '40%' }} paragraph={{ rows: 4 }} />
 * ```
 *
 * @example
 * ```tsx
 * // With per-row widths
 * <Skeleton
 *   active
 *   paragraph={{ rows: 3, width: ['100%', '80%', '60%'] }}
 * />
 * ```
 */
const SkeletonComponent = React.forwardRef<HTMLDivElement, SkeletonProps>(
	({ active = false, title = true, paragraph = true, id, testId, style, className }, ref) => {
		const titleWidth = typeof title === 'object' && title.width ? title.width : '38%';

		const paragraphRows = React.useMemo(() => {
			if (!paragraph) return null;

			const rows = typeof paragraph === 'object' ? (paragraph.rows ?? 3) : 3;

			const widths =
				typeof paragraph === 'object' && paragraph.width
					? Array.isArray(paragraph.width)
						? paragraph.width
						: Array(rows).fill(paragraph.width)
					: Array(rows).fill('100%');

			return Array.from({ length: rows }).map((_, i) => (
				<div
					key={i}
					className={styles['skeleton-paragraph-row']}
					style={{ width: widths[i] ?? '100%' }}
				/>
			));
		}, [paragraph]);

		return (
			<div
				ref={ref}
				id={id}
				data-testid={testId}
				data-active={active}
				style={style}
				className={cn(styles['skeleton'], className)}
			>
				{title !== false && (
					<div className={styles['skeleton-title']} style={{ width: titleWidth }} />
				)}
				{paragraph !== false && <div className={styles['skeleton-paragraph']}>{paragraphRows}</div>}
			</div>
		);
	}
);
SkeletonComponent.displayName = 'Skeleton';

//  Skeleton.Input

export interface SkeletonInputProps {
	/**
	 * Whether to show an animated pulse effect.
	 *
	 * @example
	 * ```tsx
	 * <Skeleton.Input active />
	 * ```
	 */
	active?: boolean;

	/**
	 * Size of the input skeleton.
	 *
	 * @example
	 * ```tsx
	 * <Skeleton.Input size="small" />
	 * <Skeleton.Input size="large" />
	 * ```
	 */
	size?: 'small' | 'default' | 'large';

	/**
	 * Whether the input skeleton should take up the full width of its container.
	 *
	 * @example
	 * ```tsx
	 * <Skeleton.Input block />
	 * ```
	 */
	block?: boolean;

	/**
	 * The id of the skeleton input element.
	 */
	id?: string;

	/**
	 * Test id for the skeleton input, rendered as `data-testid`.
	 */
	testId?: string;

	/**
	 * Inline styles applied to the skeleton input.
	 */
	style?: React.CSSProperties;

	/**
	 * Additional CSS classes applied to the skeleton input.
	 */
	className?: string;
}

/**
 * Skeleton placeholder shaped like an input field.
 *
 * @example
 * ```tsx
 * <Skeleton.Input active size="small" />
 * ```
 *
 * @example
 * ```tsx
 * <Skeleton.Input active block style={{ height: 32, marginTop: 8 }} />
 * ```
 */
const SkeletonInput = React.forwardRef<HTMLDivElement, SkeletonInputProps>(
	({ active = false, size = 'default', block = false, id, testId, style, className }, ref) => (
		<div
			ref={ref}
			id={id}
			data-testid={testId}
			data-active={active}
			data-size={size}
			data-block={block}
			style={style}
			className={cn(styles['skeleton-input'], className)}
		/>
	)
);
SkeletonInput.displayName = 'SkeletonInput';

// Skeleton.Button

export interface SkeletonButtonProps {
	/**
	 * Whether to show an animated pulse effect.
	 *
	 * @example
	 * ```tsx
	 * <Skeleton.Button active />
	 * ```
	 */
	active?: boolean;

	/**
	 * Size of the button skeleton.
	 *
	 * @example
	 * ```tsx
	 * <Skeleton.Button size="small" />
	 * ```
	 */
	size?: 'small' | 'default' | 'large';

	/**
	 * Whether the button skeleton should take up the full width of its container.
	 *
	 * @example
	 * ```tsx
	 * <Skeleton.Button block />
	 * ```
	 */
	block?: boolean;

	/**
	 * The id of the skeleton button element.
	 */
	id?: string;

	/**
	 * Test id for the skeleton button, rendered as `data-testid`.
	 */
	testId?: string;

	/**
	 * Inline styles applied to the skeleton button.
	 */
	style?: React.CSSProperties;

	/**
	 * Additional CSS classes applied to the skeleton button.
	 */
	className?: string;
}

/**
 * Skeleton placeholder shaped like a button.
 *
 * @example
 * ```tsx
 * <Skeleton.Button active size="small" />
 * ```
 *
 * @example
 * ```tsx
 * <Skeleton.Button active block />
 * ```
 */
const SkeletonButton = React.forwardRef<HTMLDivElement, SkeletonButtonProps>(
	({ active = false, size = 'default', block = false, id, testId, style, className }, ref) => (
		<div
			ref={ref}
			id={id}
			data-testid={testId}
			data-active={active}
			data-size={size}
			data-block={block}
			style={style}
			className={cn(styles['skeleton-button'], className)}
		/>
	)
);
SkeletonButton.displayName = 'SkeletonButton';

// Skeleton.Avatar

export interface SkeletonAvatarProps {
	/**
	 * Whether to show an animated pulse effect.
	 *
	 * @example
	 * ```tsx
	 * <Skeleton.Avatar active />
	 * ```
	 */
	active?: boolean;

	/**
	 * Size of the avatar skeleton in pixels, or a named size.
	 *
	 * @example
	 * ```tsx
	 * <Skeleton.Avatar size={36} />
	 * <Skeleton.Avatar size="large" />
	 * ```
	 */
	size?: number | 'small' | 'default' | 'large';

	/**
	 * Shape of the avatar skeleton.
	 *
	 * @example
	 * ```tsx
	 * <Skeleton.Avatar shape="square" />
	 * <Skeleton.Avatar shape="circle" />
	 * ```
	 */
	shape?: 'circle' | 'square';

	/**
	 * The id of the skeleton avatar element.
	 */
	id?: string;

	/**
	 * Test id for the skeleton avatar, rendered as `data-testid`.
	 */
	testId?: string;

	/**
	 * Inline styles applied to the skeleton avatar.
	 */
	style?: React.CSSProperties;

	/**
	 * Additional CSS classes applied to the skeleton avatar.
	 */
	className?: string;
}

const avatarSizeMap = { small: 24, default: 36, large: 48 };

/**
 * Skeleton placeholder shaped like an avatar.
 *
 * @example
 * ```tsx
 * <Skeleton.Avatar active shape="circle" size={36} />
 * ```
 *
 * @example
 * ```tsx
 * <Skeleton.Avatar active shape="square" size="large" />
 * ```
 */
const SkeletonAvatar = React.forwardRef<HTMLDivElement, SkeletonAvatarProps>(
	({ active = false, size = 'default', shape = 'circle', id, testId, style, className }, ref) => {
		const resolvedSize = typeof size === 'number' ? size : avatarSizeMap[size];

		return (
			<div
				ref={ref}
				id={id}
				data-testid={testId}
				data-active={active}
				data-shape={shape}
				style={{ width: resolvedSize, height: resolvedSize, ...style }}
				className={cn(styles['skeleton-avatar'], className)}
			/>
		);
	}
);
SkeletonAvatar.displayName = 'SkeletonAvatar';

// Compound component

type SkeletonWithSubComponents = typeof SkeletonComponent & {
	Input: typeof SkeletonInput;
	Button: typeof SkeletonButton;
	Avatar: typeof SkeletonAvatar;
};

(SkeletonComponent as SkeletonWithSubComponents).Input = SkeletonInput;
(SkeletonComponent as SkeletonWithSubComponents).Button = SkeletonButton;
(SkeletonComponent as SkeletonWithSubComponents).Avatar = SkeletonAvatar;

export const Skeleton = SkeletonComponent as SkeletonWithSubComponents;
