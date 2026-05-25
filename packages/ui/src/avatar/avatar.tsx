import { forwardRef, useState } from 'react';
import { cn } from '../lib/utils.js';
import styles from './avatar.module.scss';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export type AvatarColor =
	| 'primary'
	| 'secondary'
	| 'success'
	| 'error'
	| 'warning'
	| 'robin'
	| 'forest'
	| 'amber'
	| 'sienna'
	| 'cherry'
	| 'sakura'
	| 'aqua'
	| 'vanilla';

export interface AvatarProps
	extends Pick<React.ComponentProps<'span'>, 'className' | 'children' | 'id' | 'style'> {
	size?: AvatarSize;
	src?: string;
	alt?: string;
	shape?: 'circle' | 'square';
	color?: AvatarColor;
	loading?: boolean;
	testId?: string;
}

const colorMap: Record<string, string> = {
	success: 'forest',
	warning: 'amber',
	error: 'cherry',
	primary: 'robin',
	secondary: 'vanilla',
};

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
	(
		{
			className,
			size = 'md',
			src,
			alt,
			shape = 'circle',
			color,
			loading = false,
			testId,
			children,
			...props
		},
		ref
	) => {
		const [imgError, setImgError] = useState(false);

		const resolvedColor = color ? colorMap[color] || color : undefined;

		return (
			<span
				ref={ref}
				data-slot="avatar"
				data-size={size}
				data-shape={shape}
				data-color={resolvedColor}
				data-loading={loading || undefined}
				data-testid={testId}
				className={cn(styles.avatar, className)}
				{...props}
			>
				{loading ? (
					<span className={styles.skeleton} />
				) : src && !imgError ? (
					<img
						className={styles.image}
						src={src}
						alt={alt}
						onError={(): void => setImgError(true)}
					/>
				) : (
					<span className={styles.fallback}>{children}</span>
				)}
			</span>
		);
	}
);
Avatar.displayName = 'Avatar';
