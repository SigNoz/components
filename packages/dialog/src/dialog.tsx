import './index.css';
import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import { Checkbox } from '@signozhq/checkbox';

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
		narrow: 'max-w-[384px]',
		base: 'max-w-[512px]',
		wide: 'max-w-[672px]',
		'extra-wide': 'max-w-[820px]',
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
					'bg-l1-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[80px] left-[50%] z-50 grid w-full translate-x-[-50%] rounded-lg border duration-200 border-l2-border shadow-[0_-4px_16px_2px_rgba(0,0,0,0.20)] cursor-default',
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
				'leading-[100%] font-inter font-regular flex items-center gap-2 tracking-[-0.065px] slashed-zero text-l1-foreground cursor-default !text-[13px] !font-medium font-inter !m-0',

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

type CheckboxColor =
	| 'robin'
	| 'forest'
	| 'amber'
	| 'sienna'
	| 'cherry'
	| 'sakura'
	| 'aqua';

interface AlertDialogContentProps {
	title?: string;
	titleIcon?: React.ReactNode;
	children: React.ReactNode;
	checkboxLabel?: string;
	checkboxChecked?: boolean;
	onCheckboxChange?: (checked: boolean) => void;
	checkboxColor?: CheckboxColor;
	footer?: React.ReactNode;
}

function AlertDialogContent({
	title,
	titleIcon,
	children,
	checkboxLabel,
	checkboxChecked,
	onCheckboxChange,
	checkboxColor = 'cherry',
	footer,
}: AlertDialogContentProps) {
	const checkboxId = React.useId();

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-1.5">
				{title && (
					<DialogHeader className="border-b-0 p-0 pb-0">
						<DialogTitle icon={titleIcon}>{title}</DialogTitle>
					</DialogHeader>
				)}
				{children && (
					<DialogDescription className="text-[13px] font-normal leading-[20px] p-0 text-l2-foreground slashed-zero tracking-[-0.065px] mb-1.5">
						{children}
					</DialogDescription>
				)}
				{checkboxLabel && (
					<Checkbox
						id={checkboxId}
						color={checkboxColor}
						checked={checkboxChecked}
						onCheckedChange={(checked: boolean | 'indeterminate') => {
							const isChecked = checked === true;
							onCheckboxChange?.(isChecked);
						}}
						labelName={
							<span className="text-[13px] font-normal leading-none text-l2-foreground tracking-[-0.065px] slashed-zero">
								{checkboxLabel}
							</span>
						}
					/>
				)}
			</div>
			{footer && <DialogFooter className="gap-3">{footer}</DialogFooter>}
		</div>
	);
}

interface AlertDialogWrapperProps
	extends Omit<DialogWrapperProps, 'showCloseButton' | 'disableOutsideClick'> {
	checkboxLabel?: string;
	checkboxChecked?: boolean;
	onCheckboxChange?: (checked: boolean) => void;
	checkboxColor?: CheckboxColor;
	footer?: React.ReactNode;
}

export function AlertDialogWrapper({
	children,
	checkboxLabel,
	checkboxChecked,
	onCheckboxChange,
	checkboxColor = 'cherry',
	footer,
	title,
	titleIcon,
	...props
}: AlertDialogWrapperProps) {
	return (
		<DialogWrapper
			className="alert-dialog"
			showCloseButton={false}
			disableOutsideClick={true}
			{...props}
		>
			<AlertDialogContent
				title={title}
				titleIcon={titleIcon}
				checkboxLabel={checkboxLabel}
				checkboxChecked={checkboxChecked}
				onCheckboxChange={onCheckboxChange}
				checkboxColor={checkboxColor}
				footer={footer}
			>
				{children}
			</AlertDialogContent>
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
