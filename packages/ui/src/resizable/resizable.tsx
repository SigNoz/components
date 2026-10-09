import { Fragment, forwardRef, useEffect, useId, useRef, useState } from 'react';
import { Group, type GroupImperativeHandle, type Layout } from 'react-resizable-panels';
import { setRef } from '../lib/merge-refs.js';
import { useIsomorphicLayoutEffect } from '../lib/use-isomorphic-layout-effect.js';
import { partTestId, type RejectedProps } from '../lib/utils.js';
import styles from './resizable.module.scss';
import { ResizableHandle } from './subcomponents/resizable-handle.js';
import { ResizablePanel } from './subcomponents/resizable-panel.js';
import type { ResizableProps } from './types.js';
import {
	createLayout,
	encodeValue,
	isBlankLabel,
	isFixedSize,
	measurePanels,
	type ResizableLayout,
	type ResizableLayoutPanel,
	readLayout,
	restoreLayout,
	useTestIdAttribute,
	writeLayout,
} from './utils.js';

type DroppedProps =
	| 'className'
	| 'style'
	| 'children'
	| 'defaultLayout'
	| 'onLayoutChange'
	| 'onLayoutChanged'
	| 'disabled'
	| 'disableCursor'
	| 'groupRef'
	| 'resizeTargetMinimumSize';

/**
 * Two or more panels, side by side or stacked, with a handle between each pair
 * (`react-resizable-panels`). The user drags a handle, or moves it from the keyboard, to give one
 * panel more room and its neighbour less.
 *
 * The ref, `id`, `aria-*` and `data-*` land on the root. With `aria-label` or `aria-labelledby`,
 * the root is a `group` with that name. Without, it has no role.
 *
 * Visual values are `--resizable-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts).
 *
 * Each handle is a `separator` in the window splitter pattern. It controls the panel before it: it
 * takes that panel's `label` as its name, points at it with `aria-controls`, and reports its size
 * in percent of the root through `aria-valuenow`. `aria-valuemin` and `aria-valuemax` give that
 * panel's limits on the first handle only: `react-resizable-panels` works out the limits of every
 * handle by moving the first one. Panels have no role.
 *
 * ### Sizes
 *
 * When every panel has a `defaultSize` in `px` or `rem`, no panel is left to take a change of the
 * root's size. The last one takes it, and the component logs a warning.
 *
 * ### Moving a handle
 *
 * The handle takes the pointer within a band around its line, 10px wide with a mouse and 20px with
 * touch.
 *
 * Each handle is a focus stop, in the order of `items`. The arrow keys of the axis move it by 5% of
 * the root, and the arrows of the other axis do nothing. `Home` and `End` move it as far as the
 * limits allow. `F6` and `Shift+F6` move the focus to the next and the previous handle, and wrap.
 *
 * A double-click on a handle puts the panel before it back to its `defaultSize`, or the panel after
 * it when the one before has none.
 *
 * ### Saving the layout
 *
 * With `storageKey`, the layout is saved to `storage` when a drag ends, after each key press and
 * after a double-click, and restored on the next mount within the current limits. A panel in `px`
 * or `rem` gets its pixels back, and the other panels share the rest as they were saved, the same as
 * when the root changes size. A saved layout that does not parse, or a `storage` that throws, falls
 * back to the `defaultSize`s.
 *
 * A panel that leaves `items` and comes back gets its size back, and the others theirs. Without
 * `storageKey` this holds while the component stays mounted.
 *
 * ### Filling the room
 *
 * The root fills its parent: all of a block parent, and the room the siblings leave in a flex
 * parent. A vertical Resizable in a parent with no height has no room for its panels.
 *
 * A Resizable nested in a panel fills it with no wrapper.
 *
 * ### Asserting on it
 *
 * `testId` lands on the root and names every panel and handle as `` `${testId}-panel-${value}` ``
 * and `` `${testId}-handle-${value}` ``. A handle takes the `value` of the panel before it.
 *
 * | Attribute | On | When |
 * | --- | --- | --- |
 * | `data-orientation` | `resizable` | Always, mirrors `orientation` |
 *
 * | `data-slot` | Rendered | Test ID |
 * | --- | --- | --- |
 * | `resizable` | Always, the root | `{testId}` |
 * | `resizable-panel` | Per panel, the box that scrolls | `{testId}-panel-{value}` |
 * | `resizable-handle` | Between each pair of panels | `{testId}-handle-{value}` |
 * | `resizable-handle-grip` | Per handle | |
 *
 * The `data-group`, `data-panel` and `data-separator` attributes come from
 * `react-resizable-panels` and are not part of the API. Use the slots, never the hashed class names.
 *
 * @example
 * ```tsx
 * <Resizable
 *   orientation="horizontal"
 *   items={[
 *     { value: 'editor', label: 'Editor', defaultSize: '75%', minSize: '50%', children: <Editor /> },
 *     { value: 'settings', label: 'Settings', children: <Settings /> },
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // A side panel that keeps its width, and reports it
 * <Resizable
 *   orientation="horizontal"
 *   items={[
 *     { value: 'tree', label: 'Span tree', defaultSize: '450px', minSize: '240px', maxSize: '900px', onResize: setTreeWidth, children: <SpanTree /> },
 *     { value: 'timeline', label: 'Timeline', children: <Timeline /> },
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Saved across visits
 * <Resizable orientation="vertical" storageKey="panel-editor" items={rows} />
 * ```
 */
export const Resizable = forwardRef<HTMLDivElement, ResizableProps>(function Resizable(
	props: ResizableProps & RejectedProps<DroppedProps>,
	ref,
) {
	const {
		items,
		orientation,
		storageKey,
		storage,
		testId,
		id,
		className: _className,
		style: _style,
		children: _children,
		defaultLayout: _defaultLayout,
		onLayoutChange: _onLayoutChange,
		onLayoutChanged: _onLayoutChanged,
		disabled: _disabled,
		disableCursor: _disableCursor,
		groupRef: _groupRef,
		resizeTargetMinimumSize: _resizeTargetMinimumSize,
		...rest
	} = props;

	const baseId = useId();
	const groupId = id ?? baseId;
	const rootRef = useRef<HTMLDivElement>(null);
	const groupRef = useRef<GroupImperativeHandle>(null);
	const restoredKey = useRef<string | undefined>(undefined);
	// The layout read for `restoredKey` while the root had no room to apply it.
	const pendingLayout = useRef<ResizableLayout | undefined>(undefined);
	// Applies `pendingLayout` when the root has room for it. Replaced on every render, so the
	// observer of the root sees the current panels.
	const applyPendingLayout = useRef<() => void>(() => {});
	// The double-click being dispatched, from the capture listener of the window to the one of
	// `<html>`.
	const doubleClick = useRef<Event | null>(null);
	// The panel ids of the last layout the library reported, sorted and joined. It reports one once
	// it has registered the panels, which it does in an effect of its own, in the order it sorts them
	// in: by position, so right to left in a right-to-left page.
	const [registeredPanels, setRegisteredPanels] = useState('');

	useTestIdAttribute(rootRef, testId, groupId);

	// The library wraps `elementRef` in a callback that never changes, so React would never hand a
	// new `ref` the node, or an old one `null`.
	useIsomorphicLayoutEffect(() => {
		setRef(ref, rootRef.current);

		return () => {
			setRef(ref, null);
		};
	}, [ref]);

	// The library throws on two panels with the same id.
	const uniqueItems = items.filter(
		(item, index) => items.findIndex((other) => other.value === item.value) === index,
	);
	const isAllFixed =
		uniqueItems.length > 1 && uniqueItems.every((item) => isFixedSize(item.defaultSize));
	// `value` goes through `encodeValue` wherever it is joined: an id holds no whitespace, so
	// `aria-controls` stays one IDREF, and a `:` in a value cannot pass for the separator of the key.
	// The ids hold the position too. The library sorts its panels and handles only when they
	// register, so a panel that moves in `items` registers again under its new id.
	const panels: ResizableLayoutPanel[] = uniqueItems.map((item, index) => ({
		value: item.value,
		id: `${baseId}-panel-${index}-${encodeValue(item.value)}`,
		// With every panel fixed nothing would take a change of the root, so the last one does.
		fixed: isFixedSize(item.defaultSize) && !(isAllFixed && index === uniqueItems.length - 1),
	}));
	const values = panels.map((panel) => panel.value);
	const panelSet = panels
		.map((panel) => panel.id)
		.sort()
		.join(',');
	const encodedValues = values.map((value) => encodeValue(value));
	const layoutKey =
		storageKey === undefined
			? undefined
			: [encodeValue(storageKey), orientation, ...encodedValues].join(':');
	const isSaved = layoutKey !== undefined;

	const isEmpty = items.length === 0;
	const hasDuplicateValue = uniqueItems.length < items.length;
	// The last panel has no handle to name.
	const hasUnnamedHandle = uniqueItems.slice(0, -1).some((item) => isBlankLabel(item.label));

	useEffect(() => {
		if (isEmpty) {
			console.warn('Resizable: `items` is empty, rendering an empty root.');
		}
	}, [isEmpty]);

	useEffect(() => {
		if (hasDuplicateValue) {
			console.warn('Resizable: two items share a `value`, so only the first of them renders.');
		}
	}, [hasDuplicateValue]);

	useEffect(() => {
		if (hasUnnamedHandle) {
			console.warn('Resizable: a panel has an empty `label`, so the handle after it has no name.');
		}
	}, [hasUnnamedHandle]);

	useEffect(() => {
		if (isAllFixed) {
			console.warn(
				'Resizable: every panel has a `defaultSize` in `px` or `rem`, so the last panel takes the change when the root changes size.',
			);
		}
	}, [isAllFixed]);

	// The saved layout goes in after the library has registered these panels, not as its
	// `defaultLayout`: that one is read in render, before the root has a size to turn saved pixels
	// into a share, and only when the panels register, so a new `storageKey` would never apply.
	useIsomorphicLayoutEffect(() => {
		const isRegistered = registeredPanels === panelSet;

		if (isRegistered && layoutKey !== restoredKey.current) {
			restoredKey.current = layoutKey;
			pendingLayout.current =
				layoutKey === undefined ? undefined : readLayout(storage, layoutKey, values);
		}

		applyPendingLayout.current = () => {
			const saved = pendingLayout.current;
			const root = rootRef.current;

			if (!isRegistered || saved === undefined || root === null) {
				return;
			}

			const room = measurePanels(root, orientation);

			// A hidden root has no room to turn saved pixels into a share, so they wait for it to show.
			if (room > 0) {
				pendingLayout.current = undefined;
				groupRef.current?.setLayout(restoreLayout(saved, panels, room));
			}
		};

		applyPendingLayout.current();
	});

	// A hidden root that shows renders nothing, so its size tells when the pending layout fits.
	useEffect(() => {
		const root = rootRef.current;

		if (!isSaved || root === null) {
			return;
		}

		const observer = new ResizeObserver(() => {
			applyPendingLayout.current();
		});

		observer.observe(root);

		return () => {
			observer.disconnect();
		};
	}, [isSaved]);

	// The library resets a panel on a double-click from a capture listener on the document, and
	// reports the new layout as no user interaction. A layout change between the capture listeners of
	// the window and of `<html>` is that reset, wherever the target is: the band reaches past the root.
	// A document listener that stops the double-click keeps it from `<html>`, so it also ends with its
	// dispatch.
	useEffect(() => {
		const ownerDocument = rootRef.current?.ownerDocument;
		const view = ownerDocument?.defaultView;

		if (ownerDocument === undefined || view === undefined || view === null) {
			return;
		}

		const html = ownerDocument.documentElement;

		function start(event: Event) {
			doubleClick.current = event;
		}

		function end() {
			doubleClick.current = null;
		}

		view.addEventListener('dblclick', start, true);
		html.addEventListener('dblclick', end, true);

		return () => {
			view.removeEventListener('dblclick', start, true);
			html.removeEventListener('dblclick', end, true);
		};
	}, []);

	function save(layout: Layout) {
		const root = rootRef.current;

		if (layoutKey === undefined || root === null) {
			return;
		}

		const room = measurePanels(root, orientation);

		// A hidden root, or one narrower than its handles, has nothing to save.
		if (room <= 0) {
			return;
		}

		const sizes = createLayout();

		for (const panel of panels) {
			const size = layout[panel.id];

			// A layout of another set of panels, reported while `items` changes.
			if (size === undefined) {
				return;
			}

			sizes[panel.value] = (size * room) / 100;
		}

		writeLayout(storage, layoutKey, sizes);
	}

	return (
		<Group
			{...rest}
			id={groupId}
			elementRef={rootRef}
			groupRef={groupRef}
			orientation={orientation}
			onLayoutChanged={(layout, meta) => {
				setRegisteredPanels(Object.keys(layout).sort().join(','));

				const isDoubleClick =
					doubleClick.current !== null && doubleClick.current.eventPhase !== Event.NONE;

				// Pointer releases, key presses and double-clicks. Mount and root resizes are not saved.
				if (meta.isUserInteraction || isDoubleClick) {
					save(layout);
				}
			}}
			role={
				rest['aria-label'] === undefined && rest['aria-labelledby'] === undefined
					? undefined
					: 'group'
			}
			data-slot="resizable"
			data-orientation={orientation}
			className={styles['resizable']}
		>
			{uniqueItems.map((item, index) => (
				<Fragment key={item.value}>
					<ResizablePanel
						item={item}
						id={panels[index].id}
						fixed={panels[index].fixed}
						testId={testId}
					/>
					{index < uniqueItems.length - 1 && (
						<ResizableHandle
							id={`${baseId}-handle-${index}-${encodeValue(item.value)}`}
							label={item.label}
							testId={partTestId(testId, `handle-${item.value}`)}
						/>
					)}
				</Fragment>
			))}
		</Group>
	);
});
