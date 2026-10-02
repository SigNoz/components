import {
	Button,
	ButtonColor,
	ButtonSize,
	ButtonVariant,
	Toaster,
	type ToasterProps,
	ToastPosition,
	type ToastPositionType,
	ToastVariant,
	type ToastVariantType,
	toast,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactElement, useEffect, useState } from 'react';
import { expect, userEvent, waitFor } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import styles from './toast.stories.module.css';

/**
 * `Toaster` takes no toast: they are raised by `toast`. The playground drives one call to it
 * through these story-only args, next to the props of the `Toaster` that draws it.
 */
type ToastStoryArgs = ToasterProps & {
	variant?: ToastVariantType;
	title?: string;
	description?: string;
	actionLabel?: string;
};

const meta: Meta<ToastStoryArgs> = {
	title: 'Primitive Components/Toast',
	component: Toaster,
	argTypes: {
		position: {
			control: 'select',
			options: Object.values(ToastPosition),
			description: 'Where every toast of the app stacks. One position means one stack.',
			table: {
				category: 'Appearance',
				type: {
					summary:
						"'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'",
				},
				defaultValue: { summary: "'top-right'" },
			},
		},
		offset: {
			control: 'number',
			description:
				'The distance between the stack and the edges of the window it sits against. Numbers are written as `px`.',
			table: {
				category: 'Appearance',
				type: { summary: 'number | string' },
				defaultValue: { summary: '16' },
			},
		},
		limit: {
			control: { type: 'number', min: 1 },
			description: 'How many toasts the stack shows. The rest wait behind until one closes.',
			table: {
				category: 'Behavior',
				type: { summary: 'number' },
				defaultValue: { summary: '3' },
			},
		},
		timeout: {
			control: { type: 'number', min: 0, step: 1000 },
			description:
				'How long `success`, `info` and `warning` toasts stay on screen, in milliseconds. `0` keeps them until they are dismissed. `danger`, `loading` and a toast with an `action` stay until they are dismissed whatever this is.',
			table: {
				category: 'Behavior',
				type: { summary: 'number' },
				defaultValue: { summary: '5000' },
			},
		},
		container: {
			control: false,
			description:
				'The element the toasts are portalled into. Defaults to the panel of the `Dialog` or `Drawer` the `Toaster` sits in, else `document.body`.',
			table: {
				category: 'Behavior',
				type: { summary: 'HTMLElement | ShadowRoot | RefObject' },
			},
		},
		id: {
			control: 'text',
			description: 'Id of the viewport.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		className: {
			control: false,
			description: 'Merged onto the viewport. Avoid it: the stack has a fixed place and size.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		style: {
			control: false,
			description: 'Inline styles on the viewport. Avoid it, for exceptional overrides only.',
			table: { category: 'Styling', type: { summary: 'CSSProperties' } },
		},
		testId: {
			control: 'text',
			description:
				'Alias for `data-testid`, set on the viewport. A toast gets `<testId>-toast-<id>`, and each part of it a further suffix.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
		variant: {
			control: 'select',
			options: Object.values(ToastVariant),
			description: 'Story only: which method raises the toast, `toast.success` and so on.',
			table: {
				category: 'Appearance',
				type: { summary: "'success' | 'info' | 'warning' | 'danger' | 'loading'" },
			},
		},
		title: {
			control: 'text',
			description: 'Story only: the title, the first argument of the call.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
		description: {
			control: 'text',
			description: 'Story only: `description`, the line under the title.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
		actionLabel: {
			control: 'text',
			description:
				'Story only: `action.label`, the button on the right. It closes the toast. Empty means no button, except on `danger`, which requires one: the playground then names it `Close`.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
	},
	parameters: {
		layout: 'fullscreen',
		design: {
			type: 'figma',
			url: 'https://www.figma.com/design/eyORbfrXMWCz9w0xEFdgWe/Periscope-%E2%80%93-Primitives-v2?node-id=5875-15930',
		},
		// Both stories render their own `Toaster`, so the shared one the preview mounts for every
		// other story steps aside. On the docs page the playground runs in an iframe, which keeps the
		// two apart.
		ownToaster: true,
		docs: { story: { inline: false, iframeHeight: 520 } },
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<ToastStoryArgs>;

// One id for the playground toast, so a change in the controls updates it in place.
const PLAYGROUND_ID = 'playground';

function raisePlaygroundToast({
	variant = 'success',
	title,
	description,
	actionLabel,
}: ToastStoryArgs): void {
	const action = actionLabel ? { label: actionLabel } : undefined;
	const options = { id: PLAYGROUND_ID, description, action };
	// `toast.danger` requires a button, so the playground names one when the controls do not.
	const id =
		variant === 'danger'
			? toast.danger(title, { ...options, action: action ?? { label: 'Close' } })
			: toast[variant](title, options);

	// Nothing to show, so the toast of the previous controls has to go.
	if (id === '') {
		toast.dismiss(PLAYGROUND_ID);
	}
}

function ToastPlayground({
	variant,
	title,
	description,
	actionLabel,
	...toasterProps
}: ToastStoryArgs): ReactElement {
	// The `Toaster` below subscribes in an effect, and a child's effects run before its parent's,
	// so it is listening by the time this raises the toast.
	useEffect(() => {
		raisePlaygroundToast({ variant, title, description, actionLabel });
	}, [variant, title, description, actionLabel]);

	return (
		<div className={`story-center ${styles.playground}`}>
			<Button
				variant={ButtonVariant.Solid}
				color={ButtonColor.Secondary}
				size={ButtonSize.MD}
				onClick={() => raisePlaygroundToast({ variant, title, description, actionLabel })}
			>
				Show it again
			</Button>
			<Toaster {...toasterProps} />
		</div>
	);
}

/**
 * One toast, raised on load and again on every change in the controls. The button brings it back
 * once it has closed.
 */
export const Default: Story = {
	args: {
		position: 'top-right',
		offset: 16,
		limit: 3,
		timeout: 5000,
		variant: 'success',
		title: 'Panel saved',
		description: '',
		actionLabel: '',
	},
	parameters: {
		// Playground: every variant, shape and state of the stack is covered by `ToastShowcase`.
		chromatic: { disableSnapshot: true },
	},
	render: (args: ToastStoryArgs) => <ToastPlayground {...args} />,
};

type FrameName = 'spread' | 'collapsed-top' | 'collapsed-bottom';

/**
 * A `Toaster` that stacks inside a frame on the page instead of against the window. Every
 * `Toaster` draws every toast, so the frames show the same toasts, and each keeps its own hover
 * state and timers: one can be spread while the others stay collapsed.
 *
 * The frame only exists after the first render, so it is held in state rather than a ref, and
 * the `Toaster` waits for it instead of mounting into `document.body` first.
 */
function ToastFrame({
	frame,
	position,
	className,
}: {
	frame: FrameName;
	position: ToastPositionType;
	className: string;
}): ReactElement {
	const [host, setHost] = useState<HTMLDivElement | null>(null);

	return (
		<div ref={setHost} className={`${styles.frame} ${className}`} data-frame={frame}>
			{host !== null && (
				<Toaster position={position} container={host} aria-label={`Notifications, ${frame}`} />
			)}
		</div>
	);
}

const LONG_TITLE =
	'The export of the dashboard is still running, and the file will be in your downloads when it ends';

/**
 * Raised oldest first. The last three stay until dismissed, so the collapsed frames, which show
 * only the newest three and keep their timers running, do not change while they are on screen.
 */
function raiseShowcaseToasts(): void {
	toast.info(LONG_TITLE);
	toast.info('Copied to clipboard');
	toast.success('Panel saved');
	toast.warning('Quota almost reached');
	toast.info('Button focused', { action: { label: 'Cancel' }, testId: 'toast-focus' });
	toast.info('Button hovered', { action: { label: 'Cancel' }, testId: 'toast-hover' });
	toast.loading('Saving the panel');
	toast.danger('Could not save the panel', { action: { label: 'Close' } });
	toast.success('Panel deleted', {
		description: 'It is gone from the dashboard.',
		action: { label: 'Undo' },
	});
}

const SHOWCASE_TOASTS = 9;
const FRAMES = 3;

/**
 * Every variant and content shape, the stack spread and collapsed, at the top and at the bottom,
 * and the states of the button, in one snapshot. The toasts are the story: they are raised on
 * load, and each frame draws them with a `Toaster` of its own.
 *
 * The spread frame is held spread by a hover, which also pauses its timers, so a toast that
 * closes after five seconds does not race the snapshot there. Moving the real pointer over it and
 * out again lets it collapse and close them.
 */
export const ToastShowcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
	},
	render: () => (
		<div className="story-container-full">
			<div className={styles.showcase}>
				<div className="story-section">
					<Typography size="base" weight="semibold">
						Variants and content
					</Typography>
					<Typography size="sm">
						The stack spread, the way hover or focus inside it spreads it, newest first. It shows
						three toasts and holds the rest behind, so the frame lifts that limit to put every
						variant on screen. <code>danger</code> requires a button, named <code>Close</code> here,
						and the two toasts under <code>loading</code> force the hover and focus state of the
						button.
					</Typography>
					<ToastFrame frame="spread" position="top-right" className={styles.spread} />
				</div>

				<div className="story-section">
					<Typography size="base" weight="semibold">
						Stack
					</Typography>
					<Typography size="sm">
						The same toasts as the stack shows them at rest: the newest against the edge, two more
						peeking out behind it toward the page, every one as tall as the newest. At the bottom
						the stack grows upward.
					</Typography>
					<div className={styles.frames}>
						<ToastFrame frame="collapsed-top" position="top-right" className={styles.collapsed} />
						<ToastFrame
							frame="collapsed-bottom"
							position="bottom-right"
							className={styles.collapsed}
						/>
					</div>
				</div>
			</div>
		</div>
	),
	play: async ({ canvasElement }) => {
		const frame = (name: FrameName) =>
			canvasElement.querySelector(`[data-frame="${name}"]`) as HTMLElement;

		await waitFor(() =>
			expect(canvasElement.querySelectorAll('[data-slot="toaster"]')).toHaveLength(FRAMES),
		);

		toast.dismiss();
		raiseShowcaseToasts();

		await waitFor(() =>
			expect(canvasElement.querySelectorAll('[data-slot="toast"]')).toHaveLength(
				SHOWCASE_TOASTS * FRAMES,
			),
		);

		const spread = frame('spread');
		await userEvent.hover(spread.querySelector('[data-slot="toast"]') as HTMLElement);

		// `storybook-addon-pseudo-states` applies its classes once, as the story mounts, and these
		// toasts are raised after that. So the classes it would have applied are applied here.
		const action = (testId: string) =>
			spread.querySelector(`[data-testid="${testId}"] [data-slot="toast-action"]`) as HTMLElement;
		action('toast-hover').classList.add('pseudo-hover');
		action('toast-focus').classList.add('pseudo-focus-visible');
	},
};
