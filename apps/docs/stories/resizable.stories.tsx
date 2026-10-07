import {
	Button,
	Resizable,
	type ResizableItemType,
	ResizableOrientation,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactNode, useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import styles from './resizable.stories.module.css';
import { waitForEffects } from './shared/play.js';

function Pane({ title, children }: { title: string; children?: ReactNode }) {
	return (
		<div className={styles.pane}>
			<Typography size="sm" weight="semibold">
				{title}
			</Typography>
			{children !== undefined && <Typography.Text color="muted">{children}</Typography.Text>}
		</div>
	);
}

const EDITOR_ITEMS: ResizableItemType[] = [
	{
		value: 'editor',
		label: 'Query editor',
		defaultSize: '70%',
		minSize: '40%',
		children: <Pane title="Query editor">70% to start, never under 40%.</Pane>,
	},
	{
		value: 'settings',
		label: 'Panel settings',
		minSize: '20%',
		children: <Pane title="Panel settings">Takes the room the editor leaves, at least 20%.</Pane>,
	},
];

const meta: Meta<typeof Resizable> = {
	title: 'Primitive Components/Resizable',
	component: Resizable,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'Two or more panels, side by side or stacked, with a handle between each pair. The user drags a handle, or moves it from the keyboard, to give one panel more room and its neighbour less.',
			},
		},
	},
	argTypes: {
		items: {
			control: false,
			description:
				'The panels, in the order they are rendered. A handle sits between each pair. Each row takes `value` (names the saved layout and the test IDs), `label` (names the handle after the panel, not shown), `children`, and optionally `defaultSize`, `minSize`, `maxSize` (strings with a unit: `%`, `px` or `rem`) and `onResize` (the size of the panel in pixels, each time it changes).',
			table: { category: 'Content', type: { summary: 'ResizableItemType[]' } },
		},
		orientation: {
			control: 'inline-radio',
			options: Object.values(ResizableOrientation),
			description:
				'How the panels line up. `horizontal` puts them side by side, `vertical` stacks them. Also picks the arrow keys that move a handle, and whether `onResize` reports a width or a height.',
			table: { category: 'Appearance', type: { summary: 'ResizableOrientationType' } },
		},
		storageKey: {
			control: 'text',
			description:
				'Saves the layout under this key when the user resizes, and restores it on the next mount. Without it, the panels start from their `defaultSize` on every mount. Each set of panel values keeps its own layout under the key.',
			table: { category: 'Behavior', type: { summary: 'string' } },
		},
		storage: {
			control: false,
			description:
				'Where the layout is saved: any object with `getItem` and `setItem`. Only read when `storageKey` is set.',
			table: {
				category: 'Behavior',
				type: { summary: 'ResizableStorageType' },
				defaultValue: { summary: 'localStorage' },
			},
		},
		id: {
			control: 'text',
			description: 'Forwarded to the root.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		'aria-label': {
			control: 'text',
			description:
				'Names the root. With it, or with `aria-labelledby`, the root is a `group` with that name. Without either, the root has no role.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		'aria-labelledby': {
			control: 'text',
			description:
				'The id of the element that names the root. With it, or with `aria-label`, the root is a `group` with that name. Without either, the root has no role.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		testId: {
			control: 'text',
			description:
				'Forwarded to the root as `data-testid`, and the stem every panel and handle is named from: `${testId}-panel-${value}` and `${testId}-handle-${value}`.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
	args: {
		orientation: 'horizontal',
		items: EDITOR_ITEMS,
	},
};

export default meta;

type Story = StoryObj<typeof Resizable>;

export const Default: Story = {
	parameters: {
		// Every layout it can be put in is covered by `ResizableShowcase`.
		chromatic: { disableSnapshot: true },
	},
	render: (args) => (
		<div className="story-container-full">
			<div className="story-resizable">
				<Resizable {...args} />
			</div>
		</div>
	),
};

function SidePanelWithWidth() {
	const [width, setWidth] = useState(0);

	return (
		<div className={`story-resizable ${styles.withHeader}`}>
			<div className={styles.header}>
				<Typography size="sm">Span tree: {width}px</Typography>
			</div>
			<Resizable
				orientation="horizontal"
				items={[
					{
						value: 'tree',
						label: 'Span tree',
						defaultSize: '240px',
						minSize: '160px',
						maxSize: '480px',
						onResize: setWidth,
						children: (
							<Pane title="Span tree">
								240px to start. Keeps its width when the window changes.
							</Pane>
						),
					},
					{
						value: 'timeline',
						label: 'Timeline',
						children: <Pane title="Timeline">Takes every change of the window.</Pane>,
					},
				]}
			/>
		</div>
	);
}

/**
 * Both orientations, three panels, a nested split, a panel sized in pixels that reports its width,
 * a Resizable under a header, a panel that scrolls, and one panel on its own, in one snapshot.
 */
export const ResizableShowcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	render: () => (
		<div className={`story-container-full ${styles.columnLayout}`}>
			<div className="story-section">
				<Typography size="base" weight="semibold">
					Horizontal
				</Typography>
				<div className={`story-resizable ${styles.short}`}>
					<Resizable orientation="horizontal" items={EDITOR_ITEMS} />
				</div>
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					Vertical
				</Typography>
				<div className="story-resizable">
					<Resizable
						orientation="vertical"
						items={[
							{
								value: 'preview',
								label: 'Preview',
								defaultSize: '60%',
								minSize: '30%',
								children: <Pane title="Preview" />,
							},
							{ value: 'query', label: 'Query', children: <Pane title="Query" /> },
						]}
					/>
				</div>
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					Three panels
				</Typography>
				<Typography size="sm">Panels with no defaultSize share the room in equal parts.</Typography>
				<div className={`story-resizable ${styles.short}`}>
					<Resizable
						orientation="horizontal"
						items={[
							{ value: 'files', label: 'Files', children: <Pane title="Files" /> },
							{ value: 'code', label: 'Code', children: <Pane title="Code" /> },
							{ value: 'outline', label: 'Outline', children: <Pane title="Outline" /> },
						]}
					/>
				</div>
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					Nested
				</Typography>
				<Typography size="sm">
					A Resizable in a panel fills it with no wrapper, and has handles of its own.
				</Typography>
				<div className="story-resizable">
					<Resizable
						orientation="horizontal"
						items={[
							{
								value: 'main',
								label: 'Preview and editor',
								defaultSize: '75%',
								minSize: '60%',
								children: (
									<Resizable
										orientation="vertical"
										items={[
											{
												value: 'preview',
												label: 'Preview',
												defaultSize: '60%',
												minSize: '40%',
												children: <Pane title="Preview" />,
											},
											{ value: 'editor', label: 'Editor', children: <Pane title="Editor" /> },
										]}
									/>
								),
							},
							{ value: 'settings', label: 'Settings', children: <Pane title="Settings" /> },
						]}
					/>
				</div>
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					A panel in pixels, under a header
				</Typography>
				<Typography size="sm">
					The header reads the width from onResize. The Resizable takes the height the header
					leaves.
				</Typography>
				<SidePanelWithWidth />
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					Content larger than its panel
				</Typography>
				<div className={`story-resizable ${styles.short}`}>
					<Resizable
						orientation="horizontal"
						items={[
							{
								value: 'logs',
								label: 'Logs',
								defaultSize: '35%',
								children: (
									<div className={styles.longContent}>
										{Array.from({ length: 30 }, (_, index) => (
											<div key={index} className={styles.logLine}>
												<Typography.Text>
													{`2026-10-06T12:00:${String(index).padStart(2, '0')}Z info checkout-service handled request ${index} with a line long enough to scroll sideways`}
												</Typography.Text>
											</div>
										))}
									</div>
								),
							},
							{
								value: 'details',
								label: 'Details',
								children: <Pane title="Details">Stays where it is.</Pane>,
							},
						]}
					/>
				</div>
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					One panel
				</Typography>
				<Typography size="sm">Fills the root, with no handle.</Typography>
				<div className={`story-resizable ${styles.short}`}>
					<Resizable
						orientation="horizontal"
						items={[
							{
								value: 'only',
								label: 'Trace',
								defaultSize: '30%',
								children: <Pane title="Trace" />,
							},
						]}
					/>
				</div>
			</div>
		</div>
	),
};

/**
 * A handle moved from the keyboard: `Tab` focuses it, and `ArrowRight` gives the editor 5% of the
 * root, from its `defaultSize` of 70% to 75%. The snapshot shows the focused handle.
 */
export const KeyboardResize: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	play: async ({ canvasElement }) => {
		const handle = within(canvasElement).getByRole('separator', { name: 'Query editor' });
		const size = () => Number(handle.getAttribute('aria-valuenow'));

		await waitFor(() => expect(size()).toBe(70));
		await waitForEffects();

		await userEvent.tab();
		await expect(handle).toHaveFocus();

		await userEvent.keyboard('{ArrowRight}');
		await waitFor(() => expect(size()).toBe(75));
	},
	render: () => (
		<div className="story-container-full">
			<div className={`story-resizable ${styles.short}`}>
				<Resizable orientation="horizontal" items={EDITOR_ITEMS} />
			</div>
		</div>
	),
};

function DockedPanel() {
	const [docked, setDocked] = useState(true);
	const items: ResizableItemType[] = [
		{ value: 'trace', label: 'Trace', children: <Pane title="Trace" /> },
	];

	if (docked) {
		items.push({
			value: 'details',
			label: 'Span details',
			defaultSize: '320px',
			minSize: '240px',
			maxSize: '480px',
			children: (
				<Pane title="Span details">Drag the handle, close, open again: the width comes back.</Pane>
			),
		});
	}

	return (
		<div className="story-section">
			<Button variant="outlined" color="secondary" size="sm" onClick={() => setDocked(!docked)}>
				{docked ? 'Close span details' : 'Open span details'}
			</Button>
			<div className="story-resizable">
				<Resizable orientation="horizontal" items={items} />
			</div>
		</div>
	);
}

/**
 * A panel that leaves `items` and comes back gets its size back.
 */
export const PanelsThatComeAndGo: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	render: () => (
		<div className="story-container-full">
			<DockedPanel />
		</div>
	),
};

function RemountedLayout() {
	const [mount, setMount] = useState(0);

	return (
		<div className="story-section">
			<Button variant="outlined" color="secondary" size="sm" onClick={() => setMount(mount + 1)}>
				Remount
			</Button>
			<div className="story-resizable">
				<Resizable
					key={mount}
					orientation="horizontal"
					storageKey="storybook-resizable-saved-layout"
					items={EDITOR_ITEMS}
				/>
			</div>
		</div>
	);
}

/**
 * With `storageKey`, a drag is saved to `localStorage` and restored on the next mount.
 */
export const SavedLayout: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	render: () => (
		<div className="story-container-full">
			<RemountedLayout />
		</div>
	),
};
