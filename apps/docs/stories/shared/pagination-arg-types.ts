import type { Pagination } from '@signozhq/ui';
import type { Meta } from '@storybook/react-vite';

export const VARIANTS = ['numbered', 'compact'] as const;
export const ALIGNS = ['start', 'center', 'end'] as const;

export const DISABLED_REASON = 'The list is loading. Wait for it before changing the page.';

export const paginationParameters: Meta<typeof Pagination>['parameters'] = {
	layout: 'fullscreen',
	design: {
		type: 'figma',
		url: 'https://www.figma.com/design/eyORbfrXMWCz9w0xEFdgWe/Periscope-%E2%80%93-Primitives-v2?node-id=12-748&m=dev',
	},
};

/**
 * The `Pagination` props. `Pagination.Cursor` takes most of them too, so
 * `pagination-components.stories.tsx` shares them with `pagination.stories.tsx`.
 */
export const paginationArgTypes: Meta<typeof Pagination>['argTypes'] = {
	total: {
		control: 'number',
		description:
			'Required. The number of items across all pages. A value that is not a finite number, or is negative, counts as 0. The bar always renders. With a single page, or a total of 0, the page list shows `1` and both arrows are disabled, and a total of 0 reads `0 — 0 of 0`. A total of 0 never moves the page.',
		table: { category: 'Content', type: { summary: 'number' } },
	},
	showTotalLabel: {
		control: 'text',
		description:
			'A noun written after the total in the position label, as in `1 — 20 of 100 pods`. Pass the plural form, the component does not change it.',
		table: { category: 'Content', type: { summary: 'string' } },
	},
	showTotal: {
		control: 'boolean',
		description: 'Renders the position label at the start of the bar.',
		table: {
			category: 'Content',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'true' },
		},
	},
	variant: {
		control: 'inline-radio',
		options: VARIANTS,
		description:
			'The page controls: the numbered page list, or a Previous and a Next button for narrow containers. The component does not switch on its own.',
		table: {
			category: 'Appearance',
			type: { summary: 'PaginationVariant' },
			defaultValue: { summary: 'numbered' },
		},
	},
	align: {
		control: 'inline-radio',
		options: ALIGNS,
		description:
			'Where the page controls sit when the position label is hidden. It has no effect while `showTotal` is true.',
		table: {
			category: 'Appearance',
			type: { summary: 'PaginationAlign' },
			defaultValue: { summary: 'end' },
		},
	},
	current: {
		control: 'number',
		description:
			'The current page, starting at 1. Writing the prop makes the page controlled. A page outside the range renders the nearest page in range, and `onPageChange` is called once with it. A `total` of 0 leaves the page as it is.',
		table: { category: 'State', type: { summary: 'number' } },
	},
	defaultCurrent: {
		control: 'number',
		description: 'The page on the first render, for a pagination that keeps its own page.',
		table: {
			category: 'State',
			type: { summary: 'number' },
			defaultValue: { summary: '1' },
		},
	},
	pageSize: {
		control: 'number',
		description:
			'The number of items per page. Writing the prop makes the page size controlled. A value that is not a positive integer falls back to `10`, with a warning on the console.',
		table: { category: 'State', type: { summary: 'number' } },
	},
	defaultPageSize: {
		control: 'number',
		description:
			'The page size on the first render, for a pagination that keeps its own page size.',
		table: {
			category: 'State',
			type: { summary: 'number' },
			defaultValue: { summary: '10' },
		},
	},
	pageSizeOptions: {
		control: 'object',
		description:
			'Renders the page size selector. `true` renders it with the defaults, and an object renders it with the fields it sets: `items`, `label` and `position`. An object item in `items` can carry a `testId` for its row.',
		table: {
			category: 'Behavior',
			type: { summary: 'boolean | PaginationPageSizeOptions' },
			defaultValue: { summary: 'false' },
		},
	},
	disabled: {
		control: 'boolean',
		description:
			'Blocks every page change and the page size selector. Every control keeps its slot and stays focusable, and the position label still shows the current range.',
		table: {
			category: 'State',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'false' },
		},
	},
	disabledTooltip: {
		control: 'text',
		description:
			'What to tell the user while `disabled` is true, shown in a tooltip on hover or focus of any control. Previous and Next at the ends of the range are disabled without a tooltip.',
		table: { category: 'State', type: { summary: 'ReactNode' } },
	},
	onPageChange: {
		control: false,
		description:
			'Called with the new page when the user picks a page, and when the component moves an out-of-range page back into range. A new page size calls it with `1`, after `onPageSizeChange`.',
		table: { category: 'Events', type: { summary: '(page: number) => void' } },
	},
	onPageSizeChange: {
		control: false,
		description: 'Called with the new page size when the user picks one in the page size selector.',
		table: { category: 'Events', type: { summary: '(pageSize: number) => void' } },
	},
	'aria-label': {
		control: 'text',
		description:
			'The name of the `nav` landmark. A screen with two paginations passes its own to each, so the two differ.',
		table: {
			category: 'Accessibility',
			type: { summary: 'string' },
			defaultValue: { summary: 'Pagination' },
		},
	},
	id: {
		control: 'text',
		description: 'Forwarded to the `nav`.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	testId: {
		control: 'text',
		description:
			'Forwarded as `data-testid`. The parts derive theirs from it: `-total`, `-previous`, `-page-{n}`, `-separator-start`, `-separator-end`, `-divider`, `-next` and `-page-size`.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},
};
