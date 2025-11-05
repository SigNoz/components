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
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
	return (
		<DialogPrimitive.Trigger
			data-slot="dialog-trigger"
			className={cn('cursor-pointer', className)}
			{...props}
		/>
	);
}

function DialogPortal({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
	return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
	return (
		<DialogPrimitive.Close
			data-slot="dialog-close"
			className={cn('cursor-pointer', className)}
			{...props}
		/>
	);
}

function DialogOverlay({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
	return (
		<DialogPrimitive.Overlay
			data-slot="dialog-overlay"
			className={cn(
				'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 dark:bg-black/60',
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
					'fixed left-[50%] z-50 grid w-full translate-x-[-50%] shadow-[0_-4px_16px_2px_rgba(0,0,0,0.20)] cursor-default',
					widthClass,
					className,
				)}
				{...props}
			>
				{children}
				{showCloseButton && (
					<DialogPrimitive.Close
						data-slot="dialog-close"
						className="absolute top-[13px] right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 disabled:pointer-events-none cursor-pointer flex items-center justify-center w-6 h-6 hover:bg-[var(--dialog-close-icon)]/10"
					>
						<XIcon size={14} className="shrink-0" />
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
				'flex flex-row items-center justify-between border-b border-[var(--dialog-border)] px-4 py-3 cursor-default',
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
				'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end cursor-default',
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
				'text-sm font-normal leading-5 font-inter flex items-center gap-2 m-0 cursor-default',
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
			className={cn('text-sm p-4 cursor-default', className)}
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
