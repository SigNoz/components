import type { Breadcrumb } from '@signozhq/ui';
import type { Meta } from '@storybook/react-vite';

export const breadcrumbArgTypes: Meta<typeof Breadcrumb>['argTypes'] = {
	items: {
		control: 'object',
		description:
			'The crumbs, root first and the current page last. Each one takes a `title`, and optionally an `icon`, a `menu`, and the link props `href`, `target`, `render` and `onClick`, which a `menu` entry takes too. `render` is the element that draws the link, such as the `<Link to="/services" />` of a router. The trail leaves out a crumb whose `title` renders nothing. With no crumb left, nothing renders.',
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
			'Becomes `data-testid` on the `<nav>`, and the stem every crumb, separator and the `...` crumb is named from.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},
};
