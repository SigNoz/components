import { User } from '@signozhq/icons';
import type { ReactElement } from 'react';
import { partTestId } from '../../lib/utils.js';
import styles from '../avatar.module.scss';
import type { AvatarSizeType } from '../types.js';

const ICON_SIZE = { sm: 'sm', md: 'lg' } as const satisfies Record<AvatarSizeType, string>;

/**
 * What the avatar shows until its image has loaded, and in place of it when it fails or there is
 * none: the initials, or a generic user icon when `initials` is empty.
 *
 * @access private
 */
export function AvatarFallback({
	initials,
	size,
	testId,
}: {
	initials: string;
	size: AvatarSizeType;
	testId: string | undefined;
}): ReactElement {
	return (
		<span
			aria-hidden="true"
			data-slot="avatar-fallback"
			data-testid={partTestId(testId, 'fallback')}
			className={styles['avatar__fallback']}
		>
			{initials === '' ? (
				<User size={ICON_SIZE[size]} />
			) : (
				<span className={styles['avatar__initials']}>{initials}</span>
			)}
		</span>
	);
}
