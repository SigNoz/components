import { ConciergeBell, CreditCard, SolidXCircle, TriangleAlert } from '@signozhq/icons';
import { AlertStrip, type AlertStripColorType, Typography } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Fragment, type ReactElement } from 'react';
import { allModes } from '../.storybook/modes.js';
import styles from './alert-strip.stories.module.css';
import {
	alertStripArgTypes,
	alertStripParameters,
	COLORS,
	MESSAGE,
	SIDES,
} from './shared/alert-strip-arg-types.js';

const meta: Meta<typeof AlertStrip> = {
	title: 'Primitive Components/AlertStrip',
	component: AlertStrip,
	parameters: {
		...alertStripParameters,
		docs: {
			description: {
				component:
					'A full-width strip for a state of the account or the instance that holds until someone fixes it.',
			},
		},
	},
	argTypes: alertStripArgTypes,
	args: {
		color: 'primary',
		side: 'bottom',
		children: MESSAGE,
		suffix: <AlertStrip.Button prefix={<ConciergeBell />}>Get Expert Assistance</AlertStrip.Button>,
	},
};

export default meta;

type Story = StoryObj<typeof AlertStrip>;

export const Default: Story = {
	parameters: {
		// Every state it can be driven into is covered by `AlertStripShowcase`.
		chromatic: { disableSnapshot: true },
	},
};

/**
 * `hover` and `focus` cannot be reached by a snapshot on their own, so
 * `storybook-addon-pseudo-states` forces them on the controls inside the `[data-state-cell]`
 * cells. The strip itself has no hover state.
 */
const STATES = ['default', 'hover', 'focus'] as const;

const CONTROLS = [
	'[data-slot="alert-strip-close"]',
	'[data-slot="alert-strip-link"]',
	'[data-slot="alert-strip-button"]',
];

function stateSelector(state: Exclude<(typeof STATES)[number], 'default'>): string[] {
	return CONTROLS.map((control) => `[data-state-cell="${state}"] ${control}`);
}

// The showcase draws the close button, so a click on it keeps the strip on screen.
function keepOpen(): void {}

function ColorStrips({ color }: { color: AlertStripColorType }): ReactElement {
	return (
		<div className={styles.stack}>
			<AlertStrip.Closeable
				color={color}
				side="bottom"
				closed={false}
				onClose={keepOpen}
				suffix={
					<AlertStrip.Button prefix={<ConciergeBell />}>Get Expert Assistance</AlertStrip.Button>
				}
			>
				{MESSAGE}
			</AlertStrip.Closeable>
			<AlertStrip color={color} side="bottom">
				Your trial ends in 3 days. <AlertStrip.Link href="#billing">Upgrade</AlertStrip.Link> to
				keep your data.
			</AlertStrip>
		</div>
	);
}

/**
 * Every color with a button in the suffix and a close button, and with a link inside the sentence,
 * the controls in each state, a prefix and several actions, long content, a narrow parent and the
 * strips the app shows today, all in one snapshot.
 */
export const AlertStripShowcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		pseudo: {
			hover: stateSelector('hover'),
			focusVisible: stateSelector('focus'),
		},
	},
	argTypes: {
		children: { control: false },
		color: { control: false },
		side: { control: false },
		prefix: { control: false },
		suffix: { control: false },
	},
	render: () => (
		<div className={`story-container-full ${styles.columnLayout}`}>
			<div className="story-section">
				<Typography size="base" weight="semibold">
					Colors
				</Typography>
				<Typography size="sm">
					Every color, once as <code>AlertStrip.Closeable</code> with an{' '}
					<code>AlertStrip.Button</code> in <code>suffix</code>, as Figma draws it, and once as a
					plain strip with an <code>AlertStrip.Link</code> inside the sentence.
				</Typography>
				<div className={styles.matrix}>
					{COLORS.map((color) => (
						<Fragment key={color}>
							<Typography size="sm" weight="medium" className={styles.matrixLabel}>
								{color}
							</Typography>
							<ColorStrips color={color} />
						</Fragment>
					))}
				</div>
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					States
				</Typography>
				<Typography size="sm">
					The button, the link and the close button in each state. <code>hover</code> and{' '}
					<code>focus</code> are forced by <code>storybook-addon-pseudo-states</code>. The button is
					shown loading and disabled too.
				</Typography>
				<div className={styles.matrix}>
					{STATES.map((state) => (
						<Fragment key={state}>
							<Typography size="sm" weight="medium" className={styles.matrixLabel}>
								{state}
							</Typography>
							<div data-state-cell={state}>
								<AlertStrip.Closeable
									color="primary"
									side="bottom"
									closed={false}
									onClose={keepOpen}
									suffix={
										<AlertStrip.Button prefix={<ConciergeBell />}>
											Get Expert Assistance
										</AlertStrip.Button>
									}
								>
									Read the <AlertStrip.Link href="#docs">setup guide</AlertStrip.Link>.
								</AlertStrip.Closeable>
							</div>
						</Fragment>
					))}
					<Typography size="sm" weight="medium" className={styles.matrixLabel}>
						loading
					</Typography>
					<AlertStrip
						color="danger"
						side="bottom"
						suffix={
							<AlertStrip.Button prefix={<CreditCard />} loading>
								Pay the bill
							</AlertStrip.Button>
						}
					>
						Your payment failed.
					</AlertStrip>
					<Typography size="sm" weight="medium" className={styles.matrixLabel}>
						disabled
					</Typography>
					<AlertStrip
						color="danger"
						side="bottom"
						suffix={
							<AlertStrip.Button
								prefix={<CreditCard />}
								disabled
								disabledTooltip="Only an admin can pay the bill."
							>
								Pay the bill
							</AlertStrip.Button>
						}
					>
						Your payment failed.
					</AlertStrip>
				</div>
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					Prefix and suffix
				</Typography>
				<Typography size="sm">
					<code>prefix</code> sits before the message, here an outline icon and a{' '}
					<code>Solid*</code> icon, which the strip sizes and paints. <code>suffix</code> sits at
					the end of the region, before the close button, and takes several actions.
				</Typography>
				<div className={styles.stack}>
					<AlertStrip.Closeable
						color="warning"
						side="bottom"
						closed={false}
						onClose={keepOpen}
						prefix={<TriangleAlert aria-hidden="true" />}
						suffix={
							<>
								<AlertStrip.Link href="#plans">Compare plans</AlertStrip.Link>
								<AlertStrip.Button>Upgrade</AlertStrip.Button>
							</>
						}
					>
						Warning: your trial ends in 3 days.
					</AlertStrip.Closeable>
					<AlertStrip
						color="danger"
						side="bottom"
						prefix={<SolidXCircle aria-hidden="true" />}
						suffix={<AlertStrip.Button prefix={<CreditCard />}>Pay the bill</AlertStrip.Button>}
					>
						Danger: your last payment failed.
					</AlertStrip>
				</div>
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					Long content and a narrow parent
				</Typography>
				<Typography size="sm">
					Long content wraps to a second line and the strip grows, with the tapered ends stretched
					to its height, while the suffix keeps its width. A word that cannot wrap breaks. In a
					narrow parent the region shrinks with it.
				</Typography>
				<div className={styles.stack}>
					<AlertStrip.Closeable
						color="warning"
						side="bottom"
						closed={false}
						onClose={keepOpen}
						suffix={<AlertStrip.Button>Raise the limit</AlertStrip.Button>}
					>
						Your workspace is over its ingestion quota for this month, so new logs, traces and
						metrics are dropped until the quota resets on 1 November, 2026, or until you raise the
						limit.
					</AlertStrip.Closeable>
					<AlertStrip color="info" side="bottom">
						{`A message with a word that cannot wrap: ${'instrumentation'.repeat(12)}.`}
					</AlertStrip>
					<div className={styles.narrow}>
						<AlertStrip.Closeable
							color="primary"
							side="bottom"
							closed={false}
							onClose={keepOpen}
							suffix={<AlertStrip.Button prefix={<ConciergeBell />}>Get help</AlertStrip.Button>}
						>
							{MESSAGE}
						</AlertStrip.Closeable>
					</div>
				</div>
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					Placement
				</Typography>
				<Typography size="sm">
					The strip renders in normal flow, so it pushes the page aside. <code>side</code> names the
					edge of the page it sits on: the bar runs along that edge and the region rises from it.
					Figma shows it on the bottom edge, and where it renders is the call of the consumer.
				</Typography>
				<div className={styles.matrix}>
					{SIDES.map((side) => (
						<Fragment key={side}>
							<Typography size="sm" weight="medium" className={styles.matrixLabel}>
								{side}
							</Typography>
							<div className={styles.page}>
								{side === 'bottom' && <div className={styles.pageContent} />}
								<AlertStrip.Closeable
									color="primary"
									side={side}
									closed={false}
									onClose={keepOpen}
									suffix={
										<AlertStrip.Button prefix={<ConciergeBell />}>
											Get Expert Assistance
										</AlertStrip.Button>
									}
								>
									{MESSAGE}
								</AlertStrip.Closeable>
								{side === 'top' && <div className={styles.pageContent} />}
							</div>
						</Fragment>
					))}
				</div>
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					Strips in the app
				</Typography>
				<Typography size="sm">
					The strips SigNoz shows today, rebuilt on <code>AlertStrip</code>.
				</Typography>
				<div className={styles.stack}>
					<AlertStrip color="warning" side="bottom">
						Warning: your trial ends on 14 October, 2026.{' '}
						<AlertStrip.Link href="#billing">Upgrade</AlertStrip.Link> to keep your data.
					</AlertStrip>
					<AlertStrip color="danger" side="bottom">
						Danger: your last payment failed.{' '}
						<AlertStrip.Link href="#billing">Pay the bill</AlertStrip.Link> to keep your workspace.
					</AlertStrip>
					<AlertStrip color="danger" side="bottom">
						Danger: your workspace is restricted. Contact{' '}
						<AlertStrip.Link href="mailto:cloud-support@signoz.io">
							cloud-support@signoz.io
						</AlertStrip.Link>{' '}
						or read the{' '}
						<AlertStrip.Link href="https://signoz.io/terms-of-service" target="_blank">
							terms of service
						</AlertStrip.Link>
						.
					</AlertStrip>
					<AlertStrip.Closeable color="warning" side="bottom" closed={false} onClose={keepOpen}>
						Warning: you are in impersonation mode.{' '}
						<AlertStrip.Link href="#docs">Learn more</AlertStrip.Link>
					</AlertStrip.Closeable>
				</div>
			</div>
		</div>
	),
};
