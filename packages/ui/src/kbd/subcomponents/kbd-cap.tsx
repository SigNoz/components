import { forwardRef, type CSSProperties } from 'react';
import styles from '../kbd.module.scss';
import type { KbdDisplayType, KbdKey, KbdKeyProps } from '../types.js';
import { kbdGlyph, kbdWord } from '../utils.js';

/**
 * @access private
 */
export type KbdCapProps = Omit<KbdKeyProps, 'value'> & {
	value: KbdKey;
	isMac: boolean;
	display?: KbdDisplayType;
	style?: CSSProperties;
};

/**
 * One key as drawn: the glyph, hidden from assistive tech, and the spoken word, hidden from the
 * screen. Whether it shows as pressed comes from the caller.
 *
 * @access private
 */
export const KbdCap = forwardRef<HTMLElement, KbdCapProps>(function KbdCap(
	{ value, pressed = false, isMac, disabled = false, display, testId, ...props },
	ref,
) {
	return (
		<kbd
			{...props}
			ref={ref}
			data-slot="kbd"
			data-key={value}
			data-display={display}
			data-pressed={(pressed && !disabled) || undefined}
			data-disabled={disabled || undefined}
			data-testid={testId}
			className={styles['kbd']}
		>
			<span aria-hidden="true" className={styles['kbd__face']}>
				{kbdGlyph(value, isMac)}
			</span>
			<span className={styles['kbd__word']}>{kbdWord(value, isMac)}</span>
		</kbd>
	);
});
