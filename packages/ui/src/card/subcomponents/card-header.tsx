import type { ReactElement, ReactNode } from 'react';
import { hasRenderableContent, partTestId } from '../../lib/utils.js';
import { Skeleton } from '../../skeleton/skeleton.js';
import styles from '../card.module.scss';
import type { CardTextOverflowType } from '../types.js';
import { CardSkeletonLine } from './card-skeleton-line.js';
import { CardTitle } from './card-title.js';

/**
 * @access private
 */
export type CardHeaderProps = {
	testId: string | undefined;
	titleId: string;
	descriptionId: string;
	title: string;
	titlePrefix: ReactElement | undefined;
	titleSuffix: ReactNode;
	description: ReactNode;
	hasDescription: boolean;
	suffix: ReactNode;
	hasSuffix: boolean;
	textOverflow: CardTextOverflowType;
	hasBody: boolean;
	loading: boolean;
};

/**
 * The header of a card: the text column with the title line and the description, and the
 * `headerSuffix` slot at its end. While `loading`, each part that is set is a `Skeleton` of the
 * same shape.
 *
 * @access private
 */
export function CardHeader({
	testId,
	titleId,
	descriptionId,
	title,
	titlePrefix,
	titleSuffix,
	description,
	hasDescription,
	suffix,
	hasSuffix,
	textOverflow,
	hasBody,
	loading,
}: CardHeaderProps) {
	return (
		<div
			data-slot="card-header"
			data-has-body={hasBody || undefined}
			data-loading={loading || undefined}
			data-testid={partTestId(testId, 'header')}
			className={styles['card__header']}
		>
			<div className={styles['card__header-text']}>
				{loading ? (
					<>
						<CardSkeletonLine line="title" width="40%" />
						{hasDescription && <CardSkeletonLine line="text" width="70%" />}
					</>
				) : (
					<>
						<div className={styles['card__title-line']}>
							{hasRenderableContent(titlePrefix) && (
								<span
									data-slot="card-title-prefix"
									aria-hidden="true"
									data-testid={partTestId(testId, 'title-prefix')}
									className={styles['card__title-prefix']}
								>
									{titlePrefix}
								</span>
							)}
							<CardTitle id={titleId} testId={testId} textOverflow={textOverflow}>
								{title}
							</CardTitle>
							{hasRenderableContent(titleSuffix) && (
								<span
									data-slot="card-title-suffix"
									data-testid={partTestId(testId, 'title-suffix')}
									className={styles['card__title-suffix']}
								>
									{titleSuffix}
								</span>
							)}
						</div>
						{hasDescription && (
							<div
								id={descriptionId}
								data-slot="card-description"
								data-testid={partTestId(testId, 'description')}
								className={styles['card__description']}
							>
								{description}
							</div>
						)}
					</>
				)}
			</div>
			{hasSuffix && (
				<div
					data-slot="card-header-suffix"
					data-testid={partTestId(testId, 'header-suffix')}
					className={styles['card__header-suffix']}
				>
					{loading ? <Skeleton.Button active size="sm" /> : suffix}
				</div>
			)}
		</div>
	);
}
