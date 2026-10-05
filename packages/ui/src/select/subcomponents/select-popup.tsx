import { Select as BaseSelect } from '@base-ui/react/select';
import type { CSSProperties, ReactNode } from 'react';
import { toCssLength } from '../../lib/css-length.js';
import { useLayerZIndex } from '../../lib/layer-z-index.js';
import { usePopupContainer } from '../../lib/popup-container.js';
import { useScrollEdges } from '../../lib/use-scroll-edges.js';
import { partTestId } from '../../lib/utils.js';
import { Spinner } from '../../spinner/spinner.js';
import { SELECT_EMPTY_CONTENT, SELECT_SIDE_OFFSET } from '../constants.js';
import styles from '../select.module.scss';
import type { SelectItemType, SelectProps } from '../types.js';
import { SelectRows } from './select-rows.js';

/**
 * @access private
 */
export type SelectPopupProps = {
	trigger: Element | null;
	accessibleName: string | undefined;
	labelledBy: string | undefined;
	container: SelectProps['container'];
	contentMaxWidth: SelectProps['contentMaxWidth'];
	contentMaxHeight: SelectProps['contentMaxHeight'];
	items: readonly SelectItemType[];
	loading: boolean;
	loadingContent: ReactNode;
	noContent: ReactNode;
	multiple: boolean;
	testId: string | undefined;
};

/**
 * The portalled popup: the loading or empty row, and the list, which is the part that scrolls.
 *
 * @access private
 */
export function SelectPopup({
	trigger,
	accessibleName,
	labelledBy,
	container,
	contentMaxWidth,
	contentMaxHeight,
	items,
	loading,
	loadingContent,
	noContent,
	multiple,
	testId,
}: SelectPopupProps): ReactNode {
	const popupContainer = usePopupContainer();
	const { ref: listRef, edges, measure } = useScrollEdges<HTMLDivElement>();

	const popupStyle = {
		...(contentMaxWidth != null && {
			'--select-internal-max-inline-size': toCssLength(contentMaxWidth),
		}),
		...(contentMaxHeight != null && {
			'--select-internal-max-block-size': toCssLength(contentMaxHeight),
		}),
	} as CSSProperties;

	return (
		<BaseSelect.Portal container={container === undefined ? popupContainer : container}>
			<SelectPositioner trigger={trigger}>
				<BaseSelect.Popup
					data-slot="select-popup"
					className={styles['select__popup']}
					style={popupStyle}
				>
					{loading && (
						<div
							data-slot="select-loading"
							data-testid={partTestId(testId, 'loading')}
							className={styles['select__loading']}
						>
							{loadingContent ?? <Spinner size={14} />}
						</div>
					)}
					{!loading && items.length === 0 && (
						<div
							data-slot="select-empty"
							data-testid={partTestId(testId, 'empty')}
							className={styles['select__empty']}
						>
							{noContent ?? SELECT_EMPTY_CONTENT}
						</div>
					)}
					<BaseSelect.List
						ref={listRef}
						data-slot="select-list"
						aria-label={accessibleName}
						aria-labelledby={labelledBy}
						data-scroll-start={edges.start || undefined}
						data-scroll-end={edges.end || undefined}
						className={styles['select__list']}
						onScroll={measure}
					>
						{loading ? null : (
							<SelectRows items={items} selectTestId={testId} multiple={multiple} />
						)}
					</BaseSelect.List>
				</BaseSelect.Popup>
			</SelectPositioner>
		</BaseSelect.Portal>
	);
}

/**
 * Mounts on open, so the layer around the trigger is read once per open.
 */
function SelectPositioner({
	trigger,
	children,
}: {
	trigger: Element | null;
	children: ReactNode;
}): ReactNode {
	const layerStyle = useLayerZIndex(trigger, 'var(--select-z-index, 50)');

	return (
		<BaseSelect.Positioner
			side="bottom"
			align="start"
			sideOffset={SELECT_SIDE_OFFSET}
			alignItemWithTrigger={false}
			data-slot="select-positioner"
			className={styles['select__positioner']}
			style={layerStyle}
		>
			{children}
		</BaseSelect.Positioner>
	);
}
