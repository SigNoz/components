import { SolidAlertTriangle, SolidInfoCircle } from '@signozhq/icons';
import {
	Button,
	Callout,
	type CalloutCloseablePersistedProps,
	type CalloutCloseableProps,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactElement, useState } from 'react';
import { fn } from 'storybook/test';
import styles from './callout.stories.module.css';
import {
	calloutArgTypes,
	calloutParameters,
	DESCRIPTION,
	TITLE,
} from './shared/callout-arg-types.js';

/**
 * The static members of `Callout`, grouped under `Callout/Components` in the sidebar. They are
 * documented on the `Callout` page, `callout.mdx`, so this file has no docs page of its own.
 */
const meta: Meta<typeof Callout> = {
	title: 'Primitive Components/Callout/Components',
	component: Callout,
	tags: ['!autodocs'],
	parameters: calloutParameters,
	argTypes: calloutArgTypes,
	args: {
		color: 'primary',
		size: 'md',
		icon: <SolidInfoCircle />,
		children: DESCRIPTION,
	},
};

export default meta;

/**
 * `Callout.Expandable` adds the `title`, the row that stays visible while collapsed, and
 * `defaultExpanded`. It takes every other prop of `Callout`.
 */
export const Expandable: StoryObj<typeof Callout.Expandable> = {
	parameters: {
		chromatic: { disableSnapshot: true },
	},
	args: {
		title: TITLE,
		defaultExpanded: true,
	},
	argTypes: {
		title: {
			control: 'text',
			description:
				'Required. The single heading line, visible while collapsed. A long one ends in an ellipsis, with a tooltip while it is cut. Pass a string.',
			table: { category: 'Content', type: { summary: 'ReactNode' } },
		},
		defaultExpanded: {
			control: 'boolean',
			description:
				'Required. Whether the description is visible on mount. The state is uncontrolled.',
			table: { category: 'State', type: { summary: 'boolean' } },
		},
	},
	// Remounts on a new `defaultExpanded`, since the state is uncontrolled.
	render: (args) => <Callout.Expandable key={String(args.defaultExpanded)} {...args} />,
};

/**
 * Owns `closed`, as a consumer does, and shows the callout again from a button so the story is not
 * left empty after one click.
 */
function CloseablePlayground({ onClose, ...props }: CalloutCloseableProps): ReactElement {
	const [closed, setClosed] = useState(false);

	return (
		<div className={styles.stack}>
			<Callout.Closeable
				{...props}
				closed={closed}
				onClose={() => {
					setClosed(true);
					onClose();
				}}
			/>
			<div>
				<Button variant="outlined" color="secondary" size="sm" onClick={() => setClosed(false)}>
					Show it again
				</Button>
			</div>
		</div>
	);
}

/**
 * `Callout.Closeable` adds a close button. It keeps no state: the consumer passes `closed` and sets
 * it in `onClose`.
 */
export const Closeable: StoryObj<typeof Callout.Closeable> = {
	parameters: {
		chromatic: { disableSnapshot: true },
	},
	args: {
		color: 'warning',
		icon: <SolidAlertTriangle />,
		children: 'Your trial ends in 3 days.',
		closed: false,
		onClose: fn(),
	},
	argTypes: {
		closed: {
			control: false,
			description:
				'Required. Whether the callout is closed. It renders nothing while `true`. Set it in `onClose`.',
			table: { category: 'State', type: { summary: 'boolean' } },
		},
		onClose: {
			control: false,
			description:
				'Required. Runs when the close button is clicked. Set `closed` here to hide the callout.',
			table: { category: 'Events', type: { summary: '() => void' } },
		},
		closeAriaLabel: {
			control: 'text',
			description:
				'The accessible name of the close button. Set it when several closeable callouts sit on one page, and to translate it.',
			table: {
				category: 'Accessibility',
				type: { summary: 'string' },
				defaultValue: { summary: 'Dismiss' },
			},
		},
	},
	render: (args) => <CloseablePlayground {...args} />,
};

/**
 * Clears the saved dismissal and mounts the callout again, so the story is not left empty after
 * one click.
 */
function CloseablePersistedPlayground(props: CalloutCloseablePersistedProps): ReactElement {
	const [mount, setMount] = useState(0);

	return (
		<div className={styles.stack}>
			<Callout.CloseablePersisted key={mount} {...props} />
			<div>
				<Button
					variant="outlined"
					color="secondary"
					size="sm"
					onClick={() => {
						window.localStorage.removeItem(props.storageKey);
						setMount((count) => count + 1);
					}}
				>
					Clear the saved dismissal
				</Button>
			</div>
		</div>
	);
}

/**
 * `Callout.CloseablePersisted` saves the dismissal in `localStorage` under `storageKey`, so the
 * callout stays hidden after a reload.
 */
export const CloseablePersisted: StoryObj<typeof Callout.CloseablePersisted> = {
	parameters: {
		chromatic: { disableSnapshot: true },
	},
	args: {
		storageKey: 'storybook-callout-dismissed',
		children: 'Add a license key to unlock all features.',
		onClose: fn(),
	},
	argTypes: {
		storageKey: {
			control: 'text',
			description:
				'Required. The `localStorage` key the dismissal is saved under, as `"true"`. The callout stays hidden until the entry is cleared.',
			table: { category: 'Behavior', type: { summary: 'string' } },
		},
		onClose: {
			control: false,
			description:
				'Runs after the close button is clicked, once the dismissal is saved. For side effects only.',
			table: { category: 'Events', type: { summary: '() => void' } },
		},
		closeAriaLabel: {
			control: 'text',
			description:
				'The accessible name of the close button. Set it when several closeable callouts sit on one page, and to translate it.',
			table: {
				category: 'Accessibility',
				type: { summary: 'string' },
				defaultValue: { summary: 'Dismiss' },
			},
		},
	},
	render: (args) => <CloseablePersistedPlayground {...args} />,
};

/**
 * `Callout.Link` sits inside the children of a callout and draws in its link color. It takes none
 * of the callout props.
 */
export const Link: StoryObj<typeof Callout.Link> = {
	parameters: {
		chromatic: { disableSnapshot: true },
		// The callout props are declared on the parent `Meta`; `Callout.Link` has none of them.
		controls: {
			exclude: ['color', 'size', 'icon', 'width', 'maxWidth', 'height', 'maxHeight', 'id'],
		},
	},
	args: {
		href: 'https://signoz.io/docs',
		target: '_blank',
		children: 'documentation',
		onClick: fn(),
	},
	argTypes: {
		children: {
			control: 'text',
			description:
				'Required. The text of the link, which is its label. It replaces the children of the `render` element.',
			table: { category: 'Content', type: { summary: 'ReactNode' } },
		},
		href: {
			control: 'text',
			description:
				'The destination of a plain link. Not needed when `render` is a router link with its own destination.',
			table: { category: 'Content', type: { summary: 'string' } },
		},
		target: {
			control: 'text',
			description:
				'Where the link opens. `_blank`, here or on the `render` element, adds `noopener` and `noreferrer` to the `rel` of the `render` element.',
			table: { category: 'Behavior', type: { summary: 'string' } },
		},
		render: {
			control: false,
			description:
				'The element that renders the link, such as a router link. It keeps its own props, like `to`.',
			table: {
				category: 'Behavior',
				type: { summary: 'ReactElement' },
				defaultValue: { summary: '<a />' },
			},
		},
		onClick: {
			control: false,
			description:
				'Runs on click, before the handler of the `render` element. It never prevents the navigation.',
			table: { category: 'Events', type: { summary: 'MouseEventHandler' } },
		},
		testId: {
			control: 'text',
			description: 'Forwarded to the link as `data-testid`.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
	// Only the link props reach `Callout.Link`, the callout args of the parent `Meta` stay out.
	render: ({ href, target, render, onClick, testId, children }) => (
		<Callout color="primary" size="md" icon={<SolidInfoCircle />}>
			Read the{' '}
			<Callout.Link href={href} target={target} render={render} onClick={onClick} testId={testId}>
				{children}
			</Callout.Link>{' '}
			to set it up.
		</Callout>
	),
};
