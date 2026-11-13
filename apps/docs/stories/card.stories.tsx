import { Database, Info, Plus, Settings } from '@signozhq/icons';
import {
	Badge,
	Button,
	Card,
	CARD_EMPTY_TITLE,
	type CardHeaderSuffixField,
	CardSpacing,
	CardTextOverflow,
	Divider,
	Input,
	Skeleton,
	Switch,
	Tooltip,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactElement, type ReactNode, useState } from 'react';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import styles from './card.stories.module.css';
import { waitForEffects } from './shared/play.js';

const SETTING_TITLE = 'Display timestamp in 24-hour format';
const SETTING_DESCRIPTION = 'Use the 24-hour convention while showing timestamps.';
const LONG_TITLE = 'checkout-service p99 latency by deployment in production, us-east-2';
const LONG_DESCRIPTION =
	'Logs older than the retention period are deleted and cannot be restored. Raise it before you turn on a longer audit window, because the extra storage is billed per day.';
const UNBROKEN_WORD = `Value of a field that cannot break: ${'instrumentation'.repeat(5)}.`;

const SERVICES = [
	['frontend', '1,111.10 ms'],
	['checkout', '848.06 ms'],
	['payments', '11.71 ms'],
	['redis', '0.98 ms'],
] as const;

const CHART_POINTS = '0,30 10,26 20,28 30,18 40,22 50,12 60,16 70,8 80,14 90,6 100,10';

const SPACING_OPTIONS = [...CardSpacing];
const MARGIN_OPTIONS = [...CardSpacing, 'auto'];

function spacingArgType(description: string, defaultValue?: string) {
	return {
		control: 'select' as const,
		options: SPACING_OPTIONS,
		description,
		table: {
			category: 'Appearance',
			type: { summary: 'CardSpacingType' },
			...(defaultValue === undefined ? {} : { defaultValue: { summary: defaultValue } }),
		},
	};
}

function marginArgType(description: string, defaultValue?: string) {
	return {
		control: 'select' as const,
		options: MARGIN_OPTIONS,
		description,
		table: {
			category: 'Appearance',
			type: { summary: 'CardMarginType' },
			...(defaultValue === undefined ? {} : { defaultValue: { summary: defaultValue } }),
		},
	};
}

const meta: Meta<typeof Card> = {
	title: 'Primitive Components/Card',
	component: Card,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'A bordered surface that groups related content on a page: a settings group, a summary panel, a chart, a list. It has an optional header, a body and an optional footer, and no hover, focus or events of its own.',
			},
		},
		design: {
			type: 'figma',
			url: 'https://www.figma.com/design/eyORbfrXMWCz9w0xEFdgWe/Periscope-%E2%80%93-Primitives-v2?node-id=7029-4&p=f&m=dev',
		},
	},
	argTypes: {
		title: {
			control: 'text',
			description:
				'The heading of the card, rendered as text and not as a heading element. An empty title next to another header prop renders `<No title>` and warns, since the title also names the `headerSuffix` control.',
			table: { category: 'Content', type: { summary: 'string' } },
		},
		titlePrefix: {
			control: false,
			description:
				'An icon before the title, decorative and hidden from assistive tech. The card sets its size.',
			table: { category: 'Content', type: { summary: 'ReactElement' } },
		},
		titleSuffix: {
			control: false,
			description:
				'Rendered right after the title on the same line: a `Badge`, an info icon with a `Tooltip`, a spinner. It never shrinks or wraps, so the title cuts first.',
			table: { category: 'Content', type: { summary: 'ReactNode' } },
		},
		description: {
			control: 'text',
			description:
				'One or two lines under the title that say what the card holds or what its setting does. It always wraps. An empty description renders nothing and leaves `aria-describedby` out.',
			table: { category: 'Content', type: { summary: 'ReactNode' } },
		},
		headerSuffix: {
			control: false,
			description:
				'The actions at the end of the header row: a `Switch`, a `Button`, a `Select`. It keeps its width and sits at the top of the title line. As a function it receives the ids that name the control after `title` and describe it with `description`, to spread on a control that has no label of its own.',
			table: {
				category: 'Content',
				type: { summary: 'ReactNode | ((field: CardHeaderSuffixField) => ReactNode)' },
			},
		},
		children: {
			control: 'text',
			description:
				'The body: a chart, a form, a table, a list, an empty state. The blocks stack in a column, `gap` apart. A card with a header and no children renders no body.',
			table: { category: 'Content', type: { summary: 'ReactNode' } },
		},
		footerPrefix: {
			control: 'text',
			description:
				'Rendered at the start of the footer, apart from the actions: a link such as `View all`, or one line of hint text.',
			table: { category: 'Content', type: { summary: 'ReactNode' } },
		},
		footerSuffix: {
			control: false,
			description:
				'Rendered at the end of the footer: a `Button`, or a secondary and a primary button, primary last. The footer renders only when this or `footerPrefix` is set.',
			table: { category: 'Content', type: { summary: 'ReactNode' } },
		},
		textOverflow: {
			control: 'inline-radio',
			options: Object.values(CardTextOverflow),
			description:
				'What a long `title` does. `ellipsis` keeps it on one line, cuts the end and shows the whole title in a tooltip on hover while it is cut. `wrap` shows every line, for titles we write that name a setting.',
			table: {
				category: 'Behavior',
				type: { summary: 'CardTextOverflowType' },
				defaultValue: { summary: 'ellipsis' },
			},
		},
		headerDivider: {
			control: 'boolean',
			description:
				'Draws a line under the header, from one edge of the card to the other. Use it when the body starts with a chart, a table or a list that has no padding of its own.',
			table: {
				category: 'Appearance',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		loading: {
			control: 'boolean',
			description:
				'Swaps `children` for a placeholder while the data loads, and sets `aria-busy` on the root. `true` shows three lines of `Skeleton` in the body, with the padding of the header and the footer. `{ header: true, footer: true }` does the same and also swaps the header or the footer for a `Skeleton`. The object always loads the card, so gate it: `isLoading && { header: true }`. Any other node, such as a `Skeleton` shaped like the chart, is shown in the body in place of `children`, inside the padding props. The body renders while it loads even without children, and a header or a footer that is not loading stays interactive.',
			table: {
				category: 'State',
				type: { summary: 'ReactNode | CardLoadingParts' },
				defaultValue: { summary: 'false' },
			},
		},
		width: {
			control: 'text',
			description:
				'The width of the card. When omitted, it fills a block parent or a grid cell, and in a flex row it is as wide as its content.',
			table: { category: 'Appearance', type: { summary: 'CSSProperties["width"]' } },
		},
		maxWidth: {
			control: 'text',
			description: 'The max-width of the card.',
			table: {
				category: 'Appearance',
				type: { summary: 'CSSProperties["maxWidth"]' },
				defaultValue: { summary: '100%' },
			},
		},
		height: {
			control: 'text',
			description:
				'The height of the card. It grows with the content when omitted. With a height the header and the footer keep their size and the body takes the rest, so a chart with `height: 100%` fills it.',
			table: { category: 'Appearance', type: { summary: 'CSSProperties["height"]' } },
		},
		minHeight: {
			control: 'text',
			description:
				'The min-height of the card, such as a table card that keeps its size while it loads.',
			table: { category: 'Appearance', type: { summary: 'CSSProperties["minHeight"]' } },
		},
		padding: spacingArgType(
			'The space between the edge of the body and its content, as a step of the spacing scale. Each step is 2px, so `8` is 16px. The header and the footer keep their own padding.',
			'8',
		),
		paddingX: spacingArgType(
			'The body padding on the left and the right, such as `0` for a table whose cells bring their own. Wins over `padding`.',
		),
		paddingY: spacingArgType('The body padding on the top and the bottom. Wins over `padding`.'),
		paddingTop: spacingArgType('The body padding on the top. Wins over `paddingY` and `padding`.'),
		paddingRight: spacingArgType(
			'The body padding on the right. Wins over `paddingX` and `padding`.',
		),
		paddingBottom: spacingArgType(
			'The body padding on the bottom. Wins over `paddingY` and `padding`.',
		),
		paddingLeft: spacingArgType(
			'The body padding on the left. Wins over `paddingX` and `padding`.',
		),
		gap: spacingArgType(
			'The space between the blocks of the body, as a step of the spacing scale. `8` is 16px.',
			'8',
		),
		margin: marginArgType(
			'The space around the card, as a step of the spacing scale. `auto` takes the free space. For a list or a grid of cards, prefer `gap` on the parent.',
			'0',
		),
		marginX: marginArgType('The space to the left and the right of the card. Wins over `margin`.'),
		marginY: marginArgType('The space above and below the card. Wins over `margin`.'),
		marginTop: marginArgType('The space above the card. Wins over `marginY` and `margin`.'),
		marginRight: marginArgType(
			'The space to the right of the card. Wins over `marginX` and `margin`.',
		),
		marginBottom: marginArgType('The space below the card. Wins over `marginY` and `margin`.'),
		marginLeft: marginArgType(
			'The space to the left of the card. Wins over `marginX` and `margin`.',
		),
		testId: {
			control: 'text',
			description:
				'Forwarded as `data-testid` on the root. The parts derive theirs from it: `-header`, `-title-prefix`, `-title`, `-title-suffix`, `-description`, `-header-suffix`, `-body`, `-footer`, `-footer-prefix` and `-footer-suffix`.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
		id: {
			control: 'text',
			description: 'Forwarded to the root.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
	},
	args: {
		textOverflow: 'ellipsis',
		headerDivider: false,
		loading: false,
	},
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Playground: Story = {
	parameters: {
		// Every state it can be driven into is covered by `CardShowcase` and `CardLayoutShowcase`.
		chromatic: { disableSnapshot: true },
	},
	decorators: [
		(Story) => (
			<div className="story-container-lg">
				<Story />
			</div>
		),
	],
	args: {
		title: 'Logs retention',
		description: 'How long logs are kept before they are deleted.',
		children: 'Logs are kept for 15 days. After that they are deleted and cannot be restored.',
		footerPrefix: 'Applies to new data only.',
		footerSuffix: (
			<Button variant="solid" color="primary" size="md">
				Save
			</Button>
		),
	},
};

function Section({
	title,
	description,
	children,
}: {
	title: string;
	description: ReactNode;
	children: ReactNode;
}): ReactElement {
	return (
		<div className="story-section">
			<Typography
				variant="paragraph"
				size="base"
				weight="bold"
				color="inherit"
				as="p"
				textOverflow="wrap"
			>
				{title}
			</Typography>
			<Typography
				variant="paragraph"
				size="small"
				weight="regular"
				color="inherit"
				as="p"
				textOverflow="wrap"
			>
				{description}
			</Typography>
			{children}
		</div>
	);
}

function Captioned({ label, children }: { label: string; children: ReactNode }): ReactElement {
	return (
		<div className={styles.caption}>
			<Typography
				variant="label"
				size="small"
				weight="medium"
				color="secondary"
				as="span"
				textOverflow="wrap"
			>
				{label}
			</Typography>
			{children}
		</div>
	);
}

function BodyText({ children }: { children: ReactNode }): ReactElement {
	return (
		<Typography
			variant="paragraph"
			size="small"
			weight="regular"
			color="secondary"
			as="p"
			textOverflow="wrap"
		>
			{children}
		</Typography>
	);
}

function Chart({ testId }: { testId?: string }): ReactElement {
	return (
		<svg
			className={styles.chart}
			data-testid={testId}
			viewBox="0 0 100 36"
			preserveAspectRatio="none"
			aria-hidden="true"
			focusable="false"
		>
			<polyline
				points={CHART_POINTS}
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	);
}

function ServiceTable(): ReactElement {
	return (
		<table className={styles.table}>
			<thead>
				<tr>
					<th scope="col">Service</th>
					<th scope="col">p99 latency</th>
				</tr>
			</thead>
			<tbody>
				{SERVICES.map(([service, latency]) => (
					<tr key={service}>
						<td>{service}</td>
						<td>{latency}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}

function Field({ id, label, value }: { id: string; label: string; value: string }): ReactElement {
	return (
		<div className={styles.field}>
			<Typography
				variant="label"
				size="base"
				weight="medium"
				color="secondary"
				as="label"
				htmlFor={id}
				textOverflow="wrap"
			>
				{label}
			</Typography>
			<Input id={id} defaultValue={value} />
		</div>
	);
}

function ListSkeleton(): ReactElement {
	return (
		<div className={styles.listSkeleton}>
			{[0, 1, 2].map((row) => (
				<div key={row} className={styles.listSkeletonRow}>
					<Skeleton.Avatar active shape="circle" size="md" />
					<div className={styles.listSkeletonText}>
						<Skeleton active title={false} paragraph={{ rows: 1, width: '70%' }} />
					</div>
				</div>
			))}
		</div>
	);
}

function SettingSwitch({
	field,
	defaultValue,
}: {
	field: CardHeaderSuffixField;
	defaultValue: boolean;
}): ReactElement {
	return <Switch color="primary" textPlacement="right" {...field} defaultValue={defaultValue} />;
}

const EDIT_BUTTON = (
	<Button variant="outlined" color="secondary" size="sm">
		Edit
	</Button>
);

const SETTINGS_BUTTON = (
	<Button variant="ghost" color="secondary" size="sm" icon aria-label="Panel settings">
		<Settings />
	</Button>
);

const BETA_BADGE = (
	<Badge variant="outlined" color="primary">
		Beta
	</Badge>
);

const CANCEL_AND_SAVE = (
	<>
		<Button variant="outlined" color="secondary" size="md">
			Cancel
		</Button>
		<Button variant="solid" color="primary" size="md">
			Save
		</Button>
	</>
);

const VIEW_ALL = (
	<Button variant="link" color="primary" size="sm">
		View all
	</Button>
);

const REFRESH_BUTTON = (
	<Button variant="outlined" color="secondary" size="md">
		Refresh
	</Button>
);

const LONG_SETTING_TITLE = 'Display every timestamp on the console in the 24-hour format';

const ACTIVITY = [
	'checkout deployed v1.4.12',
	'payments scaled to 6 replicas',
	'frontend deployed v2.0.3',
	'redis restarted',
	'checkout rolled back to v1.4.11',
	'payments deployed v3.1.0',
	'frontend scaled to 4 replicas',
	'redis deployed v7.2.1',
	'checkout scaled to 8 replicas',
	'payments restarted',
	'frontend rolled back to v2.0.2',
	'checkout deployed v1.4.13',
] as const;

const CODE_LINES = ['service: checkout', 'retention: 15d', 'sampling: 0.1'] as const;

const THEME_MODES = {
	dark: { ...allModes.still, theme: 'dark' },
	light: { ...allModes.still, theme: 'light' },
} as const;

const SURFACES = [
	{ name: 'background', token: '--background' },
	{ name: 'surface-1', token: '--surface-1' },
	{ name: 'surface-2', token: '--surface-2' },
	{ name: 'surface-3', token: '--surface-3' },
	{ name: 'l2-background', token: '--l2-background' },
	{ name: 'l3-background', token: '--l3-background' },
] as const;

function CodeBlock(): ReactElement {
	return (
		<div className={styles.code}>
			{CODE_LINES.map((line) => (
				<Typography
					key={line}
					variant="code"
					size="small"
					weight="regular"
					color="main"
					as="p"
					textOverflow="wrap"
				>
					{line}
				</Typography>
			))}
		</div>
	);
}

function PanelSkeleton(): ReactElement {
	return (
		<div className={styles.panelSkeleton}>
			<Skeleton active title={false} paragraph={{ rows: 5 }} />
		</div>
	);
}

function ActivityList(): ReactElement {
	return (
		<div className={styles.scrollList} data-testid="activity-list">
			{ACTIVITY.map((entry) => (
				<div key={entry} className={styles.listRow}>
					{entry}
				</div>
			))}
		</div>
	);
}

function LoadingTableCard(): ReactElement {
	const [loading, setLoading] = useState(false);

	return (
		<Card
			testId="table-card"
			title="Top services"
			description="Slowest services by p99 latency."
			headerSuffix={
				<Button
					variant="outlined"
					color="secondary"
					size="sm"
					testId="toggle-loading"
					onClick={() => setLoading((current) => !current)}
				>
					{loading ? 'Show the data' : 'Load the data'}
				</Button>
			}
			paddingX={0}
			minHeight={360}
			loading={loading}
			footerPrefix="Refreshed a minute ago."
			footerSuffix={REFRESH_BUTTON}
		>
			<ServiceTable />
		</Card>
	);
}

function SurfaceCards({ name }: { name: string }): ReactElement {
	return (
		<>
			<Card
				title="Retention"
				titlePrefix={<Database />}
				description="How long each signal is kept."
				footerPrefix="Applies to new data only."
				footerSuffix={CANCEL_AND_SAVE}
				testId={`surface-${name}-card`}
			>
				<BodyText>Logs are kept for 15 days and traces for 7 days.</BodyText>
			</Card>
			<Card
				title="Wrap long log lines"
				description="Break lines that are wider than the panel."
				headerSuffix={(field) => <SettingSwitch field={field} defaultValue />}
			/>
		</>
	);
}

/**
 * The header parts, every part at once, the header divider with and without a body, the setting
 * rows, the footer, and the title that cuts, wraps or breaks, all in one snapshot. `play` checks
 * the name and the description a setting row gives its switch, toggles the switches and restores
 * them, and holds the tooltip of the cut title open so the snapshot carries it.
 */
export const CardShowcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const cut = canvas.getByTestId('truncated-card-title');
		const wrapped = canvas.getByTestId('wrapped-card-title');

		await waitFor(() => expect(cut).toHaveAttribute('data-truncated'));
		await expect(wrapped).not.toHaveAttribute('data-truncated');
		await expect(canvas.getByTestId('truncated-card')).toHaveAttribute(
			'data-text-overflow',
			'ellipsis',
		);
		await expect(canvas.getByTestId('wrapped-card')).toHaveAttribute('data-text-overflow', 'wrap');
		await expect(canvas.getByTestId('truncated-parts-card-title')).toHaveAttribute(
			'data-truncated',
		);
		await expect(canvas.getByTestId('empty-title-card-title')).toHaveTextContent(CARD_EMPTY_TITLE);
		await expect(canvas.getByRole('switch', { name: CARD_EMPTY_TITLE })).toBeInTheDocument();
		await expect(canvas.getAllByRole('switch', { name: LONG_SETTING_TITLE })).toHaveLength(2);
		await expect(
			getComputedStyle(canvas.getByTestId('divider-header-body-header')).borderBottomWidth,
		).toBe('1px');
		await expect(
			getComputedStyle(canvas.getByTestId('divider-header-only-header')).borderBottomWidth,
		).toBe('0px');

		const timestamps = canvas.getByRole('switch', { name: SETTING_TITLE });
		const wrapping = canvas.getByRole('switch', { name: 'Wrap long log lines' });

		await expect(timestamps).toHaveAccessibleDescription(SETTING_DESCRIPTION);
		await expect(timestamps).toBeChecked();
		await expect(wrapping).not.toHaveAttribute('aria-describedby');
		await expect(wrapping).not.toBeChecked();

		await userEvent.click(timestamps);

		await waitFor(() => expect(timestamps).not.toBeChecked());
		await expect(wrapping).not.toBeChecked();

		await userEvent.click(wrapping);

		await waitFor(() => expect(wrapping).toBeChecked());
		await expect(timestamps).not.toBeChecked();

		await userEvent.click(timestamps);
		await userEvent.click(wrapping);

		await waitFor(() => expect(timestamps).toBeChecked());
		await expect(wrapping).not.toBeChecked();
		timestamps.blur();
		wrapping.blur();

		await waitForEffects();

		fireEvent.pointerEnter(cut);
		fireEvent.mouseEnter(cut);
		fireEvent.mouseMove(cut);

		await waitFor(() =>
			expect(within(document.body).getByRole('tooltip')).toHaveTextContent(LONG_TITLE),
		);
	},
	render: () => (
		<div className={`story-container-full ${styles.columnLayout}`}>
			<Section
				title="Header"
				description={
					<>
						The title, an icon before it, a <code>Badge</code> or a hint after it, the description
						under it and the actions at the end. A card with a header and no children is the header
						alone. The suffix sits at the top of the title line, so a description that grows does
						not move it.
					</>
				}
			>
				<div className={styles.cardGrid}>
					<Captioned label="title">
						<Card title="Retention" />
					</Captioned>
					<Captioned label="title, description">
						<Card title="Retention" description="How long logs are kept before they are deleted." />
					</Captioned>
					<Captioned label="titlePrefix">
						<Card
							title="Storage"
							description="Disk used by the telemetry store."
							titlePrefix={<Database />}
						/>
					</Captioned>
					<Captioned label="titleSuffix, a Badge">
						<Card title="Top services" titleSuffix={BETA_BADGE} />
					</Captioned>
					<Captioned label="titleSuffix, an info button with a Tooltip">
						<Card
							title="Error rate"
							titleSuffix={
								<Tooltip title="Share of requests that ended in an error status.">
									<Button
										variant="ghost"
										color="secondary"
										size="sm"
										icon
										aria-label="About the error rate"
									>
										<Info />
									</Button>
								</Tooltip>
							}
						/>
					</Captioned>
					<Captioned label="headerSuffix, three lines of description">
						<Card
							title="Logs retention"
							description={LONG_DESCRIPTION}
							headerSuffix={EDIT_BUTTON}
						/>
					</Captioned>
				</div>
			</Section>

			<Section
				title="Every part"
				description="Prefix, title, suffix and description in the text column, the actions at the end of the header, a line under it, the body, and a footer with a hint and two buttons."
			>
				<div className={styles.stack}>
					<Card
						title="Storage"
						titlePrefix={<Database />}
						titleSuffix={BETA_BADGE}
						description="Disk used by the telemetry store, per signal."
						headerSuffix={SETTINGS_BUTTON}
						headerDivider
						footerPrefix="Updated a minute ago."
						footerSuffix={CANCEL_AND_SAVE}
					>
						<BodyText>
							Logs take 120 GB, traces 48 GB and metrics 9 GB, kept for the retention period.
						</BodyText>
					</Card>
				</div>
			</Section>

			<Section
				title="Header divider"
				description="The line under the header shows when there is a body under it. A header with no body is the whole card and draws no line."
			>
				<div className={styles.cardGrid}>
					<Captioned label="no headerDivider">
						<Card title="Retention" description="How long each signal is kept.">
							<BodyText>Logs are kept for 15 days and traces for 7 days.</BodyText>
						</Card>
					</Captioned>
					<Captioned label="headerDivider">
						<Card
							testId="divider-header-body"
							title="Retention"
							description="How long each signal is kept."
							headerDivider
						>
							<BodyText>Logs are kept for 15 days and traces for 7 days.</BodyText>
						</Card>
					</Captioned>
					<Captioned label="headerDivider, header only">
						<Card
							testId="divider-header-only"
							title="Retention"
							description="How long each signal is kept."
							headerDivider
						/>
					</Captioned>
				</div>
			</Section>

			<Section
				title="Setting rows"
				description={
					<>
						A setting is the header alone. <code>headerSuffix</code> as a function receives the ids
						that name the <code>Switch</code> after the title and describe it with the description,
						so the control needs no label of its own. In a narrow card the title cuts or wraps and
						the switch keeps its width.
					</>
				}
			>
				<div className={styles.cardGrid}>
					<Captioned label="on, with a description">
						<Card
							title={SETTING_TITLE}
							description={SETTING_DESCRIPTION}
							headerSuffix={(field) => <SettingSwitch field={field} defaultValue />}
						/>
					</Captioned>
					<Captioned label="off, no description">
						<Card
							title="Wrap long log lines"
							headerSuffix={(field) => <SettingSwitch field={field} defaultValue={false} />}
						/>
					</Captioned>
					<Captioned label="narrow, ellipsis">
						<div className={styles.narrow}>
							<Card
								title={LONG_SETTING_TITLE}
								description={SETTING_DESCRIPTION}
								headerSuffix={(field) => <SettingSwitch field={field} defaultValue />}
							/>
						</div>
					</Captioned>
					<Captioned label="narrow, wrap">
						<div className={styles.narrow}>
							<Card
								title={LONG_SETTING_TITLE}
								description={SETTING_DESCRIPTION}
								textOverflow="wrap"
								headerSuffix={(field) => <SettingSwitch field={field} defaultValue />}
							/>
						</div>
					</Captioned>
				</div>
			</Section>

			<Section
				title="Footer"
				description="The footer renders when either side is set, with a line above it. A long hint wraps above the actions, in a narrow card."
			>
				<div className={styles.cardGrid}>
					<Captioned label="footerPrefix, a link">
						<Card title="Alerts" description="Rules that fired today." footerPrefix={VIEW_ALL} />
					</Captioned>
					<Captioned label="footerSuffix, one button">
						<Card
							title="Alerts"
							description="Rules that fired today."
							footerSuffix={
								<Button variant="outlined" color="secondary" size="md" prefix={<Plus />}>
									New rule
								</Button>
							}
						/>
					</Captioned>
					<Captioned label="both, in a narrow card">
						<div className={styles.narrow}>
							<Card
								title="Alerts"
								footerPrefix="Changes apply to every environment."
								footerSuffix={CANCEL_AND_SAVE}
							/>
						</div>
					</Captioned>
				</div>
			</Section>

			<Section
				title="Long titles"
				description={
					<>
						<code>ellipsis</code> keeps the title on one line and cuts it at the width it renders
						at, with a tooltip on hover while it is cut. <code>wrap</code> shows every line. The
						title cuts before the prefix, the suffix and the actions do, and a word that cannot
						break moves onto the next line.
					</>
				}
			>
				<div className={styles.cardGrid}>
					<Captioned label="ellipsis (default)">
						<Card
							testId="truncated-card"
							title={LONG_TITLE}
							description="Hover the title to read it in full."
							headerSuffix={EDIT_BUTTON}
						/>
					</Captioned>
					<Captioned label="wrap">
						<Card
							testId="wrapped-card"
							title={LONG_TITLE}
							textOverflow="wrap"
							description="Every line of the title shows."
							headerSuffix={EDIT_BUTTON}
						/>
					</Captioned>
					<Captioned label="a word that cannot break">
						<Card title="Attribute" description={UNBROKEN_WORD} />
					</Captioned>
					<Captioned label="ellipsis, with prefix, suffix and actions">
						<Card
							testId="truncated-parts-card"
							title={LONG_TITLE}
							titlePrefix={<Database />}
							titleSuffix={BETA_BADGE}
							headerSuffix={EDIT_BUTTON}
						/>
					</Captioned>
				</div>
			</Section>

			<Section
				title="Empty title"
				description={
					<>
						An empty <code>title</code> next to another header prop renders{' '}
						<code>{CARD_EMPTY_TITLE}</code> and warns on the console, so the missing name shows in
						review. The header stays, since the title also names the control in the header suffix.
					</>
				}
			>
				<div className={styles.stack}>
					<Card
						testId="empty-title-card"
						title=""
						description="A description with no title above it."
						headerSuffix={(field) => <SettingSwitch field={field} defaultValue />}
					/>
				</div>
			</Section>
		</div>
	),
};

/**
 * Whole cards as a page builds them: a chart panel where the body takes the rest of a fixed height
 * and a list that owns its scroll, a form with both kinds of divider, the cards with no header,
 * every form of `loading`, and the empty shell, all in one snapshot. `play` checks the geometry
 * that a screenshot only hints at, which parts load, and flips a table card in and out of loading.
 */
export const CardCompositionShowcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const within1 = (a: number, b: number): boolean => Math.abs(a - b) <= 1;

		const fixed = canvas.getByTestId('fixed-card');
		await expect(within1(fixed.getBoundingClientRect().height, 240)).toBe(true);
		await expect(
			within1(
				canvas.getByTestId('fixed-card-chart').getBoundingClientRect().height,
				canvas.getByTestId('fixed-card-body').getBoundingClientRect().height,
			),
		).toBe(true);

		const scroll = canvas.getByTestId('scroll-card');
		const list = canvas.getByTestId('activity-list');
		await expect(within1(scroll.getBoundingClientRect().height, 240)).toBe(true);
		await expect(list.scrollHeight).toBeGreaterThan(list.clientHeight);
		await expect(scroll.scrollHeight).toBeLessThanOrEqual(scroll.clientHeight);

		const bleedCard = canvas.getByTestId('divider-bleed-card');
		const insetCard = canvas.getByTestId('divider-inset-card');
		await expect(
			within1(
				canvas.getByTestId('divider-bleed').getBoundingClientRect().width,
				bleedCard.clientWidth,
			),
		).toBe(true);
		await expect(canvas.getByTestId('divider-inset').getBoundingClientRect().width).toBeLessThan(
			insetCard.clientWidth - 16,
		);

		await expect(canvas.getByTestId('loading-card')).toHaveAttribute('aria-busy', 'true');
		await expect(canvas.getByTestId('loading-card-body')).toHaveAttribute('data-skeleton');
		await expect(canvas.getByTestId('loading-card-header')).not.toHaveAttribute('data-loading');
		await expect(canvas.getByTestId('loading-card-footer')).not.toHaveAttribute('data-loading');

		await expect(canvas.getByTestId('loading-node-card')).toHaveAttribute('aria-busy', 'true');
		await expect(canvas.getByTestId('loading-node-card-body')).not.toHaveAttribute('data-skeleton');
		await expect(canvas.queryByText('Rendered once the data arrives.')).not.toBeInTheDocument();

		await expect(canvas.getByTestId('loading-empty-card-body')).toHaveAttribute('data-skeleton');

		const panel = canvas.getByTestId('loading-panel');
		const panelBody = canvas.getByTestId('loading-panel-body');
		const panelPadding = getComputedStyle(panelBody);
		await expect(panel).toHaveAttribute('aria-busy', 'true');
		await expect(panel).toHaveAttribute('data-header-divider');
		await expect(panelBody).toHaveAttribute('data-skeleton');
		await expect([
			panelPadding.paddingTop,
			panelPadding.paddingRight,
			panelPadding.paddingBottom,
			panelPadding.paddingLeft,
		]).toEqual(['16px', '16px', '16px', '16px']);

		const panelNodeBody = canvas.getByTestId('loading-panel-content-body');
		await expect(canvas.getByTestId('loading-panel-content')).toHaveAttribute('aria-busy', 'true');
		await expect(panelNodeBody).not.toHaveAttribute('data-skeleton');
		await expect(getComputedStyle(panelNodeBody).paddingLeft).toBe('0px');

		const parts = canvas.getByTestId('loading-parts-card');
		await expect(parts).toHaveAttribute('aria-busy', 'true');
		await expect(canvas.getByTestId('loading-parts-card-header')).toHaveAttribute('data-loading');
		await expect(canvas.getByTestId('loading-parts-card-footer')).toHaveAttribute('data-loading');
		await expect(canvas.getByTestId('loading-parts-card-body')).toHaveAttribute('data-skeleton');
		await expect(canvas.queryByTestId('loading-parts-card-title')).not.toBeInTheDocument();
		await expect(within(parts).queryByRole('button')).not.toBeInTheDocument();

		const headerOnly = canvas.getByTestId('loading-header-card');
		await expect(headerOnly).toHaveAttribute('aria-busy', 'true');
		await expect(canvas.getByTestId('loading-header-card-header')).toHaveAttribute('data-loading');
		await expect(canvas.getByTestId('loading-header-card-footer')).not.toHaveAttribute(
			'data-loading',
		);
		await expect(canvas.queryByTestId('loading-header-card-title')).not.toBeInTheDocument();
		await expect(
			within(headerOnly).queryByRole('button', { name: 'Panel settings' }),
		).not.toBeInTheDocument();
		await expect(within(headerOnly).getByRole('button', { name: 'Refresh' })).toBeEnabled();

		const table = canvas.getByTestId('table-card');
		const toggle = canvas.getByTestId('toggle-loading');
		const tableHeight = table.getBoundingClientRect().height;
		await expect(table).not.toHaveAttribute('aria-busy');
		await expect(table).not.toHaveAttribute('data-loading');
		await expect(within(table).getByRole('table')).toBeInTheDocument();

		await userEvent.click(toggle);

		await waitFor(() => expect(table).toHaveAttribute('aria-busy', 'true'));
		await expect(table).toHaveAttribute('data-loading');
		await expect(within(table).queryByRole('table')).not.toBeInTheDocument();
		await expect(canvas.getByTestId('table-card-body')).toHaveAttribute('data-skeleton');
		await expect(canvas.getByTestId('table-card-title')).toHaveTextContent('Top services');
		await expect(within(table).getByRole('button', { name: 'Refresh' })).toBeEnabled();
		await expect(within1(table.getBoundingClientRect().height, tableHeight)).toBe(true);

		await userEvent.click(toggle);

		await waitFor(() => expect(table).not.toHaveAttribute('aria-busy'));
		await expect(table).not.toHaveAttribute('data-loading');
		await expect(within(table).getByRole('table')).toBeInTheDocument();
		await expect(within1(table.getBoundingClientRect().height, tableHeight)).toBe(true);
		toggle.blur();

		await expect(canvas.getByTestId('empty-shell')).toBeEmptyDOMElement();
	},
	render: () => (
		<div className={`story-container-full ${styles.columnLayout}`}>
			<Section
				title="Fixed height"
				description={
					<>
						With a height the card is a column: the header and the footer keep their size and the
						body takes the rest. A chart that brings its own gutter takes{' '}
						<code>padding={'{0}'}</code>, a line under the header from <code>headerDivider</code>{' '}
						and the height of its cell from <code>height="100%"</code>. A long list owns its scroll,
						since the card never scrolls.
					</>
				}
			>
				<div className={styles.cardGrid}>
					<Captioned label="height 100% of a 240px cell, the chart fills the body">
						<div className={styles.panelCell}>
							<Card
								testId="fixed-card"
								title="Requests"
								titleSuffix={BETA_BADGE}
								headerSuffix={SETTINGS_BUTTON}
								headerDivider
								padding={0}
								height="100%"
								footerPrefix="Last hour."
							>
								<Chart testId="fixed-card-chart" />
							</Card>
						</div>
					</Captioned>
					<Captioned label="height 240, the list scrolls">
						<Card
							testId="scroll-card"
							title="Recent activity"
							headerDivider
							padding={0}
							height={240}
						>
							<ActivityList />
						</Card>
					</Captioned>
				</div>
			</Section>

			<Section
				title="Form and dividers"
				description={
					<>
						A <code>Divider</code> that is a direct child runs from edge to edge, over the padding
						of the body. One inside a wrapper keeps the width of the wrapper. The footer holds a
						hint or a link at its start and the actions at its end, primary last.
					</>
				}
			>
				<div className={styles.cardGrid}>
					<Captioned label="Divider as a direct child">
						<Card
							testId="divider-bleed-card"
							title="Retention"
							description="How long each signal is kept."
							footerPrefix="Applies to new data only."
							footerSuffix={CANCEL_AND_SAVE}
						>
							<Field id="retention-logs" label="Logs" value="15 days" />
							<Divider testId="divider-bleed" />
							<Field id="retention-traces" label="Traces" value="7 days" />
						</Card>
					</Captioned>
					<Captioned label="Divider inside a wrapper">
						<Card
							testId="divider-inset-card"
							title="Retention"
							description="How long each signal is kept."
						>
							<Field id="retention-metrics" label="Metrics" value="30 days" />
							<div>
								<Divider testId="divider-inset" />
							</div>
							<Field id="retention-events" label="Events" value="3 days" />
						</Card>
					</Captioned>
				</div>
			</Section>

			<Section
				title="Without a header"
				description={
					<>
						A body that starts with text and has no header passes <code>paddingTop={'{6}'}</code>,
						since the header is what takes 4px off the top. A body with no padding clips its content
						to the corner radius of the card. The footer draws its line even when it is the first
						part. A card with nothing in it renders the empty shell and warns.
					</>
				}
			>
				<div className={styles.cardGrid}>
					<Captioned label="body only">
						<Card>
							<BodyText>Seen in the last 5 minutes across every environment.</BodyText>
						</Card>
					</Captioned>
					<Captioned label="body only, paddingTop 6">
						<Card paddingTop={6}>
							<BodyText>Seen in the last 5 minutes across every environment.</BodyText>
						</Card>
					</Captioned>
					<Captioned label="padding 0, a code block">
						<Card padding={0}>
							<CodeBlock />
						</Card>
					</Captioned>
					<Captioned label="body and footer">
						<Card footerPrefix={VIEW_ALL}>
							<BodyText>Seen in the last 5 minutes across every environment.</BodyText>
						</Card>
					</Captioned>
					<Captioned label="footer only">
						<Card footerSuffix={CANCEL_AND_SAVE} />
					</Captioned>
					<Captioned label="nothing, the empty shell">
						<Card testId="empty-shell" />
					</Captioned>
				</div>
			</Section>

			<Section
				title="Loading"
				description={
					<>
						<code>loading</code> swaps the children for a placeholder, and the root is{' '}
						<code>aria-busy</code>. <code>true</code> shows three lines of <code>Skeleton</code>{' '}
						with the padding of the header and the footer, even in a card with{' '}
						<code>padding={'{0}'}</code>. <code>{'{ header: true, footer: true }'}</code> also swaps
						the header or the footer for a <code>Skeleton</code>, and a part that is not set stays
						as it is. Any other node is shown in the body, inside the padding props. A card with no
						children still shows the body while it loads. A table takes{' '}
						<code>paddingX={'{0}'}</code>, so the cells line up with the header text, and{' '}
						<code>minHeight</code> keeps its card at one size while it loads.
					</>
				}
			>
				<div className={styles.cardGrid}>
					<Captioned label="loading">
						<Card
							testId="loading-card"
							title="Top services"
							description="Slowest services by p99 latency."
							loading
							footerPrefix={VIEW_ALL}
						>
							<ServiceTable />
						</Card>
					</Captioned>
					<Captioned label="loading with a node">
						<Card
							testId="loading-node-card"
							title="Recent activity"
							headerDivider
							loading={<ListSkeleton />}
						>
							<BodyText>Rendered once the data arrives.</BodyText>
						</Card>
					</Captioned>
					<Captioned label="loading, no children">
						<Card testId="loading-empty-card" title="Recent activity" loading />
					</Captioned>
				</div>
				<div className={styles.cardGrid}>
					<Captioned label="loading with the header and the footer">
						<Card
							testId="loading-parts-card"
							title="Top services"
							description="Slowest services by p99 latency."
							headerSuffix={SETTINGS_BUTTON}
							footerPrefix="Refreshed a minute ago."
							footerSuffix={REFRESH_BUTTON}
							loading={{ header: true, footer: true }}
						>
							<ServiceTable />
						</Card>
					</Captioned>
					<Captioned label="loading with the header only">
						<Card
							testId="loading-header-card"
							title="Top services"
							description="Slowest services by p99 latency."
							headerSuffix={SETTINGS_BUTTON}
							footerPrefix="Refreshed a minute ago."
							footerSuffix={REFRESH_BUTTON}
							loading={{ header: true }}
						>
							<ServiceTable />
						</Card>
					</Captioned>
					<Captioned label="table, the button toggles loading">
						<LoadingTableCard />
					</Captioned>
				</div>
				<div className={styles.cardGridTwo}>
					<Captioned label="panel, padding 0, loading">
						<Card
							testId="loading-panel"
							title="Requests"
							titleSuffix={BETA_BADGE}
							headerSuffix={SETTINGS_BUTTON}
							headerDivider
							padding={0}
							height={240}
							loading
						>
							<Chart />
						</Card>
					</Captioned>
					<Captioned label="panel, padding 0, loading with a node that has its own gutter">
						<Card
							testId="loading-panel-content"
							title="Requests"
							titleSuffix={BETA_BADGE}
							headerSuffix={SETTINGS_BUTTON}
							headerDivider
							padding={0}
							height={240}
							loading={<PanelSkeleton />}
						>
							<Chart />
						</Card>
					</Captioned>
				</div>
			</Section>
		</div>
	),
};

/**
 * The padding steps and the gap between the blocks of the body, the margin props, the size props
 * and a grid of cards with the gap on the parent, all in one snapshot.
 */
export const CardLayoutShowcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	render: () => (
		<div className={`story-container-full ${styles.columnLayout}`}>
			<Section
				title="Padding and gap"
				description={
					<>
						The padding props set the space inside the body, 16px by default, and the header and the
						footer keep their own. A side wins over <code>padding</code>, so{' '}
						<code>
							padding={'{0}'} paddingTop={'{4}'}
						</code>{' '}
						is 8px on top and 0 elsewhere. <code>gap</code> sets the space between the blocks of the
						body, 16px by default.
					</>
				}
			>
				<div className={styles.cardGrid}>
					<Captioned label="padding 4">
						<Card title="Title" padding={4}>
							<div className={styles.block} />
							<div className={styles.block} />
						</Card>
					</Captioned>
					<Captioned label="default, padding 8 and gap 8">
						<Card title="Title">
							<div className={styles.block} />
							<div className={styles.block} />
						</Card>
					</Captioned>
					<Captioned label="padding 12">
						<Card title="Title" padding={12}>
							<div className={styles.block} />
							<div className={styles.block} />
						</Card>
					</Captioned>
					<Captioned label="padding 0, paddingTop 4">
						<Card title="Title" padding={0} paddingTop={4}>
							<div className={styles.block} />
							<div className={styles.block} />
						</Card>
					</Captioned>
					<Captioned label="gap 2">
						<Card title="Title" gap={2}>
							<div className={styles.block} />
							<div className={styles.block} />
						</Card>
					</Captioned>
					<Captioned label="gap 12">
						<Card title="Title" gap={12}>
							<div className={styles.block} />
							<div className={styles.block} />
						</Card>
					</Captioned>
				</div>
			</Section>

			<Section
				title="Margin"
				description={
					<>
						The margin props set the space around the card, with the same precedence as the padding
						ones. <code>auto</code> takes the free space. For a list or a grid of cards, set the{' '}
						<code>gap</code> on the parent instead.
					</>
				}
			>
				<div className={styles.stack}>
					<Captioned label="margin 4, on a card in a box with a dashed outline">
						<div className={styles.marginBox}>
							<Card title="Title" margin={4} />
						</div>
					</Captioned>
					<Captioned label="marginLeft auto, in a flex row">
						<div className={styles.flexRow}>
							<Card title="Start" width={160} />
							<Card title="End" width={160} marginLeft="auto" />
						</div>
					</Captioned>
				</div>
			</Section>

			<Section
				title="Size"
				description={
					<>
						Without a size the card fills its parent. <code>width</code> sets one,{' '}
						<code>maxWidth</code> caps it at the width of the parent by default, and{' '}
						<code>minHeight</code> keeps a card at one height while its content changes.
					</>
				}
			>
				<div className={styles.cardGrid}>
					<Captioned label="width 240">
						<Card title="Title" description="A fixed width." width={240} />
					</Captioned>
					<Captioned label="maxWidth 240">
						<Card title="Title" description="Narrower than its parent." maxWidth={240} />
					</Captioned>
					<Captioned label="minHeight 160">
						<Card title="Title" description="Keeps its height." minHeight={160} />
					</Captioned>
				</div>
			</Section>

			<Section
				title="Grid"
				description="A grid or a flex row of cards sets the gap on the parent. A card without a height takes the height its row gives it."
			>
				<div className={styles.cardGridStretch}>
					<Card title="Services" description="12 reporting.">
						<BodyText>Seen in the last 5 minutes.</BodyText>
					</Card>
					<Card title="Alerts" description="3 firing.">
						<BodyText>The rules below are over their threshold.</BodyText>
						<BodyText>Open the alerts page to acknowledge them.</BodyText>
					</Card>
					<Card title="Dashboards" description="48 saved.">
						<BodyText>Shared with your team.</BodyText>
					</Card>
				</div>
			</Section>
		</div>
	),
};

/**
 * The same card, with a header, a description, a body and a footer, and a setting row, on every
 * background the design tokens offer, in the dark and the light theme. The card keeps its own
 * surface and its border, so what shows is the contrast of both against each parent.
 */
export const CardSurfacesShowcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: THEME_MODES },
		controls: { disable: true },
	},
	render: () => (
		<div className={`story-container-full ${styles.columnLayout}`}>
			<Section
				title="Surfaces"
				description={
					<>
						The card is on its own surface. Each parent is labelled with the token that paints it.{' '}
						<code>--l1-background</code> is the same value as <code>--surface-1</code> in both
						themes, so it has no parent of its own.
					</>
				}
			>
				<div className={styles.surfaces}>
					{SURFACES.map(({ name, token }) => (
						<Captioned key={name} label={token}>
							<div className={styles.surface} data-surface={name}>
								<SurfaceCards name={name} />
							</div>
						</Captioned>
					))}
				</div>
			</Section>
		</div>
	),
};
