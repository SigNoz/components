import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { ChevronRight } from '@signozhq/icons';
import * as React from 'react';

import { cn } from '../../lib/utils.js';
import styles from '../dropdown-menu.module.scss';
import { DropdownMenuBack } from './dropdown-menu-back.js';
import { DropdownMenuPortal } from './dropdown-menu-portal.js';
import { DropdownMenuSeparator } from './dropdown-menu-separator.js';

// Multi-step dropdown context
type MultiStepContextType = {
	currentStep: 'primary' | 'secondary';
	setCurrentStep: (step: 'primary' | 'secondary') => void;
};

const MultiStepContext = React.createContext<MultiStepContextType | null>(null);

export type DropdownMenuMultiStepProps = {
	/**
	 * The children of the multi-step dropdown.
	 */
	children?: React.ReactNode;
	/**
	 * The controlled open state of the dropdown menu.
	 * Must be used in conjunction with `onOpenChange`.
	 */
	open?: boolean;
	/**
	 * The open state of the dropdown menu when it is initially rendered.
	 * Use when you do not need to control its open state.
	 */
	defaultOpen?: boolean;
	/**
	 * Event handler called when the open state of the dropdown menu changes.
	 */
	onOpenChange?: (open: boolean) => void;
	/**
	 * The modality of the dropdown menu.
	 * @default true
	 */
	modal?: boolean;
};

/**
 * A multi-step dropdown menu that supports navigating between primary and secondary content.
 * Use when you need a two-level navigation within the dropdown.
 *
 * @example
 * ```tsx
 * <DropdownMenuMultiStep>
 *   <DropdownMenuTrigger asChild>
 *     <Button>Options</Button>
 *   </DropdownMenuTrigger>
 *   <DropdownMenuMultiStepContent
 *     secondaryLabel="Settings"
 *     primaryContent={
 *       <>
 *         <DropdownMenuItem>Profile</DropdownMenuItem>
 *         <DropdownMenuMultiStepTrigger>Settings</DropdownMenuMultiStepTrigger>
 *       </>
 *     }
 *     secondaryContent={
 *       <>
 *         <DropdownMenuItem>General</DropdownMenuItem>
 *         <DropdownMenuItem>Privacy</DropdownMenuItem>
 *       </>
 *     }
 *   />
 * </DropdownMenuMultiStep>
 * ```
 */
export const DropdownMenuMultiStep = React.forwardRef<HTMLDivElement, DropdownMenuMultiStepProps>(
	({ children, ...props }, ref) => {
		const [currentStep, setCurrentStep] = React.useState<'primary' | 'secondary'>('primary');
		const [open, setOpen] = React.useState(false);

		// Reset to primary when menu closes
		React.useEffect(() => {
			if (!open) {
				setCurrentStep('primary');
			}
		}, [open]);

		return (
			<MultiStepContext.Provider value={{ currentStep, setCurrentStep }}>
				<DropdownMenuPrimitive.Root
					{...props}
					open={open}
					onOpenChange={setOpen}
					// @ts-expect-error - ref is not used in the root component
					ref={ref}
				>
					{children}
				</DropdownMenuPrimitive.Root>
			</MultiStepContext.Provider>
		);
	}
);

DropdownMenuMultiStep.displayName = 'DropdownMenuMultiStep';

type OriginalContentProps = React.ComponentProps<typeof DropdownMenuPrimitive.Content>;

export type DropdownMenuMultiStepContentProps = {
	/**
	 * Additional CSS classes to apply to the content.
	 */
	className?: string;
	/**
	 * The content to display in the primary (initial) step.
	 */
	primaryContent: React.ReactNode;
	/**
	 * The content to display in the secondary step.
	 */
	secondaryContent: React.ReactNode;
	/**
	 * The label shown in the back button when in the secondary step.
	 */
	secondaryLabel: string;
	/**
	 * The distance in pixels from the trigger.
	 * @default 4
	 */
	sideOffset?: number;
	/**
	 * The preferred side of the trigger to render against when open.
	 * @default "bottom"
	 */
	side?: OriginalContentProps['side'];
	/**
	 * The preferred alignment against the trigger.
	 * @default "center"
	 */
	align?: OriginalContentProps['align'];
};

/**
 * The content for a multi-step dropdown menu.
 * Renders either primary or secondary content based on the current step.
 *
 * @example
 * ```tsx
 * <DropdownMenuMultiStepContent
 *   secondaryLabel="Advanced"
 *   primaryContent={
 *     <>
 *       <DropdownMenuItem>Basic Option 1</DropdownMenuItem>
 *       <DropdownMenuMultiStepTrigger>Advanced</DropdownMenuMultiStepTrigger>
 *     </>
 *   }
 *   secondaryContent={
 *     <>
 *       <DropdownMenuItem>Advanced Option 1</DropdownMenuItem>
 *       <DropdownMenuItem>Advanced Option 2</DropdownMenuItem>
 *     </>
 *   }
 * />
 * ```
 */
export const DropdownMenuMultiStepContent = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Content>,
	DropdownMenuMultiStepContentProps
>(
	(
		{ primaryContent, secondaryContent, secondaryLabel, className, sideOffset = 4, ...props },
		ref
	) => {
		const context = React.useContext(MultiStepContext);
		if (!context) {
			throw new Error('DropdownMenuMultiStepContent must be used within DropdownMenuMultiStep');
		}

		const { currentStep, setCurrentStep } = context;

		const handleBack = () => {
			setCurrentStep('primary');
		};

		return (
			<DropdownMenuPortal>
				<DropdownMenuPrimitive.Content
					ref={ref}
					data-slot="dropdown-menu-multi-step-content"
					sideOffset={sideOffset}
					className={cn(styles['dropdown-menu__multi-step-content'], className)}
					{...props}
				>
					{currentStep === 'primary' ? (
						primaryContent
					) : (
						<>
							<DropdownMenuBack label={secondaryLabel} onBack={handleBack} />
							<DropdownMenuSeparator />
							{secondaryContent}
						</>
					)}
				</DropdownMenuPrimitive.Content>
			</DropdownMenuPortal>
		);
	}
);

DropdownMenuMultiStepContent.displayName = 'DropdownMenuMultiStepContent';

export type DropdownMenuMultiStepTriggerProps = Omit<
	React.ComponentProps<typeof DropdownMenuPrimitive.Item>,
	'asChild' | 'onSelect'
> & {
	/**
	 * Additional CSS classes to apply to the trigger.
	 */
	className?: string;
	/**
	 * Optional icon to display before the label.
	 */
	leftIcon?: React.ReactNode;
};

/**
 * An item that triggers navigation to the secondary step in a multi-step dropdown.
 *
 * @example
 * ```tsx
 * <DropdownMenuMultiStepContent
 *   primaryContent={
 *     <>
 *       <DropdownMenuItem>Profile</DropdownMenuItem>
 *       <DropdownMenuMultiStepTrigger leftIcon={<SettingsIcon />}>
 *         Settings
 *       </DropdownMenuMultiStepTrigger>
 *     </>
 *   }
 *   secondaryContent={...}
 *   secondaryLabel="Settings"
 * />
 * ```
 */
export const DropdownMenuMultiStepTrigger = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Item>,
	DropdownMenuMultiStepTriggerProps
>(({ className, leftIcon, children, ...props }, ref) => {
	const context = React.useContext(MultiStepContext);
	if (!context) {
		throw new Error('DropdownMenuMultiStepTrigger must be used within DropdownMenuMultiStep');
	}

	const { setCurrentStep } = context;

	return (
		<DropdownMenuPrimitive.Item
			ref={ref}
			data-slot="dropdown-menu-multi-step-trigger"
			className={cn(styles['dropdown-menu__multi-step-trigger'], className)}
			onSelect={(e) => {
				e.preventDefault();
				setCurrentStep('secondary');
			}}
			{...props}
		>
			{leftIcon && (
				<span className={styles['dropdown-menu__multi-step-trigger-icon']}>{leftIcon}</span>
			)}
			{children}
			<ChevronRight className={styles['dropdown-menu__multi-step-trigger-chevron']} />
		</DropdownMenuPrimitive.Item>
	);
});

DropdownMenuMultiStepTrigger.displayName = 'DropdownMenuMultiStepTrigger';
