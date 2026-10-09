import { ConciergeBell } from '@signozhq/icons';
import {
	AlertStrip,
	type AlertStripCloseablePersistedProps,
	type AlertStripCloseableProps,
	Button as UiButton,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactElement, useRef, useState } from 'react';
import { fn } from 'storybook/test';
import styles from './alert-strip.stories.module.css';
import {
	alertStripArgTypes,
	alertStripParameters,
	MESSAGE,
} from './shared/alert-strip-arg-types.js';

/**
 * The static members of `AlertStrip`, grouped under `AlertStrip/Components` in the sidebar. They
 * are documented on the `AlertStrip` page, `alert-strip.mdx`, so this file has no docs page of its
 * own.
 */
const meta: Meta<typeof AlertStrip> = {
	title: 'Primitive Components/AlertStrip/Components',
	component: AlertStrip,
	tags: ['!autodocs'],
	parameters: alertStripParameters,
	argTypes: alertStripArgTypes,
	args: {
		color: 'primary',
		side: 'bottom',
		children: MESSAGE,
	},
};

export default meta;

const finalFocusArgType = {
	control: false,
	description:
		'The element that takes focus once `onClose` closes the strip. Without it, focus is not moved. Here, the button below.',
	table: { category: 'Accessibility', type: { summary: 'RefObject<HTMLElement | null>' } },
} as const;

const closeAriaLabelArgType = {
	control: 'text',
	description:
		'The accessible name of the close button. Set it when several closeable strips sit on one page, and to translate it.',
	table: {
		category: 'Accessibility',
		type: { summary: 'string' },
		defaultValue: { summary: 'Dismiss' },
	},
} as const;

/**
 * Owns `closed`, as a consumer does, and shows the strip again from a button so the story is not
 * left empty after one click. The button is `finalFocus`, so focus lands on it after a dismissal.
 */
function CloseablePlayground({ onClose, ...props }: AlertStripCloseableProps): ReactElement {
	const [closed, setClosed] = useState(false);
	const showRef = useRef<HTMLButtonElement>(null);

	return (
		<div className={styles.stack}>
			<AlertStrip.Closeable
				{...props}
				closed={closed}
				onClose={() => {
					setClosed(true);
					onClose();
				}}
				finalFocus={showRef}
			/>
			<div>
				<UiButton
					ref={showRef}
					variant="outlined"
					color="secondary"
					size="sm"
					onClick={() => setClosed(false)}
				>
					Show it again
				</UiButton>
			</div>
		</div>
	);
}

/**
 * `AlertStrip.Closeable` adds a close button. It keeps no state: the consumer passes `closed` and
 * sets it in `onClose`.
 */
export const Closeable: StoryObj<typeof AlertStrip.Closeable> = {
	parameters: {
		chromatic: { disableSnapshot: true },
	},
	args: {
		color: 'warning',
		children: 'Warning: your trial ends in 3 days.',
		closed: false,
		onClose: fn(),
	},
	argTypes: {
		closed: {
			control: false,
			description:
				'Required. Whether the strip is closed. It renders nothing while `true`. Set it in `onClose`.',
			table: { category: 'State', type: { summary: 'boolean' } },
		},
		onClose: {
			control: false,
			description:
				'Required. Runs when the close button is clicked. Set `closed` here to hide the strip.',
			table: { category: 'Events', type: { summary: '() => void' } },
		},
		finalFocus: finalFocusArgType,
		closeAriaLabel: closeAriaLabelArgType,
	},
	render: (args) => <CloseablePlayground {...args} />,
};

/**
 * Clears the saved dismissal and mounts the strip again, so the story is not left empty after one
 * click. The button is `finalFocus`, so focus lands on it after a dismissal.
 */
function CloseablePersistedPlayground(props: AlertStripCloseablePersistedProps): ReactElement {
	const [mount, setMount] = useState(0);
	const clearRef = useRef<HTMLButtonElement>(null);

	return (
		<div className={styles.stack}>
			<AlertStrip.CloseablePersisted key={mount} {...props} finalFocus={clearRef} />
			<div>
				<UiButton
					ref={clearRef}
					variant="outlined"
					color="secondary"
					size="sm"
					onClick={() => {
						window.localStorage.removeItem(props.storageKey);
						setMount((count) => count + 1);
					}}
				>
					Clear the saved dismissal
				</UiButton>
			</div>
		</div>
	);
}

/**
 * `AlertStrip.CloseablePersisted` saves the dismissal in `localStorage` under `storageKey`, so the
 * strip stays hidden after a reload.
 */
export const CloseablePersisted: StoryObj<typeof AlertStrip.CloseablePersisted> = {
	parameters: {
		chromatic: { disableSnapshot: true },
	},
	args: {
		storageKey: 'storybook-alert-strip-dismissed',
		color: 'warning',
		children: 'Warning: you are in impersonation mode.',
		onClose: fn(),
	},
	argTypes: {
		storageKey: {
			control: 'text',
			description:
				'Required. The `localStorage` key the dismissal is saved under, as `"true"`. The strip stays hidden until the entry is cleared.',
			table: { category: 'Behavior', type: { summary: 'string' } },
		},
		onClose: {
			control: false,
			description:
				'Runs after the close button is clicked, once the dismissal is saved. For side effects only.',
			table: { category: 'Events', type: { summary: '() => void' } },
		},
		finalFocus: finalFocusArgType,
		closeAriaLabel: closeAriaLabelArgType,
	},
	render: (args) => <CloseablePersistedPlayground {...args} />,
};

/**
 * `AlertStrip.Button` is a small `Button` the strip paints, for an action in the `suffix` of the
 * strip. It has no `variant`, `color`, `size` or `suffix`.
 */
export const Button: StoryObj<typeof AlertStrip.Button> = {
	parameters: {
		chromatic: { disableSnapshot: true },
		// The strip props are declared on the parent `Meta`; `AlertStrip.Button` has none of them.
		controls: {
			include: [
				'children',
				'prefix',
				'loading',
				'disabled',
				'disabledTooltip',
				'onClick',
				'testId',
			],
		},
	},
	args: {
		children: 'Get Expert Assistance',
		prefix: <ConciergeBell />,
		loading: false,
		disabled: false,
		onClick: fn(),
	},
	argTypes: {
		children: {
			control: 'text',
			description: 'Required. The label of the button. It stays on one line.',
			table: { category: 'Content', type: { summary: 'ReactNode' } },
		},
		prefix: {
			control: false,
			description: 'An icon before the label, in the color of the label.',
			table: { category: 'Content', type: { summary: 'ReactElement' } },
		},
		loading: {
			control: 'boolean',
			description:
				'Shows a spinner over the `prefix` and ignores clicks. The button stays focusable.',
			table: {
				category: 'State',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		disabled: {
			control: 'boolean',
			description: 'Disables the button. Requires `disabledTooltip`, the reason shown on hover.',
			table: { category: 'State', type: { summary: 'boolean' } },
		},
		disabledTooltip: {
			control: 'text',
			description: 'Why the button is disabled, shown in a tooltip while `disabled` is set.',
			table: { category: 'State', type: { summary: 'ReactNode' } },
		},
		onClick: {
			control: false,
			description: 'Runs when the button is clicked.',
			table: { category: 'Events', type: { summary: 'MouseEventHandler' } },
		},
		testId: {
			control: 'text',
			description: 'Forwarded to the button as `data-testid`.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
	// Only the button props reach `AlertStrip.Button`, the strip args of the parent `Meta` stay out.
	render: ({ children, prefix, loading, disabled, disabledTooltip, onClick, testId }) => (
		<AlertStrip
			color="primary"
			side="bottom"
			suffix={
				<AlertStrip.Button
					prefix={prefix}
					loading={loading}
					disabled={disabled}
					disabledTooltip={disabledTooltip}
					onClick={onClick}
					testId={testId}
				>
					{children}
				</AlertStrip.Button>
			}
		>
			{MESSAGE}
		</AlertStrip>
	),
};

/**
 * `AlertStrip.Link` sits inside the children of a strip and draws in its text color. It has the
 * props of `Callout.Link` and none of the strip props.
 */
export const Link: StoryObj<typeof AlertStrip.Link> = {
	parameters: {
		chromatic: { disableSnapshot: true },
		// The strip props are declared on the parent `Meta`; `AlertStrip.Link` has none of them.
		controls: {
			exclude: ['color', 'id'],
		},
	},
	args: {
		href: 'https://signoz.io/docs',
		target: '_blank',
		children: 'setup guide',
		onClick: fn(),
	},
	argTypes: {
		children: {
			control: 'text',
			description:
				'Required. The text of the link, which is its label. Leave the `render` element without children, since its own would win.',
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
				'Where the link opens. `_blank`, here or on the `render` element, adds `noopener` and `noreferrer` to the `rel` of the `render` element. A `target` on the `render` element wins.',
			table: { category: 'Behavior', type: { summary: 'string' } },
		},
		render: {
			control: false,
			description:
				'The element that renders the link, such as a router link. It keeps its own props, like `to`, and a prop set on it wins over the one of the link.',
			table: {
				category: 'Behavior',
				type: { summary: 'ReactElement' },
				defaultValue: { summary: '<a />' },
			},
		},
		onClick: {
			control: false,
			description:
				'Runs on click, after the handler of the `render` element. It never prevents the navigation.',
			table: { category: 'Events', type: { summary: 'MouseEventHandler' } },
		},
		testId: {
			control: 'text',
			description: 'Forwarded to the link as `data-testid`.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
	// Only the link props reach `AlertStrip.Link`, the strip args of the parent `Meta` stay out.
	render: ({ href, target, render, onClick, testId, children }) => (
		<AlertStrip color="primary" side="bottom">
			Need help with setup? Read the{' '}
			<AlertStrip.Link
				href={href}
				target={target}
				render={render}
				onClick={onClick}
				testId={testId}
			>
				{children}
			</AlertStrip.Link>
			.
		</AlertStrip>
	),
};
