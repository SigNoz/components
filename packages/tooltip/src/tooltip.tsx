import './index.css';
import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from './lib/utils';

type TooltipPlacement =
	| 'top'
	| 'top-start'
	| 'top-end'
	| 'bottom'
	| 'bottom-start'
	| 'bottom-end'
	| 'left'
	| 'left-start'
	| 'left-end'
	| 'right'
	| 'right-start'
	| 'right-end';

interface TooltipProps
	extends React.ComponentProps<typeof TooltipPrimitive.Root> {
	title?: React.ReactNode;
	arrow?: boolean;
	/**
	 * The placement of the tooltip relative to the trigger.
	 * @default "top"
	 */
	placement?: TooltipPlacement;
	/**
	 * The distance in pixels from the trigger.
	 * @default 4
	 */
	offset?: number;
	/**
	 * Custom className for the tooltip content.
	 */
	contentClassName?: string;
	/**
	 * Custom className for the tooltip arrow.
	 */
	arrowClassName?: string;
}

interface TooltipContentProps
	extends React.ComponentProps<typeof TooltipPrimitive.Content> {
	arrow?: boolean;
	/**
	 * Custom className for the tooltip arrow.
	 */
	arrowClassName?: string;
}

/**
 * Helper to convert placement prop to Radix side and align values
 */
function parsePlacement(placement: TooltipPlacement): {
	side: 'top' | 'right' | 'bottom' | 'left';
	align: 'start' | 'center' | 'end';
} {
	const parts = placement.split('-') as [string, string?];
	const side = parts[0] as 'top' | 'right' | 'bottom' | 'left';
	const align = (parts[1] as 'start' | 'end') || 'center';
	return { side, align };
}

function TooltipProvider({
	delayDuration = 0,
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
	return (
		<TooltipPrimitive.Provider
			data-slot="tooltip-provider"
			delayDuration={delayDuration}
			{...props}
		/>
	);
}

function Tooltip({
	title,
	arrow,
	open,
	children,
	placement = 'top',
	offset,
	contentClassName,
	arrowClassName,
	...props
}: TooltipProps) {
	const { side, align } = parsePlacement(placement);

	return (
		<TooltipPrimitive.Root open={open} {...props}>
			{title ? (
				<>
					<TooltipTrigger asChild>{children}</TooltipTrigger>
					<TooltipContent
						arrow={arrow}
						side={side}
						align={align}
						sideOffset={offset}
						className={contentClassName}
						arrowClassName={arrowClassName}
					>
						{title}
					</TooltipContent>
				</>
			) : (
				children
			)}
		</TooltipPrimitive.Root>
	);
}

function TooltipTrigger({
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
	return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
	className,
	sideOffset = 4,
	children,
	arrow = false,
	arrowClassName,
	...props
}: TooltipContentProps) {
	return (
		<TooltipPrimitive.Portal>
			<TooltipPrimitive.Content
				data-slot="tooltip-content"
				sideOffset={arrow ? 0 : sideOffset}
				className={cn(
					// Colors
					'bg-card text-card-foreground',
					// Animations
					'animate-in fade-in-0 zoom-in-95',
					'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
					'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
					// Layout & Positioning - z-[9999] ensures tooltip appears above modals (z-50)
					'z-[9999] w-fit origin-(--radix-tooltip-content-transform-origin)',
					// Spacing & Shape
					'rounded-xs px-2 py-0.75',
					// Typography
					'text-xs text-balance leading-[18px] tracking-[-0.06px]',
					'border border-secondary shadow-[0px_6px_12px_0px_rgba(0,0,0,0.20)] backdrop-blur-[15px] rounded-xs border-solid',
					className,
				)}
				{...props}
			>
				{children}
				{arrow && (
					<TooltipPrimitive.Arrow
						className={cn(
							'bg-card fill-card z-[9999] size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]',
							arrowClassName,
						)}
					/>
				)}
			</TooltipPrimitive.Content>
		</TooltipPrimitive.Portal>
	);
}

export {
	Tooltip,
	TooltipProvider,
	TooltipTrigger,
	TooltipContent,
	type TooltipProps,
	type TooltipContentProps,
	type TooltipPlacement,
};
