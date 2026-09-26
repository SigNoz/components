import { type ComponentProps, type ReactElement, useContext, useMemo } from 'react';
import type { Root } from 'react-day-picker';
import { CalendarContext } from '../calendar-context.js';
import { mergeRefs } from '../../lib/merge-refs.js';

/**
 * The calendar's root element.
 *
 * It exists to put the consumer's ref on the same `<div>` react-day-picker keeps its own ref on
 * while `animate` is set.
 *
 * @access private
 */
export function CalendarRoot({ rootRef, ...props }: ComponentProps<typeof Root>): ReactElement {
	const { rootRef: forwardedRef } = useContext(CalendarContext);
	const ref = useMemo(() => mergeRefs(forwardedRef, rootRef), [forwardedRef, rootRef]);

	return <div ref={ref} {...props} />;
}
