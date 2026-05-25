import { Slot } from '@radix-ui/react-slot';
import { X } from '@signozhq/icons';
import { forwardRef, type MouseEvent, type ReactNode, useState } from 'react';
import { cn } from '../lib/utils.js';
import { TextEllipsis, type TextEllipsisProps } from '../text-ellipsis/index.js';
import styles from './badge.module.scss';

export type BadgeVariant = 'default' | 'outline';

export type BadgeColor =
	| 'primary'
	| 'secondary'
	| 'success'
	| 'error'
	| 'warning'
	| 'robin'
	| 'forest'
	| 'amber'
	| 'sienna'
	| 'cherry'
	| 'sakura'
	| 'aqua'
	| 'vanilla';

export type TextEllipsisPosition = TextEllipsisProps['position'];

export interface BadgeProps
	extends Pick<React.ComponentProps<'span'>, 'className' | 'children' | 'id' | 'style'> {
	/**
	 * The testId associated with the badge.
	 */
	testId?: string;
	/**
	 * @default false
	 */
	asChild?: boolean;
	/**
	 * @default default
	 */
	variant?: BadgeVariant;
	/**
	 * @default primary
	 */
	color?: BadgeColor;
	/**
	 * @default false
	 */
	capitalize?: boolean;
	/**
	 * Enable text ellipsis truncation. When true, uses 'center' position.
	 * When a position is provided ('start' | 'center' | 'end'), truncates at that position.
	 * Only works when children is a string. For non-string children, use CSS text-overflow instead.
	 * @default false
	 */
	textEllipsis?: boolean | TextEllipsisPosition;
	/**
	 * Render a close button and hide the badge after close unless onClose prevents default.
	 * Intended for the default span-rendered Badge. When asChild is true, closeable is ignored
	 * to preserve Slot composition behavior.
	 * @default false
	 */
	closable?: boolean;
	/**
	 * Called when the close button is clicked. Call event.preventDefault() to keep the badge visible.
	 */
	onClose?: (event: MouseEvent<HTMLButtonElement>) => void;
	/**
	 * Custom close icon.
	 */
	closeIcon?: ReactNode;
	/**
	 * Accessible label for the close button.
	 * @default Close badge
	 */
	closeAriaLabel?: string;
}

const colorMap: Record<string, string> = {
	success: 'forest',
	warning: 'amber',
	error: 'cherry',
	primary: 'robin',
	secondary: 'vanilla',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
	(
		{
			className,
			variant = 'default',
			color = 'primary',
			asChild = false,
			capitalize = false,
			testId,
			textEllipsis = false,
			closable = false,
			onClose,
			closeIcon,
			closeAriaLabel = 'Close badge',
			children,
			...props
		},
		ref
	) => {
		const [closed, setClosed] = useState(false);
		const isClosable = closable && !asChild;

		if (closed) {
			return null;
		}

		// Determine ellipsis position
		const ellipsisPosition: TextEllipsisPosition | false =
			textEllipsis === true ? 'center' : textEllipsis === false ? false : textEllipsis;

		// Check if we should apply text ellipsis
		const shouldApplyEllipsis = ellipsisPosition && typeof children === 'string';

		// Warn if textEllipsis is used with non-string children
		if (ellipsisPosition && typeof children !== 'string') {
			console.warn(
				'Badge: textEllipsis only works when children is a string. For non-string children, use CSS text-overflow (textWrap) instead.'
			);
		}

		const content = shouldApplyEllipsis ? (
			<TextEllipsis position={ellipsisPosition} className={styles.badgeEllipsis}>
				{children}
			</TextEllipsis>
		) : (
			children
		);

		const handleCloseClick = (event: MouseEvent<HTMLButtonElement>): void => {
			event.stopPropagation();
			onClose?.(event);

			if (!event.defaultPrevented) {
				setClosed(true);
			}
		};

		const badgeProps = {
			'data-color': colorMap[color] || color,
			'data-variant': variant,
			'data-capitalize': capitalize,
			'data-slot': 'badge',
			'data-testid': testId,
			'data-text-ellipsis': shouldApplyEllipsis || undefined,
			'data-closable': isClosable || undefined,
			className: cn(styles.badge, className),
			...props,
		};

		if (asChild) {
			return (
				<Slot ref={ref} {...badgeProps}>
					{content}
				</Slot>
			);
		}

		return (
			<span ref={ref} {...badgeProps}>
				{content}
				{isClosable && (
					<button
						type="button"
						aria-label={closeAriaLabel}
						className={styles.closeButton}
						onClick={handleCloseClick}
					>
						<span aria-hidden="true" className={styles.closeIcon}>
							{closeIcon ?? <X />}
						</span>
					</button>
				)}
			</span>
		);
	}
);
Badge.displayName = 'Badge';
