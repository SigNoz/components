import type { AlertDialog } from '@signozhq/ui';
import type { Meta } from '@storybook/react-vite';

export const alertDialogParameters: Meta<typeof AlertDialog>['parameters'] = {
	layout: 'fullscreen',
	design: {
		type: 'figma',
		url: 'https://www.figma.com/design/eyORbfrXMWCz9w0xEFdgWe/Periscope-%E2%80%93-Primitives-v2?node-id=1884-7446',
	},
};

export const alertDialogArgTypes: Meta<typeof AlertDialog>['argTypes'] = {
	open: {
		control: false,
		description:
			'Shows the alert. With `open` the alert is controlled: it never opens or closes itself, so the page keeps this in state and a button opens it. Required unless a `handle` is passed, and never passed with one.',
		table: { category: 'State', type: { summary: 'boolean' } },
	},
	handle: {
		control: false,
		description:
			'A handle from `useDialogHandle()`, for showing the alert from application state instead of `open`: `handle.open(payload)` shows it, and `onConfirm` receives the payload. The alert closes itself on cancel and once `onConfirm` returns or its promise resolves, unless the answer is `false`, so `onCancel` is never passed with a handle, and `useDialogHandle(onOpenChange)` reports each close. Never passed with `open`.',
		table: { category: 'State', type: { summary: 'DialogHandle<Payload>' } },
	},
	container: {
		control: false,
		description:
			'The element the alert is portalled into, for a page that shows only part of the document, such as an element in fullscreen. The backdrop and the panel are `position: fixed`, so an ancestor with a `transform`, a `filter` or `contain` fixes them to that ancestor instead of the viewport.',
		table: {
			category: 'Behavior',
			type: { summary: 'HTMLElement | ShadowRoot | RefObject<HTMLElement | ShadowRoot | null>' },
			defaultValue: { summary: 'document.body' },
		},
	},
	title: {
		control: 'text',
		description:
			'Required. The question the alert asks, such as `Delete this view?`, and the accessible name of the panel. An empty string renders `<No title>`, so the missing name shows in review.',
		table: { category: 'Content', type: { summary: 'string' } },
	},
	titleIcon: {
		control: false,
		description: 'An icon rendered before the title.',
		table: { category: 'Content', type: { summary: 'ReactElement' } },
	},
	children: {
		control: 'text',
		description:
			'Required. The body. It states the consequence of the action, not the action again, and it is the `aria-describedby` of the panel. With a `handle`, it may be a function of the payload of the latest `handle.open(payload)`, called only while the alert is shown.',
		table: {
			category: 'Content',
			type: { summary: 'ReactNode | ((payload: Payload) => ReactNode)' },
		},
	},
	color: {
		control: 'inline-radio',
		options: ['primary', 'danger'],
		description:
			'Required. The intent of the confirm button: `danger` for a destructive action, `primary` for a consequential one.',
		table: { category: 'Appearance', type: { summary: "'primary' | 'danger'" } },
	},
	confirmText: {
		control: 'text',
		description:
			'Required. The label of the confirm button. Name the action (`Delete view`), not `OK`.',
		table: { category: 'Content', type: { summary: 'string' } },
	},
	confirmIcon: {
		control: false,
		description: 'The prefix of the confirm button.',
		table: { category: 'Content', type: { summary: 'ReactElement' } },
	},
	cancelText: {
		control: 'text',
		description: 'The label of the cancel button.',
		table: {
			category: 'Content',
			type: { summary: 'string' },
			defaultValue: { summary: 'Cancel' },
		},
	},
	cancelIcon: {
		control: false,
		description: 'The prefix of the cancel button.',
		table: { category: 'Content', type: { summary: 'ReactElement' } },
	},
	initialFocus: {
		control: false,
		description:
			'Where focus goes when the alert opens. The panel by default, so a screen reader reads the title and the body first. A ref pins it to one element, such as a field in the body the user fills before confirming. Never point it at the confirm button.',
		table: {
			category: 'Behavior',
			type: { summary: 'boolean | RefObject<HTMLElement | null> | ((openType) => …)' },
			defaultValue: { summary: 'the panel' },
		},
	},
	finalFocus: {
		control: false,
		description:
			'Where focus returns when the alert closes, such as the table when the row the alert opened from was deleted.',
		table: {
			category: 'Behavior',
			type: { summary: 'boolean | RefObject<HTMLElement | null> | ((closeType) => …)' },
			defaultValue: { summary: 'the element that had the focus when the alert opened' },
		},
	},
	onConfirm: {
		control: false,
		description:
			'Required. Called when the confirm button is pressed, with the payload of `handle.open(payload)`. While the promise it returns is pending, the confirm button shows its loading state, the cancel button is disabled and `Esc` does nothing. With `open`, the alert does not close itself: set `open` to `false`, usually at the end of this handler. With a `handle`, it closes once the handler returns or its promise resolves, unless the answer is `false`: return `false` to keep it open, such as after a failed request you have already reported. A rejected promise ends the loading state and leaves the alert open either way, and it is caught, not rethrown.',
		table: {
			category: 'Events',
			type: { summary: '(payload: Payload) => Promise<boolean | void> | boolean | void' },
		},
	},
	onCancel: {
		control: false,
		description:
			'Called by the cancel button and by `Esc`. A press on the backdrop does nothing. Required with `open`, where you set `open` to `false` here. Never passed with a `handle`: the alert closes itself on cancel, and `useDialogHandle(onOpenChange)` reports it.',
		table: { category: 'Events', type: { summary: '() => void' } },
	},
	testId: {
		control: 'text',
		description:
			'Forwarded to the panel as `data-testid`. Every part is named after it: `-backdrop`, `-title`, `-body`, `-cancel` and `-confirm`.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},
	id: {
		control: 'text',
		description: 'Lands on the panel. Every `aria-*` and `data-*` prop is forwarded there too.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
};
