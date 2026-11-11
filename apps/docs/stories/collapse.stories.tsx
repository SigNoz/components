import { Copy, Pencil, Save, ShieldCheck, Trash2 } from '@signozhq/icons';
import {
	Badge,
	Button,
	Collapse,
	type CollapseGroupItemType,
	Input,
	Switch,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Fragment, type ReactElement, type ReactNode, useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import styles from './collapse.stories.module.css';
import {
	CONTENT,
	collapseArgTypes,
	collapseParameters,
	DESCRIPTION,
	HEADING_LEVELS,
	SIGNALS,
	TEXT_OVERFLOWS,
	TITLE,
	VARIANTS,
} from './shared/collapse-arg-types.js';
import { waitForEffects } from './shared/play.js';

const meta: Meta<typeof Collapse> = {
	title: 'Primitive Components/Collapse',
	component: Collapse,
	parameters: collapseParameters,
	argTypes: collapseArgTypes,
	args: {
		variant: 'outlined',
		size: 'sm',
		title: TITLE,
		children: CONTENT,
		defaultExpanded: true,
		onExpandedChange: fn(),
	},
};

export default meta;

type Story = StoryObj<typeof Collapse>;

const LONG_TITLE =
	'Which attributes does the span carry when the service runs behind the gateway and the mesh adds its own?';

const CHANNELS_DESCRIPTION =
	'Where the alert is sent when it fires. Add a channel to route it to the team that owns the service.';

const ATTRIBUTES = [
	['service.name', 'checkout'],
	['service.version', '2.14.0'],
	['deployment.environment', 'production'],
	['k8s.pod.name', 'checkout-6f9d7c8b5-x2k4p'],
	['http.status_code', '200'],
] as const;

const FAQ: CollapseGroupItemType[] = [
	{
		value: 'what',
		title:
			'What is instrumentation, and why does every service need it before it can report traces?',
		children:
			'Instrumentation is the code that produces telemetry. Without it a service runs, but nothing leaves it for SigNoz to read.',
	},
	{
		value: 'cost',
		title:
			'How is the price of a plan worked out when I send logs, traces and metrics from one account?',
		children: 'Each signal is billed by the amount of data you send, with no charge per seat.',
	},
	{
		value: 'retention',
		title: 'Can I keep the data of one service for longer than the data of every other service?',
		children: 'Yes. Retention is set per signal, and a rule can narrow it to one service.',
	},
	{
		value: 'export',
		title: 'Is there a way to move my dashboards to another workspace without rebuilding them?',
		children: 'Export a dashboard as JSON and import it in the other workspace.',
	},
];

const MAPPINGS = [
	{ value: 'engineering', group: 'Engineering', role: 'Editor', members: 14 },
	{ value: 'platform', group: 'Platform', role: 'Admin', members: 5 },
	{ value: 'support', group: 'Support', role: 'Viewer', members: 9 },
] as const;

const MAPPING_ITEMS: CollapseGroupItemType[] = MAPPINGS.map((mapping) => ({
	value: mapping.value,
	title: mapping.group,
	description: `${mapping.members} members`,
	headerSuffix: (
		<>
			<Badge variant="outlined" color="secondary">
				{mapping.role}
			</Badge>
			<Button variant="ghost" color="secondary" size="sm" icon aria-label={`Edit ${mapping.group}`}>
				<Pencil />
			</Button>
			<Button
				variant="ghost"
				color="secondary"
				size="sm"
				icon
				aria-label={`Delete ${mapping.group}`}
			>
				<Trash2 />
			</Button>
		</>
	),
	children: `Members of ${mapping.group} get the ${mapping.role} role.`,
}));

const MANY: CollapseGroupItemType[] = Array.from({ length: 8 }, (_, index) => ({
	value: `item-${index + 1}`,
	title: `Section ${index + 1}`,
	children: `The content of section ${index + 1}.`,
}));

const OPEN_ROWS: { label: string; value: string[] }[] = [
	{ label: 'one open', value: ['logs'] },
	{ label: 'none open', value: [] },
	{ label: 'all open', value: SIGNALS.map((item) => item.value) },
];

function Label({ children }: { children: ReactNode }): ReactElement {
	return (
		<Typography
			variant="label"
			size="small"
			weight="medium"
			color="inherit"
			as="span"
			textOverflow="visible"
		>
			{children}
		</Typography>
	);
}

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

function MatrixHeader({ columns }: { columns: readonly string[] }): ReactElement {
	return (
		<>
			<span />
			{columns.map((column) => (
				<Label key={column}>{column}</Label>
			))}
		</>
	);
}

function AttributesTable(): ReactElement {
	return (
		<table className={styles.table}>
			<thead>
				<tr>
					<th>Attribute</th>
					<th>Value</th>
				</tr>
			</thead>
			<tbody>
				{ATTRIBUTES.map(([name, value]) => (
					<tr key={name}>
						<td>{name}</td>
						<td>{value}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}

function RuleForm(): ReactElement {
	return (
		<div className={styles.form}>
			<div className={styles.fieldRow}>
				<Input aria-label="Evaluation window" defaultValue="5 minutes" />
				<Input aria-label="Group notifications by" defaultValue="service.name" />
			</div>
			<Input aria-label="Runbook URL" placeholder="https://runbooks.example.com/checkout-latency" />
		</div>
	);
}

function AttributeMappingForm(): ReactElement {
	return (
		<div className={styles.form}>
			<div className={styles.fieldRow}>
				<Input aria-label="Name attribute" defaultValue="displayName" />
				<Input aria-label="Email attribute" defaultValue="mail" />
			</div>
			<Input aria-label="Groups attribute" defaultValue="memberOf" />
		</div>
	);
}

function HeaderCell({
	variant,
	withPrefix,
	withDescription,
}: {
	variant: (typeof VARIANTS)[number];
	withPrefix: boolean;
	withDescription: boolean;
}): ReactElement {
	return (
		<Collapse
			variant={variant}
			size="sm"
			title="Notification channels"
			description={withDescription ? CHANNELS_DESCRIPTION : undefined}
			prefix={withPrefix ? <ShieldCheck /> : undefined}
			defaultExpanded={false}
		>
			{CONTENT}
		</Collapse>
	);
}

/**
 * Three sections, each with a different control in `headerSuffix`: icon buttons, a switch and an
 * indicator next to a description.
 */
function SuffixControls({
	variant,
	onExpandedChange,
}: {
	variant: (typeof VARIANTS)[number];
	onExpandedChange?: (expanded: boolean) => void;
}): ReactElement {
	return (
		<div className={styles.column}>
			<Collapse
				variant={variant}
				size="sm"
				title="Ingestion key"
				onExpandedChange={onExpandedChange}
				headerSuffix={
					<>
						<Button
							variant="ghost"
							color="secondary"
							size="sm"
							icon
							aria-label="Copy key"
							onClick={fn()}
						>
							<Copy />
						</Button>
						<Button
							variant="ghost"
							color="secondary"
							size="sm"
							icon
							aria-label="Delete key"
							onClick={fn()}
						>
							<Trash2 />
						</Button>
					</>
				}
				defaultExpanded={false}
			>
				{CONTENT}
			</Collapse>
			<Collapse
				variant={variant}
				size="sm"
				title="Enable alert"
				onExpandedChange={onExpandedChange}
				headerSuffix={
					<Switch color="primary" textPlacement="right" aria-label="Enable alert" defaultValue />
				}
				defaultExpanded={false}
			>
				{CONTENT}
			</Collapse>
			<Collapse
				variant={variant}
				size="sm"
				title="Google OAuth"
				description="The client ID and the secret from the Google Cloud console."
				onExpandedChange={onExpandedChange}
				headerSuffix={
					<Badge variant="outlined" color="danger">
						2 errors
					</Badge>
				}
				defaultExpanded={false}
			>
				{CONTENT}
			</Collapse>
		</div>
	);
}

export const Default: Story = {
	parameters: {
		// Every state it can be driven into is covered by `CollapseShowcase`.
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
		description: DESCRIPTION,
		testId: 'collapse',
	},
	// Remounts on a new `defaultExpanded`, since the state is uncontrolled.
	render: (args) => <Collapse key={String(args.defaultExpanded)} {...args} />,
};

/**
 * `hover` and `focus` cannot be reached by a snapshot on their own, so
 * `storybook-addon-pseudo-states` forces them on the header button inside the `[data-state-cell]`
 * cells.
 */
const STATES = ['default', 'hover', 'focus'] as const;

const HEADER_ROWS = [
	{ label: 'prefix', withPrefix: true, withDescription: false },
	{ label: 'description', withPrefix: false, withDescription: true },
	{ label: 'prefix and description', withPrefix: true, withDescription: true },
] as const;

/**
 * Every visual state of the section in one snapshot: both variants collapsed and expanded, the
 * header button in each state, the description, the prefix and the controls in `headerSuffix`, a
 * long title with `ellipsis` and `wrap`, each heading level, a table with and without padding, form
 * fields in the panel, the empty placeholders, and a `ghost` section inside an `outlined` one. Then
 * the same for `Collapse.Group`: both variants with no item open, one open and every item open,
 * questions with `ellipsis` and `wrap`, items with controls in `headerSuffix`, a list past 6 items,
 * an empty group and an item with a `testId` of its own. The stories after it hold what a snapshot
 * cannot show.
 */
export const CollapseShowcase: Story = {
	parameters: {
		controls: { disable: true },
		chromatic: { disableSnapshot: false, modes: allModes },
		pseudo: {
			hover: '[data-state-cell="hover"] [data-slot="collapse-toggle"]',
			focusVisible: '[data-state-cell="focus"] [data-slot="collapse-toggle"]',
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const ellipsis = canvas.getByTestId('long-title-ellipsis-title');
		const wrap = canvas.getByTestId('long-title-wrap-title');

		await waitForEffects();

		// The tooltip of a cut title only exists once the title has been measured as truncated.
		await waitFor(() => expect(ellipsis).toHaveAttribute('data-truncated'));
		await expect(wrap).not.toHaveAttribute('data-truncated');
		await expect(canvas.getByText('<No title>')).toHaveAttribute('data-empty-title');
		await expect(canvas.getByText('<No content>')).toBeVisible();

		for (const level of HEADING_LEVELS) {
			await expect(
				canvas.getByRole('heading', { level, name: `Heading level ${level}` }),
			).toHaveTextContent(`Heading level ${level}`);
		}

		const groupEllipsis = within(canvas.getByTestId('faq-ellipsis'));
		const groupWrap = within(canvas.getByTestId('faq-wrap'));

		await waitFor(() =>
			expect(groupEllipsis.getByText(String(FAQ[0]?.title))).toHaveAttribute('data-truncated'),
		);

		for (const item of FAQ) {
			await expect(groupWrap.getByText(String(item.title))).not.toHaveAttribute('data-truncated');
		}

		for (const variant of VARIANTS) {
			const many = within(canvas.getByTestId(`many-${variant}`));

			await expect(many.getAllByRole('button')).toHaveLength(MANY.length);
			await expect(many.queryAllByRole('region')).toHaveLength(0);
			await expect(canvas.getByTestId(`empty-group-${variant}`)).toBeEmptyDOMElement();
		}

		await expect(canvas.getByTestId('keys-item-traces')).toHaveAttribute(
			'data-slot',
			'collapse-group-item',
		);
		await expect(canvas.getByTestId('keys-item-traces-toggle')).toBeVisible();
		await expect(canvas.getByTestId('pinned-logs')).toBeVisible();
		await expect(canvas.getByTestId('pinned-logs-header-suffix')).toBeVisible();
	},
	render: () => (
		<div className={`story-container-full ${styles.columnLayout}`}>
			<Section
				title="Variants"
				description="A collapsed section keeps only its header, and the chevron turns while it is open."
			>
				<div className={styles.matrix}>
					<MatrixHeader columns={['collapsed', 'expanded']} />
					{VARIANTS.map((variant) => (
						<Fragment key={variant}>
							<Label>{variant}</Label>
							{[false, true].map((expanded) => (
								<Collapse
									key={String(expanded)}
									variant={variant}
									size="sm"
									title={TITLE}
									defaultExpanded={expanded}
								>
									{CONTENT}
								</Collapse>
							))}
						</Fragment>
					))}
				</div>
			</Section>

			<Section
				title="States"
				description={
					<>
						The header button in each state. <code>hover</code> and <code>focus</code> are forced by{' '}
						<code>storybook-addon-pseudo-states</code>. The whole button is the hit area, the
						chevron and the padding included.
					</>
				}
			>
				<div className={`${styles.matrix} ${styles.matrixStates}`}>
					<MatrixHeader columns={STATES} />
					{VARIANTS.map((variant) => (
						<Fragment key={variant}>
							<Label>{variant}</Label>
							{STATES.map((state) => (
								<div key={state} data-state-cell={state}>
									<Collapse variant={variant} size="sm" title={TITLE} defaultExpanded={false}>
										{CONTENT}
									</Collapse>
								</div>
							))}
						</Fragment>
					))}
				</div>
			</Section>

			<Section
				title="Description and prefix"
				description="The description sits under the title and wraps. The prefix is an icon before the title, sized by the section."
			>
				<div className={styles.matrix}>
					<MatrixHeader columns={VARIANTS} />
					{HEADER_ROWS.map((row) => (
						<Fragment key={row.label}>
							<Label>{row.label}</Label>
							{VARIANTS.map((variant) => (
								<HeaderCell
									key={variant}
									variant={variant}
									withPrefix={row.withPrefix}
									withDescription={row.withDescription}
								/>
							))}
						</Fragment>
					))}
				</div>
			</Section>

			<Section
				title="Header suffix"
				description="Controls at the end of the header row, outside the header button: icon buttons, a switch and an indicator."
			>
				<div className={styles.matrix}>
					<MatrixHeader columns={VARIANTS} />
					<Label>suffix</Label>
					{VARIANTS.map((variant) => (
						<SuffixControls key={variant} variant={variant} />
					))}
				</div>
			</Section>

			<Section
				title="Long title"
				description="The same long title in a column of 24rem. ellipsis cuts it at the end and shows the whole title in a tooltip while it is cut, wrap takes as many lines as it needs. The title is the only part that shrinks, so the chevron, the prefix and the suffix keep their width."
			>
				<div className={styles.matrix}>
					<MatrixHeader columns={TEXT_OVERFLOWS} />
					<Label>long title</Label>
					{TEXT_OVERFLOWS.map((textOverflow) => (
						<Collapse
							key={textOverflow}
							variant="outlined"
							size="sm"
							title={LONG_TITLE}
							textOverflow={textOverflow}
							testId={`long-title-${textOverflow}`}
							prefix={<ShieldCheck />}
							headerSuffix={
								<Button
									variant="ghost"
									color="secondary"
									size="sm"
									icon
									aria-label={`Copy, ${textOverflow}`}
								>
									<Copy />
								</Button>
							}
							defaultExpanded={false}
						>
							{CONTENT}
						</Collapse>
					))}
				</div>
			</Section>

			<Section
				title="Heading levels"
				description={
					<>
						<code>headingLevel</code> sets the level of the heading around the header button, so the
						section fits the outline of the page. It is <code>3</code> unless set, and it does not
						change how the section looks.
					</>
				}
			>
				<div className={`${styles.matrix} ${styles.matrixSingle}`}>
					{HEADING_LEVELS.map((level) => (
						<Fragment key={level}>
							<Label>{`headingLevel ${level}`}</Label>
							<Collapse
								variant="outlined"
								size="sm"
								title={`Heading level ${level}`}
								headingLevel={level}
								defaultExpanded={false}
							>
								{CONTENT}
							</Collapse>
						</Fragment>
					))}
				</div>
			</Section>

			<Section
				title="Table content"
				description="noContentPadding lets a table run to the edges of the section. Without it the panel pads its content, so the same table sits inside an inset."
			>
				<div className={styles.matrix}>
					<MatrixHeader columns={['padded', 'noContentPadding']} />
					<Label>table</Label>
					<Collapse variant="outlined" size="sm" title="All attributes" defaultExpanded>
						<AttributesTable />
					</Collapse>
					<Collapse
						variant="outlined"
						size="sm"
						title="All attributes"
						noContentPadding
						defaultExpanded
					>
						<AttributesTable />
					</Collapse>
				</div>
			</Section>

			<Section
				title="Form content"
				description={
					<>
						Fields in the panel. The outlined section has a description and <code>keepMounted</code>
						, so its fields stay in the page while it is collapsed, hidden until found.
					</>
				}
			>
				<div className={styles.matrix}>
					<MatrixHeader columns={['ghost', 'outlined, keepMounted']} />
					{[true, false].map((expanded) => (
						<Fragment key={String(expanded)}>
							<Label>{expanded ? 'expanded' : 'collapsed'}</Label>
							<Collapse
								variant="ghost"
								size="sm"
								title="Advanced options"
								defaultExpanded={expanded}
							>
								<RuleForm />
							</Collapse>
							<Collapse
								variant="outlined"
								size="sm"
								title="Attribute mapping"
								description="Which claim of the SAML response fills each field of the user."
								keepMounted
								defaultExpanded={expanded}
							>
								<AttributeMappingForm />
							</Collapse>
						</Fragment>
					))}
				</div>
			</Section>

			<Section
				title="Empty title and content"
				description="An empty title shows <No title> and empty content shows <No content>. The section never hides, since the header is the only part left once it is collapsed."
			>
				<div className={styles.matrix}>
					<MatrixHeader columns={['empty title', 'empty content']} />
					<Label>placeholders</Label>
					<Collapse variant="outlined" size="sm" title="" defaultExpanded>
						{CONTENT}
					</Collapse>
					<Collapse variant="outlined" size="sm" title={TITLE} defaultExpanded>
						{null}
					</Collapse>
				</div>
			</Section>

			<Section
				title="Nesting"
				description="A ghost section inside an outlined one, as a form with its own advanced options. The inner sections draw no box, so the outer one is the only frame."
			>
				<div className={styles.stack}>
					<Collapse
						variant="outlined"
						size="sm"
						title="Alert rule"
						description="The query, the condition and the options that go with them."
						defaultExpanded
					>
						<div className={styles.nested}>
							<Collapse variant="ghost" size="sm" title="Condition" defaultExpanded>
								<RuleForm />
							</Collapse>
							<Collapse variant="ghost" size="sm" title="Advanced options" defaultExpanded={false}>
								<RuleForm />
							</Collapse>
						</div>
					</Collapse>
				</div>
			</Section>

			<Section
				title="Group variants"
				description="outlined draws one box around the group with a divider between the items, ghost stacks the items with no box. Opening one item never closes another, so a group can have no item open, or all of them."
			>
				<div className={styles.matrix}>
					<MatrixHeader columns={VARIANTS} />
					{OPEN_ROWS.map((row) => (
						<Fragment key={row.label}>
							<Label>{row.label}</Label>
							{VARIANTS.map((variant) => (
								<Collapse.Group
									key={variant}
									variant={variant}
									size="sm"
									defaultValue={row.value}
									items={SIGNALS}
								/>
							))}
						</Fragment>
					))}
				</div>
			</Section>

			<Section
				title="Group questions"
				description="The same questions with each textOverflow. wrap gives each title as many lines as it needs and shows no tooltip, ellipsis cuts it."
			>
				<div className={styles.matrix}>
					<MatrixHeader columns={TEXT_OVERFLOWS} />
					<Label>outlined</Label>
					{TEXT_OVERFLOWS.map((textOverflow) => (
						<Collapse.Group
							key={textOverflow}
							variant="outlined"
							size="sm"
							textOverflow={textOverflow}
							defaultValue={['what']}
							items={FAQ}
							testId={`faq-${textOverflow}`}
						/>
					))}
				</div>
			</Section>

			<Section
				title="Group header suffix"
				description="Each item takes its own controls in headerSuffix, such as the role of a mapping and its edit and delete buttons."
			>
				<div className={styles.matrix}>
					<MatrixHeader columns={VARIANTS} />
					<Label>suffix</Label>
					{VARIANTS.map((variant) => (
						<Collapse.Group
							key={variant}
							variant={variant}
							size="sm"
							defaultValue={['platform']}
							items={MAPPING_ITEMS}
						/>
					))}
				</div>
			</Section>

			<Section
				title="Group with many items"
				description="Past 6 items the panels leave out the region role. Nothing changes visually."
			>
				<div className={styles.matrix}>
					<MatrixHeader columns={VARIANTS} />
					<Label>8 items</Label>
					{VARIANTS.map((variant) => (
						<Collapse.Group
							key={variant}
							variant={variant}
							size="sm"
							defaultValue={['item-1']}
							items={MANY}
							testId={`many-${variant}`}
						/>
					))}
				</div>
			</Section>

			<Section
				title="Empty group"
				description="A group with no items renders an empty root with no warning. The items come from data, so the call site owns the empty state. The dashed frame marks where the group sits."
			>
				<div className={styles.matrix}>
					<MatrixHeader columns={VARIANTS} />
					<Label>no items</Label>
					{VARIANTS.map((variant) => (
						<div key={variant} className={styles.emptyFrame}>
							<Collapse.Group
								variant={variant}
								size="sm"
								defaultValue={[]}
								items={[]}
								testId={`empty-group-${variant}`}
							/>
						</div>
					))}
				</div>
			</Section>

			<Section
				title="Group item test ids"
				description="An item with a testId of its own, which wins over the one the group names it with. It looks the same as any other item."
			>
				<div className={`${styles.matrix} ${styles.matrixSingle}`}>
					<MatrixHeader columns={['outlined']} />
					<Label>testId</Label>
					<Collapse.Group
						variant="outlined"
						size="sm"
						testId="keys"
						defaultValue={['traces']}
						items={[
							SIGNALS[0],
							{
								...SIGNALS[1],
								testId: 'pinned-logs',
								headerSuffix: (
									<Button
										variant="ghost"
										color="secondary"
										size="sm"
										icon
										aria-label="Copy logs link"
									>
										<Copy />
									</Button>
								),
							},
						]}
					/>
				</div>
			</Section>
		</div>
	),
};

/**
 * Every background a section can sit on. Each tile takes the background of the token in its label.
 * The surface tokens follow the theme on their own, and in the light theme they all resolve to the
 * first level.
 */
const SURFACES = [
	'l1-background',
	'l2-background',
	'l3-background',
	'surface-1',
	'surface-2',
	'surface-3',
] as const;

/**
 * `outlined` and `ghost` on each surface background of the app, collapsed and expanded, and one
 * with icon buttons in `headerSuffix`, so the border and the text can be
 * judged against every surface. Each tile is labelled with the token it takes its background from.
 */
export const Surfaces: Story = {
	parameters: {
		controls: { disable: true },
		chromatic: { disableSnapshot: false, modes: allModes },
	},
	render: () => (
		<div className="story-container-full">
			<div className={styles.surfaces}>
				{SURFACES.map((surface) => (
					<div key={surface} className={styles.surface} data-surface={surface}>
						<Label>{`--${surface}`}</Label>
						<Collapse
							variant="outlined"
							size="sm"
							title="Outlined, collapsed"
							defaultExpanded={false}
						>
							{CONTENT}
						</Collapse>
						<Collapse variant="outlined" size="sm" title="Outlined, expanded" defaultExpanded>
							{CONTENT}
						</Collapse>
						<Collapse variant="ghost" size="sm" title="Ghost, collapsed" defaultExpanded={false}>
							{CONTENT}
						</Collapse>
						<Collapse variant="ghost" size="sm" title="Ghost, expanded" defaultExpanded>
							{CONTENT}
						</Collapse>
						<Collapse
							variant="outlined"
							size="sm"
							title="Ingestion key"
							headerSuffix={
								<>
									<Button
										variant="ghost"
										color="secondary"
										size="sm"
										icon
										aria-label={`Copy key, ${surface}`}
									>
										<Copy />
									</Button>
									<Button
										variant="ghost"
										color="secondary"
										size="sm"
										icon
										aria-label={`Delete key, ${surface}`}
									>
										<Trash2 />
									</Button>
								</>
							}
							defaultExpanded={false}
						>
							{CONTENT}
						</Collapse>
					</div>
				))}
			</div>
		</div>
	),
};

function MetricMetadata(): ReactElement {
	const [editing, setEditing] = useState(false);

	return (
		<Collapse
			variant="outlined"
			size="sm"
			title="Metadata"
			description={editing ? 'Editing the unit and the type of the metric.' : undefined}
			headerSuffix={
				editing ? (
					<Button
						variant="solid"
						color="primary"
						size="sm"
						prefix={<Save />}
						onClick={() => setEditing(false)}
					>
						Save
					</Button>
				) : (
					<Button
						variant="ghost"
						color="secondary"
						size="sm"
						icon
						aria-label="Edit metadata"
						onClick={() => setEditing(true)}
					>
						<Pencil />
					</Button>
				)
			}
			noContentPadding
			defaultExpanded
		>
			<AttributesTable />
		</Collapse>
	);
}

/**
 * The data sections of a details page: the attributes of a span, and the metadata of a metric with
 * an edit button that becomes a save button. Both keep the table to the edges of the box with
 * `noContentPadding`, and the edit button sits in `headerSuffix`, so the click that starts the edit
 * does not collapse the section.
 */
export const DetailsSections: Story = {
	parameters: {
		controls: { disable: true },
		// The tables are in `CollapseShowcase`. This one is for the edit button that turns into a save button.
		chromatic: { disableSnapshot: true },
	},
	render: () => (
		<div className={`story-container-lg ${styles.stack}`}>
			<Collapse
				variant="outlined"
				size="sm"
				title="All attributes"
				noContentPadding
				defaultExpanded
			>
				<AttributesTable />
			</Collapse>
			<MetricMetadata />
		</div>
	),
};

const AUTH_SECTIONS = [
	{
		id: 'password',
		title: 'Email and password',
		description: 'Members sign in with a password they set themselves.',
		errors: 0,
	},
	{
		id: 'google',
		title: 'Google OAuth',
		description: 'The client ID and the secret from the Google Cloud console.',
		errors: 2,
	},
	{
		id: 'saml',
		title: 'SAML',
		description: 'The metadata URL of your identity provider.',
		errors: 0,
	},
	{
		id: 'oidc',
		title: 'OpenID Connect',
		description: 'The issuer and the client of an OIDC provider.',
		errors: 1,
	},
] as const;

function AuthSections(): ReactElement {
	const [open, setOpen] = useState<string | null>('google');

	return (
		<div className="story-panel">
			{AUTH_SECTIONS.map((section) => (
				<Collapse
					key={section.id}
					variant="ghost"
					size="sm"
					title={section.title}
					description={section.description}
					keepMounted
					expanded={open === section.id}
					onExpandedChange={(next: boolean) => setOpen(next ? section.id : null)}
					headerSuffix={
						section.errors > 0 ? (
							<Badge variant="outlined" color="danger">
								{`${section.errors} ${section.errors === 1 ? 'error' : 'errors'}`}
							</Badge>
						) : undefined
					}
				>
					<div className={styles.form}>
						<Input aria-label={`${section.title}, client ID`} placeholder="Client ID" />
						<Input aria-label={`${section.title}, client secret`} placeholder="Client secret" />
					</div>
				</Collapse>
			))}
		</div>
	);
}

/**
 * The sign-in methods of an organization. Each section has a description, keeps its fields mounted
 * so the form validates while collapsed, and shows an error count in `headerSuffix`. The parent
 * holds `expanded` so one section is open at a time.
 */
export const AuthMethods: Story = {
	parameters: {
		controls: { disable: true },
		// Each section is in `CollapseShowcase`. This one is for the parent that keeps one open.
		chromatic: { disableSnapshot: true },
	},
	render: () => (
		<div className="story-container-lg">
			<AuthSections />
		</div>
	),
};

/**
 * By default a collapsed section unmounts its content, so the field below is empty again on the next
 * open. With `keepMounted` the content stays in the page, hidden until found, and the field keeps
 * what was typed.
 */
export const KeepMounted: Story = {
	parameters: {
		controls: { disable: true },
		chromatic: { disableSnapshot: true },
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const plain = canvas.getByRole('button', { name: 'Unmounted while collapsed' });
		const kept = canvas.getByRole('button', { name: 'Kept while collapsed' });

		await waitForEffects();

		await userEvent.type(canvas.getByLabelText('Unmounted field'), 'draft');
		await userEvent.type(canvas.getByLabelText('Kept field'), 'draft');

		await userEvent.click(plain);
		await userEvent.click(kept);

		await expect(canvas.queryByLabelText('Unmounted field')).not.toBeInTheDocument();
		await expect(canvas.getByLabelText('Kept field')).toBeInTheDocument();
		await expect(canvas.getByTestId('kept-panel')).toHaveAttribute('hidden', 'until-found');

		await userEvent.click(plain);
		await userEvent.click(kept);

		await expect(canvas.getByLabelText('Unmounted field')).toHaveValue('');
		await expect(canvas.getByLabelText('Kept field')).toHaveValue('draft');
	},
	render: () => (
		<div className={`story-container-lg ${styles.stack}`}>
			<Collapse variant="outlined" size="sm" title="Unmounted while collapsed" defaultExpanded>
				<Input aria-label="Unmounted field" />
			</Collapse>
			<Collapse
				variant="outlined"
				size="sm"
				title="Kept while collapsed"
				keepMounted
				defaultExpanded
				testId="kept"
			>
				<Input aria-label="Kept field" />
			</Collapse>
		</div>
	),
};

function MappingGroups({ onChange }: { onChange?: (value: string[]) => void }): ReactElement {
	const [open, setOpen] = useState<string[]>(['platform']);

	return (
		<div className={styles.stack}>
			<Label>{`Open: ${open.length === 0 ? 'none' : open.join(', ')}`}</Label>
			<Collapse.Group
				variant="outlined"
				size="sm"
				value={open}
				onChange={(next: string[]) => {
					setOpen(next);
					onChange?.(next);
				}}
				items={MAPPING_ITEMS}
			/>
		</div>
	);
}

/**
 * The role mappings of a SAML provider, with the open items held by the parent in `value`. The
 * list `onChange` reports follows the order of `items`, whatever order the items were opened in.
 */
export const GroupControlledMappings: StoryObj<typeof Collapse.Group> = {
	parameters: {
		controls: { disable: true },
		chromatic: { disableSnapshot: true },
	},
	args: {
		onChange: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);

		await waitForEffects();

		await expect(canvas.getByText('Open: platform')).toBeVisible();

		await userEvent.click(canvas.getByRole('button', { name: 'Engineering' }));
		await expect(canvas.getByText('Open: engineering, platform')).toBeVisible();
		await expect(args.onChange).toHaveBeenLastCalledWith(['engineering', 'platform']);

		await userEvent.click(canvas.getByRole('button', { name: 'Delete Platform' }));
		await expect(canvas.getByRole('button', { name: 'Platform' })).toHaveAttribute(
			'aria-expanded',
			'true',
		);
		await expect(args.onChange).toHaveBeenCalledTimes(1);
	},
	render: (args) => (
		<div className="story-container-lg">
			<MappingGroups onChange={args.onChange} />
		</div>
	),
};

/**
 * Opening one item never closes another, so every item can be open at once. Each header button is
 * its own tab stop, in the order of `items`. Past 6 items, the panels leave out `role="region"`,
 * since many regions crowd the landmark list, and the header buttons are still named by their
 * titles.
 */
export const GroupOpensIndependently: StoryObj<typeof Collapse.Group> = {
	parameters: {
		controls: { disable: true },
		chromatic: { disableSnapshot: true },
	},
	args: {
		onChange: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const section = (index: number) => canvas.getByRole('button', { name: `Section ${index}` });

		await waitForEffects();

		await expect(canvas.getAllByRole('button')).toHaveLength(MANY.length);

		await userEvent.click(section(5));
		await userEvent.click(section(1));
		await expect(args.onChange).toHaveBeenLastCalledWith(['item-1', 'item-5']);

		await userEvent.click(section(3));
		await expect(args.onChange).toHaveBeenLastCalledWith(['item-1', 'item-3', 'item-5']);
		await expect(section(1)).toHaveAttribute('aria-expanded', 'true');
		await expect(section(3)).toHaveAttribute('aria-expanded', 'true');
		await expect(section(5)).toHaveAttribute('aria-expanded', 'true');
		await expect(canvas.getByText('The content of section 3.')).toBeVisible();
		await expect(canvas.queryAllByRole('region')).toHaveLength(0);

		await userEvent.click(section(3));
		await expect(args.onChange).toHaveBeenLastCalledWith(['item-1', 'item-5']);

		await userEvent.tab({ shift: true });
		await expect(section(2)).toHaveFocus();
		await userEvent.tab();
		await expect(section(3)).toHaveFocus();
	},
	render: (args) => (
		<div className="story-container-lg">
			<Collapse.Group
				variant="ghost"
				size="sm"
				defaultValue={[]}
				items={MANY}
				onChange={args.onChange}
			/>
		</div>
	),
};
