import {
	type Collapse,
	type CollapseGroupItemType,
	CollapseTextOverflow,
	CollapseVariant,
} from '@signozhq/ui';
import type { Meta } from '@storybook/react-vite';

export const VARIANTS = Object.values(CollapseVariant);
export const TEXT_OVERFLOWS = Object.values(CollapseTextOverflow);
export const HEADING_LEVELS = [2, 3, 4, 5, 6] as const;

export const TITLE = 'Advanced options';
export const DESCRIPTION = 'Evaluation window, notification grouping and the runbook link.';
export const CONTENT =
	'These settings keep their default for most alerts. Open the section to change how often the rule is evaluated and how its notifications are grouped.';

/** The items of the `Collapse.Group` props story and of the group sections in the showcase. */
export const SIGNALS: CollapseGroupItemType[] = [
	{
		value: 'traces',
		title: 'Traces',
		description: 'Where a request spent its time, span by span.',
		children: 'Follow one request through every service it touched.',
	},
	{
		value: 'logs',
		title: 'Logs',
		description: 'What each service wrote while it ran.',
		children: 'Search the lines a service wrote, and jump to the trace they belong to.',
	},
	{
		value: 'metrics',
		title: 'Metrics',
		description: 'How the numbers moved over time.',
		children: 'Chart a counter, a gauge or a histogram, and alert when it crosses a line.',
	},
];

export const collapseParameters: Meta<typeof Collapse>['parameters'] = {
	layout: 'fullscreen',
	docs: {
		description: {
			component:
				'A section of a page whose content the user can hide and show from its header. `Collapse` is one section with a boolean open state, `Collapse.Group` is a list of sections that open and close on their own.',
		},
	},
};

/**
 * The `Collapse` props. `Collapse.Group` takes the look and behavior ones, so
 * `collapse-components.stories.tsx` shares them with `collapse.stories.tsx`.
 */
export const collapseArgTypes: Meta<typeof Collapse>['argTypes'] = {
	title: {
		control: 'text',
		description:
			'Required. The heading of the section. It sits in the header button, stays visible while collapsed, and names the button and the panel. Pass a string, since the ellipsis and the tooltip only work with a string. Text and inline formatting only: a control inside the header button cannot be reached by a screen reader and toggles the section on every click, so controls go in `headerSuffix`. A title that renders nothing shows `<No title>`.',
		table: { category: 'Content', type: { summary: 'ReactNode' } },
	},
	description: {
		control: 'text',
		description:
			'One or two lines under the title that say what the section holds. It wraps, and it describes the header button without being part of its name.',
		table: { category: 'Content', type: { summary: 'ReactNode' } },
	},
	prefix: {
		control: false,
		description:
			'An icon before the title. Decorative and hidden from screen readers, so when the icon is the only thing that tells two sections apart, its meaning goes in `title`. The section sets the icon size.',
		table: { category: 'Content', type: { summary: 'ReactElement' } },
	},
	headerSuffix: {
		control: false,
		description:
			'Controls at the end of the header row, outside the header button, such as icon buttons, a switch or an indicator with a tooltip. A click on them does not toggle the section, so the call site needs no `stopPropagation`. It keeps its width, so on a narrow parent the title truncates first.',
		table: { category: 'Content', type: { summary: 'ReactNode' } },
	},
	children: {
		control: 'text',
		description:
			'Required. The content of the section, rendered in the panel. It grows with its content, and a wide element that cannot wrap scrolls on the x axis inside the panel. Content that renders nothing shows `<No content>` in the open panel.',
		table: { category: 'Content', type: { summary: 'ReactNode' } },
	},
	variant: {
		control: 'inline-radio',
		options: VARIANTS,
		description:
			'Required. The shape of the section. `outlined` draws a box around the header and the panel. `ghost` has no box, for a section that sits inside a card or a form.',
		table: { category: 'Appearance', type: { summary: 'CollapseVariantType' } },
	},
	size: {
		control: 'inline-radio',
		options: ['sm'],
		description: 'Required. The type scale and the height of the header.',
		table: { category: 'Appearance', type: { summary: 'CollapseSizeType' } },
	},
	textOverflow: {
		control: 'inline-radio',
		options: TEXT_OVERFLOWS,
		description:
			'What a title longer than its row does. `ellipsis` keeps it on one line, cuts it at the end and shows the whole title in a tooltip while it is cut. `wrap` takes as many lines as it needs, for a title that is a question.',
		table: {
			category: 'Appearance',
			type: { summary: "'ellipsis' | 'wrap'" },
			defaultValue: { summary: "'ellipsis'" },
		},
	},
	noContentPadding: {
		control: 'boolean',
		description:
			'Removes the padding of the panel, for a table or a chart that runs to the edges of the section.',
		table: {
			category: 'Appearance',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	keepMounted: {
		control: 'boolean',
		description:
			'Keeps the content mounted while collapsed, hidden until found, so form fields keep their state and find in page reaches the text. Find in page opens the section, which reports the change. Without it, the content mounts when the section opens and unmounts when it closes, so heavy content costs nothing while closed and its local state resets on the next open.',
		table: {
			category: 'Behavior',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	expanded: {
		control: false,
		description:
			'The controlled open state. Use with `onExpandedChange`. For a section that keeps its own state use `defaultExpanded` instead. Decided on the first render: an `expanded` that turns `undefined` later, or appears on a section that started uncontrolled, is ignored with a warning.',
		table: { category: 'State', type: { summary: 'boolean' } },
	},
	defaultExpanded: {
		control: 'boolean',
		description:
			'Whether the section is open on mount, for a section that keeps its own state. The state does not survive a reload or a remount. Required when `expanded` is not set, so every call site states the initial state.',
		table: { category: 'State', type: { summary: 'boolean' } },
	},
	onExpandedChange: {
		control: false,
		description:
			'Called with the new state when the user presses the header button, or when find in page opens a `keepMounted` section. Not called when `expanded` changes from the outside.',
		table: { category: 'Events', type: { summary: '(expanded: boolean) => void' } },
	},
	headingLevel: {
		control: 'inline-radio',
		options: HEADING_LEVELS,
		description:
			'The level of the heading that wraps the header button, so the section fits the outline of the page.',
		table: {
			category: 'Accessibility',
			type: { summary: '2 | 3 | 4 | 5 | 6' },
			defaultValue: { summary: '3' },
		},
	},
	testId: {
		control: 'text',
		description:
			'Forwarded as `data-testid` on the root. The parts derive theirs from it: `-toggle`, `-prefix`, `-title`, `-description`, `-header-suffix` and `-panel`.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},
	id: {
		control: 'text',
		description: 'Forwarded to the root.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
};
