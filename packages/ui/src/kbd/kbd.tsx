import { Slot } from '@radix-ui/react-slot';
import type React from 'react';
import { cn } from '../lib/utils.js';
import styles from './kbd.module.css';

type KbdSize = 'sm' | 'default' | 'lg';

interface KbdProps
	extends Pick<React.ComponentProps<'kbd'>, 'className' | 'children' | 'id' | 'style'> {
	/**
	 * The testId associated with the kbd element.
	 */
	testId?: string;
	/**
	 * @default false
	 */
	asChild?: boolean;
	/**
	 * @default default
	 */
	size?: KbdSize;
}

function Kbd({
	className,
	size = 'default',
	asChild = false,
	testId,
	children,
	...props
}: KbdProps) {
	const Comp = asChild ? Slot : 'kbd';

	return (
		<Comp
			data-slot="kbd"
			data-size={size}
			data-testid={testId}
			className={cn(styles.kbd, className)}
			{...props}
		>
			{children}
		</Comp>
	);
}

export { Kbd };
export type { KbdProps, KbdSize };
