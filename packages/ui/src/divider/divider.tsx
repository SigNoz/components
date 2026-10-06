import { type CSSProperties, forwardRef, type ReactNode } from 'react';
import { toCssLength } from '../lib/css-length.js';
import { hasRenderableContent, partTestId, type RejectedProps } from '../lib/utils.js';
import { DividerOrientation } from './constants.js';
import styles from './divider.module.scss';
import type { DividerProps } from './types.js';

// The props of the orientation that does not read them hold rule types, never a value. A default
// on `orientation` stops TypeScript from narrowing the rest, so the reads below are cast.
type Length = string | number | undefined;

/**
 * Renders a 1px line between two blocks of content (horizontal) or two items in a row (vertical).
 * A horizontal divider can carry a short label in the middle.
 *
 * The divider is a `<span>`, so it can sit inside a paragraph. Its CSS sets how it lays out.
 *
 * `id`, every `aria-*` and any `data-*` are forwarded to the divider.
 *
 * `className` and `style` are not props, and a value that gets past the types is dropped. So are
 * `type` and `plain`, the props of the old Divider.
 *
 * Visual values are `--divider-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts).
 *
 * Without a label the divider is `role="separator"` with `aria-orientation`. With a label it has
 * no role, since the children of a separator are presentational and a screen reader would skip
 * them. So the label is read as plain text. An `aria-label` or `aria-labelledby` keeps the role,
 * and the screen reader reads that name in place of the label.
 *
 * The divider is not focusable and reacts to neither hover nor keys.
 *
 * ### Size and spacing
 *
 * A horizontal divider fills the width of its parent and does not shrink in a flex column. `width`
 * sets a shorter line and `maxWidth` caps it. It adds no space above or below it: the parent sets it
 * with `gap`, or `spacing` sets it on the divider.
 *
 * A vertical divider is `0.9em` tall, so it follows the font size of the text around it, and is
 * centred on the text line. In a flex row it is centred like any other item. `height` sets a fixed
 * length and `maxHeight` caps it. It adds 8px on each side, so it sits between two pieces of inline
 * text without a wrapper. In a flex row that already has a `gap`, set `spacing` to `0`.
 *
 * ### Label
 *
 * Only a horizontal divider has a label, and the types reject `children` on a vertical one. The
 * label is centred and stays on one line. It is never truncated: the two lines beside it shrink
 * first, so keep it short.
 *
 * The label sets no font or colour, so it inherits them from the parent. To style it, pass a
 * `Typography` as the label.
 *
 * `false`, `null`, `''` and an empty fragment are no label. Any other element is a label, even a
 * component that renders nothing, so pass `undefined` when there is no label.
 *
 * ### Asserting on it
 *
 * `testId` is `data-testid` on the divider, and `${testId}-label` on the label. Otherwise use the
 * role and the data attributes, never the hashed class names.
 *
 * | root attribute | value |
 * |---|---|
 * | `data-slot` | `"divider"` |
 * | `data-orientation` | mirrors `orientation` |
 * | `data-dashed` | present only while `dashed` |
 * | `data-has-label` | present only while the label renders |
 *
 * | `data-slot` | rendered | `data-testid` |
 * |---|---|---|
 * | `divider-label` | only on a horizontal divider with `children` | `${testId}-label` |
 *
 * @example
 * ```tsx
 * <Divider />
 * ```
 *
 * @example
 * ```tsx
 * // Between two pieces of inline text
 * <Typography.Text>
 *   Back
 *   <Divider orientation="vertical" />
 *   {metricName}
 * </Typography.Text>
 * ```
 *
 * @example
 * ```tsx
 * // In a toolbar row that already has a gap
 * <Divider orientation="vertical" height={16} spacing={0} />
 * ```
 *
 * @example
 * ```tsx
 * // A label in the middle of the line, styled with Typography
 * <Divider>
 *   <Typography.Text color="muted" weight="medium">
 *     Or get started with these sample alerts
 *   </Typography.Text>
 * </Divider>
 * ```
 */
export const Divider = forwardRef<HTMLSpanElement, DividerProps>(function Divider(
	props: DividerProps & RejectedProps<'className' | 'style' | 'type' | 'plain'>,
	ref,
) {
	const {
		orientation = DividerOrientation.Horizontal,
		dashed = false,
		spacing,
		testId,
		width,
		maxWidth,
		height,
		maxHeight,
		children,
		className: _className,
		style: _style,
		type: _type,
		plain: _plain,
		...rest
	} = props;
	const vertical = orientation === DividerOrientation.Vertical;
	// Only the props of the orientation in force are read, so a `width` on a vertical divider or
	// `children` on any vertical one that gets past the types is dropped.
	const label = vertical ? undefined : (children as ReactNode);
	const hasLabel = hasRenderableContent(label);
	const isSeparator = !hasLabel || rest['aria-label'] != null || rest['aria-labelledby'] != null;
	const length = (vertical ? height : width) as Length;
	const maxLength = (vertical ? maxHeight : maxWidth) as Length;
	const axis = vertical ? 'height' : 'width';

	const rootStyle = {
		...(spacing != null && { '--divider-internal-spacing': toCssLength(spacing) }),
		...(length != null && { [`--divider-internal-${axis}`]: toCssLength(length) }),
		...(maxLength != null && { [`--divider-internal-max-${axis}`]: toCssLength(maxLength) }),
	} as CSSProperties;

	return (
		<span
			{...rest}
			ref={ref}
			// Written after the spread, so a stray `role` cannot hide the label of a labelled divider.
			role={isSeparator ? 'separator' : undefined}
			aria-orientation={isSeparator ? orientation : undefined}
			data-slot="divider"
			data-orientation={orientation}
			data-dashed={dashed || undefined}
			data-has-label={hasLabel || undefined}
			className={styles.divider}
			style={rootStyle}
			{...(testId === undefined ? {} : { 'data-testid': testId })}
		>
			{hasLabel && (
				<span
					data-slot="divider-label"
					data-testid={partTestId(testId, 'label')}
					className={styles['divider__label']}
				>
					{label}
				</span>
			)}
		</span>
	);
});
