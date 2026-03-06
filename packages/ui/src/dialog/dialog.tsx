import './index.css';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import * as React from 'react';
import { Checkbox } from '../checkbox/index.js';

import { cn } from '../lib/utils.js';
import styles from './dialog.module.css';

function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
	return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
	return (
		<DialogPrimitive.Trigger
			data-slot="dialog-trigger"
			className={cn(styles['dialog__trigger'], className)}
			{...props}
		/>
	);
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
	return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
	return (
		<DialogPrimitive.Close
			data-slot="dialog-close"
			className={cn(styles['dialog__close'], className)}
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
			className={cn(styles['dialog__overlay'], className)}
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
	return (
		<DialogPortal data-slot="dialog-portal">
			<DialogOverlay />
			<DialogPrimitive.Content
				data-slot="dialog-content"
				data-width={width}
				className={cn(styles['dialog__content'], className)}
				{...props}
			>
				{children}
				{showCloseButton && (
					<DialogPrimitive.Close
						data-slot="dialog-close"
						className={styles['dialog__close-button']}
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
		<div data-slot="dialog-header" className={cn(styles['dialog__header'], className)} {...props} />
	);
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div data-slot="dialog-footer" className={cn(styles['dialog__footer'], className)} {...props} />
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
			className={cn(styles['dialog__title'], className)}
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
			className={cn(styles['dialog__description'], className)}
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
				onPointerDownOutside={disableOutsideClick ? (e) => e.preventDefault() : undefined}
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

type CheckboxColor = 'robin' | 'forest' | 'amber' | 'sienna' | 'cherry' | 'sakura' | 'aqua';

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
		<div className={styles['alert-dialog__content-wrapper']}>
			<div className={styles['alert-dialog__content-inner']}>
				{title && (
					<DialogHeader className={styles['alert-dialog__header']}>
						<DialogTitle icon={titleIcon}>{title}</DialogTitle>
					</DialogHeader>
				)}
				{children && (
					<DialogDescription className={styles['alert-dialog__description']}>
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
			{footer && <DialogFooter className={styles['alert-dialog__footer']}>{footer}</DialogFooter>}
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
