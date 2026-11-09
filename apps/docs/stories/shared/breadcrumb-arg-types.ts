import type { Breadcrumb } from '@signozhq/ui';
import type { Meta } from '@storybook/react-vite';

export const breadcrumbArgTypes: Meta<typeof Breadcrumb>['argTypes'] = {
	items: {
		control: 'object',
		description:
			'The crumbs, root first and the current page last. Each one takes a `title`, and optionally an `icon`, a `menu`, a `preview`, and the link props `href`, `target`, `render` and `onClick`, which a `menu` entry takes too. `render` is the element that draws the link, such as the `<Link to="/services" />` of a router. `preview` is a card that opens below the crumb after the pointer rests on it for 300ms, or on keyboard focus, and takes the place of the tooltip with the full title. The trail has one card, shared by every crumb with a `preview`, which moves from crumb to crumb. A crumb with a `menu` ignores it, and so does a collapsed crumb. The trail leaves out a crumb whose `title` renders nothing. With no crumb left, nothing renders.',
		table: { category: 'Content', type: { summary: 'BreadcrumbItemType[]' } },
	},
	separator: {
		control: 'text',
		description:
			"Drawn between two crumbs, as written: pass a character such as `›`. The literal `'chevron'` is a type error, and a `string` that holds it, which the types cannot see, logs a warning and still prints the word.",
		table: {
			category: 'Content',
			type: { summary: 'string' },
			defaultValue: { summary: '/' },
		},
	},
	truncate: {
		control: 'boolean',
		description:
			'Keeps the trail on one line. Middle crumbs collapse into a `...` crumb when the trail does not fit, then the last and the first crumb shorten. With `false`, every crumb stays and the trail wraps onto more lines.',
		table: {
			category: 'Behavior',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'true' },
		},
	},
	maxVisible: {
		control: { type: 'number', min: 2 },
		description:
			'The most crumbs shown at once, the first and the last included, whatever the width. A value below 2 counts as 2. Only applies while `truncate` is set.',
		table: { category: 'Behavior', type: { summary: 'number' } },
	},
	collapseFrom: {
		control: 'select',
		options: ['center', 'start'],
		description:
			'Which middle crumbs collapse first. `center` starts at the middle one and moves outward. `start` starts at the crumb after the first one and moves toward the current page, so the trail reads the first crumb, `...`, then the last crumbs. The first and the last crumb never collapse. Only applies while `truncate` is set.',
		table: {
			category: 'Behavior',
			type: { summary: 'BreadcrumbCollapseFromType' },
			defaultValue: { summary: 'center' },
		},
	},
	textOverflow: {
		control: 'select',
		options: ['ellipsis', 'hidden'],
		description:
			'What a crumb label does past its maximum width. `ellipsis` cuts it with `…` and shows the full title in a tooltip, `hidden` clips it with no marker and no tooltip.',
		table: {
			category: 'Appearance',
			type: { summary: 'BreadcrumbTextOverflowType' },
			defaultValue: { summary: 'ellipsis' },
		},
	},
	ellipsis: {
		control: false,
		description:
			'What the `...` crumb holds. The crumb opens a popover below it while the pointer rests on it and on a press, `Enter` or `Space` included. `heading` is a group label above the rows, and names the popover. `rowSuffix` returns the element at the end of each row, called with the crumb and its index in `items`, and is not called for a crumb with a `menu`. `render` replaces the rows with content of your own and receives the collapsed crumbs in path order, each with its index in `items`: a pure function that calls no hooks, whose content has no rows and no navigation of its own, so it links to what it lists and closes itself, and `heading` and `rowSuffix` are not used. A `render` that returns nothing leaves the `...` crumb as text that opens nothing. Only matters while a crumb is collapsed.',
		table: { category: 'Content', type: { summary: 'BreadcrumbEllipsisOptions' } },
	},
	variant: {
		control: 'select',
		options: ['plain', 'outlined'],
		description:
			'How the crumbs are drawn. `plain` is text that fills on hover. `outlined` draws every crumb but the current page, and the `...` crumb, as a chip with a border, and leaves the current page as text in the primary colour.',
		table: {
			category: 'Appearance',
			type: { summary: 'BreadcrumbVariantType' },
			defaultValue: { summary: 'plain' },
		},
	},
	id: {
		control: 'text',
		description: 'The `id` of the `<nav>`.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	'aria-label': {
		control: 'text',
		description: 'The accessible name of the `<nav>`.',
		table: {
			category: 'Accessibility',
			type: { summary: 'string' },
			defaultValue: { summary: 'Breadcrumb' },
		},
	},
	'aria-labelledby': {
		control: 'text',
		description: 'The id of the element that names the `<nav>`.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	'aria-describedby': {
		control: 'text',
		description: 'The id of the element that describes the `<nav>`.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	testId: {
		control: 'text',
		description:
			'Becomes `data-testid` on the `<nav>`, and the stem every crumb, separator, the preview card and the `...` crumb is named from.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},
};
