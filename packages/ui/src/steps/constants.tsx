/**
 * The state of one step of `Steps`, written to `data-status`. It comes from the position of the
 * step against `current`, never from a prop.
 */
export const StepsStatus = {
	Done: 'done',
	Current: 'current',
	Waiting: 'waiting',
} as const;

/**
 * @access private
 */
export const STEPS_EMPTY_LABEL = '<No label>';

/**
 * The visually hidden word after the label of a done step.
 *
 * @access private
 */
export const STEPS_DONE_TEXT = 'Completed';
