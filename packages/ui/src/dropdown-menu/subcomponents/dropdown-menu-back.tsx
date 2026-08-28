import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { ChevronLeft } from '@signozhq/icons';
import * as React from 'react';

import { cn } from '../../lib/utils.js';
import styles from '../dropdown-menu.module.scss';

export type DropdownMenuBackProps = Omit<
	React.ComponentProps<typeof MenuPrimitive.Item>,
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
export const DropdownMenuBack = React.forwardRef<HTMLDivElement, DropdownMenuBackProps>(
	({ className, label, onBack, ...props }, ref) => (
		<MenuPrimitive.Item
			ref={ref}
			data-slot="dropdown-menu-back"
			className={cn(styles['dropdown-menu__back'], className)}
			// Stepping back stays within the same menu, so it must not close it.
			closeOnClick={false}
			onClick={() => onBack?.()}
			{...props}
		>
			<ChevronLeft className={styles['dropdown-menu__back-icon']} />
			<span>{label}</span>
		</MenuPrimitive.Item>
	),
);

DropdownMenuBack.displayName = 'DropdownMenuBack';
