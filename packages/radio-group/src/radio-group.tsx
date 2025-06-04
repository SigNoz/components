import './index.css';
import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cn } from './lib/utils';
import { Circle } from 'lucide-react';

export type RadioColorProps =
	| 'robin'
	| 'forest'
	| 'amber'
	| 'sienna'
	| 'cherry'
	| 'sakura'
	| 'aqua';

interface RadioGroupItemProps
	extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
	color?: RadioColorProps;
}

const RadioGroup = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
	return (
		<RadioGroupPrimitive.Root
			className={cn('grid gap-2', className)}
			{...props}
			ref={ref}
		/>
	);
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Item>,
	RadioGroupItemProps
>(({ className, color = 'robin', ...props }, ref) => {
	return (
		<RadioGroupPrimitive.Item
			ref={ref}
			data-color={color}
			className={cn(
				'aspect-square h-4 w-4 rounded-full border border-[var(--radio-checked-background)] text-[var(--radio-checked-background)] ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--radio-checked-background)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-[2px]',
				'hover:ring-1 hover:ring-[var(--radio-checked-background)] hover:border-[var(--radio-checked-background)]',
				'peer-disabled:hover:ring-0 peer-disabled:hover:border-transparent',
				className,
			)}
			{...props}
		>
			<RadioGroupPrimitive.Indicator className="flex items-center justify-center">
				{/* <Circle className="h-2.5 w-2.5 fill-current text-current" /> */}
				<Circle
					className="h-3 w-3"
					strokeWidth={5}
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</RadioGroupPrimitive.Indicator>
		</RadioGroupPrimitive.Item>
	);
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

const RadioGroupLabel = React.forwardRef<
	HTMLLabelElement,
	React.LabelHTMLAttributes<HTMLLabelElement>
>(({ ...props }, ref) => {
	return (
		<label
			ref={ref}
			className={cn(
				'font-inter text-sm font-normal leading-5 tracking-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
			)}
			{...props}
		/>
	);
});
RadioGroupLabel.displayName = 'RadioGroupLabel';

export { RadioGroup, RadioGroupItem, RadioGroupLabel };
