import type { AriaAttributes, CSSProperties, ReactElement, ReactNode } from 'react';
import type { CardSpacing, CardTextOverflow } from './constants.js';

export type CardTextOverflowType = (typeof CardTextOverflow)[keyof typeof CardTextOverflow];
// `Extract` builds a new union, which keeps this name in error messages. The bare indexed access
// resolves to the tuple's own union, which has no name, so errors print all 19 numbers.
export type CardSpacingType = Extract<(typeof CardSpacing)[number], number>;
export type CardMarginType = CardSpacingType | 'auto';

/**
 * What `headerSuffix` receives when it is a function. Spread it on a control that has no visible
 * label of its own, such as `Switch`, `Input` or `Select`.
 */
export type CardHeaderSuffixField = {
	/**
	 * The id of the control, unique to this card.
	 */
	id: string;
	/**
	 * The id of the title, which names the control.
	 */
	'aria-labelledby': string;
	/**
	 * The id of the description, which describes the control. Present only while the card has a
	 * description.
	 */
	'aria-describedby'?: string;
};

/**
 * The parts of a card that show a `Skeleton` while `loading`, on top of the body.
 *
 * The object itself means the card is loading, so each part takes only `true` and at least one is
 * set. Gate the whole object on the request, as in `isLoading && { header: true }`: an object built
 * from the request state, such as `{ header: isLoading }`, would keep the card loading after the
 * data arrives.
 */
export type CardLoadingParts =
	| {
			/**
			 * Swaps the title, the description and the `headerSuffix` for a `Skeleton` of the same
			 * shape.
			 */
			header: true;
			/**
			 * Swaps the `footerPrefix` and the `footerSuffix` for a `Skeleton` of the same shape.
			 */
			footer?: true;
	  }
	| {
			/**
			 * Swaps the title, the description and the `headerSuffix` for a `Skeleton` of the same
			 * shape.
			 */
			header?: true;
			/**
			 * Swaps the `footerPrefix` and the `footerSuffix` for a `Skeleton` of the same shape.
			 */
			footer: true;
	  };

export interface CardProps extends AriaAttributes {
	/**
	 * Forwarded to the card root.
	 */
	id?: string;
	/**
	 * Forwarded to the card root as `data-testid`. The parts derive theirs from it, as
	 * `{testId}-header`, `{testId}-title-prefix`, `{testId}-title`, `{testId}-title-suffix`,
	 * `{testId}-description`, `{testId}-header-suffix`, `{testId}-body`, `{testId}-footer`,
	 * `{testId}-footer-prefix` and `{testId}-footer-suffix`.
	 */
	testId?: string;
	/**
	 * The heading of the card, in the header. It renders as text, not as a heading element.
	 *
	 * @note The header renders when one of `title`, `titleSuffix`, `description` or `headerSuffix` is
	 * set. An empty `title` next to one of the others renders `<No title>` and logs a warning,
	 * since the title also names the `headerSuffix` control.
	 */
	title?: string;
	/**
	 * An icon before the title. It is decorative and hidden from screen readers.
	 *
	 * @note The card sets the icon size, the one passed on the element is ignored.
	 */
	titlePrefix?: ReactElement;
	/**
	 * Rendered right after the title, on the same line: a `Badge`, an info icon with a `Tooltip`, a
	 * spinner for a refetch. It never shrinks or wraps, so the title cuts first.
	 */
	titleSuffix?: ReactNode;
	/**
	 * One or two lines under the title that say what the card holds or what its setting does. It
	 * always wraps.
	 *
	 * @note Expected to be a string or inline text. An empty description renders nothing and
	 * leaves `aria-describedby` out.
	 */
	description?: ReactNode;
	/**
	 * What a long `title` does. `ellipsis` keeps it on one line and cuts the end, with a tooltip
	 * that shows the whole title while it is cut. `wrap` shows every line.
	 *
	 * @note `wrap` is for titles we write that name a setting, where a cut title is a cut label.
	 * `ellipsis` is for titles the user types, such as a panel name.
	 *
	 * @note The `ellipsis` cut follows the rendered width, not a character count. The full title
	 * stays in the DOM for a screen reader, and the tooltip opens on hover only, since the title is
	 * not focusable.
	 *
	 * @default 'ellipsis'
	 */
	textOverflow?: CardTextOverflowType;
	/**
	 * The actions at the end of the header row: a `Switch`, a `Button`, a `Select`, a `Tab`, a menu
	 * button. It keeps its own width, and sits at the top of the title line.
	 *
	 * @note As a function, it receives the ids that name the control after `title` and describe it
	 * with `description`. Spread them on a control that has no visible label of its own. A control
	 * without them, and without a label of its own, has no accessible name.
	 *
	 * @note An empty node renders no suffix slot, and the text takes the whole width.
	 */
	headerSuffix?: ReactNode | ((field: CardHeaderSuffixField) => ReactNode);
	/**
	 * Draws a line under the header, from one edge of the card to the other. Use it when the body
	 * starts with a chart, a table or a list that has no padding of its own.
	 *
	 * @default false
	 */
	headerDivider?: boolean;
	/**
	 * The body of the card: a chart, a form, a table, a list, an empty state, or any mix of them.
	 * The blocks are stacked in a column, `gap` apart.
	 *
	 * @note A `Divider` that is a direct child runs from one edge of the card to the other, over
	 * the padding of the body. One inside a wrapper keeps the width of the wrapper.
	 *
	 * @note A card with a header and no children renders no body, so a setting row is the header
	 * alone.
	 */
	children?: ReactNode;
	/**
	 * Rendered at the end of the footer: a `Button`, or a secondary and a primary button, primary
	 * last.
	 *
	 * @note The footer renders only when this or `footerPrefix` is set.
	 */
	footerSuffix?: ReactNode;
	/**
	 * Rendered at the start of the footer, apart from the `footerSuffix` actions: a link such as
	 * `View all`, or one line of hint text.
	 */
	footerPrefix?: ReactNode;
	/**
	 * Swaps `children` for a placeholder while the data of the card loads, and sets
	 * `aria-busy="true"` on the root.
	 *
	 * - `true` shows three text lines of `Skeleton` in the body, with the padding of the header and
	 *   the footer whatever the padding props are.
	 * - `{ header: true, footer: true }` does the same, and also swaps the header or the footer for
	 *   a `Skeleton` of the same shape, for a title or a footer hint that comes with the data. Any
	 *   object loads the card, so pass `isLoading && { header: true }`, never
	 *   `{ header: isLoading }`.
	 * - Any other node, such as a `Skeleton` shaped like the chart or the list about to render, is
	 *   shown in the body in place of `children`, inside the padding props.
	 *
	 * @note The body renders while it loads, even when there are no `children`. A header or a footer
	 * that is not loading stays interactive: a control in it that must wait for the data takes its
	 * own `loading` or `disabled`. A header or a footer that is loading renders only when the card
	 * has one.
	 *
	 * @default false
	 */
	loading?: ReactNode | CardLoadingParts;
	/**
	 * The width of the card. Numbers are written as `px`.
	 *
	 * @note Without it the card fills a block parent or a grid cell. In a flex row it is as wide as
	 * its content.
	 */
	width?: CSSProperties['width'];
	/**
	 * The max-width of the card. Numbers are written as `px`.
	 *
	 * @default '100%'
	 */
	maxWidth?: CSSProperties['maxWidth'];
	/**
	 * The height of the card. Without it the card grows with its content. Numbers are written as
	 * `px`.
	 *
	 * @note With a height the card is a column: the header and the footer keep their size and the
	 * body takes the rest, so a chart with `height: 100%` fills it. The card never scrolls, so
	 * content taller than the body overflows it.
	 */
	height?: CSSProperties['height'];
	/**
	 * The min-height of the card, such as a table card that keeps its size while it loads. Numbers
	 * are written as `px`.
	 */
	minHeight?: CSSProperties['minHeight'];
	/**
	 * The space between the edge of the body and its content, as a step of the spacing scale. Each
	 * step is 2px, so `8` is 16px.
	 *
	 * @note `paddingX` and `paddingY` win over `padding`, and `paddingTop`, `paddingRight`,
	 * `paddingBottom` and `paddingLeft` win over both: `padding={0} paddingTop={4}` is 8px on top
	 * and 0 elsewhere. The header and the footer keep their own padding.
	 *
	 * @note Under a header, the top padding of the body is the space under the title, since the
	 * header has no bottom padding of its own there. `padding={0}` puts the content right under the
	 * title: add `headerDivider`, or keep `paddingTop`.
	 *
	 * @note A body with `padding={0}` on every side clips its content to the corner radius of the
	 * card where it is the last part, and where it is the first when the card has no header. A body
	 * followed by a footer clips nothing.
	 *
	 * @default 8
	 */
	padding?: CardSpacingType;
	/**
	 * The body padding on the left and the right, such as `0` for a table whose cells bring their
	 * own. Wins over `padding`.
	 */
	paddingX?: CardSpacingType;
	/**
	 * The body padding on the top and the bottom. Wins over `padding`.
	 */
	paddingY?: CardSpacingType;
	/**
	 * The body padding on the top. Wins over `paddingY` and `padding`.
	 */
	paddingTop?: CardSpacingType;
	/**
	 * The body padding on the right. Wins over `paddingX` and `padding`.
	 */
	paddingRight?: CardSpacingType;
	/**
	 * The body padding on the bottom. Wins over `paddingY` and `padding`.
	 */
	paddingBottom?: CardSpacingType;
	/**
	 * The body padding on the left. Wins over `paddingX` and `padding`.
	 */
	paddingLeft?: CardSpacingType;
	/**
	 * The space between the blocks of the body, as a step of the spacing scale. `8` is 16px.
	 *
	 * @default 8
	 */
	gap?: CardSpacingType;
	/**
	 * The space around the card, as a step of the spacing scale. `auto` takes the free space, such
	 * as to push the card to the end of a flex row.
	 *
	 * @note `marginX` and `marginY` win over `margin`, and `marginTop`, `marginRight`,
	 * `marginBottom` and `marginLeft` win over both: `margin={4} marginBottom={8}` is 8px on three
	 * sides and 16px below. For a list or a grid of cards, prefer `gap` on the parent.
	 *
	 * @default 0
	 */
	margin?: CardMarginType;
	/**
	 * The space to the left and the right of the card. Wins over `margin`.
	 */
	marginX?: CardMarginType;
	/**
	 * The space above and below the card. Wins over `margin`.
	 */
	marginY?: CardMarginType;
	/**
	 * The space above the card. Wins over `marginY` and `margin`.
	 */
	marginTop?: CardMarginType;
	/**
	 * The space to the right of the card. Wins over `marginX` and `margin`.
	 */
	marginRight?: CardMarginType;
	/**
	 * The space below the card. Wins over `marginY` and `margin`.
	 */
	marginBottom?: CardMarginType;
	/**
	 * The space to the left of the card. Wins over `marginX` and `margin`.
	 */
	marginLeft?: CardMarginType;
	/**
	 * Any `data-*` prop is accepted and forwarded to the card root.
	 */
	[key: `data-${string}`]: unknown;
}
