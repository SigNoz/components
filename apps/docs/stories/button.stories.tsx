import { Check, ChevronLeft, ChevronRight, Code, Star, Trash } from '@signozhq/icons';
import {
	Button,
	ButtonColor,
	type ButtonProps,
	ButtonSize,
	ButtonTextOverflow,
	ButtonVariant,
	type SizeType,
	Tooltip,
	TooltipProvider,
	type VariantColorType,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type CSSProperties, Fragment, type ReactElement, useEffect, useState } from 'react';
import { expect, fireEvent, fn, waitFor, within } from 'storybook/test';
import styles from './button.stories.module.css';
import {
	buttonArgTypes,
	COLORS,
	MULTI_COLOR_VARIANTS,
	resolveVariantColor,
	SECONDARY_ONLY_VARIANTS,
	VARIANTS,
} from './shared/button-arg-types.js';

const meta: Meta<typeof Button> = {
	title: 'Primitive Components/Button',
	component: Button,
	decorators: [],
	args: {
		onClick: fn(),
		onDoubleClick: fn(),
		variant: ButtonVariant.Solid,
		size: ButtonSize.MD,
		loading: false,
		disabled: false,
		type: 'button',
	},
	argTypes: buttonArgTypes,
	parameters: {
		layout: 'fullscreen',
		backgrounds: {
			disable: true,
		},
		controls: { disable: false },
		docs: {
			source: {
				type: 'code',
			},
		},
		design: {
			type: 'figma',
			url: 'https://www.figma.com/design/eyORbfrXMWCz9w0xEFdgWe/Periscope-%E2%80%93-Primitives-v2?node-id=12-739&p=f&m=dev',
		},
		test: { dangerouslyIgnoreUnhandledErrors: true },
	},
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
	parameters: {
		docs: { story: { autoplay: true } },
		// Playground: every state it can be driven into is covered by `ButtonShowcase`.
		chromatic: { disableSnapshot: true },
	},
	argTypes: {
		prefix: {
			control: 'select',
			options: ['chevron-left', 'chevron-right', 'star', 'code'],
			description:
				'The prefix for the button, will be displayed before the button text, can be anything such as an icon or a text. For this playground, the only options are icons.',
			table: {
				category: 'Content',
				type: { summary: 'React.ReactElement' },
			},
		},
		suffix: {
			control: 'select',
			options: ['trash', 'check', 'star', 'code'],
			description:
				'The suffix for the button, will be displayed after the button text, can be anything such as an icon or a text. For this playground, the only options are icons.',
			table: {
				category: 'Content',
				type: { summary: 'React.ReactElement' },
			},
		},
	},
	render: ({ prefix, suffix, ...args }) => {
		switch (prefix?.toString()) {
			case 'chevron-left':
				prefix = <ChevronLeft />;
				break;
			case 'chevron-right':
				prefix = <ChevronRight />;
				break;
			case 'star':
				prefix = <Star />;
				break;
			case 'code':
				prefix = <Code />;
				break;
			default:
				prefix = undefined;
				break;
		}

		switch (suffix?.toString()) {
			case 'trash':
				suffix = <Trash />;
				break;
			case 'check':
				suffix = <Check />;
				break;
			case 'star':
				suffix = <Star />;
				break;
			case 'code':
				suffix = <Code />;
				break;
			default:
				suffix = undefined;
				break;
		}

		// outlined/dashed/ghost only accept `secondary`, so the free color control is clamped here.
		// `icon` is dropped because this playground drives the prefix/suffix slots instead.
		const { variant, color, icon: _icon, ...rest } = args;

		return (
			<Button
				testId="default-button"
				prefix={prefix}
				suffix={suffix}
				{...rest}
				{...resolveVariantColor(variant, color)}
			>
				Click Me
			</Button>
		);
	},
};

const DISABLED_REASON = 'You need write access to edit alerts';
const LOADING_REASON = 'Deleting the rules, this can take a minute';
const NESTED_TOOLTIP_TITLE = 'Removes every rule, cannot be undone';
const LONG_LABEL = 'Delete every alert rule in this workspace';
const CONSTRAINED_WIDTH = '12rem';

/**
 * The columns of both matrices below. `hover`, `focus` and `active` cannot be reached by a
 * snapshot on their own, `storybook-addon-pseudo-states` forces them through the
 * `[data-pseudo]` selectors in the story parameters.
 */
const STATES = ['default', 'hover', 'focus', 'active', 'disabled', 'loading'] as const;

type State = (typeof STATES)[number];

type StateProps = {
	disabled?: boolean;
	disabledTooltip?: string;
	loading?: boolean;
	'data-pseudo'?: State;
};

function stateProps(state: State): StateProps {
	switch (state) {
		case 'default':
			return {};
		case 'disabled':
			return { disabled: true, disabledTooltip: DISABLED_REASON };
		case 'loading':
			return { loading: true };
		default:
			return { 'data-pseudo': state };
	}
}

/**
 * Every pair the types allow: any color for solid/link, `secondary` only for the other three.
 */
const VARIANT_COLORS: VariantColorType[] = [
	...MULTI_COLOR_VARIANTS.flatMap((variant) =>
		COLORS.map((color) => resolveVariantColor(variant, color)),
	),
	...SECONDARY_ONLY_VARIANTS.map((variant) => resolveVariantColor(variant)),
];

type Composition = {
	id: string;
	label: string;
	prefix?: ReactElement;
	suffix?: ReactElement;
	icon?: true;
};

const COMPOSITIONS: Composition[] = [
	{ id: 'label', label: 'label only' },
	{ id: 'prefix', label: 'prefix', prefix: <Star /> },
	{ id: 'suffix', label: 'suffix', suffix: <Check /> },
	{ id: 'affixes', label: 'prefix + suffix', prefix: <Star />, suffix: <Check /> },
	{ id: 'icon', label: 'icon only', icon: true },
];

const COMPOSITION_STATES: { label: string; size: SizeType; state: State }[] = [
	{ label: 'sm', size: ButtonSize.SM, state: 'default' },
	{ label: 'md', size: ButtonSize.MD, state: 'default' },
	{ label: 'sm hover', size: ButtonSize.SM, state: 'hover' },
	{ label: 'md loading', size: ButtonSize.MD, state: 'loading' },
	{ label: 'md disabled', size: ButtonSize.MD, state: 'disabled' },
];

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

/**
 * One button per variant/color pair in a single state.
 */
function StateCell({
	variantColor,
	state,
}: {
	variantColor: VariantColorType;
	state: State;
}): ReactElement {
	return (
		<Button {...variantColor} size={ButtonSize.MD} prefix={<Star />} {...stateProps(state)}>
			Button
		</Button>
	);
}

/**
 * One button per prefix/suffix/icon composition in a single size + state.
 */
function CompositionCell({
	composition,
	size,
	state,
}: {
	composition: Composition;
	size: SizeType;
	state: State;
}): ReactElement {
	const props = stateProps(state);

	if (composition.icon === true) {
		return (
			<Button
				variant={ButtonVariant.Solid}
				color={ButtonColor.Primary}
				size={size}
				icon
				aria-label={`icon only, ${size} ${state}`}
				{...props}
			>
				<Code />
			</Button>
		);
	}

	return (
		<Button
			variant={ButtonVariant.Solid}
			color={ButtonColor.Primary}
			size={size}
			prefix={composition.prefix}
			suffix={composition.suffix}
			{...props}
		>
			Button
		</Button>
	);
}

/**
 * The buttons whose tooltip the `play` function opens, in the order they appear.
 */
const FORCED_TOOLTIPS = [
	'overflow-truncated',
	'overflow-disabled',
	'overflow-nested',
	'overflow-nested-disabled',
];

/**
 * Every variant, color, size, composition and state in one snapshot, with the four tooltip
 * combinations held open and every animation frozen.
 */
export const ButtonShowcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, disableAnimations: true },
		pseudo: {
			hover: '[data-pseudo="hover"]',
			focusVisible: '[data-pseudo="focus"]',
			active: '[data-pseudo="active"]',
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		for (const testId of FORCED_TOOLTIPS) {
			const trigger = canvas.getByTestId(testId);

			// Base UI opens the tooltip when the pointer enters the trigger. `userEvent.hover`
			// moves one pointer around, so each hover would close the tooltip before it, while
			// synthetic events leave all four open in the same snapshot.
			fireEvent.pointerEnter(trigger);
			fireEvent.mouseEnter(trigger);
			fireEvent.mouseMove(trigger);
		}

		await waitFor(() =>
			expect(document.querySelectorAll('[data-slot="tooltip-content"]')).toHaveLength(
				FORCED_TOOLTIPS.length,
			),
		);
	},
	// `story-freeze-animations`: the dashed border marches on hover, the ghost glow shimmers
	// while active and the spinner never stops, so the snapshot would catch each one mid-frame.
	render: () => (
		<div className="story-container-full story-freeze-animations">
			<div className={styles.columnLayout}>
				<div className="story-section">
					<Typography size="base" weight="semibold">
						States
					</Typography>
					<Typography size="sm">
						One row per variant/color pair the types allow, one column per state. <code>hover</code>
						, <code>focus</code> and <code>active</code> are forced by{' '}
						<code>storybook-addon-pseudo-states</code>. Only <code>ghost</code> styles{' '}
						<code>active</code>, and only <code>outlined</code> restyles <code>disabled</code> (the
						stripes), the rest carry the shared opacity.
					</Typography>
					<div
						className={`${styles.matrix} ${styles.marginTopMedium}`}
						style={matrixStyle(STATES.length)}
					>
						<MatrixHeader columns={[...STATES]} />
						{VARIANT_COLORS.map(({ variant, color }) => (
							<Fragment key={`${variant}-${color}`}>
								<Typography size="sm" weight="medium" className={styles.matrixLabel}>
									{variant} / {color}
								</Typography>
								{STATES.map((state) => (
									<StateCell
										key={state}
										variantColor={resolveVariantColor(variant, color)}
										state={state}
									/>
								))}
							</Fragment>
						))}
					</div>
				</div>
				<div className="story-section">
					<Typography size="base" weight="semibold">
						Composition
					</Typography>
					<Typography size="sm">
						The prefix/suffix/icon slots against both sizes. While loading, the spinner cross-fades
						over the prefix slot, which opens up on buttons that have no prefix, and the suffix
						stays where it is.
					</Typography>
					<div
						className={`${styles.matrix} ${styles.marginTopMedium}`}
						style={matrixStyle(COMPOSITION_STATES.length)}
					>
						<MatrixHeader columns={COMPOSITION_STATES.map(({ label }) => label)} />
						{COMPOSITIONS.map((composition) => (
							<Fragment key={composition.id}>
								<Typography size="sm" weight="medium" className={styles.matrixLabel}>
									{composition.label}
								</Typography>
								{COMPOSITION_STATES.map(({ label, size, state }) => (
									<CompositionCell
										key={label}
										composition={composition}
										size={size}
										state={state}
									/>
								))}
							</Fragment>
						))}
					</div>
				</div>
				<div className="story-section">
					<Typography size="base" weight="semibold">
						Overflow and tooltips
					</Typography>
					<Typography size="sm">
						Every button below is capped at <code>{CONSTRAINED_WIDTH}</code>. The four rows that
						have something to say are held open by the story's <code>play</code> function, so the
						snapshot carries the popups themselves, including the stacked ones.
					</Typography>
					<div className={`${styles.overflowGrid} ${styles.marginTopMedium}`}>
						<Typography size="sm" weight="medium" className={styles.matrixLabel}>
							ellipsis
						</Typography>
						<Button
							variant={ButtonVariant.Solid}
							color={ButtonColor.Primary}
							size={ButtonSize.MD}
							width={CONSTRAINED_WIDTH}
							prefix={<Trash />}
							testId="overflow-truncated"
						>
							{LONG_LABEL}
						</Button>
						<Typography size="sm">
							The default: truncates and hands the full label to a tooltip, only while it is
							actually truncated.
						</Typography>

						<Typography size="sm" weight="medium" className={styles.matrixLabel}>
							ellipsis, label fits
						</Typography>
						<Button
							variant={ButtonVariant.Solid}
							color={ButtonColor.Primary}
							size={ButtonSize.MD}
							width={CONSTRAINED_WIDTH}
							prefix={<Trash />}
							testId="overflow-fits"
						>
							Delete
						</Button>
						<Typography size="sm">
							Same mode, short label. Nothing is truncated, so there is no tooltip to open.
						</Typography>

						<Typography size="sm" weight="medium" className={styles.matrixLabel}>
							none
						</Typography>
						<Button
							variant={ButtonVariant.Solid}
							color={ButtonColor.Primary}
							size={ButtonSize.MD}
							width={CONSTRAINED_WIDTH}
							textOverflow={ButtonTextOverflow.None}
							prefix={<Trash />}
							testId="overflow-none"
						>
							{LONG_LABEL}
						</Button>
						<Typography size="sm">
							Clips the label at the button's edge, with no marker and no tooltip.
						</Typography>

						<Typography size="sm" weight="medium" className={styles.matrixLabel}>
							disabled + truncated
						</Typography>
						<Button
							variant={ButtonVariant.Solid}
							color={ButtonColor.Primary}
							size={ButtonSize.MD}
							width={CONSTRAINED_WIDTH}
							disabled
							disabledTooltip={DISABLED_REASON}
							prefix={<Trash />}
							testId="overflow-disabled"
						>
							{LONG_LABEL}
						</Button>
						<Typography size="sm">
							Two entries in one popup, the reason first and the full label under it.
						</Typography>

						<Typography size="sm" weight="medium" className={styles.matrixLabel}>
							tooltip + truncated
						</Typography>
						<TooltipProvider>
							<Tooltip title={NESTED_TOOLTIP_TITLE}>
								<Button
									variant={ButtonVariant.Solid}
									color={ButtonColor.Primary}
									size={ButtonSize.MD}
									width={CONSTRAINED_WIDTH}
									prefix={<Trash />}
									testId="overflow-nested"
								>
									{LONG_LABEL}
								</Button>
							</Tooltip>
						</TooltipProvider>
						<Typography size="sm">
							A button that is already a tooltip trigger stacks into that popup instead of opening a
							second one on the same hover: your title, then the label.
						</Typography>

						<Typography size="sm" weight="medium" className={styles.matrixLabel}>
							tooltip + disabled + truncated
						</Typography>
						<TooltipProvider>
							<Tooltip title={NESTED_TOOLTIP_TITLE}>
								<Button
									variant={ButtonVariant.Solid}
									color={ButtonColor.Primary}
									size={ButtonSize.MD}
									width={CONSTRAINED_WIDTH}
									disabled
									disabledTooltip={DISABLED_REASON}
									prefix={<Trash />}
									testId="overflow-nested-disabled"
								>
									{LONG_LABEL}
								</Button>
							</Tooltip>
						</TooltipProvider>
						<Typography size="sm">
							All three entries stack, dividers between them: title, reason, label.
						</Typography>

						<Typography size="sm" weight="medium" className={styles.matrixLabel}>
							loading + disabled + truncated
						</Typography>
						<Button
							variant={ButtonVariant.Solid}
							color={ButtonColor.Primary}
							size={ButtonSize.MD}
							width={CONSTRAINED_WIDTH}
							loading
							disabled
							disabledTooltip={DISABLED_REASON}
							prefix={<Trash />}
							testId="overflow-loading"
						>
							{LONG_LABEL}
						</Button>
						<Typography size="sm">
							The spinner already says the button is busy, so the reason is dropped. The truncated
							label still has its own tooltip.
						</Typography>

						<Typography size="sm" weight="medium" className={styles.matrixLabel}>
							loadingTooltip + disabled + truncated
						</Typography>
						<Button
							variant={ButtonVariant.Solid}
							color={ButtonColor.Primary}
							size={ButtonSize.MD}
							width={CONSTRAINED_WIDTH}
							loading
							loadingTooltip={LOADING_REASON}
							disabled
							disabledTooltip={DISABLED_REASON}
							prefix={<Trash />}
							testId="overflow-loading-tooltip"
						>
							{LONG_LABEL}
						</Button>
						<Typography size="sm">
							<code>loadingTooltip</code> takes the place of the disabled reason for as long as the
							button is loading, above the truncated label.
						</Typography>
					</div>
				</div>
			</div>
		</div>
	),
};

const LOADING_DURATION_MS = 5_000;

/**
 * Flips to `loading` for 5s on click, then back, the usual "fire a request and wait" pattern.
 */
function LoadingOnClickButton(props: ButtonProps): ReactElement {
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!loading) {
			return;
		}

		const timeout = setTimeout(() => setLoading(false), LOADING_DURATION_MS);

		return () => clearTimeout(timeout);
	}, [loading]);

	return <Button {...props} loading={loading} onClick={() => setLoading(true)} />;
}

// Loading triggered by a click. The only story that keeps its animations: the point is the
// spinner cross-fade, which the snapshot of `ButtonShowcase` freezes.
export const LoadingOnClick: Story = {
	parameters: {
		controls: { disable: false },
		chromatic: { disableSnapshot: false, disableAnimations: false },
	},
	args: {
		variant: ButtonVariant.Solid,
		color: ButtonColor.Primary,
	},
	argTypes: {
		variant: {
			control: 'select',
			options: VARIANTS,
		},
		color: {
			control: 'select',
			options: COLORS,
		},
	},
	// prefix/suffix/icon are set per button below, so the matching controls are dropped here
	render: ({
		variant,
		color,
		loading: _loading,
		onClick: _onClick,
		icon: _icon,
		prefix: _prefix,
		suffix: _suffix,
		...args
	}) => (
		<div className={`story-container-full ${styles.sectionGapLarge}`}>
			<div className="story-section">
				<Typography size="base" weight="semibold">
					Loading On Click
				</Typography>
				<Typography>
					Click a button to put it in the loading state for 5 seconds. While loading, the spinner
					cross-fades over the prefix, the label and suffix stay visible, and both{' '}
					<code>onClick</code> and <code>onDoubleClick</code> stop firing.
				</Typography>
				<div className={`story-row-lg ${styles.marginTopMedium}`}>
					<LoadingOnClickButton
						{...args}
						{...resolveVariantColor(variant, color)}
						testId="loading-on-click-button"
					>
						Save changes
					</LoadingOnClickButton>
					<LoadingOnClickButton
						{...args}
						{...resolveVariantColor(variant, color)}
						prefix={<Star />}
						suffix={<Check />}
						testId="loading-on-click-button-with-affixes"
					>
						With prefix and suffix
					</LoadingOnClickButton>
					<LoadingOnClickButton
						{...args}
						{...resolveVariantColor(variant, color)}
						icon
						aria-label="Loading icon only"
						testId="loading-on-click-icon-button"
						loadingTooltip="Your loading tooltip"
					>
						<Star />
					</LoadingOnClickButton>
				</div>
			</div>
		</div>
	),
};
