import type { DatePicker } from '@signozhq/ui';
import type { Meta } from '@storybook/react-vite';

export const datePickerArgTypes: Meta<typeof DatePicker>['argTypes'] = {
	placeholder: {
		control: 'text',
		description:
			'What the trigger shows while there is no value. Required. Also its accessible name when no `aria-label`, `aria-labelledby` or `<label>` names it.',
		table: { category: 'Content', type: { summary: 'string' } },
	},
	formatValue: {
		control: false,
		description:
			'Formats the value for the trigger and for its accessible value, with the date library of the app. Without it the trigger shows `YYYY-MM-DD`, or `YYYY-MM-DD HH:mm:ss` with `showTime`, followed by the label of the selected zone with `showTimezone`. An empty string shows `<No label>`.',
		table: {
			category: 'Content',
			type: {
				summary: '(value: TDate, details: { timezone: string | undefined }) => string',
			},
		},
	},
	value: {
		control: false,
		description:
			'The selected date. Without `showTime` it is the start of the picked day. `undefined` on the first render leaves the date picker uncontrolled, starting at `defaultValue`. A value that arrives later is followed, with a warning, and once controlled `undefined` is no date. With `nullable`, `null` is no date too, and a controlled date picker that starts empty passes it. A value outside the limits is shown as it is, and the date picker never calls `onChange` to correct it.',
		table: { category: 'Value', type: { summary: 'TDate | undefined' } },
	},
	nullable: {
		control: false,
		description:
			'Makes `value` also take `null` for no date, and makes a clear report `null` in place of `undefined`. For a field whose schema is nullable, such as a zod `.nullable()` one behind a react-hook-form `Controller`. Only `true` is accepted.',
		table: { category: 'Value', type: { summary: 'true' } },
	},
	defaultValue: {
		control: false,
		description:
			'The date selected on the first render, for a date picker that keeps its own state. A form reset brings it back.',
		table: { category: 'Value', type: { summary: 'TDate' } },
	},
	onChange: {
		control: false,
		description:
			'Called with the new date when a day is picked, when `Apply` is pressed with `showTime`, and with `undefined` when the value is cleared, or `null` with `nullable`. `details.timezone` is the zone picked with `showTimezone`.',
		table: {
			category: 'Events',
			type: {
				summary: '(value: TDate | undefined, details: { timezone: string | undefined }) => void',
			},
		},
	},
	onBlur: {
		control: false,
		description:
			'Called when the focus leaves the date picker, the trigger and its popup counting as one. Opening and closing the popup do not call it. Tabbing away, or pressing outside while the popup is open, does. A handler with no argument, such as the `onBlur` of a react-hook-form `field`, is accepted.',
		table: { category: 'Events', type: { summary: '(event: FocusEvent<HTMLElement>) => void' } },
	},
	showTime: {
		control: 'boolean',
		description:
			'Adds a time row under the calendar and an `Apply` button that commits the day and the time together. Without it a pick commits and closes the popup at once.',
		table: {
			category: 'Time',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	showTimezone: {
		control: false,
		description:
			'Adds a time zone field under the time row. `options` lists the zones, `value` makes the zone controlled and `defaultValue` sets the first one. The picked zone comes back in `onChange` as `details.timezone`, and the adapter does the time zone math. Only with `showTime`, and only on a date picker made with an adapter that declares `supportsTimezone`.',
		table: {
			category: 'Time',
			type: {
				summary:
					'{ options: { value: string; label: string }[]; value?: string; defaultValue?: string }',
			},
		},
	},
	minDate: {
		control: false,
		description:
			'The first day that can be picked, included. The days before it are disabled, and the month arrows stop at its month. Compares calendar days in the selected zone, so any time of the day allows the whole day.',
		table: { category: 'Limits', type: { summary: 'TDate' } },
	},
	maxDate: {
		control: false,
		description:
			'The last day that can be picked, included. The days after it are disabled, and the month arrows stop at its month.',
		table: { category: 'Limits', type: { summary: 'TDate' } },
	},
	disabledDate: {
		control: false,
		description:
			'Disables single days inside `minDate` and `maxDate`, such as weekends or holidays. Called with the start of each day the calendar draws, in the selected zone, and only for the days inside the limits. Keep it cheap and pure: it runs for every drawn day on every render. It never moves the month arrows.',
		table: { category: 'Limits', type: { summary: '(date: TDate) => boolean' } },
	},
	allowClear: {
		control: 'boolean',
		description:
			'Shows a clear button in the trigger while there is a value. `Delete` and `Backspace` on the trigger clear it too.',
		table: {
			category: 'Behavior',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	container: {
		control: false,
		description:
			'The element the popup is portalled into. Defaults to `document.body`, or to the panel of the `Dialog` or `Drawer` the date picker sits in.',
		table: { category: 'Behavior', type: { summary: 'HTMLElement | RefObject' } },
	},
	name: {
		control: 'text',
		description:
			'Identifies the field when the owning form is submitted. It submits `YYYY-MM-DD`, or `YYYY-MM-DDTHH:mm:ss` with `showTime`, and an empty string without a value. With `showTimezone`, a second field named `<name>-timezone` submits the zone.',
		table: { category: 'Form', type: { summary: 'string' } },
	},
	form: {
		control: 'text',
		description:
			'The id of the owning form, for a date picker rendered outside the `<form>` element.',
		table: { category: 'Form', type: { summary: 'string' } },
	},
	required: {
		control: 'boolean',
		description:
			'An empty date picker fails the form validation, and the trigger carries `aria-required`. Inside a required `Field` the trigger carries `aria-required` without it, and only this prop sets the native `required`.',
		table: {
			category: 'Form',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	disabled: {
		control: 'boolean',
		description:
			'Keeps the popup closed, blocks the keys on the trigger and hides the clear button. The trigger carries `aria-disabled`, not the native `disabled`, so the reason stays reachable. A disabled date picker is left out of the form submit. Requires `disabledTooltip`. `readOnly` outranks it.',
		table: {
			category: 'State',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	disabledTooltip: {
		control: 'text',
		description:
			'Why the date picker cannot be used, in a tooltip on the trigger while `disabled` is true and `readOnly` is not.',
		table: { category: 'State', type: { summary: 'ReactNode' } },
	},
	readOnly: {
		control: 'boolean',
		description:
			'Keeps the popup closed and the value as it is, with the trigger colours unchanged, faded a little and without its calendar icon. The trigger carries `aria-readonly`, and the value is still submitted with the form. Requires `readOnlyTooltip`.',
		table: {
			category: 'State',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	readOnlyTooltip: {
		control: 'text',
		description:
			'Why the date picker cannot be changed, in a tooltip on the trigger while `readOnly` is true.',
		table: { category: 'State', type: { summary: 'ReactNode' } },
	},
	width: {
		control: 'text',
		description: 'The width of the date picker. A number is read as pixels.',
		table: {
			category: 'Appearance',
			type: { summary: 'number | string' },
			defaultValue: { summary: '100%' },
		},
	},
	maxWidth: {
		control: 'text',
		description: 'The max-width of the date picker. A number is read as pixels.',
		table: {
			category: 'Appearance',
			type: { summary: 'number | string' },
			defaultValue: { summary: '100%' },
		},
	},
	id: {
		control: 'text',
		description: 'Forwarded to the trigger, so a `<label htmlFor>` can name it.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	'aria-label': {
		control: 'text',
		description:
			'Names the trigger. Without a name, the `placeholder` names the trigger, which is not a label.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	'aria-labelledby': {
		control: 'text',
		description: 'The id of a visible label that names the trigger.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	'aria-invalid': {
		control: 'boolean',
		description:
			'Marks the value as invalid. The trigger border turns destructive, hovered or not.',
		table: { category: 'Accessibility', type: { summary: 'boolean' } },
	},
	testId: {
		control: 'text',
		description:
			'Forwarded to the trigger as `data-testid`, and the stem every part is named from.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},
};
