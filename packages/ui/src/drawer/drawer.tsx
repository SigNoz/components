import { X } from '@signozhq/icons';
import * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';
import { Button } from '../button/button.js';
import { cn } from '../lib/utils.js';
import styles from './drawer.module.scss';

function Drawer({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Root>) {
	return <DrawerPrimitive.Root data-slot="drawer" {...props} />;
}

function DrawerTrigger({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
	return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
	return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerClose({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Close>) {
	return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

const DrawerOverlay = React.forwardRef<
	React.ElementRef<typeof DrawerPrimitive.Overlay>,
	React.ComponentProps<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => {
	return (
		<DrawerPrimitive.Overlay
			ref={ref}
			data-slot="drawer-overlay"
			className={cn(styles.overlay, className)}
			{...props}
		/>
	);
});
function DrawerContent({
	className,
	children,
	showOverlay = true,
	type = 'drawer',
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
				data-type={type}
				className={cn(styles.content, className)}
				{...props}
			>
				{children}
			</DrawerPrimitive.Content>
		</DrawerPortal>
	);
}

function DrawerHeader({ className, ...props }: React.ComponentProps<'div'>) {
	return <div data-slot="drawer-header" className={cn(styles.header, className)} {...props} />;
}

function DrawerFooter({ className, ...props }: React.ComponentProps<'div'>) {
	return <div data-slot="drawer-footer" className={cn(styles.footer, className)} {...props} />;
}

function DrawerTitle({ className, ...props }: React.ComponentProps<typeof DrawerPrimitive.Title>) {
	return (
		<DrawerPrimitive.Title
			data-slot="drawer-title"
			className={cn(styles.title, className)}
			{...props}
		/>
	);
}

function DrawerSubtitle({
	className,
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
	return (
		<DrawerPrimitive.Description
			data-slot="drawer-subtitle"
			className={cn(styles.subtitle, className)}
			{...props}
		/>
	);
}

export type DrawerDescriptionProps = Pick<
	React.ComponentPropsWithoutRef<'div'>,
	'id' | 'className' | 'style' | 'children'
> & {
	testId?: string;
};

function DrawerDescription({ className, children, testId, ...props }: DrawerDescriptionProps) {
	return (
		<div
			data-slot="drawer-description"
			data-testid={testId}
			className={cn(styles.description, className)}
			{...props}
		>
			{children}
		</div>
	);
}

function DrawerCloseButton() {
	return (
		<DrawerClose asChild>
			<Button
				type="button"
				variant="ghost"
				size="icon"
				color="none"
				aria-label="Close"
				suffix={<X className={styles.closeButtonIcon} />}
				className={cn(styles.closeButton)}
			>
				<span className={styles.srOnly}>Close</span>
			</Button>
		</DrawerClose>
	);
}

export interface DrawerWrapperProps {
	/** Element that opens the drawer. Optional when using controlled mode (open/onOpenChange). */
	trigger?: React.ReactNode;
	title?: string;
	subTitle?: string;
	children?: React.ReactNode;
	footer?: React.ReactNode;
	direction?: 'top' | 'right' | 'bottom' | 'left';
	showCloseButton?: boolean;
	allowOutsideClick?: boolean;
	showOverlay?: boolean;
	className?: string;
	type?: 'panel' | 'drawer';
	/** Controlled open state. When provided with onOpenChange, enables programmatic control. */
	open?: boolean;
	/** Called when drawer open state changes (close button, outside click, ESC). Required for controlled mode. */
	onOpenChange?: (open: boolean) => void;
}

function DrawerWrapper({
	trigger,
	title,
	subTitle,
	footer,
	direction = 'right',
	showCloseButton = true,
	allowOutsideClick = true,
	showOverlay = true,
	className,
	type = 'drawer',
	open,
	onOpenChange,
	children,
}: DrawerWrapperProps) {
	return (
		<Drawer direction={direction} modal={allowOutsideClick} open={open} onOpenChange={onOpenChange}>
			{trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
			<DrawerContent className={className} showOverlay={showOverlay} type={type}>
				{(title || subTitle) && (
					<DrawerHeader>
						{title && <DrawerTitle>{title}</DrawerTitle>}
						{subTitle && <DrawerSubtitle>{subTitle}</DrawerSubtitle>}
						{showCloseButton && <DrawerCloseButton />}
					</DrawerHeader>
				)}
				{children && <DrawerDescription>{children}</DrawerDescription>}
				{footer && <DrawerFooter>{footer}</DrawerFooter>}
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
	DrawerSubtitle,
	DrawerTitle,
	DrawerDescription,
	DrawerWrapper,
	DrawerCloseButton,
};
