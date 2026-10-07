import type { AriaAttributes, ComponentProps, ReactNode } from 'react';
import type { ResizableOrientation } from './constants.js';

export type ResizableOrientationType =
	(typeof ResizableOrientation)[keyof typeof ResizableOrientation];

/**
 * A size with its unit: `'25%'`, `'240px'` or `'15rem'`. A percentage is a share of the root along
 * `orientation`.
 *
 * @note A number, or a string with no unit, does not type check. `react-resizable-panels` reads
 * `25` as pixels and `'25'` as a percentage, and the two look alike in review.
 */
export type ResizableSizeType = `${number}%` | `${number}px` | `${number}rem`;

/**
 * Where a layout is saved. `localStorage` and `sessionStorage` fit, and so does any object with
 * the same two methods.
 */
export type ResizableStorageType = Pick<Storage, 'getItem' | 'setItem'>;

/**
 * One panel, and the handle that follows it.
 */
export type ResizableItemType = {
	/**
	 * This panel's identity. Keys the saved layout, and names the `data-testid` of the panel and of
	 * the handle after it.
	 *
	 * @note Unique across `items`. A repeated `value` renders only its first panel, and the
	 * component logs a warning.
	 */
	value: string;
	/**
	 * Names the handle after this panel for a screen reader. Not shown. An empty or blank `label`
	 * leaves the handle with no name, and the component logs a warning.
	 *
	 * @note Required on the last panel too, which has no handle, so reordering `items` never leaves
	 * a handle without a name.
	 */
	label: string;
	/**
	 * The content of the panel. It scrolls when it is larger than the panel, so the other panels do
	 * not move. A child with `height: 100%` fills the panel.
	 */
	children: ReactNode;
	/**
	 * The size the panel starts at. Without it, the panel shares the room the others leave in equal
	 * parts.
	 *
	 * @note In `px` or `rem`, the panel keeps its size in pixels when the root changes size, and the
	 * other panels take the change. In `%`, or with no `defaultSize`, it keeps its share of the root.
	 */
	defaultSize?: ResizableSizeType;
	/**
	 * The smallest the panel gets. The handle stops there.
	 *
	 * @default '0%'
	 */
	minSize?: ResizableSizeType;
	/**
	 * The largest the panel gets. The handle stops there.
	 *
	 * @default '100%'
	 */
	maxSize?: ResizableSizeType;
	/**
	 * Called with the size of the panel in pixels each time it changes: its width in a horizontal
	 * Resizable, its height in a vertical one.
	 *
	 * @note Also called on mount, and when the root changes size.
	 */
	onResize?: (size: number) => void;
};

/**
 * What `data-testid` on `Resizable` reads as: the rule to write `testId` instead.
 */
export interface ResizableDataTestIdIsWrittenAsTestId {
	'`data-testid` is written as the `testId` prop, which lands on the root and names every panel and handle': never;
}

export type ResizableProps = Pick<ComponentProps<'div'>, 'id'> &
	AriaAttributes & {
		/**
		 * The panels, in the order they are rendered. A handle sits between each pair. The
		 * component owns its markup, so there are no children to compose.
		 *
		 * @note With one panel, the panel fills the root and there is no handle. An empty `items`
		 * renders the root with nothing inside, and the component logs a warning.
		 */
		items: readonly ResizableItemType[];
		/**
		 * How the panels line up. `horizontal` puts them side by side, `vertical` stacks them. Also
		 * picks the arrow keys that move a handle, and whether `onResize` reports a width or a
		 * height.
		 */
		orientation: ResizableOrientationType;
		/**
		 * Saves the layout under this key when the user resizes, and restores it on the next mount.
		 * Without it, the panels start from their `defaultSize` on every mount.
		 *
		 * @note Each set of panel `value`s, in its order, and each `orientation` keeps its own layout
		 * under the key.
		 *
		 * @note A new `storageKey` applies the layout saved under it. With none saved there, the
		 * panels stay where they are.
		 */
		storageKey?: string;
		/**
		 * Where the layout is saved. Only read when `storageKey` is set.
		 *
		 * @default localStorage
		 */
		storage?: ResizableStorageType;
		/**
		 * Forwarded to the root as `data-testid`, and the stem every panel and handle is named from.
		 */
		testId?: string;
		/**
		 * Written as `testId`.
		 */
		'data-testid'?: ResizableDataTestIdIsWrittenAsTestId;
		/**
		 * Any `data-*` prop is accepted and forwarded to the root, alongside `aria-*`.
		 */
		[key: `data-${string}`]: unknown;
	};
