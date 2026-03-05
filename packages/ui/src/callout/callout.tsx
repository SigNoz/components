// packages/ui/src/callout/callout.tsx
import './index.css';
import * as React from 'react';
import { cn } from '../lib/utils.js';
import styles from './callout.module.css';

type CalloutType = 'info' | 'success' | 'warning' | 'error';
type CalloutSize = 'small' | 'medium';

interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
	type?: CalloutType;
	size?: CalloutSize;
	icon?: React.ReactNode;
	title?: string;
	description?: string;
}

const Callout = React.forwardRef<HTMLDivElement, CalloutProps>(
	(
		{ className, type = 'info', size = 'medium', icon, title, description, children, ...props },
		ref
	) => {
		return (
			<div
				ref={ref}
				data-slot="callout"
				data-color={
					type === 'info'
						? 'robin'
						: type === 'success'
							? 'forest'
							: type === 'warning'
								? 'amber'
								: 'cherry'
				}
				data-type={type}
				data-size={size}
				className={cn(styles['callout'], className)}
				{...props}
			>
				{icon && <div className={styles['callout__icon']}>{icon}</div>}
				<div className={styles['callout__content']}>
					{title && <div className={styles['callout__title']}>{title}</div>}
					{description && <div className={styles['callout__description']}>{description}</div>}
					{children}
				</div>
			</div>
		);
	}
);
Callout.displayName = 'Callout';

export { Callout };
export type { CalloutProps, CalloutType, CalloutSize };
