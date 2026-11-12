import type { ColorPicker } from '@signozhq/ui';
import type { Meta } from '@storybook/react-vite';

export const colorPickerArgTypes: Meta<typeof ColorPicker>['argTypes'] = {
	children: {
		control: false,
		description:
			'The trigger. Rendered as the element you pass, with the press handler, the aria attributes and the data attributes of the picker merged into it, so there is no wrapper around it. It cannot be a `Tooltip`, and the picker never restyles it: it reads `data-popup-open`, `data-disabled`, `data-readonly`, and `data-invalid` inside a `Field` in `danger`.',
		table: { category: 'Content', type: { summary: 'ReactElement' } },
	},
	nativeButton: {
		control: false,
		description:
			'Required. Whether `children` renders a native `<button>`. `true` for a `<button>` or `Button`, whose role and keys come from the browser. `false` for anything else, and Base UI adds `role="button"`, `tabIndex` and the `Enter` and `Space` handlers. The value has to match the element: Base UI logs an error on a mismatch.',
		table: { category: 'Content', type: { summary: 'boolean' } },
	},
	value: {
		control: false,
		description:
			"The selected color, a hex string. `undefined` and `''` are no color. Reads `#rgb`, `#rgba`, `#rrggbb` and `#rrggbbaa` in any case and drops the alpha. `undefined` on the first render leaves the picker uncontrolled, starting at `defaultValue`. A value that arrives later is followed, with a warning, and once controlled `undefined` is no color. `null` is no color too, with `nullable`. During a drag the panel shows the draft, and a `value` that changed from outside is applied after the release.",
		table: { category: 'Content', type: { summary: 'string | undefined' } },
	},
	defaultValue: {
		control: 'color',
		description:
			'The initial color, for a picker that keeps its own state. Without it and without `value`, the picker holds no color and the panel opens at `#000000` with an empty hex field.',
		table: { category: 'Content', type: { summary: 'string | undefined' } },
	},
	footer: {
		control: false,
		description:
			'Content rendered under the hex field. Receives the color the panel shows as `#rrggbb`, the draft during a drag included, and `#000000` while there is no color. Wraps inside the popup width and never scrolls, so keep it to a line or two. Not a live region.',
		table: { category: 'Content', type: { summary: '(color: string) => ReactNode' } },
	},
	side: {
		control: 'select',
		options: ['top', 'bottom', 'left', 'right'],
		description:
			'The side of the trigger the popup opens on. Required: placement is never incidental. Flips to the opposite side when there is no room.',
		table: { category: 'Layout', type: { summary: 'top | bottom | left | right' } },
	},
	align: {
		control: 'select',
		options: ['start', 'center', 'end'],
		description: 'How the popup aligns with the trigger on that side. Required.',
		table: { category: 'Layout', type: { summary: 'start | center | end' } },
	},
	container: {
		control: false,
		description:
			'The element the popup is portalled into. Defaults to `document.body`, or to the panel of the `Dialog` or `Drawer` the picker sits in.',
		table: {
			category: 'Layout',
			type: { summary: 'HTMLElement | ShadowRoot | RefObject | null' },
			defaultValue: { summary: 'document.body' },
		},
	},
	allowClear: {
		control: 'boolean',
		description:
			'Lets the user take the picker back to no color: a clear button at the end of the hex field, and `Delete` and `Backspace` on the trigger while the popup is closed. Both call `onChange` and `onAfterChange` once each with `undefined`, or `null` with `nullable`, close the popup and leave the focus on the trigger. Only while there is a color, and never while `disabled` or `readOnly`.',
		table: {
			category: 'Behavior',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	onChange: {
		control: false,
		description:
			'Called on every change: while the area or the hue thumb drags (at most once per animation frame), on each key press, when the hex field commits, and with `undefined` on a clear, or `null` with `nullable`. A color is always `#rrggbb` in lower case. Never called when the hex did not change.',
		table: { category: 'Events', type: { summary: '(value: string | undefined) => void' } },
	},
	onAfterChange: {
		control: false,
		description:
			'Called once when a change ends: on pointer release, on each key press, when the hex field commits, and with `undefined` on a clear, or `null` with `nullable`. A release on the hex the press started from calls nothing. Update a controlled `value` here alone, and the panel still follows the drag.',
		table: { category: 'Events', type: { summary: '(value: string | undefined) => void' } },
	},
	nullable: {
		control: false,
		description:
			'Makes `value` also take `null` for no color, and makes a clear report `null` in place of `undefined`. For a field whose schema is nullable, such as a zod `.nullable()` one behind a react-hook-form `Controller`. Only `true` is accepted.',
		table: { category: 'Behavior', type: { summary: 'true' } },
	},
	onBlur: {
		control: false,
		description:
			'Called once when the focus leaves the picker, the trigger and its popup counting as one. Opening and closing the popup do not call it. Tabbing away, or pressing outside while the popup is open, does. Called one task after the focus moved, with the trigger as `event.currentTarget`.',
		table: { category: 'Events', type: { summary: '(event: FocusEvent) => void' } },
	},
	name: {
		control: 'text',
		description:
			"Identifies the field when the owning form is submitted. The submitted value is `#rrggbb`, or `''` while there is no color.",
		table: { category: 'Behavior', type: { summary: 'string' } },
	},
	form: {
		control: 'text',
		description: 'The id of the owning form, for a picker rendered outside the `<form>` element.',
		table: { category: 'Behavior', type: { summary: 'string' } },
	},
	required: {
		control: 'boolean',
		description:
			'Blocks the submit of the owning form while the picker holds no color, and moves the focus to the trigger.',
		table: {
			category: 'Behavior',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	disabled: {
		control: 'boolean',
		description:
			'A press, `Enter` and `Space` on the trigger do not open the popup, and `Delete` and `Backspace` do not clear it. The trigger carries `aria-disabled` and `data-disabled`, never the native `disabled`, so it stays focusable and the reason stays reachable. Left out of the form submit. Closes an open popup. Ignored while `readOnly`. Requires `disabledTooltip`.',
		table: {
			category: 'State',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	disabledTooltip: {
		control: 'text',
		description:
			'Why the picker cannot be used, shown in a tooltip on the trigger on hover and on keyboard focus while `disabled` is true. Empty content renders no tooltip. Only allowed alongside `disabled`.',
		table: { category: 'State', type: { summary: 'ReactNode' } },
	},
	readOnly: {
		control: 'boolean',
		description:
			'Locks the color. The popup still opens so the color can be read and the hex copied, but the area, the hue strip and the keys change nothing, the hex field is a native read-only input, and the clear button does not render. Still submitted with its form. Outranks `disabled`. Requires `readOnlyTooltip`.',
		table: {
			category: 'State',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	readOnlyTooltip: {
		control: 'text',
		description:
			'Why the color is locked, shown in a tooltip on the trigger on hover and on keyboard focus while `readOnly` is true. Empty content renders no tooltip. Only allowed alongside `readOnly`.',
		table: { category: 'State', type: { summary: 'ReactNode' } },
	},
	id: {
		control: 'text',
		description: 'Lands on the popup.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	testId: {
		control: 'text',
		description:
			"`data-testid` on the trigger, where it wins over the element's own. It also names every part of the popup, such as `${testId}-popup` and `${testId}-hex`.",
		table: { category: 'Testing', type: { summary: 'string' } },
	},
};
