import {
	Pill,
	PillColor,
	type PillColorType,
	PillTextOverflow,
	PillTextTransform,
	PillVariant,
	type PillVariantType,
	Typography,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type CSSProperties, Fragment, type ReactElement } from 'react';
import { expect, fireEvent, fn, waitFor, within } from 'storybook/test';
import styles from './pill.stories.module.css';

const COLORS = Object.values(PillColor);
const VARIANT = PillVariant.Outlined;

const meta: Meta<typeof Pill> = {
	title: 'Primitive Components/Pill',
	component: Pill,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'The interactive sibling of `Badge`: a real `<button>` with a tinted outlined treatment.',
			},
		},
		design: {
			type: 'figma',
			url: 'https://www.figma.com/design/eyORbfrXMWCz9w0xEFdgWe/Periscope-%E2%80%93-Primitives-v2?node-id=6928-4&p=f&m=dev',
		},
	},
	argTypes: {
		children: {
			control: 'text',
			description: 'The content of the pill.',
			table: { category: 'Content' },
		},
		variant: {
			control: 'inline-radio',
			options: Object.values(PillVariant),
			description: '`outlined` only tints the border and text, no fill.',
			table: {
				category: 'Appearance',
				type: { summary: 'PillVariantType' },
				defaultValue: { summary: 'outlined' },
			},
		},
		color: {
			control: 'select',
			options: COLORS,
			description: "Same palette as Badge's `color`.",
			table: { category: 'Appearance', type: { summary: 'PillColorType' } },
		},
		textTransform: {
			control: 'inline-radio',
			options: Object.values(PillTextTransform),
			description:
				'Defaults to `none`, unlike `Badge`, so the label keeps its own case. No `uppercase`.',
			table: {
				category: 'Appearance',
				type: { summary: 'PillTextTransformType' },
				defaultValue: { summary: 'none' },
			},
		},
		textOverflow: {
			control: 'inline-radio',
			options: Object.values(PillTextOverflow),
			description: '`ellipsis` (default) shows the full content in a tooltip while truncated.',
			table: {
				category: 'Behavior',
				type: { summary: 'PillTextOverflowType' },
				defaultValue: { summary: 'ellipsis' },
			},
		},
		width: {
			control: 'text',
			description: 'Width of the pill, sizes to content when omitted.',
			table: { category: 'Appearance', type: { summary: 'CSSProperties["width"]' } },
		},
		maxWidth: {
			control: 'text',
			description: 'Max-width of the pill, capped at 100% of its container when omitted.',
			table: { category: 'Appearance', type: { summary: 'CSSProperties["maxWidth"]' } },
		},
		disabled: {
			control: 'boolean',
			description:
				'Blocks clicks and keyboard activation and drops the pill from the tab order, natively.',
			table: {
				category: 'State',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		onClick: {
			control: false,
			description: 'Called on click, Enter or Space. Never called while `disabled`.',
			table: { category: 'Events' },
		},
		testId: {
			control: 'text',
			description: 'Forwarded to the rendered element as `data-testid`.',
			table: { category: 'Testing' },
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes for custom styling.',
			table: { category: 'Styling' },
		},
		id: {
			control: 'text',
			table: { category: 'Accessibility' },
		},
	},
};

export default meta;

type Story = StoryObj<typeof Pill>;

export const Playground: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
	},
	args: {
		variant: VARIANT,
		color: 'primary',
		onClick: fn(),
		children: 'env:prod',
	},
};

/**
 * `Pill.Closeable` is dismissible: fixed neutral fill, no `variant` or `color` to pick. The close
 * icon is its own control, activating it calls `onClose` and never `onClick`, and clicking the
 * body never fires `onClose`.
 */
export const Closeable: StoryObj<typeof Pill.Closeable> = {
	parameters: {
		chromatic: { disableSnapshot: true },
		// `variant` and `color` are declared on the parent `Meta`; `Pill.Closeable` has neither.
		controls: { exclude: ['variant', 'color'] },
	},
	args: {
		children: 'env:prod',
		onClick: fn(),
		onClose: fn(),
	},
	argTypes: {
		onClick: {
			control: false,
			description: 'Called when the pill body is activated. The close icon never triggers it.',
			table: { category: 'Events' },
		},
		onClose: {
			control: false,
			description: 'Required. Called when the close icon is activated; never fired by the body.',
			table: { category: 'Events' },
		},
		disabled: {
			control: 'boolean',
			description: 'Disables the body and the close button.',
			table: { category: 'State', defaultValue: { summary: 'false' } },
		},
		closeAriaLabel: {
			control: 'text',
			description:
				'Accessible name for the close icon. Defaults to `Remove {children}` for string children, `Remove` otherwise.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
	},
	render: (args) => <Pill.Closeable {...args} />,
};

/**
 * `hover` and `focus` cannot be reached by a snapshot on their own,
 * `storybook-addon-pseudo-states` forces them through the `[data-pseudo]` selectors in the story
 * parameters. `disabled` and `invalid` are real attributes, so they need no pseudo.
 */
const STATES = ['default', 'hover', 'focus', 'disabled', 'invalid'] as const;

type State = (typeof STATES)[number];

type StateProps = {
	'data-pseudo'?: Extract<State, 'hover' | 'focus'>;
	disabled?: true;
	'aria-invalid'?: true;
};

function stateProps(state: State): StateProps {
	if (state === 'disabled') {
		return { disabled: true };
	}
	if (state === 'invalid') {
		return { 'aria-invalid': true };
	}
	return state === 'default' ? {} : { 'data-pseudo': state };
}

/**
 * One pill per color in a single state.
 */
function StateCell({
	variant,
	color,
	state,
}: {
	variant: PillVariantType;
	color: PillColorType;
	state: State;
}): ReactElement {
	return (
		<Pill variant={variant} color={color} onClick={fn()} {...stateProps(state)}>
			{color}
		</Pill>
	);
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

const LONG_LABEL = 'checkout-service-production-east-us-2';
const CONSTRAINED_WIDTH = '10rem';

export const PillShowcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false },
		pseudo: {
			hover: '[data-pseudo="hover"]',
			// Both `Pill` and `Pill.Closeable` put the attribute on the focusable element itself,
			// the `<button>` and the `<span role="button">` respectively.
			focusVisible: '[data-pseudo="focus"]',
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByTestId('truncated-pill');

		fireEvent.pointerEnter(trigger);
		fireEvent.mouseEnter(trigger);
		fireEvent.mouseMove(trigger);

		await waitFor(() =>
			expect(within(document.body).getByRole('tooltip')).toHaveTextContent(LONG_LABEL),
		);
	},
	argTypes: {
		children: { control: false },
		color: { control: false },
		variant: { control: false },
	},
	render: () => (
		<div className={`story-container-full ${styles.columnLayout}`}>
			<div className="story-section">
				<Typography size="base" weight="semibold">
					Colors
				</Typography>
				<Typography size="sm">One outlined pill per color.</Typography>
				<div className={`${styles.matrix} ${styles.marginTopMedium}`} style={matrixStyle(1)}>
					<MatrixHeader columns={['outlined']} />
					{COLORS.map((color) => (
						<Fragment key={color}>
							<Typography size="sm" weight="medium" className={styles.matrixLabel}>
								{color}
							</Typography>
							<Pill variant={VARIANT} color={color}>
								{color}
							</Pill>
						</Fragment>
					))}
				</div>
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					States
				</Typography>
				<Typography size="sm">
					One row per color, one column per state. <code>hover</code> and <code>focus</code> are
					forced by <code>storybook-addon-pseudo-states</code>, <code>disabled</code> is the native
					attribute.
				</Typography>
				<div
					className={`${styles.matrix} ${styles.marginTopMedium}`}
					style={matrixStyle(STATES.length)}
				>
					<MatrixHeader columns={[...STATES]} />
					{COLORS.map((color) => (
						<Fragment key={color}>
							<Typography size="sm" weight="medium" className={styles.matrixLabel}>
								{color}
							</Typography>
							{STATES.map((state) => (
								<StateCell key={state} variant={VARIANT} color={color} state={state} />
							))}
						</Fragment>
					))}
					<Typography size="sm" weight="medium" className={styles.matrixLabel}>
						closeable
					</Typography>
					{STATES.map((state) => (
						<Pill.Closeable key={state} onClose={fn()} {...stateProps(state)}>
							env:prod
						</Pill.Closeable>
					))}
				</div>
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					Usage examples
				</Typography>
				<Typography size="sm">Applied filters a user can click or remove.</Typography>
				<div className="story-grid">
					<Pill variant={VARIANT} color="primary" onClick={fn()}>
						env:prod
					</Pill>
					<Pill variant={VARIANT} color="secondary" onClick={fn()}>
						region:us-east-1
					</Pill>
					<Pill.Closeable onClick={fn()} onClose={fn()}>
						service:checkout
					</Pill.Closeable>
				</div>
			</div>

			<div className="story-section">
				<Typography size="base" weight="semibold">
					Overflow and tooltip
				</Typography>
				<Typography size="sm">
					Capped at <code>{CONSTRAINED_WIDTH}</code>, full content on hover or focus.
				</Typography>
				<div className={`${styles.overflowGrid} ${styles.marginTopMedium}`}>
					<Typography size="sm" weight="medium">
						ellipsis (default)
					</Typography>
					<Pill
						variant={VARIANT}
						color="secondary"
						testId="truncated-pill"
						maxWidth={CONSTRAINED_WIDTH}
						onClick={fn()}
					>
						{LONG_LABEL}
					</Pill>
					<Typography size="sm">Truncates, full content on hover or focus.</Typography>
				</div>
			</div>
		</div>
	),
};
