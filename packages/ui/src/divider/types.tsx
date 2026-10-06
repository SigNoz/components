import type { AriaAttributes, ComponentProps, CSSProperties, ReactNode } from 'react';
import type { DividerOrientation } from './constants.js';

export type DividerOrientationType = (typeof DividerOrientation)[keyof typeof DividerOrientation];

type DividerBaseProps = Pick<ComponentProps<'span'>, 'id'> &
	// JSX does not type-check hyphenated names, so this `Omit` only keeps it out of the docs. The
	// divider writes its own after the spread, so a caller value never wins.
	Omit<AriaAttributes, 'aria-orientation'> & {
		/**
		 * Draws the line dashed instead of solid. On a divider with a label, both lines are dashed.
		 *
		 * @default false
		 */
		dashed?: boolean;
		/**
		 * Forwarded to the divider as `data-testid`. The label takes `${testId}-label`.
		 */
		testId?: string;
		/**
		 * Any `data-*` prop is accepted and forwarded to the divider.
		 */
		[key: `data-${string}`]: unknown;
	};

// The compiler prints these names, so a prop of the other orientation reads as the rule instead of
// a mismatch on `orientation`. The required key keeps a string, a number or an element from
// matching them. `DividerProps` lists the vertical branch first: when the props fit both branches
// equally, TypeScript reports the last one, and a divider without `orientation` is horizontal.
interface OnlyAHorizontalDividerHasALabel {
	'`children` is the label, and only a horizontal divider has one': never;
}

interface OnlyAHorizontalDividerTakesAWidth {
	'`width` and `maxWidth` are the length of a horizontal divider, a vertical one takes `height`': never;
}

interface OnlyAVerticalDividerTakesAHeight {
	'`height` and `maxHeight` are the length of a vertical divider, a horizontal one takes `width`': never;
}

export type DividerHorizontalProps = DividerBaseProps & {
	/**
	 * The direction of the line. Also sets `aria-orientation` on a divider without a label.
	 *
	 * @default 'horizontal'
	 */
	orientation?: (typeof DividerOrientation)['Horizontal'];
	/**
	 * A short label in the middle of the line. It stays on one line and is never truncated: the
	 * lines beside it shrink first.
	 *
	 * @note The label sets no font or colour and inherits them. To style it, pass a `Typography`.
	 *
	 * @note With a label the divider has no `role`, so a screen reader reads the label as text.
	 */
	children?: ReactNode;
	/**
	 * The length of the line. Without it the divider fills its parent. Numbers are written as `px`.
	 */
	width?: CSSProperties['width'];
	/**
	 * The max-width of the divider. Numbers are written as `px`.
	 *
	 * @default '100%'
	 */
	maxWidth?: CSSProperties['maxWidth'];
	/**
	 * The space above and below the line. Numbers are written as `px`.
	 *
	 * @note Two lengths in a string set the space above, then below: `'10px 16px'`.
	 *
	 * @default 0
	 */
	spacing?: CSSProperties['marginBlock'];
	/**
	 * Only a vertical divider takes a height.
	 */
	height?: OnlyAVerticalDividerTakesAHeight;
	/**
	 * Only a vertical divider takes a max-height.
	 */
	maxHeight?: OnlyAVerticalDividerTakesAHeight;
};

export type DividerVerticalProps = DividerBaseProps & {
	/**
	 * The direction of the line. Also sets `aria-orientation`. Without it the divider is horizontal.
	 */
	orientation: (typeof DividerOrientation)['Vertical'];
	/**
	 * Only a horizontal divider has a label.
	 */
	children?: OnlyAHorizontalDividerHasALabel;
	/**
	 * The length of the line. Without it the divider is `0.9em` tall, so it follows the font size
	 * of the text around it. Numbers are written as `px`.
	 *
	 * @default '0.9em'
	 */
	height?: CSSProperties['height'];
	/**
	 * The max-height of the divider. Numbers are written as `px`.
	 *
	 * @default '100%'
	 */
	maxHeight?: CSSProperties['maxHeight'];
	/**
	 * The space on each side of the line. Numbers are written as `px`.
	 *
	 * @note In a row that already has a `gap`, set it to `0`.
	 *
	 * @default 8
	 */
	spacing?: CSSProperties['marginInline'];
	/**
	 * Only a horizontal divider takes a width.
	 */
	width?: OnlyAHorizontalDividerTakesAWidth;
	/**
	 * Only a horizontal divider takes a max-width.
	 */
	maxWidth?: OnlyAHorizontalDividerTakesAWidth;
};

export type DividerProps = DividerVerticalProps | DividerHorizontalProps;
