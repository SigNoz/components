import { Separator } from '@base-ui/react/separator';
import { forwardRef } from 'react';
import { cn } from '../lib/utils.js';
import styles from './divider.module.scss';

export interface DividerProps extends Pick<
	React.ComponentProps<'div'>,
	'className' | 'children' | 'id' | 'style'
> {
	type?: 'horizontal' | 'vertical';
	dashed?: boolean;
	plain?: boolean;
	testId?: string;
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
	(
		{ className, type = 'horizontal', dashed = false, plain = false, testId, children, ...props },
		ref,
	) => {
		const hasChildren = children != null;
		const sharedProps = {
			'data-slot': 'divider',
			'data-type': type,
			'data-dashed': dashed || undefined,
			'data-plain': plain || undefined,
			'data-with-text': hasChildren || undefined,
			'data-testid': testId,
			className: cn(styles.divider, className),
			...props,
		};

		// A separator cannot contain content, so only the childless form is a
		// real separator; the labelled form stays a plain element by design.
		if (hasChildren) {
			return (
				<div ref={ref} {...sharedProps}>
					<span className={styles.text}>{children}</span>
				</div>
			);
		}

		return <Separator ref={ref} orientation={type} {...sharedProps} />;
	},
);
Divider.displayName = 'Divider';
