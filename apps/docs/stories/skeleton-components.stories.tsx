import { Skeleton, Typography } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
	INPUT_SIZES,
	SHAPES,
	SIZES,
	skeletonArgTypes,
	skeletonParameters,
} from './shared/skeleton-arg-types.js';
import styles from './skeleton.stories.module.css';

/**
 * The static members of `Skeleton`, grouped under `Skeleton/Components` in the sidebar. They are
 * documented on the `Skeleton` page, `skeleton.mdx`, so this file has no docs page of its own.
 */
const meta: Meta<typeof Skeleton> = {
	title: 'Primitive Components/Skeleton/Components',
	component: Skeleton,
	tags: ['!autodocs'],
	parameters: skeletonParameters,
	argTypes: skeletonArgTypes,
	decorators: [
		(Story) => (
			<div className="story-container-lg">
				<Story />
			</div>
		),
	],
};

export default meta;

const sizeArgType = {
	control: 'inline-radio',
	options: SIZES,
	table: { category: 'Appearance', type: { summary: 'SkeletonSizeType' } },
} as const;

const idArgType = {
	control: 'text',
	description: 'Forwarded to the placeholder.',
	table: { category: 'Accessibility', type: { summary: 'string' } },
} as const;

/**
 * `Skeleton.Input` stands for one `Input`. Its height is the height of the field, and it fills its
 * parent like the field does.
 */
export const Input: StoryObj<typeof Skeleton.Input> = {
	parameters: {
		chromatic: { disableSnapshot: true },
		// The root props are declared on the parent `Meta`; `Skeleton.Input` takes no text block.
		controls: { exclude: ['title', 'paragraph'] },
	},
	args: {
		size: 'md',
	},
	argTypes: {
		id: idArgType,
		size: {
			control: 'inline-radio',
			options: INPUT_SIZES,
			description:
				'Required. The height of the placeholder: `sm` is 24px, `md` is 32px, `lg` is 40px, the heights of `Input` at its three sizes.',
			table: { category: 'Appearance', type: { summary: 'SkeletonInputSizeType' } },
		},
		width: {
			control: 'text',
			description:
				'The width of the placeholder. It fills its parent when omitted, like `Input`. Numbers are written as `px`.',
			table: { category: 'Appearance', type: { summary: 'CSSProperties["width"]' } },
		},
		maxWidth: {
			control: 'text',
			description: 'The max-width of the placeholder. Numbers are written as `px`.',
			table: {
				category: 'Appearance',
				type: { summary: 'CSSProperties["maxWidth"]' },
				defaultValue: { summary: '100%' },
			},
		},
		testId: {
			control: 'text',
			description: 'Forwarded to the placeholder as `data-testid`.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
	render: (args) => (
		<div className={styles.field}>
			<Typography
				variant="label"
				size="base"
				weight="medium"
				color="main"
				as="span"
				textOverflow="visible"
			>
				Service name
			</Typography>
			<Skeleton.Input {...args} />
		</div>
	),
};

/**
 * `Skeleton.Button` stands for one `Button`. It keeps the width of its size and does not shrink in a
 * flex row.
 */
export const Button: StoryObj<typeof Skeleton.Button> = {
	parameters: {
		chromatic: { disableSnapshot: true },
		// The root props are declared on the parent `Meta`; `Skeleton.Button` takes no text block.
		controls: { exclude: ['title', 'paragraph'] },
	},
	args: {
		size: 'md',
	},
	argTypes: {
		id: idArgType,
		size: {
			...sizeArgType,
			description:
				'Required. The height of the placeholder: `sm` is 24px, `md` is 32px, the same heights as `Button`. Without `width`, it also sets the width: 48px at `sm`, 64px at `md`.',
		},
		width: {
			control: 'text',
			description:
				'The width of the placeholder. Without it the width follows `size`. `100%` fills the parent. Numbers are written as `px`.',
			table: { category: 'Appearance', type: { summary: 'CSSProperties["width"]' } },
		},
		maxWidth: {
			control: 'text',
			description: 'The max-width of the placeholder. Numbers are written as `px`.',
			table: {
				category: 'Appearance',
				type: { summary: 'CSSProperties["maxWidth"]' },
				defaultValue: { summary: '100%' },
			},
		},
		testId: {
			control: 'text',
			description: 'Forwarded to the placeholder as `data-testid`.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
	render: (args) => (
		<div className={styles.actions}>
			<Skeleton.Button {...args} />
		</div>
	),
};

/**
 * `Skeleton.Avatar` stands for one `Avatar`. Put it next to a `Skeleton` with no title for a text
 * block with an avatar. It keeps its size and does not shrink in a flex row.
 */
export const Avatar: StoryObj<typeof Skeleton.Avatar> = {
	parameters: {
		chromatic: { disableSnapshot: true },
		// The root props are declared on the parent `Meta`; `Skeleton.Avatar` takes only its own.
		controls: { exclude: ['title', 'paragraph', 'width', 'maxWidth'] },
	},
	args: {
		size: 'md',
		shape: 'circle',
	},
	argTypes: {
		id: idArgType,
		size: {
			...sizeArgType,
			description:
				'Required. The width and the height of the placeholder: `sm` is 24px, `md` is 32px, the same sizes as `Avatar` at `sm` and `md`.',
		},
		shape: {
			control: 'inline-radio',
			options: SHAPES,
			description: 'The shape of the placeholder. Same union as `Avatar`.',
			table: {
				category: 'Appearance',
				type: { summary: 'SkeletonAvatarShapeType' },
				defaultValue: { summary: 'circle' },
			},
		},
		testId: {
			control: 'text',
			description: 'Forwarded to the placeholder as `data-testid`.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
	render: ({ active, ...args }) => (
		<div className={styles.listRow}>
			<Skeleton.Avatar active={active} {...args} />
			<Skeleton active={active} title={false} paragraph={{ rows: 2, width: ['70%', '40%'] }} />
		</div>
	),
};
