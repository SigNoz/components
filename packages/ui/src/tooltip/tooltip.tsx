// packages/ui/src/tooltip/tooltip.tsx
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type * as React from 'react';
import { cn } from '../lib/utils.js';
import styles from './tooltip.module.css';

interface TooltipProps extends React.ComponentProps<typeof TooltipPrimitive.Root> {
	title?: React.ReactNode;
	arrow?: boolean;
}

interface TooltipContentProps extends React.ComponentProps<typeof TooltipPrimitive.Content> {
	arrow?: boolean;
}

function TooltipProvider({
	delayDuration = 0,
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
	return <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />;
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
	className,
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
	return (
		<TooltipPrimitive.Trigger
			data-slot="tooltip-trigger"
			className={cn(styles['tooltip__trigger'], className)}
			{...props}
		/>
	);
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
				className={cn(styles['tooltip__content'], className)}
				{...props}
			>
				{children}
				{arrow && <TooltipPrimitive.Arrow className={cn(styles['tooltip__arrow'])} />}
			</TooltipPrimitive.Content>
		</TooltipPrimitive.Portal>
	);
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
