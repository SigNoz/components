import { forwardRef } from 'react';
import { AsChild } from '../lib/as-child.js';
import { cn } from '../lib/utils.js';
import styles from './kbd.module.css';

type KbdSize = 'sm' | 'default' | 'lg';

interface KbdProps extends Pick<
	React.ComponentProps<'kbd'>,
	'className' | 'children' | 'id' | 'style'
> {
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
	/**
	 * Highlights the key with a subtle primary color tint.
	 * @default false
	 */
	active?: boolean;
}

const Kbd = forwardRef<HTMLElement, KbdProps>(
	(
		{ className, size = 'default', asChild = false, active = false, testId, children, ...props },
		ref,
	) => {
		const elementProps = {
			'data-slot': 'kbd',
			'data-size': size,
			'data-active': active || undefined,
			'data-testid': testId,
			className: cn(styles.kbd, className),
			...props,
		};

		if (asChild) {
			return (
				<AsChild child={children} props={elementProps} defaultTagName="kbd" elementRef={ref} />
			);
		}

		return (
			<kbd ref={ref} {...elementProps}>
				{children}
			</kbd>
		);
	},
);
Kbd.displayName = 'Kbd';

export type { KbdProps, KbdSize };
export { Kbd };
