import * as React from 'react';
import { Checkbox } from '../checkbox/index.js';
import type { CheckboxProps } from '../checkbox/index.js';
import { DialogWrapper, type DialogWrapperProps } from '../dialog/index.js';
import { cn } from '../lib/utils.js';
import styles from './alert-dialog.module.scss';

export interface AlertDialogProps extends Omit<
	DialogWrapperProps,
	'showCloseButton' | 'disableOutsideClick'
> {
	checkboxLabel?: string;
	checkboxChecked?: boolean;
	onCheckboxChange?: (checked: boolean) => void;
	checkboxColor?: CheckboxProps['color'];
	footer?: React.ReactNode;
}

const AlertDialog = React.forwardRef<HTMLDivElement, AlertDialogProps>(
	(
		{
			children,
			checkboxLabel,
			checkboxChecked,
			onCheckboxChange,
			checkboxColor = 'danger',
			title,
			titleIcon,
			className,
			...props
		},
		ref,
	) => {
		return (
			<DialogWrapper
				ref={ref}
				showCloseButton={false}
				disableOutsideClick={true}
				title={title}
				titleIcon={titleIcon}
				className={cn(styles.alert__dialog, className)}
				{...props}
			>
				{children}

				{checkboxLabel && (
					<Checkbox color={checkboxColor} value={checkboxChecked} onChange={onCheckboxChange}>
						{checkboxLabel}
					</Checkbox>
				)}
			</DialogWrapper>
		);
	},
);
AlertDialog.displayName = 'AlertDialog';

export { AlertDialog };
