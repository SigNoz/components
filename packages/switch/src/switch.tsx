import './index.css';
import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';

import { cn } from './lib/utils';

type SwitchColor =
	| 'robin'
	| 'forest'
	| 'amber'
	| 'sienna'
	| 'cherry'
	| 'sakura'
	| 'aqua';

interface SwitchProps
	extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
	color?: SwitchColor;
}

const Switch = React.forwardRef<
	React.ElementRef<typeof SwitchPrimitives.Root>,
	SwitchProps
>(({ className, color = 'robin', ...props }, ref) => (
	<SwitchPrimitives.Root
		data-color={color}
		className={cn(
			'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[var(--switch-checked-background)] data-[state=unchecked]:bg-input',
			className,
		)}
		{...props}
		ref={ref}
	>
		<SwitchPrimitives.Thumb
			className={cn(
				'pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0',
			)}
		/>
	</SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

const SwitchWrapper: React.FC<
	{ labelName?: string | React.ReactNode } & SwitchProps
> = ({ labelName, ...props }) => {
	return (
		<div className="flex items-center space-x-2">
			<Switch {...props} />
			{labelName && (
				<label
					htmlFor={props.id}
					className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
				>
					{labelName}
				</label>
			)}
		</div>
	);
};

export { SwitchWrapper as Switch };
