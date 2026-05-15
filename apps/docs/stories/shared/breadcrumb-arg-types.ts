import type { BreadcrumbSimple } from '@signozhq/ui';
import type { Meta } from '@storybook/react-vite';

export const breadcrumbSimpleArgTypes: Meta<typeof BreadcrumbSimple>['argTypes'] = {
	items: {
		control: 'object',
		description:
			'The breadcrumb items to display. Each item can have title, href, icon, menu, path, onClick, and className.',
		table: { category: 'Content', type: { summary: 'BreadcrumbItemType[]' } },
	},
	separator: {
		control: 'text',
		description:
			"Separator between breadcrumb items. Use 'chevron' for chevron icon, or any string for custom separator text.",
		table: {
			category: 'Content',
			type: { summary: 'string' },
			defaultValue: { summary: '/' },
		},
	},
	itemRender: {
		control: false,
		description:
			'Custom renderer for breadcrumb items. Useful for integration with react-router or other routing libraries.',
		table: {
			category: 'Behavior',
			type: {
				summary:
					'(route: BreadcrumbItemType, params: Record<string, string> | undefined, routes: BreadcrumbItemType[], paths: string[]) => ReactNode',
			},
		},
	},
	params: {
		control: 'object',
		description: 'Route parameters to pass to itemRender.',
		table: { category: 'Behavior', type: { summary: 'Record<string, string>' } },
	},
	id: {
		control: 'text',
		description: 'The id to apply to the breadcrumb nav element.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	className: {
		control: 'text',
		description: 'Additional CSS classes to apply to the breadcrumb container.',
		table: { category: 'Styling', type: { summary: 'string' } },
	},
	testId: {
		control: 'text',
		description:
			'Test ID for the breadcrumb container. Propagates to children as testId-list, testId-item-N, testId-link-N, etc.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},
	title: {
		control: 'text',
		description: 'Tooltip text shown on hover.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	'aria-label': {
		control: 'text',
		description: 'Accessible label for the breadcrumb navigation.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	'aria-labelledby': {
		control: 'text',
		description: 'ID of element that labels this breadcrumb.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	'aria-describedby': {
		control: 'text',
		description: 'ID of element that describes this breadcrumb.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
};
