import type React from 'react';

import {
	Popover,
	PopoverContent,
	type PopoverContentProps,
	type PopoverProps,
	PopoverTrigger,
} from '../popover.js';

export type PopoverSimpleProps = Pick<
	PopoverProps,
	'open' | 'defaultOpen' | 'onOpenChange' | 'modal'
> &
	Pick<
		PopoverContentProps,
		| 'className'
		| 'side'
		| 'sideOffset'
		| 'align'
		| 'alignOffset'
		| 'arrow'
		| 'forceMount'
		| 'avoidCollisions'
		| 'collisionPadding'
		| 'disableOutsidePointerEvents'
	> & {
		/**
		 * The element that opens the popover when clicked.
		 */
		trigger?: React.ReactNode;
		/**
		 * The content of the popover.
		 */
		children: React.ReactNode;
	};

/**
 * Preset that combines `Popover`, `PopoverTrigger`, and `PopoverContent` for simple use cases.
 * Pass `trigger` and `children` instead of composing subcomponents.
 *
 * @example
 * ```tsx
 * <PopoverSimple
 *   trigger={<Button variant="outline">Open</Button>}
 *   className="w-64"
 * >
 *   <p>Simple popover content</p>
 * </PopoverSimple>
 * ```
 *
 * @example
 * ```tsx
 * <PopoverSimple
 *   trigger={<Button>Pick date</Button>}
 *   side="bottom"
 *   align="start"
 *   arrow
 * >
 *   <Calendar mode="single" selected={date} onSelect={setDate} />
 * </PopoverSimple>
 * ```
 */
export function PopoverSimple({
	trigger,
	children,
	className,
	open,
	defaultOpen,
	onOpenChange,
	modal,
	side,
	sideOffset,
	align,
	alignOffset,
	arrow,
	forceMount,
	avoidCollisions,
	collisionPadding,
}: PopoverSimpleProps) {
	return (
		<Popover open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={modal}>
			{trigger && <PopoverTrigger asChild>{trigger}</PopoverTrigger>}
			<PopoverContent
				className={className}
				side={side}
				sideOffset={sideOffset}
				align={align}
				alignOffset={alignOffset}
				arrow={arrow}
				forceMount={forceMount}
				avoidCollisions={avoidCollisions}
				collisionPadding={collisionPadding}
			>
				{children}
			</PopoverContent>
		</Popover>
	);
}
