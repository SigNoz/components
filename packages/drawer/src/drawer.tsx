import './index.css';
import * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';
import { X } from 'lucide-react';

import { cn } from './lib/utils';

function Drawer({
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
	return <DrawerPrimitive.Root data-slot="drawer" {...props} />;
}

function DrawerTrigger({
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
	return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal({
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
	return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerClose({
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
	return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerOverlay({
	className,
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
	return (
		<DrawerPrimitive.Overlay
			data-slot="drawer-overlay"
			className={cn(
				'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
				className,
			)}
			{...props}
		/>
	);
}
function DrawerContent({
	className,
	children,
	showOverlay = true,
	type,
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Content> & {
	showOverlay?: boolean;
	type?: 'panel' | 'drawer';
}) {
	return (
		<DrawerPortal data-slot="drawer-portal">
			{showOverlay && <DrawerOverlay />}
			<DrawerPrimitive.Content
				data-slot="drawer-content"
				className={cn(
					'group/drawer-content bg-card fixed z-50 flex h-auto flex-col shadow-lg',
					'data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b',
					'data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t',
					'data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm',
					'data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm',
					'border border-vanilla-300 dark:border-slate-500',
					type === 'drawer' ? 'rounded-md' : 'rounded-none',
					className,
				)}
				{...props}
			>
				<div className="bg-muted mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
				{children}
			</DrawerPrimitive.Content>
		</DrawerPortal>
	);
}

function DrawerHeader({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="drawer-header"
			className={cn('flex flex-col gap-1.5 p-4', className)}
			{...props}
		/>
	);
}

function DrawerFooter({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="drawer-footer"
			className={cn('mt-auto flex flex-col gap-2 p-4', className)}
			{...props}
		/>
	);
}

function DrawerTitle({
	className,
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
	return (
		<DrawerPrimitive.Title
			data-slot="drawer-title"
			className={cn('text-foreground font-semibold', className)}
			{...props}
		/>
	);
}

function DrawerDescription({
	className,
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
	return (
		<DrawerPrimitive.Description
			data-slot="drawer-description"
			className={cn('text-muted-foreground text-sm', className)}
			{...props}
		/>
	);
}

interface DrawerWrapperProps {
	trigger: React.ReactNode;
	header?: {
		title: string;
		description?: string;
	};
	content: React.ReactNode;
	footer?: React.ReactNode;
	direction?: 'top' | 'right' | 'bottom' | 'left';
	showCloseButton?: boolean;
	allowOutsideClick?: boolean;
	showOverlay?: boolean;
	className?: string;
	type?: 'panel' | 'drawer';
}

function CloseButton() {
	return (
		<DrawerClose asChild>
			<button className="mr-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
				<X className="h-4 w-4" />
				<span className="sr-only">Close</span>
			</button>
		</DrawerClose>
	);
}

function DrawerWrapper({
	trigger,
	header,
	content,
	footer,
	direction = 'right',
	showCloseButton = true,
	allowOutsideClick = true,
	showOverlay = true,
	className,
	type = 'drawer',
}: DrawerWrapperProps) {
	return (
		<Drawer direction={direction} modal={allowOutsideClick}>
			<DrawerTrigger asChild>{trigger}</DrawerTrigger>
			<DrawerContent className={className} showOverlay={showOverlay} type={type}>
				<div className="mx-auto w-full max-w-sm">
					{header && (
						<div className="flex h-12 items-center justify-between border-b border-vanilla-300 dark:border-slate-500 px-6">
							{type === 'panel' && showCloseButton && <CloseButton />}
							<div className="flex items-center gap-2 flex-1">
								<DrawerTitle className="font-inter text-sm font-normal">
									{header.title}
								</DrawerTitle>
							</div>
							{type === 'drawer' && showCloseButton && <CloseButton />}
						</div>
					)}
					<DrawerHeader>
						{header?.description && (
							<DrawerDescription>{header.description}</DrawerDescription>
						)}
					</DrawerHeader>
					{content}
					{footer && <DrawerFooter>{footer}</DrawerFooter>}
				</div>
			</DrawerContent>
		</Drawer>
	);
}

export {
	Drawer,
	DrawerPortal,
	DrawerOverlay,
	DrawerTrigger,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerFooter,
	DrawerTitle,
	DrawerDescription,
	DrawerWrapper,
};
