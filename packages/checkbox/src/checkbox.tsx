import './index.css';
import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cn } from './lib/utils';
import { CheckIcon } from '@radix-ui/react-icons';

const Checkbox = React.forwardRef<
	React.ElementRef<typeof CheckboxPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
	<CheckboxPrimitive.Root
		ref={ref}
		className={cn(
			'peer h-4 w-4 shrink-0 rounded-md',
			'border shadow',
			'cursor-pointer',
			'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
			'hover:ring-1 hover:ring-primary hover:border-primary',
			'peer-disabled:hover:ring-0 peer-disabled:hover:border-transparent',
			'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-transparent',
			'disabled:cursor-not-allowed disabled:opacity-50',
			className,
		)}
		{...props}
	>
		<CheckboxPrimitive.Indicator
			className={cn('flex items-center justify-center text-current')}
		>
			<CheckIcon className="h-3.5 w-3.5 text-white" />
		</CheckboxPrimitive.Indicator>
	</CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

const CheckboxWrapper: React.FC<
	{ labelName?: string | React.ReactNode } & React.ComponentPropsWithoutRef<
		typeof Checkbox
	>
> = ({ labelName, ...props }) => {
	return (
		<div className="flex items-center space-x-2 cursor-pointer">
			<Checkbox {...props} />
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

export { CheckboxWrapper as Checkbox };
