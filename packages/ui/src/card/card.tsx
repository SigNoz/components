import { forwardRef, useId, type ReactElement, type RefAttributes } from 'react';
import { isBlankText } from '../lib/blank-text.js';
import { hasRenderableContent, type RejectedProps } from '../lib/utils.js';
import { Skeleton } from '../skeleton/skeleton.js';
import styles from './card.module.scss';
import { CARD_EMPTY_TITLE, CardTextOverflow } from './constants.js';
import { CardBody } from './subcomponents/card-body.js';
import { CardFooter } from './subcomponents/card-footer.js';
import { CardHeader } from './subcomponents/card-header.js';
import type { CardHeaderSuffixField, CardProps } from './types.js';
import { useCardWarnings } from './use-card-warnings.js';
import {
	getCardStyle,
	hasCardText,
	isFlushBody,
	resolveCardLoading,
	splitCardSpacing,
} from './utils.js';

const DEFAULT_LOADING_CONTENT = (
	<Skeleton active title={false} paragraph={{ rows: 3, width: ['100%', '100%', '60%'] }} />
);

const CardRoot = forwardRef<HTMLDivElement, CardProps>(function Card(
	{
		title,
		titlePrefix,
		titleSuffix,
		description,
		textOverflow = CardTextOverflow.Ellipsis,
		headerSuffix,
		headerDivider = false,
		children,
		footerPrefix,
		footerSuffix,
		loading = false,
		width,
		maxWidth,
		height,
		minHeight,
		gap,
		testId,
		className: _className,
		style: _style,
		...props
	}: CardProps & RejectedProps,
	ref,
) {
	const [spacing, rest] = splitCardSpacing(props);
	const baseId = useId();
	const controlId = `${baseId}-control`;
	const titleId = `${baseId}-title`;
	const descriptionId = `${baseId}-description`;

	const hasTitle = typeof title === 'string' && !isBlankText(title);
	const hasDescription = hasCardText(description);
	const field: CardHeaderSuffixField = {
		id: controlId,
		'aria-labelledby': titleId,
		...(hasDescription && { 'aria-describedby': descriptionId }),
	};
	const suffix = typeof headerSuffix === 'function' ? headerSuffix(field) : headerSuffix;
	const hasSuffix = hasRenderableContent(suffix);

	const hasHeader = hasTitle || hasRenderableContent(titleSuffix) || hasDescription || hasSuffix;
	const loadingState = resolveCardLoading(loading);
	const isLoading = loadingState.isLoading;
	const hasSkeleton = isLoading && loadingState.body === undefined;
	const hasBody = isLoading || hasRenderableContent(children);
	const hasFooterPrefix = hasRenderableContent(footerPrefix);
	const hasFooterSuffix = hasRenderableContent(footerSuffix);
	const hasFooter = hasFooterPrefix || hasFooterSuffix;

	useCardWarnings(hasHeader && !hasTitle, !hasHeader && !hasBody && !hasFooter);

	return (
		<div
			{...rest}
			ref={ref}
			data-slot="card"
			data-text-overflow={textOverflow}
			data-header-divider={headerDivider || undefined}
			data-loading={isLoading || undefined}
			{...(isLoading ? { 'aria-busy': true } : {})}
			className={styles['card']}
			style={getCardStyle({ width, maxWidth, height, minHeight, gap }, spacing)}
			{...(testId === undefined ? {} : { 'data-testid': testId })}
		>
			{hasHeader && (
				<CardHeader
					testId={testId}
					titleId={titleId}
					descriptionId={descriptionId}
					title={hasTitle ? title : CARD_EMPTY_TITLE}
					titlePrefix={titlePrefix}
					titleSuffix={titleSuffix}
					description={description}
					hasDescription={hasDescription}
					suffix={suffix}
					hasSuffix={hasSuffix}
					textOverflow={textOverflow}
					hasBody={hasBody}
					loading={loadingState.header}
				/>
			)}
			{hasBody && (
				<CardBody
					testId={testId}
					isFlush={!hasSkeleton && isFlushBody(spacing)}
					hasSkeleton={hasSkeleton}
				>
					{isLoading ? (loadingState.body ?? DEFAULT_LOADING_CONTENT) : children}
				</CardBody>
			)}
			{hasFooter && (
				<CardFooter
					testId={testId}
					prefix={footerPrefix}
					hasPrefix={hasFooterPrefix}
					suffix={footerSuffix}
					hasSuffix={hasFooterSuffix}
					loading={loadingState.footer}
				/>
			)}
		</div>
	);
});

/**
 * A bordered surface that groups related content on a page: a settings group, a summary panel, a
 * chart, a list, an empty state. It has an optional header (title, description and actions), a
 * body and an optional footer. It has no hover, no focus, no events and no states of its own: the
 * controls inside it keep theirs.
 *
 * `id` and the ref land on the root, with every `aria-*` and any `data-*`. There is no `className`
 * or `style`: the size comes from `width`, `maxWidth`, `height` and `minHeight`, the space around
 * the card from the margin props, and the space inside its body from the padding props and `gap`.
 *
 * Visual values are `--card-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts).
 *
 * ### Accessibility
 *
 * The root is a `div` with no role, and nothing in the card is focusable: the controls inside keep
 * their own tab stops, in the order of the page. The title and the description are text, each with
 * an id, and a `headerSuffix` function receives those ids. That is what names a `Switch` or an
 * `Input` that has no label of its own. The lines of the header and the footer are decorative. A
 * card that has to go somewhere puts a `Button` or a link inside it.
 *
 * ### Header
 *
 * The header is two columns: the text column, with the title line (`titlePrefix`, `title`,
 * `titleSuffix`) and the description, and the `headerSuffix`. When the two compete, the title cuts
 * or wraps and the suffix keeps its width. The suffix sits at the top of the title line, so a
 * description that grows does not move it. The header padding does not follow the padding props, so
 * titles line up across cards whose bodies differ.
 *
 * ### Overflow
 *
 * The card grows with its content and never scrolls: a part of the content that can be long, such
 * as a table body or a log list, owns its scroll. The root never sets `overflow: hidden`, which
 * would cut the focus ring of a control near its edge. A long word in the title or the description
 * breaks onto the next line.
 *
 * ### Empty
 *
 * A card with no header, no body and no footer renders the empty shell and logs a warning.
 *
 * ### Asserting on it
 *
 * `testId` becomes `data-testid` on the root. Without it no part has a `data-testid`. Otherwise use
 * the data attributes, never the hashed class names.
 *
 * | Element | `data-testid` |
 * |---|---|
 * | header | `${testId}-header` |
 * | title prefix | `${testId}-title-prefix` |
 * | title | `${testId}-title` |
 * | title suffix | `${testId}-title-suffix` |
 * | description | `${testId}-description` |
 * | header suffix | `${testId}-header-suffix` |
 * | body | `${testId}-body` |
 * | footer | `${testId}-footer` |
 * | footer prefix | `${testId}-footer-prefix` |
 * | footer suffix | `${testId}-footer-suffix` |
 *
 * | root attribute | value |
 * |---|---|
 * | `data-slot` | `"card"` |
 * | `data-text-overflow` | mirrors `textOverflow`, always present |
 * | `data-header-divider` | present only while `headerDivider` |
 * | `data-loading` | present only while `loading` |
 *
 * The header and the footer carry `data-loading` while `loading` swaps them for a `Skeleton`, and
 * the body carries `data-skeleton` while it shows the default one.
 *
 * | `data-slot` | rendered |
 * |---|---|
 * | `card` | always, on the root |
 * | `card-header` | when the header renders |
 * | `card-title-prefix`, `card-title`, `card-title-suffix` | the title always, the others when set |
 * | `card-description` | when the description is not empty |
 * | `card-header-suffix` | when the `headerSuffix` is not empty |
 * | `card-body` | when there are `children`, or while `loading` |
 * | `card-footer` | when `footerPrefix` or `footerSuffix` is set |
 * | `card-footer-prefix`, `card-footer-suffix` | when each is set |
 *
 * The title carries `data-truncated` while it is cut.
 *
 * @example
 * ```tsx
 * <Card
 *   title="Display timestamp in 24-hour format"
 *   description="Use the 24-hour convention while showing timestamps."
 *   headerSuffix={(field) => <Switch color="primary" textPlacement="right" {...field} value={is24h} onChange={setIs24h} />}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // A chart that fills the grid cell and brings its own gutter
 * <Card
 *   title="Top services"
 *   titleSuffix={<Badge variant="outlined" color="primary">Beta</Badge>}
 *   headerDivider
 *   padding={0}
 *   height="100%"
 *   loading={isLoading && <ChartSkeleton />}
 * >
 *   <Chart />
 * </Card>
 * ```
 *
 * @example
 * ```tsx
 * // Blocks in the body, a divider that reaches the edges, and a footer with an action
 * <Card title="Retention" footerSuffix={<Button variant="solid" color="primary" size="md">Save</Button>}>
 *   <Field label="Logs">...</Field>
 *   <Divider />
 *   <Field label="Traces">...</Field>
 * </Card>
 * ```
 */
export const Card = CardRoot as unknown as <T extends CardProps>(
	props: T &
		// `T` is inferred from the call site, so `T extends CardProps` alone never runs excess
		// property checks, and a spread of props held in a variable would carry a `className`
		// through. Every key outside the props is pinned to `never` instead.
		Record<Exclude<keyof T, keyof CardProps | keyof RefAttributes<HTMLDivElement>>, never> &
		RefAttributes<HTMLDivElement>,
) => ReactElement | null;
