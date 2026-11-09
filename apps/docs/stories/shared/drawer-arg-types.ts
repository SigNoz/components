import type { Drawer } from '@signozhq/ui';
import type { Meta } from '@storybook/react-vite';

export const WIDTHS = ['narrow', 'base', 'wide', 'extra-wide', 'entity'] as const;

export const drawerParameters: Meta<typeof Drawer>['parameters'] = {
	layout: 'fullscreen',
	design: {
		type: 'figma',
		url: 'https://www.figma.com/design/eyORbfrXMWCz9w0xEFdgWe/Periscope-%E2%80%93-Primitives-v2?node-id=1885-8561',
	},
};

export const drawerArgTypes: Meta<typeof Drawer>['argTypes'] = {
	type: {
		control: 'inline-radio',
		options: ['task', 'inspector'],
		description:
			'Required. What the drawer is for. `inspector` shows one record to read and leaves the page usable: no backdrop, no focus trap, no scroll lock, and a press outside does not close it. It takes no footer and no description. `task` is one job to finish, such as a create or an edit form, or a picker: modal, with a backdrop and the footer.',
		table: { category: 'Appearance', type: { summary: "'inspector' | 'task'" } },
	},
	stack: {
		control: 'inline-radio',
		options: ['overlay', 'breadcrumb'],
		description:
			'Required. How a drawer declared inside this one renders when it opens. `breadcrumb` drills down: the nested drawer opens in place at the same width, and a trail of crumbs under its header leads back. `Esc` steps back one drawer, the close button closes the whole trail. `overlay` opens the nested drawer over this one at 80% of its width, and this one takes no input until it closes. A nested drawer takes its width from this one. A drawer declared in a `Dialog` or an `AlertDialog` opened from this one is not nested: it opens over the dialog as a drawer of its own.',
		table: { category: 'Behavior', type: { summary: "'overlay' | 'breadcrumb'" } },
	},
	crumb: {
		control: false,
		description:
			'The crumb of this drawer in a breadcrumb trail, nested in another drawer or the last one of the `trail` this drawer shows: a short `title`, the `icon` of the kind of record, a `preview` card shown while the crumb is hovered or focused, and a link (`href`, `target`, or a router link in `render`) for a new tab. A plain click on a crumb with a link still steps back. The crumb of the drawer on top has no card and no link. The `title` of the drawer, with no icon, by default.',
		table: {
			category: 'Content',
			type: {
				summary:
					'{ title?: ReactNode; icon?: ReactNode; preview?: ReactNode; href?: string; target?: string; render?: ReactElement }',
			},
			defaultValue: { summary: '{ title }' },
		},
	},
	trailEllipsis: {
		control: false,
		description:
			'The `...` crumb of the breadcrumb trail this drawer starts, merged over the default: a popover list that opens on hover and on a press, under the heading `Earlier steps`, with the number of the step at the end of every row. `render` replaces the list with your own content. Read on the first drawer of a trail only.',
		table: {
			category: 'Content',
			type: { summary: 'BreadcrumbEllipsisOptions' },
			defaultValue: {
				summary: "{ heading: 'Earlier steps', rowSuffix: step number }",
			},
		},
	},
	trail: {
		control: false,
		description:
			'The earlier steps of a drill-down this one drawer shows itself, root first, for content too heavy to keep mounted once per step, such as a page of charts. Each step is a crumb like `crumb`, with a required `title`. The drawer renders them as the trail under its header, its own `crumb` last, and `children` render only the current step, so a step back mounts that step again and it keeps no scroll or state. A nested drawer with `stack="breadcrumb"` keeps every earlier step mounted instead. Controlled: the drawer never changes the steps, so `onTrailSelect` is required with it. An empty `trail` shows no trail row, and `Esc` closes the drawer.',
		table: {
			category: 'Content',
			type: {
				summary:
					'readonly { title: ReactNode; icon?: ReactNode; preview?: ReactNode; href?: string; target?: string; render?: ReactElement }[]',
			},
		},
	},
	onTrailSelect: {
		control: false,
		description:
			'Called when the user asks to show an earlier step of `trail`: a plain click on its crumb (`crumb-press`), or `Esc`, which asks for the last one (`escape-key`). Drop the steps after `index` and render that step. A click on a crumb with `Ctrl`, `Cmd`, `Shift` or `Alt` follows its `href` and does not call it. The close button, a swipe and a press on the backdrop call `onClose` instead. A nested drawer open over this one closes first, with `crumb-press`. Required with `trail`, and rejected without it.',
		table: {
			category: 'Events',
			type: { summary: "(index: number, reason: 'crumb-press' | 'escape-key') => void" },
		},
	},
	open: {
		control: false,
		description:
			'Shows the drawer. With `open` the drawer is controlled: it never opens or closes itself, so the story keeps this in state and a button opens it. Required unless a `handle` is passed, and never passed with one.',
		table: { category: 'State', type: { summary: 'boolean' } },
	},
	handle: {
		control: false,
		description:
			'A handle from `useDrawerHandle()`, for showing the drawer from application state instead of `open`: `handle.open(payload)` shows it from anywhere, such as a row of a table, and calling it again while open swaps the payload in place. `handle.close()` dismisses it. The drawer closes itself on every close request, so `onClose` is never passed with a handle. Never passed with `open`.',
		table: { category: 'State', type: { summary: 'DrawerHandleType<Payload>' } },
	},
	container: {
		control: false,
		description:
			'The element the drawer is portalled into, for a page that shows only part of the document, such as an element in fullscreen. The backdrop and the panel are `position: fixed`, so an ancestor with a `transform`, a `filter` or `contain` fixes them to that ancestor instead of the viewport.',
		table: {
			category: 'Behavior',
			type: { summary: 'HTMLElement | ShadowRoot | RefObject<HTMLElement | ShadowRoot | null>' },
			defaultValue: { summary: 'document.body' },
		},
	},
	initialFocus: {
		control: false,
		description:
			'Where focus goes when the drawer opens. The panel by default, so a screen reader reads the title first. A ref pins it to one element, such as the field to fill first. Use it instead of `autoFocus` on an element in the body: React runs `autoFocus` before the drawer records where the focus was, so on close the focus would fall to the page body.',
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
		description: 'Where focus returns when the drawer closes.',
		table: {
			category: 'Behavior',
			type: {
				summary:
					'boolean | RefObject<HTMLElement | null> | ((closeType) => HTMLElement | boolean | void)',
			},
			defaultValue: { summary: 'the element that had the focus when the drawer opened' },
		},
	},
	onClose: {
		control: false,
		description:
			'Called when the user asks to close the drawer, with the reason: `escape-key`, `outside-press` (the backdrop of a `task`), `close-press`, `swipe` (towards the right edge on a touch screen) or `crumb-press` (an earlier crumb of a breadcrumb trail). The drawer stays open until `open` becomes `false`. An `inspector` never reports `outside-press`. Required with `open`, and never passed with a `handle`.',
		table: {
			category: 'Events',
			type: {
				summary:
					"(reason: 'escape-key' | 'outside-press' | 'close-press' | 'swipe' | 'crumb-press') => void",
			},
		},
	},
	title: {
		control: 'text',
		description:
			'Required. The name of the record or the job, and the accessible name of the panel. One line: a longer name is cut with `…` and shows in full in a tooltip. An empty string renders `<No title>`, so the missing name shows in review.',
		table: { category: 'Content', type: { summary: 'string' } },
	},
	headerPrefix: {
		control: false,
		description:
			'The start of the header, before a divider: the ↑/↓ buttons of a drawer opened from a list, or the Back button of a drawer that turned from a view into an edit. Use `size="sm"` buttons with an `aria-label`. While `loading`, it stays on screen but takes no input.',
		table: { category: 'Content', type: { summary: 'ReactNode' } },
	},
	titlePrefix: {
		control: false,
		description:
			'Right before the title: an icon, or the one neutral type badge of an infra entity (Host, Pod, Node). Not part of the accessible name. While `loading`, a skeleton takes its place.',
		table: { category: 'Content', type: { summary: 'ReactNode' } },
	},
	titleSuffix: {
		control: false,
		description:
			'Right after the title: the copy button of a name the user may paste elsewhere, such as a pod name or a trace ID. Hidden while `loading`.',
		table: { category: 'Content', type: { summary: 'ReactNode' } },
	},
	headerSuffix: {
		control: false,
		description:
			'The end of the header, before the close button: one kind of action (up to two icon buttons, one text button or a time picker) and a `⋯` menu for the rest. Use `size="sm"` buttons. Saving and deleting belong to the footer of a `task`. While `loading`, it stays on screen but takes no input.',
		table: { category: 'Content', type: { summary: 'ReactNode' } },
	},
	closePosition: {
		control: 'inline-radio',
		options: ['end', 'start'],
		description:
			'Where the close button sits: `end`, last in the header, or `start`, first, before `headerPrefix` and the title. It sits there in the keyboard order too. A drawer of a breadcrumb trail takes the `closePosition` of the first drawer of the trail.',
		table: {
			category: 'Appearance',
			type: { summary: "'start' | 'end'" },
			defaultValue: { summary: 'end' },
		},
	},
	description: {
		control: 'text',
		description:
			'A `task` only. One line of guidance under the title, when the title alone does not say what to do. It is the `aria-describedby` of the panel, and a node that renders nothing renders no description.',
		table: { category: 'Content', type: { summary: 'ReactNode' } },
	},
	children: {
		control: 'text',
		description:
			'Required. The body, the one area that scrolls, between a header and a footer that stay put. With a `handle`, it may be a function of the payload of the latest `handle.open(payload)`, called only while the drawer is shown.',
		table: {
			category: 'Content',
			type: { summary: 'ReactNode | ((payload: Payload) => ReactNode)' },
		},
	},
	footerSuffix: {
		control: false,
		description:
			'A `task` only. The actions at the end of the footer: Cancel, then one primary named by what it does, primary last. A form in the body submits through a button here with `form="<form id>"`. A node that renders nothing renders no footer. The playground draws its own, since its buttons close the drawer.',
		table: { category: 'Content', type: { summary: 'ReactNode' } },
	},
	footerPrefix: {
		control: false,
		description:
			'A `task` only. The start of the footer, apart from the actions: one destructive button that confirms first, or one line of status such as `• 2 unsaved changes`. Rendered only with a `footerSuffix` that renders something.',
		table: { category: 'Content', type: { summary: 'ReactNode' } },
	},
	loading: {
		control: 'boolean',
		description:
			'Shows the drawer while its content is still being fetched. The title, `titlePrefix` and `description` show a skeleton, `titleSuffix` is hidden, and `headerPrefix` and `headerSuffix` take no input. The body shows `loadingContent`, and the footer slots show a skeleton. The close button and `Esc` keep working, and the panel is `aria-busy` and still named by `title`.',
		table: { category: 'State', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
	},
	loadingContent: {
		control: false,
		description:
			'What the body shows while `loading` is true, such as a skeleton shaped like the content about to render. Defaults to a title line and three text lines.',
		table: { category: 'Content', type: { summary: 'ReactNode' } },
	},
	width: {
		control: 'select',
		options: WIDTHS,
		description:
			'The max width of the panel, so on a narrow screen it shrinks before it overflows: `narrow` 384px, `base` 512px, `wide` 672px, `extra-wide` 820px, `entity` 880px. Only these names are accepted.',
		table: {
			category: 'Appearance',
			type: { summary: "'narrow' | 'base' | 'wide' | 'extra-wide' | 'entity'" },
			defaultValue: { summary: 'base' },
		},
	},
	testId: {
		control: 'text',
		description:
			'Forwarded to the panel as `data-testid`. Every part is named after it: `-backdrop`, `-header`, `-header-prefix`, `-title-prefix`, `-title`, `-title-suffix`, `-description`, `-header-suffix`, `-close`, `-body`, `-footer`, `-footer-prefix` and `-footer-suffix`, and in a breadcrumb trail `-trail` and `-trail-breadcrumb`. While `loading`, the skeletons are `-title-prefix-skeleton`, `-title-skeleton`, `-description-skeleton` and `-body-skeleton`.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},
	id: {
		control: 'text',
		description: 'Lands on the panel. Every `aria-*` and `data-*` prop is forwarded there too.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
};
