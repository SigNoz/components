import type React from 'react';
import { Checkbox } from '../checkbox/index.js';
import { DialogWrapper, type DialogWrapperProps } from '../dialog/index.js';
import { cn } from '../lib/utils.js';
import styles from './alert-dialog.module.scss';

type CheckboxColor = 'robin' | 'forest' | 'amber' | 'sienna' | 'cherry' | 'sakura' | 'aqua';

export interface AlertDialogProps
	extends Omit<DialogWrapperProps, 'showCloseButton' | 'disableOutsideClick'> {
	checkboxLabel?: string;
	checkboxChecked?: boolean;
	onCheckboxChange?: (checked: boolean) => void;
	checkboxColor?: CheckboxColor;
	footer?: React.ReactNode;
}

function AlertDialog({
	children,
	checkboxLabel,
	checkboxChecked,
	onCheckboxChange,
	checkboxColor = 'cherry',
	title,
	titleIcon,
	className,
	...props
}: AlertDialogProps) {
	return (
		<DialogWrapper
			showCloseButton={false}
			disableOutsideClick={true}
			title={title}
			titleIcon={titleIcon}
			className={cn(styles.alert__dialog, className)}
			{...props}
		>
			{children}

			{checkboxLabel && (
				<Checkbox
					color={checkboxColor}
					value={checkboxChecked}
					className={styles.alert__dialog__checkbox}
					onChange={(checked: boolean | 'indeterminate') => {
						const isChecked = checked === true;
						onCheckboxChange?.(isChecked);
					}}
				>
					{checkboxLabel}
				</Checkbox>
			)}
		</DialogWrapper>
	);
}

export { AlertDialog };
