import { CircleAlert, CircleCheckBig, Info, TriangleAlert, X } from '@signozhq/icons';
import type { ReactNode } from 'react';
import React from 'react';
import { Button } from '../button/index.js';
import { cn } from '../lib/utils.js';
import styles from './announcement-banner.module.scss';

export type AnnouncementBannerType = 'warning' | 'info' | 'error' | 'success';

export type AnnouncementBannerAction = {
	/**
	 * The label of the action.
	 */
	label: ReactNode;
	/**
	 * The callback to call when the action is clicked.
	 */
	onClick: () => void;
};

/**
 * A banner component for displaying announcements, alerts, or notices.
 *
 * @example
 * Basic usage
 * ```tsx
 * <AnnouncementBanner type="warning">
 *   This is an important announcement.
 * </AnnouncementBanner>
 * ```
 *
 * @example
 * With action and dismiss
 * ```tsx
 * const [visible, setVisible] = useState(true);
 * if (!visible) return null;
 * return (
 *   <AnnouncementBanner
 *     type="info"
 *     onClose={() => setVisible(false)}
 *     action={{ label: 'Learn more', onClick: () => {} }}
 *   >
 *     New feature available.
 *   </AnnouncementBanner>
 * );
 * ```
 */
export type AnnouncementBannerProps = {
	/**
	 * The type of banner to display.
	 */
	type?: AnnouncementBannerType;
	/**
	 * The icon to display in the banner.
	 */
	icon?: ReactNode | null;
	/**
	 * The action to display in the banner.
	 */
	action?: AnnouncementBannerAction;
	/**
	 * The callback to call when the banner is closed.
	 */
	onClose?: () => void;
	/**
	 * The test id to apply to the banner.
	 */
	testId?: string;
} & Pick<React.ComponentPropsWithoutRef<'div'>, 'id' | 'className' | 'children'>;

const DEFAULT_ICONS: Record<AnnouncementBannerType, ReactNode> = {
	warning: <TriangleAlert size={14} />,
	info: <Info size={14} />,
	error: <CircleAlert size={14} />,
	success: <CircleCheckBig size={14} />,
};

export const AnnouncementBanner = React.forwardRef<HTMLDivElement, AnnouncementBannerProps>(
	({ children, type = 'warning', icon, action, onClose, className, testId, id }, ref) => {
		const resolvedIcon = icon === null ? null : (icon ?? DEFAULT_ICONS[type]);

		return (
			<div
				id={id}
				role="alert"
				ref={ref}
				data-testid={testId}
				data-type={type}
				className={cn(styles.banner, styles[`banner--${type}`], className)}
			>
				<div className={styles['banner__body']}>
					{resolvedIcon && (
						<span className={styles['banner__icon']} data-testid="banner-icon">
							{resolvedIcon}
						</span>
					)}
					<div className={styles['banner__message']}>{children}</div>
					{action && (
						<Button
							type="button"
							variant="solid"
							color="primary"
							className={styles.banner__action}
							onClick={action.onClick}
						>
							{action.label}
						</Button>
					)}
				</div>

				{onClose && (
					<Button
						className={styles['banner__dismiss']}
						type="button"
						aria-label="Dismiss"
						variant="solid"
						color="primary"
						size="icon"
						suffix={<X size={14} />}
						onClick={onClose}
					/>
				)}
			</div>
		);
	}
);
