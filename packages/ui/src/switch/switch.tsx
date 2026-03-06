// packages/ui/src/switch/switch.tsx
import './index.css'; // Keep for CSS variable definitions

import * as SwitchPrimitive from '@radix-ui/react-switch';
import * as React from 'react';
import { cn } from '../lib/utils.js';
import styles from './switch.module.css';

type SwitchColor = 'robin' | 'forest' | 'amber' | 'sienna' | 'cherry' | 'sakura' | 'aqua';

interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
	color?: SwitchColor;
}

const SwitchBase = React.forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(
	({ className, color = 'robin', ...props }, ref) => (
		<SwitchPrimitive.Root
			ref={ref}
			data-color={color}
			className={cn(styles['switch'], className)}
			{...props}
		>
			<SwitchPrimitive.Thumb className={styles['switch__thumb']} />
		</SwitchPrimitive.Root>
	)
);
SwitchBase.displayName = SwitchPrimitive.Root.displayName;

const SwitchWrapper: React.FC<{ labelName?: string | React.ReactNode } & SwitchProps> = ({
	labelName,
	...props
}) => {
	return (
		<div className={styles['switch-wrapper']}>
			<SwitchBase {...props} />
			{labelName && (
				<label htmlFor={props.id} className={styles['switch-label']}>
					{labelName}
				</label>
			)}
		</div>
	);
};

export { SwitchWrapper as Switch };
