import { useEffect } from 'react';

/**
 * Warns once per change about the two ways a card is built by mistake: a header with no title,
 * and a card with nothing in it.
 *
 * @access private
 */
export function useCardWarnings(hasEmptyTitle: boolean, isEmpty: boolean): void {
	useEffect(() => {
		if (hasEmptyTitle) {
			console.warn(
				'Card: `title` is empty, rendering `<No title>` in its place. The title also names the `headerSuffix` control.',
			);
		}
	}, [hasEmptyTitle]);

	useEffect(() => {
		if (isEmpty) {
			console.warn('Card: it has no header, no children and no footer, rendering the empty shell.');
		}
	}, [isEmpty]);
}
