import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import * as React from 'react';
import { cn } from '../lib/utils.js';
import type { ToggleColor } from '../toggle/index.js';
import styles from './toggle-group.module.scss';

export type { ToggleColor } from '../toggle/index.js';
export { ToggleColorValue } from '../toggle/index.js';

export type ToggleGroupProps = (
	| {
			type: 'single';
			/**
			 * The controlled stateful value of the item that is pressed.
			 */
			value?: string;
			/**
			 * The value of the item that is pressed when initially rendered. Use
			 * `defaultValue` if you do not need to control the state of a toggle group.
			 */
			defaultValue?: string;
			/**
			 * The callback that fires when the value of the toggle group changes.
			 */
			onChange?(value: string): void;
	  }
	| {
			type: 'multiple';
			/**
			 * The controlled stateful value of the items that are pressed.
			 */
			value?: string[];
			/**
			 * The value of the items that are pressed when initially rendered. Use
			 * `defaultValue` if you do not need to control the state of a toggle group.
			 */
			defaultValue?: string[];
			/**
			 * The callback that fires when the state of the toggle group changes.
			 */
			onChange?(value: string[]): void;
	  }
) & {
	/**
	 * Whether the group is disabled from user interaction.
	 * @defaultValue false
	 */
	disabled?: boolean;
	/**
	 * Whether the group should maintain roving focus of its buttons.
	 * @defaultValue true
	 */
	rovingFocus?: boolean;
	/**
	 * The loop of the toggle group.
	 */
	loop?: boolean;
	/**
	 * The orientation of the toggle group.
	 */
	orientation?: 'horizontal' | 'vertical';
	/**
	 * The direction of the toggle group.
	 */
	dir?: 'ltr' | 'rtl';
	/**
	 * The testId associated with the toggle group.
	 */
	testId?: string;
	/**
	 * The size of the toggle group.
	 * @default 'default'
	 */
	size?: 'default' | 'sm' | 'lg';
	/**
	 * The color of the toggle group.
	 * @default 'secondary'
	 */
	color?: ToggleColor;
} & Pick<React.ComponentPropsWithoutRef<'div'>, 'id' | 'className' | 'style' | 'children'>;

/**
 * A set of two-state buttons that can be toggled on or off, in single or multiple selection mode.
 * Use ToggleGroupItem as children for full control over each option.
 *
 * @example Manual composition with ToggleGroupItem
 * ```tsx
 * <ToggleGroup type="single" defaultValue="center">
 *   <ToggleGroupItem value="left" aria-label="Align left">
 *     <AlignLeft className="h-3 w-3" />
 *   </ToggleGroupItem>
 *   <ToggleGroupItem value="center" aria-label="Align center">
 *     <AlignCenter className="h-3 w-3" />
 *   </ToggleGroupItem>
 *   <ToggleGroupItem value="right" aria-label="Align right">
 *     <AlignRight className="h-3 w-3" />
 *   </ToggleGroupItem>
 * </ToggleGroup>
 * ```
 *
 * @example Items-based usage (icon, label, or both)
 * ```tsx
 * import { ToggleGroupSimple } from '@signozhq/ui';
 *
 * const items = [
 *   { value: 'bold', label: <Bold className="h-3 w-3" />, 'aria-label': 'Bold' },
 *   { value: 'grid', label: <><LayoutGrid className="h-6 w-6" /> Label</> },
 * ];
 * <ToggleGroupSimple type="single" items={items} defaultValue="bold" />
 * ```
 */
export const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
	(
		{ className, children, size = 'default', color = 'secondary', onChange, testId, ...props },
		ref
	) => (
		<ToggleGroupPrimitive.Root
			ref={ref}
			data-slot="toggle-group"
			data-size={size}
			data-color={color}
			data-testid={testId}
			className={cn(styles['toggle-group'], className)}
			onValueChange={onChange as (value: string | string[]) => void}
			{...props}
		>
			{children}
		</ToggleGroupPrimitive.Root>
	)
);

export type ToggleGroupItemProps = {
	/**
	 * The value of the toggle group item.
	 */
	value: string;
	/**
	 * The testId associated with the toggle group item.
	 */
	testId?: string;
} & Pick<
	React.ComponentPropsWithoutRef<'button'>,
	'className' | 'style' | 'id' | 'disabled' | 'aria-disabled' | 'onClick' | 'children'
>;

/**
 * A single toggle option within ToggleGroup. Use as child of ToggleGroup.
 *
 * @example Icon only
 * ```tsx
 * <ToggleGroupItem value="bold" aria-label="Bold">
 *   <Bold className="h-3 w-3" />
 * </ToggleGroupItem>
 * ```
 *
 * @example Icon and label
 * ```tsx
 * <ToggleGroupItem value="grid">
 *   <LayoutGrid className="h-6 w-6" /> Label
 * </ToggleGroupItem>
 * ```
 *
 * @example Prefer ToggleGroupSimple for items-based API
 * ```tsx
 * <ToggleGroupSimple
 *   type="single"
 *   items={[{ value: 'a', label: 'Option A' }, { value: 'b', label: <><Icon /> Option B</> }]}
 *   defaultValue="a"
 * />
 * ```
 */
export const ToggleGroupItem = React.forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
	({ className, value, testId, ...props }, ref) => (
		<ToggleGroupPrimitive.Item
			ref={ref}
			data-slot="toggle-group-item"
			data-testid={testId}
			value={value}
			className={cn(styles['toggle-group-item'], className)}
			{...props}
		/>
	)
);
