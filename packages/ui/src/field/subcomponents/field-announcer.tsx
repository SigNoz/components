import { type ReactNode, useRef } from 'react';
import { useIsomorphicLayoutEffect } from '../../lib/use-isomorphic-layout-effect.js';
import styles from '../field.module.scss';

/**
 * Stays mounted while the row comes and goes, because a screen reader only announces changes to a
 * live region that already exists.
 *
 * It holds the text of the message row, read from the row with `messageId`, and not a second copy
 * of the `message` nodes: a link or a button in the message would be a second tab stop that cannot
 * be seen, and an id inside it would repeat.
 *
 * @access private
 */
export function FieldAnnouncer({
	messageId,
	message,
}: {
	messageId: string | undefined;
	message: ReactNode;
}) {
	const ref = useRef<HTMLSpanElement>(null);

	useIsomorphicLayoutEffect(() => {
		const announcer = ref.current;

		if (announcer === null) {
			return;
		}

		const row =
			messageId === undefined
				? null
				: announcer.parentElement?.querySelector(`#${CSS.escape(messageId)}`);
		const text = row?.textContent ?? '';

		// Writing the same text again would announce it again.
		if (announcer.textContent !== text) {
			announcer.textContent = text;
		}
	}, [messageId, message]);

	return (
		<span
			ref={ref}
			className={styles['field__announcer']}
			data-slot="field-announcer"
			aria-live="polite"
		/>
	);
}
