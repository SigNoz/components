import './index.css';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import * as React from 'react';

import { cn } from '../lib/utils.js';
import type { ToggleSize, ToggleVariant } from './toggle.js';
import styles from './toggle-group.module.css';

interface ToggleGroupContextValue {
	size?: ToggleSize;
	variant?: ToggleVariant;
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue>({
	size: 'default',
	variant: 'default',
});

type ToggleGroupProps = React.ComponentProps<typeof ToggleGroupPrimitive.Root> & {
	variant?: ToggleVariant;
	size?: ToggleSize;
};

function ToggleGroup({ className, variant, size, children, ...props }: ToggleGroupProps) {
	return (
		<ToggleGroupPrimitive.Root
			data-slot="toggle-group"
			data-variant={variant}
			data-size={size}
			className={cn(styles['toggle-group'], className)}
			{...props}
		>
			<ToggleGroupContext.Provider value={{ variant, size }}>
				{children}
			</ToggleGroupContext.Provider>
		</ToggleGroupPrimitive.Root>
	);
}

type ToggleGroupItemProps = React.ComponentProps<typeof ToggleGroupPrimitive.Item> & {
	variant?: ToggleVariant;
	size?: ToggleSize;
};

function ToggleGroupItem({ className, children, variant, size, ...props }: ToggleGroupItemProps) {
	const context = React.useContext(ToggleGroupContext);

	return (
		<ToggleGroupPrimitive.Item
			data-slot="toggle-group-item"
			data-variant={context.variant || variant}
			data-size={context.size || size}
			className={cn(styles['toggle-group-item'], className)}
			{...props}
		>
			{children}
		</ToggleGroupPrimitive.Item>
	);
}

export { ToggleGroup, ToggleGroupItem };
