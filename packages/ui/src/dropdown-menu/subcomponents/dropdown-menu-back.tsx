import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { ChevronLeft } from '@signozhq/icons';
import * as React from 'react';

import { cn } from '../../lib/utils.js';
import styles from '../dropdown-menu.module.scss';

export type DropdownMenuBackProps = Omit<
	React.ComponentProps<typeof DropdownMenuPrimitive.Item>,
	'asChild' | 'onSelect'
> & {
	/**
	 * Additional CSS classes to apply to the back button.
	 */
	className?: string;
	/**
	 * The label to display next to the back icon.
	 */
	label: string;
	/**
	 * Callback fired when the back button is clicked.
	 */
	onBack?: () => void;
};

/**
 * A back button for navigating in multi-step dropdown menus.
 * Displays a chevron left icon and a label.
 *
 * @example
 * ```tsx
 * const [step, setStep] = React.useState<'main' | 'settings'>('main');
 *
 * <DropdownMenuContent>
 *   {step === 'main' ? (
 *     <>
 *       <DropdownMenuItem onSelect={() => setStep('settings')}>
 *         Settings
 *       </DropdownMenuItem>
 *     </>
 *   ) : (
 *     <>
 *       <DropdownMenuBack label="Back" onBack={() => setStep('main')} />
 *       <DropdownMenuSeparator />
 *       <DropdownMenuItem>Setting 1</DropdownMenuItem>
 *       <DropdownMenuItem>Setting 2</DropdownMenuItem>
 *     </>
 *   )}
 * </DropdownMenuContent>
 * ```
 */
export const DropdownMenuBack = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Item>,
	DropdownMenuBackProps
>(({ className, label, onBack, ...props }, ref) => (
	<DropdownMenuPrimitive.Item
		ref={ref}
		data-slot="dropdown-menu-back"
		className={cn(styles['dropdown-menu__back'], className)}
		onSelect={(e) => {
			e.preventDefault();
			onBack?.();
		}}
		{...props}
	>
		<ChevronLeft className={styles['dropdown-menu__back-icon']} />
		<span>{label}</span>
	</DropdownMenuPrimitive.Item>
));

DropdownMenuBack.displayName = 'DropdownMenuBack';
