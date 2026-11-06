import type { Dialog } from '@signozhq/ui';
import type { Meta } from '@storybook/react-vite';

export const WIDTHS = ['narrow', 'base', 'wide', 'extra-wide', 'full'] as const;

export const dialogParameters: Meta<typeof Dialog>['parameters'] = {
	layout: 'fullscreen',
	design: {
		type: 'figma',
		url: 'https://www.figma.com/design/eyORbfrXMWCz9w0xEFdgWe/Periscope-%E2%80%93-Primitives-v2?node-id=12-753',
	},
};

export const dialogArgTypes: Meta<typeof Dialog>['argTypes'] = {
	open: {
		control: false,
		description:
			'Shows the dialog. With `open` the dialog is controlled: it never opens or closes itself, so the story keeps this in state and a button opens it. Required unless a `handle` is passed, and never passed with one.',
		table: { category: 'State', type: { summary: 'boolean' } },
	},
	handle: {
		control: false,
		description:
			'A handle from `useDialogHandle()`, for showing the dialog from application state instead of `open`: `handle.open(payload)` shows it from anywhere, such as a row action, and `handle.close()` dismisses it. The dialog closes itself on every close request, so `onClose` is never passed with a handle, and `useDialogHandle(onOpenChange)` reports each close. A dialog that must refuse a close uses `open`. Never passed with `open`.',
		table: { category: 'State', type: { summary: 'DialogHandle<Payload>' } },
	},
	container: {
		control: false,
		description:
			'The element the dialog is portalled into, for a page that shows only part of the document, such as an element in fullscreen. The backdrop and the panel are `position: fixed`, so an ancestor with a `transform`, a `filter` or `contain` fixes them to that ancestor instead of the viewport.',
		table: {
			category: 'Behavior',
			type: { summary: 'HTMLElement | ShadowRoot | RefObject<HTMLElement | ShadowRoot | null>' },
			defaultValue: { summary: 'document.body' },
		},
	},
	initialFocus: {
		control: false,
		description:
			'Where focus goes when the dialog opens. The panel by default, so a screen reader reads the title first. A ref pins it to one element, such as the field to fill first. Use it instead of `autoFocus` on an element in the body: React runs `autoFocus` before the dialog records where the focus was, so on close the focus would fall to the page body.',
		table: {
			category: 'Behavior',
			type: {
				summary:
					'boolean | RefObject<HTMLElement | null> | ((openType) => HTMLElement | boolean | void)',
			},
			defaultValue: { summary: 'the panel' },
		},
	},
	finalFocus: {
		control: false,
		description: 'Where focus returns when the dialog closes.',
		table: {
			category: 'Behavior',
			type: {
				summary:
					'boolean | RefObject<HTMLElement | null> | ((closeType) => HTMLElement | boolean | void)',
			},
			defaultValue: { summary: 'the element that had the focus when the dialog opened' },
		},
	},
	onClose: {
		control: false,
		description:
			'Called when the user asks to close the dialog, with the reason: `escape-key`, `outside-press` or `close-press`. The dialog stays open until `open` becomes `false`. Required with `open`, and never passed with a `handle`: a dialog on a handle closes itself on every request, and `useDialogHandle(onOpenChange)` reports it. To keep the dialog open for one reason, such as unsaved edits, use `open`, ignore that reason here and say why in the code.',
		table: {
			category: 'Events',
			type: {
				summary: "(reason: 'escape-key' | 'outside-press' | 'close-press') => void",
			},
		},
	},
	title: {
		control: 'text',
		description:
			'Required. The heading, and the accessible name of the panel. It wraps and never truncates. An empty string renders `<No title>`, so the missing name shows in review.',
		table: { category: 'Content', type: { summary: 'string' } },
	},
	titleIcon: {
		control: false,
		description: 'An icon rendered before the title.',
		table: { category: 'Content', type: { summary: 'ReactElement' } },
	},
	description: {
		control: 'text',
		description:
			'A line under the title, inside the header. It is the `aria-describedby` of the panel, and a node that renders nothing renders no description.',
		table: { category: 'Content', type: { summary: 'ReactNode' } },
	},
	children: {
		control: 'text',
		description:
			'Required. The body. It scrolls when the panel reaches its max height, while the header and the footer stay put. Initial focus goes to its first focusable element. With a `handle`, it may be a function of the payload of the latest `handle.open(payload)`, called only while the dialog is shown.',
		table: {
			category: 'Content',
			type: { summary: 'ReactNode | ((payload: Payload) => ReactNode)' },
		},
	},
	footerSuffix: {
		control: false,
		description:
			'The actions, at the end of the footer: a secondary Cancel button and one primary, primary last. A form in the body submits through a button here with `form="<form id>"`. A node that renders nothing renders no footer. Below 640px the buttons stack, the last one on top. The playground draws its own, since its buttons close the dialog.',
		table: { category: 'Content', type: { summary: 'ReactNode' } },
	},
	footerPrefix: {
		control: false,
		description:
			'Rendered at the start of the footer, apart from the actions: one destructive button, or one line of hint text. Rendered only with a `footerSuffix` that renders something. Below 640px it goes under the stacked buttons.',
		table: { category: 'Content', type: { summary: 'ReactNode' } },
	},
	loading: {
		control: 'boolean',
		description:
			'Shows the dialog while its content is still being fetched. The title, `titleIcon`, `description`, `footerPrefix` and `footerSuffix` each show a skeleton when they are passed, and the body shows `loadingContent`. `children` is not rendered, or called with the payload, until `loading` is `false`. The close button stays, and the panel is `aria-busy` and still named by `title`.',
		table: { category: 'State', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
	},
	loadingContent: {
		control: false,
		description:
			'What the body shows while `loading` is true, such as a skeleton shaped like the form about to render. Defaults to a title line and three text lines.',
		table: { category: 'Content', type: { summary: 'ReactNode' } },
	},
	width: {
		control: 'select',
		options: WIDTHS,
		description:
			'The max width of the panel, so on a narrow screen it shrinks before it overflows: `narrow` 384px, `base` 512px, `wide` 672px, `extra-wide` 820px, `full` the viewport minus 16px on each side. Only these names are accepted.',
		table: {
			category: 'Appearance',
			type: { summary: "'narrow' | 'base' | 'wide' | 'extra-wide' | 'full'" },
			defaultValue: { summary: 'base' },
		},
	},
	testId: {
		control: 'text',
		description:
			'Forwarded to the panel as `data-testid`. Every part is named after it: `-backdrop`, `-header`, `-title`, `-description`, `-close`, `-body`, `-footer`, `-footer-prefix` and `-footer-suffix`. While `loading`, the skeletons are `-title-skeleton`, `-description-skeleton` and `-body-skeleton`.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},
	id: {
		control: 'text',
		description: 'Lands on the panel. Every `aria-*` and `data-*` prop is forwarded there too.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
};
