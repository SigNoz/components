import {
	SolidAlertTriangle,
	SolidCheckCircle2,
	SolidInfoCircle,
	SolidXCircle,
} from '@signozhq/icons';
import { Callout, type CalloutColorType, type CalloutSizeType, Typography } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type CSSProperties, Fragment, type ReactElement } from 'react';
import { expect, fireEvent, waitFor, within } from 'storybook/test';
import styles from './callout.stories.module.css';
import {
	COLORS,
	calloutArgTypes,
	calloutParameters,
	DESCRIPTION,
	SIZES,
	TITLE,
} from './shared/callout-arg-types.js';
import { waitForEffects } from './shared/play.js';

const ICONS: Record<CalloutColorType, ReactElement> = {
	primary: <SolidInfoCircle />,
	secondary: <SolidInfoCircle />,
	success: <SolidCheckCircle2 />,
	danger: <SolidXCircle />,
	warning: <SolidAlertTriangle />,
	info: <SolidInfoCircle />,
	archive: <SolidInfoCircle />,
	'highlight-danger': <SolidXCircle />,
};

const meta: Meta<typeof Callout> = {
	title: 'Primitive Components/Callout',
	component: Callout,
	parameters: {
		...calloutParameters,
		docs: {
			description: {
				component:
					'A static message with a severity: a tinted box with an icon and a description, always visible.',
			},
		},
	},
	argTypes: calloutArgTypes,
	args: {
		color: 'primary',
		size: 'md',
		icon: <SolidInfoCircle />,
		children: DESCRIPTION,
	},
};

export default meta;

type Story = StoryObj<typeof Callout>;

export const Default: Story = {
	parameters: {
		// Every state it can be driven into is covered by `CalloutShowcase`.
		chromatic: { disableSnapshot: true },
	},
};

/**
 * `hover` and `focus` cannot be reached by a snapshot on their own, so
 * `storybook-addon-pseudo-states` forces them on the controls inside the `[data-state-cell]`
 * cells. The callout itself has no hover state.
 */
const STATES = ['default', 'hover', 'focus'] as const;

type State = (typeof STATES)[number];

const CONTROLS = [
	'[data-slot="callout-toggle"]',
	'[data-slot="callout-close"]',
	'[data-slot="callout-link"]',
	'[data-slot="callout-button"]',
];

function stateSelector(state: Exclude<State, 'default'>): string[] {
	return CONTROLS.map((control) => `[data-state-cell="${state}"] ${control}`);
}

function MatrixHeader({ columns }: { columns: string[] }): ReactElement {
	return (
		<>
			<span />
			{columns.map((column) => (
				<Typography key={column} size="sm" weight="medium" className={styles.matrixLabel}>
					{column}
				</Typography>
			))}
		</>
	);
}

function matrixStyle(columns: number): CSSProperties {
	return { '--matrix-columns': columns } as CSSProperties;
}

const VARIANTS = ['callout', 'expanded', 'collapsed', 'closeable'] as const;

type Variant = (typeof VARIANTS)[number];

const VARIANT_LABELS: Record<Variant, string> = {
	callout: 'Callout',
	expanded: 'Expandable, expanded',
	collapsed: 'Expandable, collapsed',
	closeable: 'Closeable',
};

/**
 * Text on both sides of a link, so one description shows the plain text and the link of its color.
 * A callout without a link draws the same text, so it needs no cell of its own.
 */
// Short enough to fit a matrix cell at `md` in a 1200px snapshot, so no cell shows the ellipsis.
const SHORT_TITLE = 'Instrumentation';

const LINKED_DESCRIPTION = (
	<>
		Instrumentation turns your code into logs, metrics and traces. Read the{' '}
		<Callout.Link href="https://signoz.io/docs">documentation</Callout.Link> to set it up.
	</>
);

// The matrices show the close button, so a click on it keeps the callout on screen.
function keepOpen(): void {}

const ACTION = <Callout.Button>Refresh</Callout.Button>;

function VariantCell({
	variant,
	color,
	size,
}: {
	variant: Variant;
	color: CalloutColorType;
	size: CalloutSizeType;
}): ReactElement {
	const props = { color, size, icon: ICONS[color] };

	if (variant === 'callout') {
		return <Callout {...props}>{LINKED_DESCRIPTION}</Callout>;
	}

	if (variant === 'closeable') {
		return (
			<Callout.Closeable {...props} closed={false} onClose={keepOpen}>
				{LINKED_DESCRIPTION}
			</Callout.Closeable>
		);
	}

	return (
		<Callout.Expandable {...props} title={SHORT_TITLE} defaultExpanded={variant === 'expanded'}>
			{LINKED_DESCRIPTION}
		</Callout.Expandable>
	);
}

const LONG_TITLE =
	'What is instrumentation, and why does every service in this cluster need it before it can report traces?';

/**
 * Every color in every variant at both sizes, the click target of the title row, the controls in
 * each state, the empty and long content, and the scrolling description, all in one snapshot. The
 * tooltip of the truncated title is forced open by `play` so the snapshot carries it.
 */
export const CalloutShowcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false },
		pseudo: {
			hover: stateSelector('hover'),
			focusVisible: stateSelector('focus'),
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const title = canvas.getByTestId('truncated-callout-title');
		// The tooltip sits on the title row, the button around the title.
		const toggle = canvas.getByTestId('truncated-callout-toggle');

		// The tooltip only exists once the title has been measured as truncated.
		await waitFor(() => expect(title).toHaveAttribute('data-truncated'));
		await waitForEffects();

		fireEvent.pointerEnter(toggle);
		fireEvent.mouseEnter(toggle);
		fireEvent.mouseMove(toggle);

		await waitFor(() =>
			expect(within(document.body).getByRole('tooltip')).toHaveTextContent(LONG_TITLE),
		);
	},
	argTypes: {
		children: { control: false },
		color: { control: false },
		size: { control: false },
	},
	render: () => (
		<div className={`story-container-full ${styles.columnLayout}`}>
			<div className="story-section">
				<Typography size="base" weight="semibold">
					Variants
				</Typography>
				<Typography size="sm">
					Every color in every variant, once per size. Each description holds a{' '}
					<code>Callout.Link</code>, and a collapsed callout hides it with the description.
				</Typography>
				<div
					className={`${styles.matrix} ${styles.marginTopMedium}`}
					style={matrixStyle(VARIANTS.length)}
				>
					<MatrixHeader columns={VARIANTS.map((variant) => VARIANT_LABELS[variant])} />
					{SIZES.map((size) => (
						<Fragment key={size}>
							<Typography size="sm" weight="semibold" className={styles.matrixGroup}>
								{size}
							</Typography>
							{COLORS.map((color) => (
								<Fragment key={color}>
									<Typography size="sm" weight="medium" className={styles.matrixLabel}>
										{color}
									</Typography>
									{VARIANTS.map((variant) => (
										<VariantCell key={variant} variant={variant} color={color} size={size} />
									))}
								</Fragment>
							))}
						</Fragment>
					))}
				</div>
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					Action
				</Typography>
				<Typography size="sm">
					<code>Callout.Action</code> in every color at both sizes, with a{' '}
					<code>Callout.Button</code> in the color of the callout. The action sits where the close
					button does, centered on the first line of the description, and leaves the height of the
					callout alone.
				</Typography>
				<div
					className={`${styles.matrix} ${styles.marginTopMedium}`}
					style={matrixStyle(SIZES.length)}
				>
					<MatrixHeader columns={SIZES} />
					{COLORS.map((color) => (
						<Fragment key={color}>
							<Typography size="sm" weight="medium" className={styles.matrixLabel}>
								{color}
							</Typography>
							{SIZES.map((size) => (
								<Callout.Action
									key={size}
									color={color}
									size={size}
									icon={ICONS[color]}
									action={ACTION}
								>
									{LINKED_DESCRIPTION}
								</Callout.Action>
							))}
						</Fragment>
					))}
				</div>
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					Title hit area
				</Typography>
				<Typography size="sm">
					The tint marks the title row of <code>Callout.Expandable</code>, the one button that
					toggles it. It spans the row with the chevron, and the description is outside it.
				</Typography>
				<div
					className={`${styles.matrix} ${styles.hitArea} ${styles.marginTopMedium}`}
					style={matrixStyle(SIZES.length)}
				>
					<MatrixHeader columns={SIZES} />
					<Typography size="sm" weight="medium" className={styles.matrixLabel}>
						expandable
					</Typography>
					{SIZES.map((size) => (
						<VariantCell key={size} variant="expanded" color="primary" size={size} />
					))}
				</div>
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					States
				</Typography>
				<Typography size="sm">
					The title row, the close button, the button of an action and the link in each state.{' '}
					<code>hover</code> and <code>focus</code> are forced by{' '}
					<code>storybook-addon-pseudo-states</code>.
				</Typography>
				<div
					className={`${styles.matrix} ${styles.marginTopMedium}`}
					style={matrixStyle(STATES.length)}
				>
					<MatrixHeader columns={[...STATES]} />
					<Typography size="sm" weight="medium" className={styles.matrixLabel}>
						expandable
					</Typography>
					{STATES.map((state) => (
						<div key={state} data-state-cell={state}>
							<Callout.Expandable
								color="primary"
								size="sm"
								icon={<SolidInfoCircle />}
								title={TITLE}
								defaultExpanded
							>
								Read the <Callout.Link href="https://signoz.io/docs">documentation</Callout.Link>.
							</Callout.Expandable>
						</div>
					))}
					<Typography size="sm" weight="medium" className={styles.matrixLabel}>
						closeable
					</Typography>
					{STATES.map((state) => (
						<div key={state} data-state-cell={state}>
							<Callout.Closeable
								color="warning"
								size="sm"
								icon={<SolidAlertTriangle />}
								closed={false}
								onClose={keepOpen}
							>
								Your trial ends in 3 days.
							</Callout.Closeable>
						</div>
					))}
					<Typography size="sm" weight="medium" className={styles.matrixLabel}>
						action
					</Typography>
					{STATES.map((state) => (
						<div key={state} data-state-cell={state}>
							<Callout.Action
								color="warning"
								size="sm"
								icon={<SolidAlertTriangle />}
								action={ACTION}
							>
								New data is available for this view.
							</Callout.Action>
						</div>
					))}
				</div>
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					Empty and long content
				</Typography>
				<Typography size="sm">
					An empty <code>Callout</code> renders nothing. <code>Callout.Expandable</code> shows
					placeholders instead, and truncates a long title with a tooltip.
				</Typography>
				<div className={`${styles.stack} ${styles.marginTopMedium}`}>
					<Callout.Expandable
						color="danger"
						size="sm"
						icon={<SolidXCircle />}
						title=""
						defaultExpanded
					>
						{''}
					</Callout.Expandable>
					<Callout.Expandable
						color="primary"
						size="sm"
						icon={<SolidInfoCircle />}
						title={LONG_TITLE}
						defaultExpanded={false}
						testId="truncated-callout"
					>
						{DESCRIPTION}
					</Callout.Expandable>
					<Callout color="primary" size="sm" icon={<SolidInfoCircle />}>
						{`A description with a word that cannot wrap: ${'instrumentation'.repeat(8)}.`}
					</Callout>
				</div>
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					Overflow
				</Typography>
				<Typography size="sm">
					In a parent with no height left, the description scrolls and the icon stays pinned.
				</Typography>
				<div className={`${styles.constrained} ${styles.marginTopMedium}`}>
					<Callout color="success" size="sm" icon={<SolidCheckCircle2 />}>
						{DESCRIPTION}
					</Callout>
				</div>
			</div>
		</div>
	),
};
