/**
 * Whether `value` has nothing to read: it is empty or has only spaces. Takes any value, for a
 * caller with no types, and a value that is not a string is blank.
 *
 * @access private
 */
export function isBlankText(value: unknown): boolean {
	return typeof value !== 'string' || value.trim() === '';
}
