import { forwardRef } from 'react';
import { cn } from '../lib/utils.js';
import styles from './divider.module.scss';

export interface DividerProps
	extends Pick<React.ComponentProps<'div'>, 'className' | 'children' | 'id' | 'style'> {
	type?: 'horizontal' | 'vertical';
	dashed?: boolean;
	plain?: boolean;
	testId?: string;
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
	(
		{ className, type = 'horizontal', dashed = false, plain = false, testId, children, ...props },
		ref
	) => {
		const hasChildren = children != null;
		const separatorProps = hasChildren
			? {}
			: ({ role: 'separator', 'aria-orientation': type } as const);

		return (
			<div
				ref={ref}
				{...separatorProps}
				data-slot="divider"
				data-type={type}
				data-dashed={dashed || undefined}
				data-plain={plain || undefined}
				data-with-text={hasChildren || undefined}
				data-testid={testId}
				className={cn(styles.divider, className)}
				{...props}
			>
				{hasChildren && <span className={styles.text}>{children}</span>}
			</div>
		);
	}
);
Divider.displayName = 'Divider';
