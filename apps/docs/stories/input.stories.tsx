import { Search } from '@signozhq/icons';
import { Input, type InputProps, Typography } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type CSSProperties, Fragment, type ReactElement, type ReactNode, useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import { inputArgTypes, inputParameters } from './shared/input-arg-types.js';
import styles from './input.stories.module.css';

const meta: Meta<typeof Input> = {
	title: 'Primitive Components/Input',
	component: Input,
	parameters: inputParameters,
	argTypes: inputArgTypes,
	args: {
		placeholder: 'For eg. Simpsonville...',
		'aria-label': 'Organisation name',
		onChange: fn(),
	},
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
	decorators: [
		(Story) => (
			<div className="story-container">
				<Story />
			</div>
		),
	],
	parameters: {
		// Every state it can be driven into is covered by `Showcase`.
		chromatic: { disableSnapshot: true },
	},
};

/**
 * `hover` and `focus` cannot be reached by a snapshot on their own, so
 * `storybook-addon-pseudo-states` forces them through the `[data-pseudo]` selectors in the
 * story parameters. `disabled` and `readOnly` are real props, so they need no pseudo.
 *
 * Each cell holds an empty field, then a filled one. The empty one is where the placeholder
 * color shows, including its hover color.
 */
const STATES = ['default', 'hover', 'focus', 'disabled', 'readonly'] as const;

type State = (typeof STATES)[number];

type LockedProps = Pick<
	InputProps,
	'disabled' | 'disabledTooltip' | 'readOnly' | 'readOnlyTooltip'
> & {
	'data-pseudo'?: 'hover' | 'focus';
};

function stateProps(state: State): LockedProps {
	switch (state) {
		case 'disabled':
			return { disabled: true, disabledTooltip: 'Ask an admin to unlock this field' };
		case 'readonly':
			return { readOnly: true, readOnlyTooltip: 'Saving your changes' };
		case 'hover':
			return { 'data-pseudo': 'hover' };
		case 'focus':
			return { 'data-pseudo': 'focus' };
		default:
			return {};
	}
}

type Appearance = {
	id: string;
	label: string;
	props: Pick<InputProps, 'size' | 'status' | 'variant'>;
};

const APPEARANCES: Appearance[] = [
	{ id: 'base', label: 'base', props: {} },
	{ id: 'large', label: 'large', props: { size: 'large' } },
	{ id: 'success', label: 'success', props: { status: 'success' } },
	{ id: 'warning', label: 'warning', props: { status: 'warning' } },
	{ id: 'danger', label: 'danger', props: { status: 'danger' } },
	{ id: 'unstyled', label: 'unstyled', props: { variant: 'unstyled' } },
];

const LONG_VALUE = 'Springfield Heights Observatory, 1842 West Canary Lane';

function matrixStyle(columns: number): CSSProperties {
	return { '--matrix-columns': columns } as CSSProperties;
}

function MatrixHeader({ columns }: { columns: readonly string[] }): ReactElement {
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

function Field({ children }: { children: ReactNode }): ReactElement {
	return <div className={styles.field}>{children}</div>;
}

function StateCell({ appearance, state }: { appearance: Appearance; state: State }): ReactElement {
	const shared = { ...appearance.props, ...stateProps(state) };

	return (
		<div className={styles.stateCell}>
			<Field>
				<Input
					{...shared}
					placeholder="For eg. Simpsonville..."
					aria-label={`${appearance.label} ${state} empty`}
				/>
			</Field>
			<Field>
				<Input {...shared} defaultValue="Springfield" aria-label={`${appearance.label} ${state}`} />
			</Field>
		</div>
	);
}

function Row({ label, children }: { label: string; children: ReactNode }): ReactElement {
	return (
		<>
			<Typography size="sm" weight="medium" className={styles.rowLabel}>
				{label}
			</Typography>
			{children}
		</>
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
			<Typography size="base" weight="semibold">
				{title}
			</Typography>
			<Typography size="sm">{description}</Typography>
			{children}
		</div>
	);
}

export const Showcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
		pseudo: {
			// The hover border is on the frame. The toggle and the steppers paint their own hover.
			hover:
				'[data-pseudo="hover"], [data-pseudo="hover"] [data-slot="input-password-toggle"], [data-pseudo="hover"] [data-slot="input-step-up"], [data-pseudo="hover"] [data-slot="input-step-down"]',
			// The ring is `:has(.input__field:focus-visible)` on the frame, so the class lands on the control.
			focusVisible: '[data-pseudo="focus"] [data-slot="input-field"]',
		},
	},
	render: () => (
		<div className={`story-container-full ${styles.columnLayout}`}>
			<Section
				title="States"
				description="One row per appearance, one column per state, each cell empty then filled. base is 32px, large is 40px, and the text size does not change. Hover darkens the border and the placeholder, and never while a status, disabled, or read-only is set: the status border wins. danger also announces itself as aria-invalid. Success is confirmation of a completed check, not a resting state for a valid field. Disabled fades to 0.4, read-only to 0.8. Unstyled drops the border and the background and keeps the focus ring."
			>
				<div
					className={`${styles.matrix} ${styles.marginTopMedium}`}
					style={matrixStyle(STATES.length)}
				>
					<MatrixHeader columns={['default', 'hover', 'focus', 'disabled', 'read-only']} />
					{APPEARANCES.map((appearance) => (
						<Fragment key={appearance.id}>
							<Typography size="sm" weight="medium" className={styles.matrixLabel}>
								{appearance.label}
							</Typography>
							{STATES.map((state) => (
								<StateCell
									key={`${appearance.id}-${state}`}
									appearance={appearance}
									state={state}
								/>
							))}
						</Fragment>
					))}
				</div>
			</Section>

			<Section
				title="Focus ring"
				description="The ring is the one focus signal, drawn on keyboard focus only. noFocusRing removes it. On an unstyled field the ring is all that marks focus, so the two do not go together."
			>
				<div className={`${styles.matrix} ${styles.marginTopMedium}`} style={matrixStyle(2)}>
					<MatrixHeader columns={['focus', 'noFocusRing']} />
					<Typography size="sm" weight="medium" className={styles.matrixLabel}>
						default
					</Typography>
					<Field>
						<Input data-pseudo="focus" defaultValue="Springfield" aria-label="Focused" />
					</Field>
					<Field>
						<Input
							data-pseudo="focus"
							noFocusRing
							defaultValue="Springfield"
							aria-label="No focus ring"
						/>
					</Field>
					<Typography size="sm" weight="medium" className={styles.matrixLabel}>
						unstyled
					</Typography>
					<Field>
						<Input
							data-pseudo="focus"
							variant="unstyled"
							defaultValue="Springfield"
							aria-label="Unstyled focused"
						/>
					</Field>
					<Field>
						<Input
							data-pseudo="focus"
							variant="unstyled"
							noFocusRing
							defaultValue="Springfield"
							aria-label="Unstyled no focus ring"
						/>
					</Field>
				</div>
			</Section>

			<Section
				title="Prefix and suffix"
				description="Slots inside the field, before and after the text. The status icon renders after the suffix."
			>
				<div className={`${styles.rows} ${styles.marginTopMedium}`}>
					<Row label="prefix icon">
						<Field>
							<Input
								prefix={<Search />}
								placeholder="For eg. Simpsonville..."
								aria-label="Prefix"
							/>
						</Field>
					</Row>
					<Row label="suffix text">
						<Field>
							<Input
								suffix={<Typography size="sm">ms</Typography>}
								placeholder="500"
								aria-label="Suffix"
							/>
						</Field>
					</Row>
					<Row label="both, with a status">
						<Field>
							<Input
								prefix={<Search />}
								suffix={<Typography size="sm">ms</Typography>}
								status="danger"
								placeholder="500"
								aria-label="Both"
							/>
						</Field>
					</Row>
					<Row label="large, with a prefix">
						<Field>
							<Input
								size="large"
								prefix={<Search />}
								placeholder="For eg. Simpsonville..."
								aria-label="Large prefix"
							/>
						</Field>
					</Row>
				</div>
			</Section>

			<Section
				title="Long value"
				description="The dashed outline is the parent. The field fills it and the text scrolls inside, so a long value never pushes the prefix, the suffix, or the status icon out."
			>
				<div className={`${styles.rows} ${styles.marginTopMedium}`}>
					<Row label="long value">
						<div className={styles.bounded}>
							<Input defaultValue={LONG_VALUE} aria-label="Long value" />
						</div>
					</Row>
					<Row label="with prefix and suffix">
						<div className={styles.bounded}>
							<Input
								prefix={<Search />}
								suffix={<Typography size="sm">ms</Typography>}
								defaultValue={LONG_VALUE}
								aria-label="Long value with slots"
							/>
						</div>
					</Row>
					<Row label="with a status">
						<div className={styles.bounded}>
							<Input
								prefix={<Search />}
								suffix={<Typography size="sm">ms</Typography>}
								status="danger"
								defaultValue={LONG_VALUE}
								aria-label="Long value with status"
							/>
						</div>
					</Row>
					<Row label="textarea">
						<div className={styles.bounded}>
							<Input.TextArea rows={4} defaultValue={LONG_VALUE} aria-label="Long description" />
						</div>
					</Row>
				</div>
			</Section>

			<Section
				title="Disabled and read-only"
				description="Read-only outranks disabled. With both, the field is only read-only: it keeps its tab stop and its value stays selectable."
			>
				<div className={`${styles.rows} ${styles.marginTopMedium}`}>
					<Row label="both">
						<Field>
							<Input
								disabled
								disabledTooltip="Ask an admin to unlock this field"
								readOnly
								readOnlyTooltip="Saving your changes"
								defaultValue="Springfield"
								aria-label="Read-only outranks disabled"
							/>
						</Field>
					</Row>
				</div>
			</Section>

			<Section
				title="Width"
				description="The field fills its parent. width and maxWidth bound it without a wrapper."
			>
				<div className={`${styles.rows} ${styles.marginTopMedium}`}>
					<Row label="width 240">
						<Input width={240} placeholder="For eg. Simpsonville..." aria-label="Width 240" />
					</Row>
					<Row label="maxWidth 240">
						<Input
							maxWidth={240}
							placeholder="For eg. Simpsonville..."
							aria-label="Max width 240"
						/>
					</Row>
				</div>
			</Section>

			<Section
				title="Members"
				description="Input.Password, Input.TextArea and Input.Number keep the same frame. The password toggle and the number steppers show their hover color in the hover column. A textarea grows with its rows and aligns the status icon with the first line."
			>
				<div
					className={`${styles.matrix} ${styles.marginTopMedium}`}
					style={matrixStyle(STATES.length)}
				>
					<MatrixHeader columns={['default', 'hover', 'focus', 'disabled', 'read-only']} />
					<Typography size="sm" weight="medium" className={styles.matrixLabel}>
						password
					</Typography>
					{STATES.map((state) => (
						<Field key={`password-${state}`}>
							<Input.Password
								{...stateProps(state)}
								placeholder="Enter password"
								autoComplete="new-password"
								aria-label={`Password ${state}`}
							/>
						</Field>
					))}
					<Typography size="sm" weight="medium" className={styles.matrixLabel}>
						textarea
					</Typography>
					{STATES.map((state) => (
						<Field key={`textarea-${state}`}>
							<Input.TextArea
								{...stateProps(state)}
								rows={3}
								defaultValue={'Line one\nLine two'}
								aria-label={`Description ${state}`}
							/>
						</Field>
					))}
					<Typography size="sm" weight="medium" className={styles.matrixLabel}>
						number
					</Typography>
					{STATES.map((state) => (
						<Field key={`number-${state}`}>
							<Input.Number
								{...stateProps(state)}
								defaultValue={3}
								min={0}
								max={10}
								aria-label={`Count ${state}`}
							/>
						</Field>
					))}
				</div>
			</Section>

			<Section
				title="Member details"
				description="The status icon on a textarea sits on the first line. The step buttons disable at min and max. controls={false} removes them. A number takes the same prefix slot as a text field."
			>
				<div className={`${styles.rows} ${styles.marginTopMedium}`}>
					<Row label="textarea, danger">
						<Field>
							<Input.TextArea
								rows={3}
								status="danger"
								defaultValue={'Line one\nLine two'}
								aria-label="Description danger"
							/>
						</Field>
					</Row>
					<Row label="number at min">
						<Field>
							<Input.Number defaultValue={0} min={0} max={10} aria-label="Count at min" />
						</Field>
					</Row>
					<Row label="number at max">
						<Field>
							<Input.Number defaultValue={10} min={0} max={10} aria-label="Count at max" />
						</Field>
					</Row>
					<Row label="number, no controls">
						<Field>
							<Input.Number
								defaultValue={3}
								min={0}
								max={10}
								controls={false}
								aria-label="Count without controls"
							/>
						</Field>
					</Row>
					<Row label="number, large, prefix">
						<Field>
							<Input.Number
								size="large"
								defaultValue={3}
								prefix={<Search />}
								aria-label="Large count"
							/>
						</Field>
					</Row>
				</div>
			</Section>
		</div>
	),
};

function ControlledInput(): ReactElement {
	const [value, setValue] = useState('');

	return (
		<Input
			aria-label="Organisation name"
			placeholder="For eg. Simpsonville..."
			value={value}
			onChange={(event) => setValue(event.target.value)}
			testId="controlled-input"
		/>
	);
}

export const Typing: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	decorators: [
		(Story) => (
			<div className="story-container">
				<Story />
			</div>
		),
	],
	render: () => <ControlledInput />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const field = canvas.getByRole('textbox');

		await userEvent.type(field, 'Simpsonville');

		await expect(field).toHaveValue('Simpsonville');
	},
};

export const DisabledTooltip: Story = {
	parameters: {
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	decorators: [
		(Story) => (
			<div className="story-container">
				<Story />
			</div>
		),
	],
	render: () => (
		<Input
			aria-label="Organisation name"
			disabled
			disabledTooltip="Ask an admin to unlock this field"
			testId="disabled-input"
		/>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await userEvent.hover(canvas.getByTestId('disabled-input'));

		await waitFor(() => {
			expect(document.body).toHaveTextContent('Ask an admin to unlock this field');
		});
	},
};
