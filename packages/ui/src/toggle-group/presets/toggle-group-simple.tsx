import * as React from 'react';
import { ToggleGroup, ToggleGroupItem, type ToggleGroupProps } from '../toggle-group.js';

export type ToggleGroupSimpleItem = {
	/**
	 * Unique value for the option.
	 */
	value: string;
	/**
	 * Display content. Can be string, icon only, or ReactNode (e.g. icon + text).
	 */
	label: React.ReactNode;
	/**
	 * Optional aria-label for accessibility when label is icon-only or complex.
	 */
	'aria-label'?: string;
};

export type ToggleGroupSimpleProps = Omit<ToggleGroupProps, 'children'> & {
	/**
	 * List of items to display.
	 */
	items?: ToggleGroupSimpleItem[];
};

const ToggleGroupSimpleInner = React.forwardRef<HTMLDivElement, ToggleGroupSimpleProps>(
	({ items = [], size = 'default', color = 'secondary', ...props }, ref) => {
		return (
			<ToggleGroup
				ref={ref}
				size={size}
				color={color}
				{...(props as React.ComponentProps<typeof ToggleGroup>)}
			>
				{items.map((item) => (
					<ToggleGroupItem key={item.value} value={item.value} aria-label={item['aria-label']}>
						{item.label}
					</ToggleGroupItem>
				))}
			</ToggleGroup>
		);
	}
);

/**
 * Minimal toggle group preset. Accepts a list of items and renders toggle buttons
 * with minimal configuration. Supports icon-only, label-only, or icon + label via
 * label as ReactNode.
 *
 * @example Flat items (value + string label)
 * ```tsx
 * const items = [
 *   { value: 'left', label: 'Left' },
 *   { value: 'center', label: 'Center' },
 *   { value: 'right', label: 'Right' },
 * ];
 *
 * <ToggleGroupSimple
 *   type="single"
 *   items={items}
 *   defaultValue="center"
 *   onValueChange={setValue}
 * />
 * ```
 *
 * @example Items with icon only
 * ```tsx
 * const items = [
 *   { value: 'bold', label: <Bold className="h-3 w-3" />, 'aria-label': 'Bold' },
 *   { value: 'italic', label: <Italic className="h-3 w-3" />, 'aria-label': 'Italic' },
 * ];
 *
 * <ToggleGroupSimple type="multiple" items={items} defaultValue={['bold']} />
 * ```
 *
 * @example Items with icon and label (ReactNode)
 * ```tsx
 * const items = [
 *   { value: 'grid', label: <><LayoutGrid className="h-6 w-6" /> Label</> },
 *   { value: 'list', label: <><List className="h-6 w-6" /> Label</> },
 * ];
 *
 * <ToggleGroupSimple type="single" items={items} defaultValue="grid" />
 * ```
 */
export const ToggleGroupSimple = React.memo(ToggleGroupSimpleInner);
