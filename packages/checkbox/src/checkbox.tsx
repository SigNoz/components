import './index.css';
import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cn } from './lib/utils';
import { CheckIcon } from '@radix-ui/react-icons';

type CheckboxColor =
	| 'robin'
	| 'forest'
	| 'amber'
	| 'sienna'
	| 'cherry'
	| 'sakura'
	| 'aqua';

interface CheckboxProps
	extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
	color?: CheckboxColor;
}

const Checkbox = React.forwardRef<
	React.ElementRef<typeof CheckboxPrimitive.Root>,
	CheckboxProps
>(({ className, color = 'robin', ...props }, ref) => (
	<CheckboxPrimitive.Root
		ref={ref}
		data-color={color}
		className={cn(
			'peer h-4 w-4 shrink-0 rounded-md',
			'border shadow',
			'cursor-pointer',
			'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--checkbox-checked-background)]',
			'hover:ring-1 hover:ring-[var(--checkbox-checked-background)] hover:border-[var(--checkbox-checked-background)]',
			'peer-disabled:hover:ring-0 peer-disabled:hover:border-transparent',
			'data-[state=checked]:bg-[var(--checkbox-checked-background)] data-[state=checked]:text-white data-[state=checked]:border-transparent',
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
	{ labelName?: string | React.ReactNode } & CheckboxProps
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
