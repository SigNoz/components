// packages/ui/src/checkbox/checkbox.tsx
import './index.css';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import * as React from 'react';
import { cn } from '../lib/utils.js';
import styles from './checkbox.module.css';

type CheckboxColor = 'robin' | 'forest' | 'amber' | 'sienna' | 'cherry' | 'sakura' | 'aqua';

interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
	color?: CheckboxColor;
}

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
	({ className, color = 'robin', ...props }, ref) => (
		<CheckboxPrimitive.Root
			ref={ref}
			data-color={color}
			className={cn(styles['checkbox'], className)}
			{...props}
		>
			<CheckboxPrimitive.Indicator className={styles['checkbox__indicator']}>
				<CheckIcon className={styles['checkbox__icon']} />
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	)
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

const CheckboxWrapper: React.FC<{ labelName?: string | React.ReactNode } & CheckboxProps> = ({
	labelName,
	...props
}) => {
	return (
		<div className={styles['checkbox-wrapper']}>
			<Checkbox {...props} />
			{labelName && (
				<label htmlFor={props.id} className={styles['checkbox-wrapper__label']}>
					{labelName}
				</label>
			)}
		</div>
	);
};

export { CheckboxWrapper as Checkbox };
