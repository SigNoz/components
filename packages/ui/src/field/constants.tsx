export const FieldStatus = {
	Success: 'success',
	Warning: 'warning',
	Danger: 'danger',
} as const;

/**
 * The text of a label left empty, so the missing name shows in review and in tests.
 *
 * @access private
 */
export const EMPTY_LABEL_TEXT = '<No label>';

/**
 * The props of a field shorthand that go to the field. Every other prop goes to the control.
 *
 * @access private
 */
export const FIELD_SHORTHAND_KEYS = [
	'label',
	'labelIcon',
	'labelTooltip',
	'description',
	'error',
	'status',
	'message',
] as const;
