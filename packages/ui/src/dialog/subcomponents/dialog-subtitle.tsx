import * as React from 'react';
import { cn } from '../../lib/utils.js';
import styles from '../dialog.module.css';

export type DialogSubtitleProps = Pick<
	React.ComponentPropsWithoutRef<'div'>,
	'id' | 'className' | 'style' | 'children'
> & {
	/**
	 * Test ID for the dialog subtitle.
	 */
	testId?: string;
};

export const DialogSubtitle = React.forwardRef<HTMLDivElement, DialogSubtitleProps>(
	({ className, testId, ...props }, ref) => (
		<div
			ref={ref}
			data-slot="dialog-subtitle"
			data-testid={testId}
			className={cn(styles.dialog__subtitle, className)}
			{...props}
		/>
	)
);
