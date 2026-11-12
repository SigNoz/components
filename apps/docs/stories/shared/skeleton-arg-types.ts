import { type Skeleton, SkeletonAvatarShape, SkeletonInputSize, SkeletonSize } from '@signozhq/ui';
import type { Meta } from '@storybook/react-vite';

export const SIZES = Object.values(SkeletonSize);
export const INPUT_SIZES = Object.values(SkeletonInputSize);
export const SHAPES = Object.values(SkeletonAvatarShape);

export const skeletonParameters: Meta<typeof Skeleton>['parameters'] = {
	layout: 'fullscreen',
};

/**
 * The `Skeleton` props. Its static members take some of them too, so `skeleton-components.stories.tsx`
 * shares them with `skeleton.stories.tsx`.
 */
export const skeletonArgTypes: Meta<typeof Skeleton>['argTypes'] = {
	active: {
		control: 'boolean',
		description:
			'The shimmer plays by default. Pass `active={false}` for a still fill, on a placeholder that does not stand for loading data. With `prefers-reduced-motion: reduce` the shimmer does not play and the skeleton shows the still fill.',
		table: {
			category: 'State',
			type: { summary: 'boolean' },
			defaultValue: { summary: 'true' },
		},
	},
	title: {
		control: 'object',
		description:
			'Shows the title bar above the rows, or sets its width with `{ width }`. `false` hides it. Numbers are written as `px`. With `paragraph={false}` too, the skeleton is an empty box with no height, so render nothing instead.',
		table: {
			category: 'Content',
			type: { summary: 'boolean | { width?: string | number }' },
			defaultValue: { summary: 'true' },
		},
	},
	paragraph: {
		control: 'object',
		description:
			'Shows the rows, or sets how many rows to draw with `rows` and how wide they are with `width`: one value for every row, or one value per row. A row with no value is `100%` wide. `rows: 0` draws none and keeps the title, and `false` hides the rows.',
		table: {
			category: 'Content',
			type: {
				summary: 'boolean | { rows?: number; width?: string | number | Array<string | number> }',
			},
			defaultValue: { summary: 'true' },
		},
	},
	width: {
		control: 'text',
		description:
			'The width of the skeleton. It fills its parent when omitted. Numbers are written as `px`.',
		table: { category: 'Appearance', type: { summary: 'CSSProperties["width"]' } },
	},
	maxWidth: {
		control: 'text',
		description:
			'The max-width of the skeleton, so it never grows past its parent. Numbers are written as `px`.',
		table: {
			category: 'Appearance',
			type: { summary: 'CSSProperties["maxWidth"]' },
			defaultValue: { summary: '100%' },
		},
	},
	id: {
		control: 'text',
		description: 'Forwarded to the root.',
		table: { category: 'Accessibility', type: { summary: 'string' } },
	},
	testId: {
		control: 'text',
		description:
			'Forwarded to the root as `data-testid`. The parts derive theirs from it: `-title`, `-paragraph` and `-row-${index}`. The placeholders for controls take it on their one element.',
		table: { category: 'Testing', type: { summary: 'string' } },
	},
};
