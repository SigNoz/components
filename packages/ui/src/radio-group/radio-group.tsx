// packages/ui/src/radio-group/radio-group.tsx
import './index.css';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as React from 'react';
import { cn } from '../lib/utils.js';
import styles from './radio-group.module.css';

type RadioColor = 'robin' | 'forest' | 'amber' | 'sienna' | 'cherry' | 'sakura' | 'aqua';

interface RadioGroupProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
	color?: RadioColor;
}

const RadioGroup = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Root>,
	RadioGroupProps
>(({ className, color = 'robin', ...props }, ref) => {
	return (
		<RadioGroupPrimitive.Root
			ref={ref}
			data-color={color}
			className={cn(styles['radio-group'], className)}
			{...props}
		/>
	);
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
	return (
		<RadioGroupPrimitive.Item
			ref={ref}
			className={cn(styles['radio-group__item'], className)}
			{...props}
		>
			<RadioGroupPrimitive.Indicator className={styles['radio-group__indicator']}>
				<span className={styles['radio-group__indicator-dot']} />
			</RadioGroupPrimitive.Indicator>
		</RadioGroupPrimitive.Item>
	);
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
