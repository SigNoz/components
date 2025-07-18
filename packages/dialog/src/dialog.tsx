import './index.css';
import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';

import { cn } from './lib/utils';

function Dialog({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
	return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
	return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
	return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
	return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
	return (
		<DialogPrimitive.Overlay
			data-slot="dialog-overlay"
			className={cn(
				'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
				className,
			)}
			{...props}
		/>
	);
}

function DialogContent({
	className,
	children,
	showCloseButton = true,
	width = 'base',
	...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
	showCloseButton?: boolean;
	width?: 'narrow' | 'base' | 'wide' | 'extra-wide';
}) {
	const widthClassMap: Record<
		'narrow' | 'base' | 'wide' | 'extra-wide',
		string
	> = {
		narrow: 'max-w-sm',
		base: 'max-w-lg',
		wide: 'max-w-2xl',
		'extra-wide': 'max-w-4xl',
	};
	const widthClass =
		widthClassMap[width as 'narrow' | 'base' | 'wide' | 'extra-wide'] ||
		'sm:max-w-lg';
	return (
		<DialogPortal data-slot="dialog-portal">
			<DialogOverlay />
			<DialogPrimitive.Content
				data-slot="dialog-content"
				className={cn(
					'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[80px] left-[50%] z-50 grid w-full translate-x-[-50%] rounded-lg border shadow-lg duration-200 border-vanilla-300 dark:border-slate-500',
					widthClass,
					className,
				)}
				{...props}
			>
				{children}
				{showCloseButton && (
					<DialogPrimitive.Close className="data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 disabled:pointer-events-none cursor-pointer [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:not([class*='size-']):size-4">
						<XIcon size={18} />
						<span className="sr-only">Close</span>
					</DialogPrimitive.Close>
				)}
			</DialogPrimitive.Content>
		</DialogPortal>
	);
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="dialog-header"
			className={cn(
				'flex flex-col gap-2 text-center sm:text-left border-b border-vanilla-300 dark:border-slate-500 p-4 cursor-default',
				className,
			)}
			{...props}
		/>
	);
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="dialog-footer"
			className={cn(
				'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
				className,
			)}
			{...props}
		/>
	);
}

function DialogTitle({
	className,
	icon,
	children,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Title> & {
	icon?: React.ReactNode;
}) {
	return (
		<DialogPrimitive.Title
			data-slot="dialog-title"
			className={cn(
				'text-sm font-normal leading-5 font-inter font-regular flex items-center gap-2',
				className,
			)}
			{...props}
		>
			{icon}
			{children}
		</DialogPrimitive.Title>
	);
}

function DialogDescription({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
	return (
		<DialogPrimitive.Description
			data-slot="dialog-description"
			className={cn('text-sm p-4', className)}
			{...props}
		/>
	);
}

interface DialogWrapperProps {
	title?: string;
	children: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	trigger?: React.ReactNode;
	className?: string;
	showCloseButton?: boolean;
	disableOutsideClick?: boolean;
	width?: 'narrow' | 'base' | 'wide' | 'extra-wide';
	titleIcon?: React.ReactNode;
}

function DialogWrapper({
	title,
	children,
	open,
	onOpenChange,
	trigger,
	className,
	showCloseButton = true,
	disableOutsideClick = false,
	width = 'base',
	titleIcon,
}: DialogWrapperProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			{trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
			<DialogContent
				className={className}
				showCloseButton={showCloseButton}
				onPointerDownOutside={
					disableOutsideClick ? (e) => e.preventDefault() : undefined
				}
				width={width}
			>
				{title && (
					<DialogHeader>
						{title && <DialogTitle icon={titleIcon}>{title}</DialogTitle>}
					</DialogHeader>
				)}
				{children && <DialogDescription>{children}</DialogDescription>}
			</DialogContent>
		</Dialog>
	);
}

export function AlertDialogWrapper({
	children,
	...props
}: Omit<DialogWrapperProps, 'showCloseButton' | 'disableOutsideClick'>) {
	return (
		<DialogWrapper
			className="alert-dialog"
			showCloseButton={false}
			disableOutsideClick={true}
			{...props}
		>
			{children}
		</DialogWrapper>
	);
}

export {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
	DialogWrapper,
};
