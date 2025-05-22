import './index.css';
import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from './lib/utils';

interface TooltipProps
	extends React.ComponentProps<typeof TooltipPrimitive.Root> {
	title?: React.ReactNode;
	arrow?: boolean;
}

interface TooltipContentProps
	extends React.ComponentProps<typeof TooltipPrimitive.Content> {
	arrow?: boolean;
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

function Tooltip({ title, arrow, open, children, ...props }: TooltipProps) {
	return (
		<TooltipPrimitive.Root open={open} {...props}>
			{title ? (
				<>
					<TooltipTrigger asChild>{children}</TooltipTrigger>
					<TooltipContent arrow={arrow}>{title}</TooltipContent>
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
					// Layout & Positioning
					'z-50 w-fit origin-(--radix-tooltip-content-transform-origin)',
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
					<TooltipPrimitive.Arrow className="bg-card fill-card z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
				)}
			</TooltipPrimitive.Content>
		</TooltipPrimitive.Portal>
	);
}

export { Tooltip, TooltipProvider };
