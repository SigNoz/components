import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { type CSSProperties, type MutableRefObject, type ReactNode, useMemo } from 'react';
import { toCssLength } from '../../lib/css-length.js';
import { useLayerZIndex } from '../../lib/layer-z-index.js';
import { usePopupContainer } from '../../lib/popup-container.js';
import { useScrollEdges } from '../../lib/use-scroll-edges.js';
import { partTestId } from '../../lib/utils.js';
import { Spinner } from '../../spinner/spinner.js';
import { COMBOBOX_EMPTY_CONTENT, COMBOBOX_SIDE_OFFSET } from '../constants.js';
import styles from '../combobox.module.scss';
import type {
	ComboboxFooterActionType,
	ComboboxProps,
	ComboboxSearchInputProps,
} from '../types.js';
import { type ComboboxEntry, flattenComboboxRows } from '../utils.js';
import { ComboboxFooterAction } from './combobox-footer-action.js';
import { ComboboxRows } from './combobox-rows.js';
import { ComboboxSearch } from './combobox-search.js';
import { type ComboboxVirtualScroller, ComboboxVirtualRows } from './combobox-virtual-rows.js';

/**
 * @access private
 */
export type ComboboxPopupProps = {
	trigger: Element | null;
	accessibleName: string | undefined;
	labelledBy: string | undefined;
	container: ComboboxProps['container'];
	contentMaxWidth: ComboboxProps['contentMaxWidth'];
	contentMaxHeight: ComboboxProps['contentMaxHeight'];
	searchInputProps: ComboboxSearchInputProps;
	entries: readonly ComboboxEntry[];
	optionCount: number;
	virtualized: boolean;
	scrollerRef: MutableRefObject<ComboboxVirtualScroller | null>;
	loading: boolean;
	loadingContent: ReactNode;
	noContent: ReactNode;
	footerAction: ComboboxFooterActionType | undefined;
	onFooterAction: () => void;
	multiple: boolean;
	createLabel: ((query: string) => ReactNode) | undefined;
	testId: string | undefined;
};

/**
 * The portalled popup: the search row, the scrolling rows, and the footer action under them.
 *
 * @access private
 */
export function ComboboxPopup({
	trigger,
	accessibleName,
	labelledBy,
	container,
	contentMaxWidth,
	contentMaxHeight,
	searchInputProps,
	entries,
	optionCount,
	virtualized,
	scrollerRef,
	loading,
	loadingContent,
	noContent,
	footerAction,
	onFooterAction,
	multiple,
	createLabel,
	testId,
}: ComboboxPopupProps): ReactNode {
	const popupContainer = usePopupContainer();
	// `viewportElement` is state, not a ref: the virtualizer reads its scroll element in a layout
	// effect, which runs before React attaches the ref of the viewport around it.
	const {
		ref: viewportRef,
		element: viewportElement,
		edges,
		measure,
	} = useScrollEdges<HTMLDivElement>();
	const virtualRows = useMemo(
		() => (virtualized ? flattenComboboxRows(entries) : []),
		[virtualized, entries],
	);

	const popupStyle = {
		...(contentMaxWidth != null && {
			'--combobox-internal-max-inline-size': toCssLength(contentMaxWidth),
		}),
		...(contentMaxHeight != null && {
			'--combobox-internal-max-block-size': toCssLength(contentMaxHeight),
		}),
	} as CSSProperties;

	const rowProps = { comboboxTestId: testId, multiple, createLabel };

	return (
		<BaseCombobox.Portal container={container === undefined ? popupContainer : container}>
			<ComboboxPositioner trigger={trigger}>
				<BaseCombobox.Popup
					data-slot="combobox-popup"
					aria-label={accessibleName}
					aria-labelledby={labelledBy}
					className={styles['combobox__popup']}
					style={popupStyle}
				>
					<ComboboxSearch searchInputProps={searchInputProps} comboboxTestId={testId} />
					<div
						ref={viewportRef}
						data-slot="combobox-viewport"
						data-scroll-start={edges.start || undefined}
						data-scroll-end={edges.end || undefined}
						className={styles['combobox__viewport']}
						onScroll={measure}
					>
						{loading && (
							<div
								data-slot="combobox-loading"
								data-testid={partTestId(testId, 'loading')}
								className={styles['combobox__loading']}
							>
								{loadingContent ?? <Spinner size={14} />}
							</div>
						)}
						{!loading && entries.length === 0 && (
							<div
								data-slot="combobox-empty"
								data-testid={partTestId(testId, 'empty')}
								className={styles['combobox__empty']}
							>
								{noContent ?? COMBOBOX_EMPTY_CONTENT}
							</div>
						)}
						<BaseCombobox.List data-slot="combobox-list" className={styles['combobox__list']}>
							{loading ? null : virtualized ? (
								<ComboboxVirtualRows
									rows={virtualRows}
									optionCount={optionCount}
									scrollElement={viewportElement}
									scrollerRef={scrollerRef}
									{...rowProps}
								/>
							) : (
								<ComboboxRows entries={entries} {...rowProps} />
							)}
						</BaseCombobox.List>
					</div>
					{footerAction !== undefined && (
						<ComboboxFooterAction
							action={footerAction}
							comboboxTestId={testId}
							onPress={onFooterAction}
						/>
					)}
				</BaseCombobox.Popup>
			</ComboboxPositioner>
		</BaseCombobox.Portal>
	);
}

/**
 * Mounts on open, so the layer around the trigger is read once per open.
 */
function ComboboxPositioner({
	trigger,
	children,
}: {
	trigger: Element | null;
	children: ReactNode;
}): ReactNode {
	const layerStyle = useLayerZIndex(trigger, 'var(--combobox-z-index, 50)');

	return (
		<BaseCombobox.Positioner
			side="bottom"
			align="start"
			sideOffset={COMBOBOX_SIDE_OFFSET}
			data-slot="combobox-positioner"
			className={styles['combobox__positioner']}
			style={layerStyle}
		>
			{children}
		</BaseCombobox.Positioner>
	);
}
