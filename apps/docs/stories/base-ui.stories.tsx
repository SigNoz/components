import {
	Avatar,
	Badge,
	Button,
	Checkbox,
	Divider,
	Kbd,
	PopoverSimple,
	Progress,
	RadioGroup,
	RadioGroupItem,
	Slider,
	Switch,
	Tabs,
	Toggle,
	ToggleGroup,
	ToggleGroupItem,
	TooltipProvider,
	TooltipSimple,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from './base-ui.stories.module.css';

/**
 * Tracking section for the Radix UI → Base UI replacement. Every component
 * whose primitive has been swapped shows up here as a live example, so the
 * migration can be eyeballed in one place instead of hunting through the
 * per-component sections.
 */
const meta: Meta = {
	title: 'Base UI/Migration',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Status of the Radix UI → Base UI replacement, now complete: no component imports `@radix-ui/*` and the dependency is gone from the package. The remaining rows are backed by something other than a Base UI primitive — cmdk, our own Popover, or hand-rolled markup.',
			},
		},
	},
};

export default meta;

type Status = 'baseui' | 'radix' | 'opportunity' | 'custom';

interface Row {
	component: string;
	loc: number;
	backedBy: string;
	status: Status;
	/** Base UI primitive that could back this component, or '—' if none exists. */
	primitive: string;
	note: string;
}

/** Every component in the package. Kept in sync by hand as each one lands. */
const ROWS: Row[] = [
	{
		component: 'avatar',
		loc: 137,
		backedBy: 'Avatar.Root/Image/Fallback',
		status: 'baseui',
		primitive: '—',
		note: 'Image only swaps in once loaded, so a broken src no longer flashes.',
	},
	{
		component: 'badge',
		loc: 232,
		backedBy: 'useRender',
		status: 'baseui',
		primitive: '—',
		note: 'asChild reimplemented on useRender; public prop unchanged.',
	},
	{
		component: 'button',
		loc: 515,
		backedBy: 'useRender',
		status: 'baseui',
		primitive: '—',
		note: 'asChild reimplemented on useRender.',
	},
	{
		component: 'checkbox',
		loc: 163,
		backedBy: 'Checkbox.Root/Indicator',
		status: 'baseui',
		primitive: '—',
		note: 'CheckedState union preserved over checked + indeterminate.',
	},
	{
		component: 'divider',
		loc: 67,
		backedBy: 'Separator',
		status: 'baseui',
		primitive: '—',
		note: 'Childless form is a real Separator; the labelled form stays a plain element.',
	},
	{
		component: 'kbd',
		loc: 88,
		backedBy: 'useRender',
		status: 'baseui',
		primitive: '—',
		note: 'asChild reimplemented on useRender.',
	},
	{
		component: 'progress',
		loc: 184,
		backedBy: 'Progress.Root/Track/Indicator',
		status: 'baseui',
		primitive: '—',
		note: 'Gained a Track part; the indicator is width-positioned.',
	},
	{
		component: 'radio-group',
		loc: 267,
		backedBy: 'RadioGroup + Radio',
		status: 'baseui',
		primitive: '—',
		note: 'Two namespaces. `loop` has no equivalent and is dropped.',
	},
	{
		component: 'slider',
		loc: 478,
		backedBy: 'Slider Root/Control/Track/Indicator/Thumb',
		status: 'baseui',
		primitive: '—',
		note: 'The slider role now sits on a native input[type=range].',
	},
	{
		component: 'switch',
		loc: 217,
		backedBy: 'Switch.Root/Thumb',
		status: 'baseui',
		primitive: '—',
		note: 'Root is a span + hidden input; `id` moves to the input.',
	},
	{
		component: 'tabs',
		loc: 758,
		backedBy: 'Tabs Root/List/Tab/Panel/Indicator',
		status: 'baseui',
		primitive: '—',
		note: 'The data-state MutationObserver underline is now Tabs.Indicator.',
	},
	{
		component: 'toggle',
		loc: 149,
		backedBy: 'Toggle',
		status: 'baseui',
		primitive: '—',
		note: 'data-state="on" became data-pressed.',
	},
	{
		component: 'toggle-group',
		loc: 391,
		backedBy: 'ToggleGroup + Toggle',
		status: 'baseui',
		primitive: '—',
		note: 'type=single/multiple became a `multiple` flag; items are pressed toggles.',
	},
	{
		component: 'combobox',
		loc: 2209,
		backedBy: 'our Popover + cmdk',
		status: 'opportunity',
		primitive: 'combobox',
		note: 'Popover layer moved with popover; cmdk and the custom virtualiser are what remain.',
	},
	{
		component: 'dialog',
		loc: 1732,
		backedBy: 'Dialog.Root/Portal/Backdrop/Popup + motion',
		status: 'baseui',
		primitive: '—',
		note: 'motion keeps owning the animation; MotionContent now reads data-open. forceMount unhides the kept-mounted popup so the exit still plays.',
	},
	{
		component: 'dropdown-menu',
		loc: 2707,
		backedBy: 'Menu.Root/Positioner/Popup/Item',
		status: 'baseui',
		primitive: '—',
		note: 'onSelect is rebuilt on onClick + preventBaseUIHandler(). Labels fall back to a plain element outside a group, which Base UI requires.',
	},
	{
		component: 'popover',
		loc: 846,
		backedBy: 'Popover.Root/Positioner/Popup',
		status: 'baseui',
		primitive: '—',
		note: 'Anchor registers its element for the Positioner; Backdrop stands in for disableOutsidePointerEvents.',
	},
	{
		component: 'select',
		loc: 1772,
		backedBy: 'Select.Root/Positioner/Popup/List',
		status: 'baseui',
		primitive: '—',
		note: 'Native `multiple` replaced the hand-rolled toggling, so the popup now stays open across picks. Item `id` is gone — the primitive owns it for aria-activedescendant.',
	},
	{
		component: 'tooltip',
		loc: 650,
		backedBy: 'Tooltip.Root/Positioner/Popup',
		status: 'baseui',
		primitive: '—',
		note: 'Visual-only by design: no role="tooltip" and no aria-describedby on the trigger.',
	},
	{
		component: 'alert-dialog',
		loc: 82,
		backedBy: 'our DialogWrapper',
		status: 'baseui',
		primitive: 'alert-dialog',
		note: 'Rode along with the dialog swap. Adopting Base UI AlertDialog directly would upgrade the role to alertdialog.',
	},
	{
		component: 'command',
		loc: 607,
		backedBy: 'cmdk',
		status: 'opportunity',
		primitive: 'autocomplete',
		note: 'Command-palette semantics (groups, shortcuts, dialog mode) do not map cleanly.',
	},
	{
		component: 'drawer',
		loc: 846,
		backedBy: 'motion/react + our Dialog',
		status: 'baseui',
		primitive: 'drawer',
		note: 'Rode along with the dialog swap. Base UI now ships a real Drawer with swipe handling — a separate opportunity.',
	},
	{
		component: 'input',
		loc: 357,
		backedBy: 'custom',
		status: 'opportunity',
		primitive: 'input + field',
		note: 'Our prefix/suffix/container API is richer than the primitive.',
	},
	{
		component: 'input-number',
		loc: 794,
		backedBy: 'custom',
		status: 'opportunity',
		primitive: 'number-field',
		note: 'formatter/parser are arbitrary functions vs Intl options; plus a range mode.',
	},
	{
		component: 'sonner',
		loc: 40,
		backedBy: 'sonner',
		status: 'opportunity',
		primitive: 'toast',
		note: 'sonner works well; swapping it is a behaviour change, not a port.',
	},
	{
		component: 'announcement-banner',
		loc: 210,
		backedBy: 'custom',
		status: 'custom',
		primitive: '—',
		note: 'No equivalent.',
	},
	{
		component: 'breadcrumb',
		loc: 891,
		backedBy: 'custom',
		status: 'custom',
		primitive: '—',
		note: 'No equivalent. Zero tests — the least protected component in the package.',
	},
	{
		component: 'calendar',
		loc: 346,
		backedBy: 'react-day-picker',
		status: 'custom',
		primitive: '—',
		note: 'Base UI ships no calendar.',
	},
	{
		component: 'callout',
		loc: 259,
		backedBy: 'custom',
		status: 'custom',
		primitive: '—',
		note: 'No equivalent.',
	},
	{
		component: 'date-picker',
		loc: 1078,
		backedBy: 'custom + dayjs',
		status: 'custom',
		primitive: '—',
		note: 'Depends on calendar; no Base UI equivalent.',
	},
	{
		component: 'pagination',
		loc: 763,
		backedBy: 'custom',
		status: 'custom',
		primitive: '—',
		note: 'No equivalent.',
	},
	{
		component: 'pin-list',
		loc: 560,
		backedBy: 'motion/react',
		status: 'custom',
		primitive: '—',
		note: 'No equivalent.',
	},
	{
		component: 'resizable',
		loc: 404,
		backedBy: 'react-resizable-panels',
		status: 'custom',
		primitive: '—',
		note: 'No equivalent.',
	},
	{
		component: 'skeleton',
		loc: 446,
		backedBy: 'custom',
		status: 'custom',
		primitive: '—',
		note: 'No equivalent.',
	},
	{
		component: 'table',
		loc: 2276,
		backedBy: '@tanstack/react-table + virtual',
		status: 'custom',
		primitive: '—',
		note: 'No equivalent; tanstack stays.',
	},
	{
		component: 'text-ellipsis',
		loc: 412,
		backedBy: 'custom',
		status: 'custom',
		primitive: '—',
		note: 'No equivalent.',
	},
	{
		component: 'typography',
		loc: 554,
		backedBy: 'custom',
		status: 'custom',
		primitive: '—',
		note: 'Radix icon import removed; never needed a primitive.',
	},
];

const PILL: Record<Status, { className: string; label: string }> = {
	baseui: { className: styles.pillDone, label: 'Base UI' },
	radix: { className: styles.pillRadix, label: 'Radix' },
	opportunity: { className: styles.pillNext, label: 'Primitive avail.' },
	custom: { className: styles.pillLater, label: 'No primitive' },
};

function StatusTable() {
	const count = (status: Status) => ROWS.filter((r) => r.status === status).length;
	const loc = (status: Status) =>
		ROWS.filter((r) => r.status === status).reduce((sum, r) => sum + r.loc, 0);

	return (
		<div className={styles.page}>
			<div className={styles.intro}>
				<Typography.Title level={4}>Radix UI &rarr; Base UI</Typography.Title>
				<Typography.Text className={styles.caption}>
					Every component in <code className={styles.mono}>@signozhq/ui</code>, what backs it today,
					and whether Base UI ships a primitive that could. The replacement is complete — all 15
					Radix packages are gone. Rows marked &ldquo;Primitive avail.&rdquo; are not backed by a
					Base UI primitive today but could be: combobox and command got there by having their Radix
					usage removed, the rest never used Radix at all.
				</Typography.Text>
			</div>

			<div className={styles.counts}>
				<div className={styles.count}>
					<span className={styles.countValue}>{count('baseui')}</span>
					<span className={styles.countLabel}>On Base UI</span>
				</div>
				<div className={styles.count}>
					<span className={styles.countValue}>{count('radix')}</span>
					<span className={styles.countLabel}>Still on Radix</span>
				</div>
				<div className={styles.count}>
					<span className={styles.countValue}>{count('opportunity')}</span>
					<span className={styles.countLabel}>Primitive available</span>
				</div>
				<div className={styles.count}>
					<span className={styles.countValue}>{count('custom')}</span>
					<span className={styles.countLabel}>No primitive exists</span>
				</div>
				<div className={styles.count}>
					<span className={styles.countValue}>0</span>
					<span className={styles.countLabel}>Radix pkgs left of 15</span>
				</div>
				<div className={styles.count}>
					<span className={styles.countValue}>{loc('radix').toLocaleString()}</span>
					<span className={styles.countLabel}>Lines still on Radix</span>
				</div>
			</div>

			<div className={styles.scroll}>
				<table className={styles.table}>
					<thead>
						<tr>
							<th>Component</th>
							<th className={styles.num}>LOC</th>
							<th>Status</th>
							<th>Backed by today</th>
							<th>Base UI primitive</th>
							<th>Notes</th>
						</tr>
					</thead>
					<tbody>
						{ROWS.map((row) => (
							<tr key={row.component}>
								<td className={styles.mono}>{row.component}</td>
								<td className={`${styles.mono} ${styles.num}`}>{row.loc.toLocaleString()}</td>
								<td>
									<span className={`${styles.pill} ${PILL[row.status].className}`}>
										{PILL[row.status].label}
									</span>
								</td>
								<td className={styles.mono}>{row.backedBy}</td>
								<td className={styles.mono}>{row.primitive}</td>
								<td>{row.note}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<Typography.Text className={styles.caption}>
				Base UI also ships primitives for components this system does not have yet: accordion,
				collapsible, scroll-area, meter, otp-field, context-menu, menubar, navigation-menu, toolbar,
				preview-card, checkbox-group, and field / fieldset / form.
			</Typography.Text>
		</div>
	);
}

export const Status: StoryObj = {
	name: 'Status',
	render: () => <StatusTable />,
};

export const MigratedComponents: StoryObj = {
	name: 'Migrated components',
	render: () => (
		<div className={styles.page}>
			<Typography.Text className={styles.caption}>
				Every component below renders from <code className={styles.mono}>@base-ui/react</code> or
				has had its Radix dependency removed entirely. Compare against the per-component sections —
				they should be indistinguishable. Each one also has its own entry in this section, listing
				the Base UI parts it renders and what the swap changed for callers.
			</Typography.Text>

			<div className={styles.gallery}>
				<div className={styles.card}>
					<div className={styles.cardHead}>
						<span className={styles.cardTitle}>Switch</span>
						<span className={styles.cardNote}>Switch.Root / Thumb</span>
					</div>
					<div className={styles.demo}>
						<Switch defaultValue>Checked</Switch>
						<Switch>Off</Switch>
					</div>
					<div className={styles.demo}>
						<Switch color="forest" defaultValue>
							Forest
						</Switch>
						<Switch color="cherry" disabled>
							Disabled
						</Switch>
						<Switch isLoading>Loading</Switch>
					</div>
				</div>

				<div className={styles.card}>
					<div className={styles.cardHead}>
						<span className={styles.cardTitle}>Button</span>
						<span className={styles.cardNote}>useRender</span>
					</div>
					<div className={styles.demo}>
						<Button>Solid</Button>
						<Button variant="outlined">Outlined</Button>
						<Button variant="ghost">Ghost</Button>
					</div>
					<div className={styles.demo}>
						<Button loading>Loading</Button>
						<Button disabled>Disabled</Button>
					</div>
				</div>

				<div className={styles.card}>
					<div className={styles.cardHead}>
						<span className={styles.cardTitle}>Badge</span>
						<span className={styles.cardNote}>useRender</span>
					</div>
					<div className={styles.demo}>
						<Badge>Default</Badge>
						<Badge color="forest">Healthy</Badge>
						<Badge color="cherry">Critical</Badge>
						<Badge color="amber" variant="outline">
							Warning
						</Badge>
					</div>
				</div>

				<div className={styles.card}>
					<div className={styles.cardHead}>
						<span className={styles.cardTitle}>Kbd</span>
						<span className={styles.cardNote}>useRender</span>
					</div>
					<div className={styles.demo}>
						<Kbd size="sm">⌘</Kbd>
						<Kbd>K</Kbd>
						<Kbd size="lg">Enter</Kbd>
						<Kbd active>Esc</Kbd>
					</div>
				</div>

				<div className={styles.card}>
					<div className={styles.cardHead}>
						<span className={styles.cardTitle}>Typography</span>
						<span className={styles.cardNote}>icons only</span>
					</div>
					<div className={styles.demo}>
						<Typography.Text copyable>Copy me — icon comes from @signozhq/icons</Typography.Text>
					</div>
				</div>

				<div className={styles.card}>
					<div className={styles.cardHead}>
						<span className={styles.cardTitle}>Checkbox</span>
						<span className={styles.cardNote}>Checkbox.Root / Indicator</span>
					</div>
					<div className={styles.demo}>
						<Checkbox defaultValue>Checked</Checkbox>
						<Checkbox>Off</Checkbox>
						<Checkbox value="indeterminate">Mixed</Checkbox>
					</div>
				</div>

				<div className={styles.card}>
					<div className={styles.cardHead}>
						<span className={styles.cardTitle}>Radio Group</span>
						<span className={styles.cardNote}>RadioGroup + Radio</span>
					</div>
					<div className={styles.demo}>
						<RadioGroup defaultValue="logs">
							<RadioGroupItem value="logs">Logs</RadioGroupItem>
							<RadioGroupItem value="traces">Traces</RadioGroupItem>
						</RadioGroup>
					</div>
				</div>

				<div className={styles.card}>
					<div className={styles.cardHead}>
						<span className={styles.cardTitle}>Toggle / Toggle Group</span>
						<span className={styles.cardNote}>Toggle, ToggleGroup</span>
					</div>
					<div className={styles.demo}>
						<Toggle defaultValue>Bold</Toggle>
						<ToggleGroup type="single" defaultValue="logs">
							<ToggleGroupItem value="logs">Logs</ToggleGroupItem>
							<ToggleGroupItem value="traces">Traces</ToggleGroupItem>
						</ToggleGroup>
					</div>
				</div>

				<div className={styles.card}>
					<div className={styles.cardHead}>
						<span className={styles.cardTitle}>Progress</span>
						<span className={styles.cardNote}>Root / Track / Indicator</span>
					</div>
					<div className={styles.demo} style={{ display: 'block' }}>
						<Progress percent={45} showInfo />
						<Progress percent={85} steps={4} />
					</div>
				</div>

				<div className={styles.card}>
					<div className={styles.cardHead}>
						<span className={styles.cardTitle}>Slider</span>
						<span className={styles.cardNote}>Root / Control / Track / Thumb</span>
					</div>
					<div className={styles.demo} style={{ display: 'block' }}>
						<Slider defaultValue={40} />
						<Slider defaultValue={[20, 70]} range />
					</div>
				</div>

				<div className={styles.card}>
					<div className={styles.cardHead}>
						<span className={styles.cardTitle}>Avatar</span>
						<span className={styles.cardNote}>Root / Image / Fallback</span>
					</div>
					<div className={styles.demo}>
						<Avatar>YM</Avatar>
						<Avatar color="forest">AB</Avatar>
						<Avatar shape="square" color="amber">
							CD
						</Avatar>
						<Avatar src="https://broken.invalid/x.png" color="cherry">
							EF
						</Avatar>
					</div>
				</div>

				<div className={styles.card}>
					<div className={styles.cardHead}>
						<span className={styles.cardTitle}>Divider</span>
						<span className={styles.cardNote}>Separator</span>
					</div>
					<div className={styles.demo} style={{ display: 'block' }}>
						<Divider />
						<Divider dashed />
						<Divider>OR</Divider>
					</div>
				</div>

				<div className={styles.card}>
					<div className={styles.cardHead}>
						<span className={styles.cardTitle}>Tooltip</span>
						<span className={styles.cardNote}>Root / Positioner / Popup / Arrow</span>
					</div>
					<div className={styles.demo}>
						<TooltipProvider delayDuration={0}>
							<TooltipSimple title="Positioned by Base UI" arrow>
								<Button>Hover me</Button>
							</TooltipSimple>
							<TooltipSimple title="On the right" side="right">
								<Button>Right side</Button>
							</TooltipSimple>
						</TooltipProvider>
					</div>
				</div>

				<div className={styles.card}>
					<div className={styles.cardHead}>
						<span className={styles.cardTitle}>Popover</span>
						<span className={styles.cardNote}>Root / Positioner / Popup / Arrow</span>
					</div>
					<div className={styles.demo}>
						<PopoverSimple trigger={<Button>Open popover</Button>} arrow>
							<Typography.Text>Anchored to the trigger.</Typography.Text>
						</PopoverSimple>
						<PopoverSimple trigger={<Button>Aligned start</Button>} side="bottom" align="start">
							<Typography.Text>Side and align still read the same.</Typography.Text>
						</PopoverSimple>
					</div>
				</div>

				<div className={styles.card} style={{ gridColumn: '1 / -1' }}>
					<div className={styles.cardHead}>
						<span className={styles.cardTitle}>Tabs</span>
						<span className={styles.cardNote}>Root / List / Tab / Panel / Indicator</span>
					</div>
					<div className={styles.demo} style={{ display: 'block' }}>
						<Tabs
							items={[
								{ key: 'logs', label: 'Logs', children: 'Logs panel' },
								{ key: 'traces', label: 'Traces', children: 'Traces panel' },
								{ key: 'metrics', label: 'Metrics', children: 'Metrics panel' },
							]}
						/>
					</div>
				</div>
			</div>
		</div>
	),
};

export const AsChildContract: StoryObj = {
	name: 'asChild contract',
	render: () => (
		<div className={styles.page}>
			<Typography.Text className={styles.caption}>
				The public <code className={styles.mono}>asChild</code> prop is unchanged, but it now runs
				on Base UI&apos;s <code className={styles.mono}>useRender</code> instead of Radix&apos;s{' '}
				<code className={styles.mono}>Slot</code>. The child becomes the rendered element, our props
				merge onto it, <code className={styles.mono}>className</code> is joined rather than
				replaced, and event handlers from both sides run.
			</Typography.Text>

			<div className={styles.gallery}>
				<div className={styles.card}>
					<div className={styles.cardHead}>
						<span className={styles.cardTitle}>Button as anchor</span>
						<span className={styles.cardNote}>renders &lt;a&gt;</span>
					</div>
					<div className={styles.demo}>
						<Button asChild>
							<a href="https://signoz.io" target="_blank" rel="noreferrer">
								Open SigNoz
							</a>
						</Button>
					</div>
				</div>

				<div className={styles.card}>
					<div className={styles.cardHead}>
						<span className={styles.cardTitle}>Badge as anchor</span>
						<span className={styles.cardNote}>renders &lt;a&gt;</span>
					</div>
					<div className={styles.demo}>
						<Badge asChild color="forest">
							<a href="https://signoz.io" target="_blank" rel="noreferrer">
								Linked badge
							</a>
						</Badge>
					</div>
				</div>

				<div className={styles.card}>
					<div className={styles.cardHead}>
						<span className={styles.cardTitle}>Kbd as span</span>
						<span className={styles.cardNote}>renders &lt;span&gt;</span>
					</div>
					<div className={styles.demo}>
						<Kbd asChild active>
							<span title="rendered as a span">⌘K</span>
						</Kbd>
					</div>
				</div>
			</div>
		</div>
	),
};
