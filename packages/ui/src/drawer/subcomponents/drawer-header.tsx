import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer';
import { X } from '@signozhq/icons';
import { type ReactNode, type RefObject, useRef } from 'react';
import { Button } from '../../button/index.js';
import { PopupContainer } from '../../lib/popup-container.js';
import { hasRenderableContent, partTestId } from '../../lib/utils.js';
import { Skeleton } from '../../skeleton/index.js';
import { Typography } from '../../typography/index.js';
import styles from '../drawer.module.scss';
import type { DrawerProps } from '../types.js';
import { useInert } from '../use-inert.js';

type DrawerHeaderProps = Pick<
	DrawerProps,
	| 'title'
	| 'headerPrefix'
	| 'titlePrefix'
	| 'titleSuffix'
	| 'headerSuffix'
	| 'description'
	| 'testId'
> & {
	loading: boolean;
	onClosePress: () => void;
	popupRef: RefObject<HTMLDivElement | null>;
};

/**
 * The header of a `Drawer`, one row: `headerPrefix` and its divider, the title with its prefix and
 * suffix over the description, `headerSuffix`, and the close button, always last.
 *
 * @access private
 */
export function DrawerHeader({
	title,
	headerPrefix,
	titlePrefix,
	titleSuffix,
	headerSuffix,
	description,
	loading,
	testId,
	onClosePress,
	popupRef,
}: DrawerHeaderProps): ReactNode {
	const prefixRef = useRef<HTMLDivElement | null>(null);
	const suffixRef = useRef<HTMLDivElement | null>(null);
	// Figma keeps the nav and the actions on screen while the record loads, disabled. Each slot is
	// its own popup container, so a menu or popover opened from it renders inside it and goes inert
	// with it, instead of acting on the record that is being replaced.
	useInert(prefixRef, loading, popupRef);
	useInert(suffixRef, loading, popupRef);

	const hasDescription = hasRenderableContent(description);

	return (
		<div
			className={styles['drawer__header']}
			data-slot="drawer-header"
			data-testid={partTestId(testId, 'header')}
		>
			{hasRenderableContent(headerPrefix) ? (
				<>
					<div
						ref={prefixRef}
						className={styles['drawer__header-prefix']}
						data-slot="drawer-header-prefix"
						data-loading={loading || undefined}
						data-testid={partTestId(testId, 'header-prefix')}
					>
						<PopupContainer>{headerPrefix}</PopupContainer>
					</div>
					<span className={styles['drawer__header-divider']} aria-hidden="true" />
				</>
			) : null}
			<div className={styles['drawer__heading']}>
				<div className={styles['drawer__title-row']}>
					{hasRenderableContent(titlePrefix) ? (
						<span
							className={styles['drawer__title-prefix']}
							data-slot="drawer-title-prefix"
							data-loading={loading || undefined}
							data-testid={partTestId(testId, 'title-prefix')}
						>
							{loading ? (
								<Skeleton.Avatar
									size="sm"
									shape="square"
									testId={partTestId(testId, 'title-prefix-skeleton')}
								/>
							) : (
								titlePrefix
							)}
						</span>
					) : null}
					<DrawerPrimitive.Title
						// While loading, the title stays the accessible name of the panel and only the
						// skeleton shows.
						className={loading ? styles['drawer__visually-hidden'] : styles['drawer__title']}
						data-slot="drawer-title"
						data-testid={partTestId(testId, 'title')}
					>
						<Typography
							as="span"
							variant="label"
							size="base"
							weight="medium"
							color="inherit"
							display="block"
							textOverflow="ellipsis"
						>
							{title.trim() === '' ? '<No title>' : title}
						</Typography>
					</DrawerPrimitive.Title>
					{loading ? (
						<div className={styles['drawer__title-skeleton']} data-slot="drawer-title-skeleton">
							<Skeleton
								title={false}
								paragraph={{ rows: 1, width: '40%' }}
								testId={partTestId(testId, 'title-skeleton')}
							/>
						</div>
					) : null}
					{hasRenderableContent(titleSuffix) && !loading ? (
						<span
							className={styles['drawer__title-suffix']}
							data-slot="drawer-title-suffix"
							data-testid={partTestId(testId, 'title-suffix')}
						>
							{titleSuffix}
						</span>
					) : null}
				</div>
				{hasDescription && loading ? (
					<div
						className={styles['drawer__description-skeleton']}
						data-slot="drawer-description-skeleton"
					>
						<Skeleton
							title={false}
							paragraph={{ rows: 1, width: '70%' }}
							testId={partTestId(testId, 'description-skeleton')}
						/>
					</div>
				) : null}
				{hasDescription && !loading ? (
					<DrawerPrimitive.Description
						render={<div />}
						className={styles['drawer__description']}
						data-slot="drawer-description"
						data-testid={partTestId(testId, 'description')}
					>
						{description}
					</DrawerPrimitive.Description>
				) : null}
			</div>
			{hasRenderableContent(headerSuffix) ? (
				<div
					ref={suffixRef}
					className={styles['drawer__header-suffix']}
					data-slot="drawer-header-suffix"
					data-loading={loading || undefined}
					data-testid={partTestId(testId, 'header-suffix')}
				>
					<PopupContainer>{headerSuffix}</PopupContainer>
				</div>
			) : null}
			<Button
				variant="ghost"
				color="secondary"
				size="sm"
				icon
				aria-label="Close"
				data-slot="drawer-close"
				testId={partTestId(testId, 'close')}
				onClick={onClosePress}
			>
				<X />
			</Button>
		</div>
	);
}
