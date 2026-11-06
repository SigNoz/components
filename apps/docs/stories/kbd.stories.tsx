import { Bookmark, Pencil, Save, Share2, Trash } from '@signozhq/icons';
import {
	Button,
	ButtonColor,
	ButtonVariant,
	Command,
	type CommandItemType,
	Dropdown,
	type DropdownItemType,
	Kbd,
	Typography,
	type VariantColorType,
} from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type CSSProperties, Fragment, type ReactElement, useId, useState } from 'react';
import { expect, fireEvent, fn, userEvent, waitFor, within } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import styles from './kbd.stories.module.css';
import { resolveVariantColor } from './shared/button-arg-types.js';
import { CHARACTER_KEYS, kbdArgTypes, kbdParameters, NAMED_KEYS } from './shared/kbd-arg-types.js';
import {
	expectAtRest,
	expectCursorOf,
	expectPressed,
	expectSameHeight,
	isMac,
	keyOf,
	modWord,
	shortcutOf,
} from './shared/kbd-play.js';
import { waitForEffects } from './shared/play.js';

const meta: Meta<typeof Kbd> = {
	title: 'Primitive Components/Kbd',
	component: Kbd,
	parameters: {
		...kbdParameters,
		docs: {
			description: {
				component:
					'One key of a keyboard hint: a fixed 20 × 20 square holding one glyph or one character. It is not interactive and never listens to the keyboard: it draws as pressed while `pressed` is set.',
			},
		},
	},
	argTypes: kbdArgTypes,
	args: {
		value: 'K',
		disabled: false,
		pressed: false,
	},
};

export default meta;

type Story = StoryObj<typeof Kbd>;

export const Default: Story = {
	parameters: {
		// Every state it can be driven into is covered by `KbdShowcase`.
		chromatic: { disableSnapshot: true },
	},
	render: (args) => (
		<div className="story-container-full">
			<Kbd {...args} />
		</div>
	),
};

/**
 * The glyph a key draws and the word it is read as. `Meta` reads as `Command` on macOS only.
 * `Alt` and `Mod` depend on the platform and are checked on their own.
 */
const GLYPHS: Record<string, [glyph: string, word: string]> = {
	Escape: ['⎋', 'Escape'],
	Enter: ['↵', 'Enter'],
	Backspace: ['⌫', 'Backspace'],
	Tab: ['⇥', 'Tab'],
	Shift: ['⇧', 'Shift'],
	Meta: ['⌘', isMac() ? 'Command' : 'Meta'],
	Control: ['⌃', 'Control'],
	ArrowUp: ['↑', 'Up arrow'],
	ArrowDown: ['↓', 'Down arrow'],
	ArrowLeft: ['←', 'Left arrow'],
	ArrowRight: ['→', 'Right arrow'],
	a: ['A', 'A'],
	k: ['K', 'K'],
	Z: ['Z', 'Z'],
	'0': ['0', '0'],
	'9': ['9', '9'],
	'/': ['/', 'Slash'],
	'?': ['?', 'Question mark'],
	',': [',', 'Comma'],
	'.': ['.', 'Period'],
};

const PRESS_KEYS = ['L', 'M', '4'] as const;

/**
 * The columns of the button grid. `hover`, `active` and `focus` cannot be reached by a snapshot on
 * their own, `storybook-addon-pseudo-states` forces them through the `[data-pseudo]` selectors in
 * the story parameters.
 */
const BUTTON_STATES = ['rest', 'hover', 'active', 'focus', 'disabled', 'loading'] as const;

type ButtonState = (typeof BUTTON_STATES)[number];

type ButtonStateProps = {
	disabled?: boolean;
	disabledTooltip?: string;
	loading?: boolean;
	'data-pseudo'?: ButtonState;
};

function buttonStateProps(state: ButtonState): ButtonStateProps {
	switch (state) {
		case 'rest':
			return {};
		case 'disabled':
			return { disabled: true, disabledTooltip: 'Write a query first' };
		case 'loading':
			return { loading: true };
		default:
			return { 'data-pseudo': state };
	}
}

/**
 * The rows of the button grid: every colored solid button, which gives the key a look of its own,
 * then the neutral variants, which keep the key's own.
 */
const BUTTON_ROWS: ReadonlyArray<VariantColorType> = [
	resolveVariantColor(ButtonVariant.Solid, ButtonColor.Primary),
	resolveVariantColor(ButtonVariant.Solid, ButtonColor.Danger),
	resolveVariantColor(ButtonVariant.Solid, ButtonColor.Success),
	resolveVariantColor(ButtonVariant.Solid, ButtonColor.Warning),
	resolveVariantColor(ButtonVariant.Solid, ButtonColor.Info),
	resolveVariantColor(ButtonVariant.Solid, ButtonColor.Archive),
	resolveVariantColor(ButtonVariant.Solid, ButtonColor.HighlightDanger),
	resolveVariantColor(ButtonVariant.Solid, ButtonColor.Secondary),
	resolveVariantColor(ButtonVariant.Outlined),
	resolveVariantColor(ButtonVariant.Ghost),
	resolveVariantColor(ButtonVariant.Dashed),
];

function isColoredSolid({ variant, color }: VariantColorType): boolean {
	return variant === ButtonVariant.Solid && color !== ButtonColor.Secondary;
}

function buttonKeyId({ variant, color }: VariantColorType, state: ButtonState): string {
	return `${variant}-${color}-${state}`;
}

function ButtonKeyCell({
	row,
	state,
}: {
	row: VariantColorType;
	state: ButtonState;
}): ReactElement {
	const id = buttonKeyId(row, state);

	return (
		<Button
			{...row}
			size="md"
			{...buttonStateProps(state)}
			testId={`button-${id}`}
			suffix={<Kbd value="Enter" disabled={state === 'disabled'} testId={`button-key-${id}`} />}
		>
			Run
		</Button>
	);
}

function ButtonKeyGrid(): ReactElement {
	return (
		<div
			className={`${styles.matrix} ${styles.marginTopMedium}`}
			style={{ '--matrix-columns': BUTTON_STATES.length } as CSSProperties}
		>
			<span />
			{BUTTON_STATES.map((state) => (
				<Typography
					key={state}
					variant="label"
					size="small"
					weight="medium"
					color="inherit"
					as="span"
					textOverflow="visible"
				>
					{state}
				</Typography>
			))}
			{BUTTON_ROWS.map((row) => (
				<Fragment key={`${row.variant}-${row.color}`}>
					<Typography
						variant="label"
						size="small"
						weight="medium"
						color="inherit"
						as="span"
						textOverflow="visible"
					>
						{row.variant} / {row.color}
					</Typography>
					{BUTTON_STATES.map((state) => (
						<ButtonKeyCell key={state} row={row} state={state} />
					))}
				</Fragment>
			))}
		</div>
	);
}

const BLOCKED_REASON = 'Only the owner can delete this dashboard';
const LOADING_REASON = 'Creating the public link';

/**
 * The rows of the dropdown menu. The first is highlighted by the story, so the menu shows a key on
 * a row at rest, a highlighted one, a blocked one and a waiting one, and a row with no key to
 * measure the others against.
 */
const MENU_ITEMS: DropdownItemType[] = [
	{
		type: 'item',
		value: 'save',
		label: 'Save dashboard',
		prefix: <Save />,
		shortcut: ['Mod', 'S'],
	},
	{ type: 'item', value: 'rename', label: 'Rename', prefix: <Pencil />, shortcut: ['R'] },
	{ type: 'item', value: 'pin', label: 'Pin to the top', prefix: <Bookmark /> },
	{
		type: 'item',
		value: 'delete',
		label: 'Delete',
		prefix: <Trash />,
		shortcut: ['Shift', 'Backspace'],
		disabled: true,
		disabledTooltip: BLOCKED_REASON,
	},
	{
		type: 'item',
		value: 'share',
		label: 'Share',
		prefix: <Share2 />,
		shortcut: ['Shift', 'E'],
		loading: true,
		loadingTooltip: LOADING_REASON,
	},
];

/**
 * The rows of the command palette, in the same states as the menu above. The palette highlights
 * its first row on open.
 */
const COMMAND_ITEMS: CommandItemType[] = [
	{
		type: 'item',
		value: 'save',
		label: 'Save dashboard',
		prefix: <Save />,
		shortcut: ['Mod', 'S'],
		onClick: fn(),
	},
	{
		type: 'item',
		value: 'rename',
		label: 'Rename',
		prefix: <Pencil />,
		shortcut: ['R'],
		onClick: fn(),
	},
	{ type: 'item', value: 'pin', label: 'Pin to the top', prefix: <Bookmark />, onClick: fn() },
	{
		type: 'item',
		value: 'delete',
		label: 'Delete',
		prefix: <Trash />,
		shortcut: ['Shift', 'Backspace'],
		disabled: true,
		disabledTooltip: BLOCKED_REASON,
		onClick: fn(),
	},
	{
		type: 'item',
		value: 'share',
		label: 'Share',
		prefix: <Share2 />,
		shortcut: ['Shift', 'E'],
		loading: true,
		loadingTooltip: LOADING_REASON,
		onClick: fn(),
	},
];

/**
 * The rows that hold a shortcut, and whether its keys are drawn disabled. Only a blocked row dims
 * them: a waiting row is not disabled, so its keys stay as they are. `pin` holds none, and is what
 * the others are measured against.
 */
const SHORTCUT_ROWS = [
	{ value: 'save', disabled: false },
	{ value: 'rename', disabled: false },
	{ value: 'delete', disabled: true },
	{ value: 'share', disabled: false },
] as const;

function KeyCell({ value }: { value: string }): ReactElement {
	return (
		<div className={styles.keyCell}>
			<Kbd value={value} testId={`glyph-${value}`} />
			<Typography
				variant="label"
				size="small"
				weight="regular"
				color="inherit"
				as="span"
				textOverflow="visible"
			>
				{value}
			</Typography>
		</div>
	);
}

function ClickThrough(): ReactElement {
	const [count, setCount] = useState(0);

	return (
		<div className={styles.row}>
			<Button
				variant="outlined"
				size="md"
				color="secondary"
				onClick={() => setCount((value) => value + 1)}
				suffix={<Kbd value="Enter" testId="click-key" />}
			>
				Run once
			</Button>
			<Typography
				variant="label"
				size="small"
				weight="regular"
				color="inherit"
				as="span"
				textOverflow="visible"
			>
				Runs: {count}
			</Typography>
		</div>
	);
}

function DescribedByTheParent(): ReactElement {
	const keyId = useId();
	const chordId = useId();
	const sequenceId = useId();

	return (
		<div className={styles.row}>
			<Button
				variant="solid"
				size="md"
				color="primary"
				aria-describedby={keyId}
				suffix={<Kbd id={keyId} value="Enter" aria-hidden="true" />}
			>
				Run search
			</Button>
			<Button
				variant="solid"
				size="md"
				color="primary"
				aria-describedby={chordId}
				suffix={<Kbd.Shortcut id={chordId} keys={['Mod', 'Enter']} aria-hidden="true" />}
			>
				Run all
			</Button>
			<Button
				variant="outlined"
				size="md"
				color="secondary"
				aria-describedby={sequenceId}
				suffix={
					<Kbd.Shortcut id={sequenceId} keys={['G', 'D']} mode="sequence" aria-hidden="true" />
				}
			>
				Go to dashboards
			</Button>
		</div>
	);
}

function CommandRows(): ReactElement {
	const [open, setOpen] = useState(false);

	return (
		<div className="story-container">
			<Button variant="solid" color="secondary" size="md" onClick={() => setOpen(true)}>
				Open palette
			</Button>
			<Command
				label="Command palette"
				items={COMMAND_ITEMS}
				open={open}
				onOpenChange={setOpen}
				searchInputProps={{ placeholder: 'Search…' }}
				testId="kbd-command"
			/>
		</div>
	);
}

/**
 * Every key, the shortcuts, the disabled look, the pressed look, a key in a sentence, its display
 * and margin, the keys inside each button state and the keys inside an open dropdown, all in one
 * snapshot. The pressed section renders keys with `pressed`, so the snapshot shows the press.
 *
 * The rows of a command palette are in `InCommandRow`: the palette is a modal dialog, and cannot
 * share a page with the sections above.
 */
export const KbdShowcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
		pseudo: {
			hover: '[data-pseudo="hover"]',
			focusVisible: '[data-pseudo="focus"]',
			active: '[data-pseudo="active"]',
		},
	},
	render: () => (
		<div className={`story-container-full ${styles.columnLayout}`}>
			<div className="story-section">
				<Typography
					variant="paragraph"
					size="base"
					weight="bold"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					Named keys
				</Typography>
				<Typography
					variant="paragraph"
					size="small"
					weight="regular"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					A glyph per key, 20 × 20. <code>Mod</code> is <code>⌘</code> on macOS and <code>⌃</code>{' '}
					elsewhere. A key never shows a word such as <code>esc</code>.
				</Typography>
				<div className={`${styles.keyGrid} ${styles.marginTopMedium}`}>
					{NAMED_KEYS.map((value) => (
						<KeyCell key={value} value={value} />
					))}
				</div>
			</div>

			<div className="story-section">
				<Typography
					variant="paragraph"
					size="base"
					weight="bold"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					Characters
				</Typography>
				<Typography
					variant="paragraph"
					size="small"
					weight="regular"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					A letter draws uppercase. A digit and the punctuation as typed.
				</Typography>
				<div className={`${styles.keyGrid} ${styles.marginTopMedium}`}>
					{CHARACTER_KEYS.map((value) => (
						<KeyCell key={value} value={value} />
					))}
				</div>
			</div>

			<div className="story-section">
				<Typography
					variant="paragraph"
					size="base"
					weight="bold"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					Chord
				</Typography>
				<Typography
					variant="paragraph"
					size="small"
					weight="regular"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					<code>Kbd.Shortcut</code> with keys held together, 2px apart.
				</Typography>
				<div className={`${styles.row} ${styles.marginTopMedium}`}>
					<Kbd.Shortcut keys={['Mod', 'K']} testId="chord" />
					<Kbd.Shortcut keys={['Meta', 'Shift', 'P']} />
					<Kbd.Shortcut keys={['Control', 'Alt', 'Backspace']} />
					<Kbd.Shortcut keys={['Shift', 'ArrowUp']} />
					<Kbd.Shortcut keys={['Mod', '/']} />
				</div>
			</div>

			<div className="story-section">
				<Typography
					variant="paragraph"
					size="base"
					weight="bold"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					Sequence
				</Typography>
				<Typography
					variant="paragraph"
					size="small"
					weight="regular"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					Keys pressed one after the other, 4px apart and with no word between them.
				</Typography>
				<div className={`${styles.row} ${styles.marginTopMedium}`}>
					<Kbd.Shortcut keys={['G', 'D']} mode="sequence" testId="sequence" />
					<Kbd.Shortcut keys={['G', 'G']} mode="sequence" />
					<Kbd.Shortcut keys={['1', '2', '3']} mode="sequence" />
				</div>
			</div>

			<div className="story-section">
				<Typography
					variant="paragraph"
					size="base"
					weight="bold"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					Order of the modifiers
				</Typography>
				<Typography
					variant="paragraph"
					size="small"
					weight="regular"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					The modifiers come first, in the order given: both draw <code>⌘ ⇧ C</code>.
				</Typography>
				<div className={`${styles.row} ${styles.marginTopMedium}`}>
					<Kbd.Shortcut keys={['Meta', 'Shift', 'C']} />
					<Kbd.Shortcut keys={['C', 'Meta', 'Shift']} testId="ordered" />
				</div>
			</div>

			<div className="story-section">
				<Typography
					variant="paragraph"
					size="base"
					weight="bold"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					Disabled
				</Typography>
				<Typography
					variant="paragraph"
					size="small"
					weight="regular"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					Half opacity. A disabled key stays at rest, even with <code>pressed</code>.
				</Typography>
				<div className={`${styles.row} ${styles.marginTopMedium}`}>
					<Kbd value="K" />
					<Kbd value="K" disabled />
					<Kbd.Shortcut keys={['Mod', 'K']} disabled />
					<Kbd.Shortcut keys={['G', 'D']} mode="sequence" disabled />
					<Button
						variant="solid"
						size="md"
						color="primary"
						disabled
						disabledTooltip="Write a query first"
						suffix={<Kbd value="Enter" disabled />}
					>
						Run query
					</Button>
				</div>
			</div>

			<div className="story-section">
				<Typography
					variant="paragraph"
					size="base"
					weight="bold"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					Pressed
				</Typography>
				<Typography
					variant="paragraph"
					size="small"
					weight="regular"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					The bottom edge shrinks to 1px and the face moves down by 1px. The key never listens to
					the keyboard: the second row sets <code>pressed</code>, and its disabled key stays at
					rest. A shortcut presses every key of it at once.
				</Typography>
				<div className={`${styles.stack} ${styles.marginTopMedium}`}>
					<div className={styles.row}>
						{PRESS_KEYS.map((value) => (
							<Kbd key={value} value={value} testId={`rest-${value}`} />
						))}
					</div>
					<div className={styles.row}>
						{PRESS_KEYS.map((value) => (
							<Kbd key={value} value={value} pressed testId={`pressed-${value}`} />
						))}
						<Kbd value="L" disabled pressed testId="pressed-disabled" />
					</div>
					<div className={styles.row}>
						<Kbd.Shortcut keys={['Mod', 'K']} pressed testId="pressed-chord" />
						<Kbd.Shortcut keys={['G', 'D']} mode="sequence" pressed testId="pressed-sequence" />
						<Kbd.Shortcut keys={['Mod', 'K']} disabled pressed testId="pressed-disabled-chord" />
					</div>
				</div>
			</div>

			<div className="story-section">
				<Typography
					variant="paragraph"
					size="base"
					weight="bold"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					In a sentence
				</Typography>
				<Typography
					variant="paragraph"
					size="small"
					weight="regular"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					The key stays in the accessibility tree and reads as its word. It is not rendered below
					640px or on a touch-only device, so the line is hidden there too.
				</Typography>
				<div className={`${styles.hintLine} ${styles.marginTopMedium}`} data-testid="hint-line">
					<Typography
						variant="paragraph"
						size="small"
						weight="regular"
						color="inherit"
						as="p"
						textOverflow="wrap"
					>
						Press <Kbd value="P" testId="pin-key" /> to pin the tooltip, then <Kbd value="Escape" />{' '}
						to close it.
					</Typography>
				</div>
			</div>

			<div className="story-section">
				<Typography
					variant="paragraph"
					size="base"
					weight="bold"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					Display and margin
				</Typography>
				<Typography
					variant="paragraph"
					size="small"
					weight="regular"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					An <code>inline</code> key, the default, sits in the line of text and takes its spacing
					from the text. A <code>block</code> key takes a line of its own and the margin props, one
					step of the spacing scale being 2px. The key itself stays 20px wide.
				</Typography>
				<div className={`${styles.displayGrid} ${styles.marginTopMedium}`}>
					<Typography
						variant="label"
						size="small"
						weight="medium"
						color="inherit"
						as="span"
						textOverflow="visible"
					>
						inline, in a sentence
					</Typography>
					<div className={styles.hintLine}>
						<Typography
							variant="paragraph"
							size="small"
							weight="regular"
							color="inherit"
							as="p"
							textOverflow="wrap"
						>
							Press <Kbd value="U" testId="display-inline" /> to undo the last change.
						</Typography>
					</div>

					<Typography
						variant="label"
						size="small"
						weight="medium"
						color="inherit"
						as="span"
						textOverflow="visible"
					>
						block, on a line of its own
					</Typography>
					<div className={styles.lines}>
						<Typography
							variant="paragraph"
							size="small"
							weight="regular"
							color="inherit"
							as="p"
							textOverflow="wrap"
						>
							The line before
						</Typography>
						<Kbd display="block" value="Y" testId="display-block" />
						<Typography
							variant="paragraph"
							size="small"
							weight="regular"
							color="inherit"
							as="p"
							textOverflow="wrap"
						>
							The line after
						</Typography>
					</div>

					<Typography
						variant="label"
						size="small"
						weight="medium"
						color="inherit"
						as="span"
						textOverflow="visible"
					>
						block, margin 4
					</Typography>
					<div className={styles.marginBox} data-testid="display-margin-box">
						<Kbd display="block" margin={4} value="B" testId="display-margin" />
					</div>

					<Typography
						variant="label"
						size="small"
						weight="medium"
						color="inherit"
						as="span"
						textOverflow="visible"
					>
						block, marginLeft auto, in a row
					</Typography>
					<div className={styles.endRow} data-testid="display-auto-box">
						<Typography
							variant="label"
							size="small"
							weight="regular"
							color="inherit"
							as="span"
							textOverflow="visible"
						>
							Archive the dashboard
						</Typography>
						<Kbd display="block" marginLeft="auto" value="N" testId="display-auto" />
					</div>

					<Typography
						variant="label"
						size="small"
						weight="medium"
						color="inherit"
						as="span"
						textOverflow="visible"
					>
						block shortcut, marginTop 4
					</Typography>
					<div className={styles.marginBox}>
						<Typography
							variant="paragraph"
							size="small"
							weight="regular"
							color="inherit"
							as="p"
							textOverflow="wrap"
						>
							Confirm the change
						</Typography>
						<Kbd.Shortcut
							display="block"
							marginTop={4}
							keys={['Mod', 'T']}
							testId="display-shortcut"
						/>
					</div>
				</div>
			</div>

			<div className="story-section">
				<Typography
					variant="paragraph"
					size="base"
					weight="bold"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					Inside a button
				</Typography>
				<Typography
					variant="paragraph"
					size="small"
					weight="regular"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					One row per variant and color, one column per state. <code>hover</code>,{' '}
					<code>active</code> and <code>focus</code> are forced by{' '}
					<code>storybook-addon-pseudo-states</code>. A solid button with a color gives the key its
					own label color, fill and border, and the other rows keep the neutral look. The key takes
					the button's cursor, and goes to half opacity with a disabled button only: a loading
					button is waiting, not disabled.
				</Typography>
				<ButtonKeyGrid />
				<div className={`${styles.row} ${styles.marginTopMedium}`}>
					<Button
						variant="solid"
						size="md"
						color="danger"
						suffix={<Kbd.Shortcut keys={['Shift', 'Backspace']} />}
					>
						Delete
					</Button>
					<Button
						variant="solid"
						size="md"
						color="secondary"
						suffix={<Kbd.Shortcut keys={['Mod', 'S']} />}
					>
						Save
					</Button>
				</div>
			</div>

			<div className={`story-section ${styles.menuSection}`}>
				<Typography
					variant="paragraph"
					size="base"
					weight="bold"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					Inside a dropdown row
				</Typography>
				<Typography
					variant="paragraph"
					size="small"
					weight="regular"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					The menu is held open by the story. The first row is highlighted, the key sits on a row at
					rest, on a blocked one and on a waiting one, and every row has the height of the row that
					holds no key. The key takes the cursor of its row.
				</Typography>
				<div className={styles.marginTopMedium}>
					<Dropdown nativeButton side="bottom" align="start" testId="kbd-menu" items={MENU_ITEMS}>
						<Button variant="outlined" color="secondary" size="md">
							Actions
						</Button>
					</Dropdown>
				</div>
			</div>

			<div className="story-section">
				<Typography
					variant="paragraph"
					size="base"
					weight="bold"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					Described by the parent
				</Typography>
				<Typography
					variant="paragraph"
					size="small"
					weight="regular"
					color="inherit"
					as="p"
					textOverflow="wrap"
				>
					The button names the action, marks the key <code>aria-hidden</code> and points{' '}
					<code>aria-describedby</code> at it, so the shortcut is read once, after the label. A
					click on the key is a click on the button.
				</Typography>
				<div className={`${styles.stack} ${styles.marginTopMedium}`}>
					<DescribedByTheParent />
					<ClickThrough />
				</div>
			</div>
		</div>
	),
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('each key draws its glyph and reads as its word', async () => {
			for (const [value, [glyph, word]] of Object.entries(GLYPHS)) {
				const key = canvas.getByTestId(`glyph-${value}`);

				await expect(key).toHaveAttribute('data-slot', 'kbd');
				await expect(key).toHaveAttribute('data-key', value);
				await expect(key.textContent).toBe(`${glyph}${word}`);
			}

			await expect(canvas.getByTestId('glyph-Alt').textContent).toBe(
				`⌥${isMac() ? 'Option' : 'Alt'}`,
			);
			await expect(canvas.getByTestId('glyph-Mod').textContent).toBe(
				`${isMac() ? '⌘' : '⌃'}${modWord()}`,
			);
		});

		await step('a shortcut draws its modifiers first and carries its mode', async () => {
			await expect(canvas.getByTestId('chord')).toHaveAttribute('data-mode', 'chord');
			await expect(canvas.getByTestId('sequence')).toHaveAttribute('data-mode', 'sequence');
			await expect(canvas.getByTestId('ordered-key-0')).toHaveAttribute('data-key', 'Meta');
			await expect(canvas.getByTestId('ordered-key-1')).toHaveAttribute('data-key', 'Shift');
			await expect(canvas.getByTestId('ordered-key-2')).toHaveAttribute('data-key', 'C');
		});

		await step('a key in a sentence stays in the accessibility tree', async () => {
			await expect(canvas.getByTestId('pin-key')).not.toHaveAttribute('aria-hidden');
		});

		await step('the parent reads the shortcut as its description', async () => {
			await expect(canvas.getByRole('button', { name: 'Run search' })).toHaveAccessibleDescription(
				'Enter',
			);
			await expect(canvas.getByRole('button', { name: 'Run all' })).toHaveAccessibleDescription(
				`${modWord()} Enter`,
			);
			await expect(
				canvas.getByRole('button', { name: 'Go to dashboards' }),
			).toHaveAccessibleDescription('G then D');
		});

		await step('a click on the key is a click on the button', async () => {
			const key = canvas.getByTestId('click-key');
			const button = canvas.getByRole('button', { name: /^Run once/ });

			expectCursorOf(key, button);

			await userEvent.click(key);

			await expect(canvas.getByText('Runs: 1')).toBeInTheDocument();

			button.blur();
		});

		await step(
			'a key is inline by default, and block takes its margin and keeps its 20px',
			async () => {
				const inline = canvas.getByTestId('display-inline');

				await expect(inline).toHaveAttribute('data-display', 'inline');
				await expect(getComputedStyle(inline).marginTop).toBe('0px');

				const block = canvas.getByTestId('display-block');

				await expect(block).toHaveAttribute('data-display', 'block');
				await expect(getComputedStyle(block).display).toBe('flex');

				const margin = canvas.getByTestId('display-margin');

				await expect(margin).toHaveAttribute('data-display', 'block');
				for (const side of ['Top', 'Right', 'Bottom', 'Left'] as const) {
					await expect(getComputedStyle(margin)[`margin${side}`]).toBe('8px');
				}

				const auto = canvas.getByTestId('display-auto');
				const row = canvas.getByTestId('display-auto-box');

				await expect(auto).toHaveAttribute('data-display', 'block');
				await expect(auto.getBoundingClientRect().right).toBeCloseTo(
					row.getBoundingClientRect().right - parseFloat(getComputedStyle(row).borderRightWidth),
					0,
				);

				const shortcut = canvas.getByTestId('display-shortcut');

				await expect(shortcut).toHaveAttribute('data-display', 'block');
				await expect(getComputedStyle(shortcut).marginTop).toBe('8px');
				await expect(getComputedStyle(shortcut).marginLeft).toBe('0px');

				for (const slot of [block, margin, auto, canvas.getByTestId('display-shortcut-key-0')]) {
					await expect(slot.getBoundingClientRect().width).toBe(20);
				}
			},
		);

		await step(
			'inside a button the key takes the cursor, a colored one its label color',
			async () => {
				for (const row of BUTTON_ROWS) {
					for (const state of BUTTON_STATES) {
						const id = buttonKeyId(row, state);
						const button = canvas.getByTestId(`button-${id}`);
						const key = canvas.getByTestId(`button-key-${id}`);

						expectCursorOf(key, button);

						if (isColoredSolid(row)) {
							await expect(getComputedStyle(key.firstElementChild as Element).color).toBe(
								getComputedStyle(button).color,
							);
						}
					}
				}

				const rest = canvas.getByTestId(`button-key-${buttonKeyId(BUTTON_ROWS[0], 'rest')}`);
				const blocked = canvas.getByTestId(`button-key-${buttonKeyId(BUTTON_ROWS[0], 'disabled')}`);
				const waiting = canvas.getByTestId(`button-key-${buttonKeyId(BUTTON_ROWS[0], 'loading')}`);

				await expect(getComputedStyle(rest).cursor).toBe('pointer');
				await expect(getComputedStyle(blocked).cursor).toBe('not-allowed');
				await expect(getComputedStyle(waiting).cursor).toBe('wait');
				await expect(rest).not.toHaveAttribute('data-disabled');
				await expect(blocked).toHaveAttribute('data-disabled');
				await expect(waiting).not.toHaveAttribute('data-disabled');
			},
		);

		await step(
			'a key shows as pressed through the prop, a disabled one stays at rest',
			async () => {
				for (const value of PRESS_KEYS) {
					expectAtRest(canvas.getByTestId(`rest-${value}`));
					expectPressed(canvas.getByTestId(`pressed-${value}`));
				}

				expectAtRest(canvas.getByTestId('pressed-disabled'));

				for (const shortcut of ['pressed-chord', 'pressed-sequence']) {
					for (const index of [0, 1]) {
						expectPressed(canvas.getByTestId(`${shortcut}-key-${index}`));
					}
				}

				for (const index of [0, 1]) {
					expectAtRest(canvas.getByTestId(`pressed-disabled-chord-key-${index}`));
				}
			},
		);

		// Last: an open menu dismisses on a press outside it, and the steps above click the page.
		await step(
			'inside a dropdown row the key keeps the row height and takes its cursor',
			async () => {
				const body = within(canvasElement.ownerDocument.body);

				fireEvent.mouseDown(canvas.getByTestId('kbd-menu'));
				await body.findByTestId('kbd-menu-item-save');
				await waitForEffects();

				const save = body.getByTestId('kbd-menu-item-save');

				fireEvent.mouseMove(save.closest('[data-slot="dropdown-popup"]') ?? save);
				fireEvent.pointerEnter(save);
				fireEvent.mouseEnter(save);
				fireEvent.mouseMove(save);

				await waitFor(() => expect(save).toHaveAttribute('data-highlighted'));

				const pin = body.getByTestId('kbd-menu-item-pin');

				for (const { value, disabled } of SHORTCUT_ROWS) {
					const row = body.getByTestId(`kbd-menu-item-${value}`);

					expectSameHeight(row, pin);
					expectCursorOf(keyOf(row), row);

					if (disabled) {
						await expect(shortcutOf(row)).toHaveAttribute('data-disabled');
					} else {
						await expect(shortcutOf(row)).not.toHaveAttribute('data-disabled');
					}
				}
			},
		);
	},
};

/**
 * A command palette is a modal dialog, so its rows cannot share a page with the sections of
 * `KbdShowcase`. The play function opens it. The first row is highlighted by the palette itself,
 * and the key sits on a row at rest, a blocked one and a waiting one, next to a row with no key.
 */
export const InCommandRow: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	render: () => <CommandRows />,
	play: async ({ canvasElement, step }) => {
		const body = within(canvasElement.ownerDocument.body);

		await waitForEffects();
		await userEvent.click(within(canvasElement).getByRole('button', { name: 'Open palette' }));

		const field = await body.findByRole('combobox', { name: 'Command palette' });

		await waitFor(() => expect(field).toHaveFocus());

		await step('the palette highlights its first row', async () => {
			await waitFor(() =>
				expect(body.getByTestId('kbd-command-item-save')).toHaveAttribute('data-highlighted'),
			);
		});

		await step(
			'every row keeps the height of the row with no key, and the key takes its cursor',
			async () => {
				const pin = body.getByTestId('kbd-command-item-pin');

				for (const { value, disabled } of SHORTCUT_ROWS) {
					const row = body.getByTestId(`kbd-command-item-${value}`);

					expectSameHeight(row, pin);
					expectCursorOf(keyOf(row), row);

					if (disabled) {
						await expect(shortcutOf(row)).toHaveAttribute('data-disabled');
					} else {
						await expect(shortcutOf(row)).not.toHaveAttribute('data-disabled');
					}
				}
			},
		);
	},
};
