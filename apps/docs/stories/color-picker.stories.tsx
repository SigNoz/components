import {
	Button,
	ButtonColor,
	ButtonVariant,
	ColorPicker,
	type ColorPickerProps,
	Typography,
} from '@signozhq/ui';
import { ForceOpenProvider } from '@signozhq/ui/testing';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
	type ButtonHTMLAttributes,
	type CSSProperties,
	type ReactElement,
	type ReactNode,
	type RefAttributes,
	useEffect,
	useState,
} from 'react';
import { expect, fireEvent, fn, waitFor, within } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import styles from './color-picker.stories.module.css';
import { colorPickerArgTypes } from './shared/color-picker-arg-types.js';
import { waitForEffects } from './shared/play.js';

// The stories write the picker without `nullable`, so their args take the props it has then.
type PlainColorPicker = (
	props: Extract<ColorPickerProps, { nullable?: never }> & RefAttributes<HTMLElement>,
) => ReactElement;

const meta: Meta<PlainColorPicker> = {
	title: 'Composed Components/ColorPicker',
	component: ColorPicker as PlainColorPicker,
	args: {
		side: 'bottom',
		align: 'start',
		nativeButton: true,
		allowClear: false,
		required: false,
		disabled: false,
		readOnly: false,
	},
	argTypes: colorPickerArgTypes,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Picks any color and reports it as a `#rrggbb` string, from a popup hung off a trigger you provide. The panel holds a saturation and brightness area, a hue strip, a preview and a hex field.',
			},
		},
	},
};

export default meta;
type Story = StoryObj<PlainColorPicker>;

/**
 * The fill of a swatch, read by `.swatch` and `.legendSwatch` through `--swatch`.
 */
function swatchStyle(color: string): CSSProperties {
	return { '--swatch': color } as CSSProperties;
}

/**
 * A channel of `#rrggbb` in linear light, the WCAG 2 relative luminance input.
 */
function linearChannel(hex: string, offset: number): number {
	const value = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;

	return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(hex: string): number {
	return (
		0.2126 * linearChannel(hex, 1) + 0.7152 * linearChannel(hex, 3) + 0.0722 * linearChannel(hex, 5)
	);
}

/**
 * The text panel background's footer: the better of white and black text on the color, and its
 * WCAG contrast ratio. It is passed the draft color, so it follows the drag.
 */
function ContrastNote({ background }: { background: string }): ReactElement {
	const luminance = relativeLuminance(background);
	const onWhite = 1.05 / (luminance + 0.05);
	const onBlack = (luminance + 0.05) / 0.05;
	const [text, ratio] = onWhite >= onBlack ? ['White', onWhite] : ['Black', onBlack];

	return (
		<Typography
			as="p"
			variant="paragraph"
			size="small"
			weight="regular"
			color="secondary"
			textOverflow="wrap"
			aria-live="polite"
		>
			{text} text reads at {ratio.toFixed(1)}:1
			{ratio < 4.5 ? ', under the 4.5:1 that body text needs.' : '.'}
		</Typography>
	);
}

function Hint({ children }: { children: ReactNode }): ReactElement {
	return (
		<Typography
			as="p"
			variant="paragraph"
			size="small"
			weight="regular"
			color="tertiary"
			textOverflow="wrap"
			marginBottom={4}
		>
			{children}
		</Typography>
	);
}

function Result({ testId, children }: { testId: string; children: ReactNode }): ReactElement {
	return (
		<Typography
			as="p"
			variant="paragraph"
			size="small"
			weight="regular"
			color="secondary"
			textOverflow="wrap"
			marginTop={6}
			testId={testId}
		>
			{children}
		</Typography>
	);
}

function Label({ children }: { children: ReactNode }): ReactElement {
	return (
		<Typography
			as="span"
			variant="label"
			size="small"
			weight="medium"
			color="inherit"
			textOverflow="visible"
		>
			{children}
		</Typography>
	);
}

type SwatchProps = Pick<
	ButtonHTMLAttributes<HTMLButtonElement>,
	'className' | 'style' | 'aria-label'
> & {
	'data-empty'?: true;
};

/**
 * A swatch trigger, spread onto a plain `<button>`: the picker merges its props
 * into the element it is given, and a function component in between would swallow them.
 */
function swatchProps(color: string | undefined, label: string): SwatchProps {
	return {
		className: styles.swatch,
		style: color === undefined ? undefined : swatchStyle(color),
		'data-empty': color === undefined || undefined,
		'aria-label': `${label}, ${color ?? 'no color'}`,
	};
}

type PlaygroundProps = Parameters<NonNullable<Story['render']>>[0];

/**
 * Owns the value, as a call site does, so the swatch shows the color.
 */
function PlaygroundView({ defaultValue, onChange, ...args }: PlaygroundProps): ReactElement {
	const [color, setColor] = useState(defaultValue);

	return (
		<div className={styles.roomBelow}>
			<Hint>
				Press the swatch. The area takes the focus: the arrows move saturation and brightness, Tab
				reaches the hue strip and the hex field, and Escape closes it.
			</Hint>
			<ColorPicker
				{...args}
				value={color}
				onChange={(next) => {
					setColor(next);
					onChange?.(next);
				}}
			>
				<button type="button" {...swatchProps(color, 'Accent color')} />
			</ColorPicker>
		</div>
	);
}

/**
 * The playground the Controls table drives.
 */
export const Playground: Story = {
	args: {
		defaultValue: '#4e74f8',
		testId: 'color-picker-playground',
		disabledTooltip: 'Pick a data source first',
		readOnlyTooltip: 'Set by the dashboard owner',
		onChange: fn(),
		onAfterChange: fn(),
	},
	parameters: {
		// Every state the picker can be driven into is held open at once by `ColorPickerShowcase`.
		chromatic: { disableSnapshot: true },
	},
	// Remounts on a new `defaultValue`, which only seeds the state.
	render: (args) => <PlaygroundView key={String(args.defaultValue)} {...args} />,
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByTestId('color-picker-playground');

		await waitForEffects();
		fireEvent.click(trigger);

		const saturation = await waitFor(() => {
			const input = within(getNode('color-picker-playground-area')).getByRole('slider', {
				name: 'Saturation',
			});

			expect(input).toHaveFocus();

			return input;
		});

		fireEvent.keyDown(saturation, { key: 'ArrowLeft' });

		const field = getNode('color-picker-playground-hex');

		await waitFor(() => expect(field).not.toHaveValue('4e74f8'));

		const picked = `#${(field as HTMLInputElement).value}`;

		expect(args.onChange).toHaveBeenCalledTimes(1);
		expect(args.onChange).toHaveBeenCalledWith(picked);
		expect(args.onAfterChange).toHaveBeenCalledTimes(1);
		expect(args.onAfterChange).toHaveBeenCalledWith(picked);
		expect(trigger).toHaveAccessibleName(`Accent color, ${picked}`);

		fireEvent.keyDown(saturation, { key: 'Escape' });

		await waitFor(() => expect(trigger).toHaveFocus());
		expect(document.querySelector('[data-testid="color-picker-playground-popup"]')).toBeNull();
	},
};

function getNode(testId: string): HTMLElement {
	// The popups are portalled to `document.body`, so none of them is inside the canvas element.
	const node = document.querySelector<HTMLElement>(`[data-testid="${testId}"]`);

	if (node === null) {
		throw new Error(`ColorPicker stories: no node named "${testId}".`);
	}

	return node;
}

/**
 * The window height, so the popup grid can remount when a snapshot tool grows the viewport.
 *
 * Base UI flips a popup whose trigger is below the fold to open upwards, and keeps it flipped
 * while it stays open. The tools shoot a tall page by growing the viewport after the story has
 * rendered, so the popups have to open again once it has grown.
 */
function useWindowHeight(): number {
	const [height, setHeight] = useState(() => window.innerHeight);

	useEffect(() => {
		const onResize = (): void => setHeight(window.innerHeight);

		window.addEventListener('resize', onResize);

		return () => window.removeEventListener('resize', onResize);
	}, []);

	return height;
}

function ShowcaseCell({
	title,
	note,
	short = false,
	testId,
	children,
}: {
	title: string;
	note: ReactNode;
	short?: boolean;
	testId: string;
	children: ReactNode;
}): ReactElement {
	return (
		<div
			className={`story-section ${short ? styles.cellShort : styles.cell}`}
			data-testid={`${testId}-cell`}
		>
			<Typography
				as="p"
				variant="paragraph"
				size="base"
				weight="bold"
				color="inherit"
				textOverflow="wrap"
			>
				{title}
			</Typography>
			<Typography
				as="p"
				variant="paragraph"
				size="small"
				weight="regular"
				color="secondary"
				textOverflow="wrap"
				marginBottom={4}
			>
				{note}
			</Typography>
			{children}
		</div>
	);
}

/**
 * The popups the showcase holds open. The disabled cell is not one: it stays closed under
 * `ForceOpenProvider`.
 */
const OPEN_POPUPS = [
	'showcase-color',
	'showcase-empty',
	'showcase-alpha',
	'showcase-clear',
	'showcase-footer',
	'showcase-invalid',
	'showcase-readonly',
];

function ColorPickerShowcaseView(): ReactElement {
	const windowHeight = useWindowHeight();

	return (
		<div className="story-container-full">
			<Typography
				as="p"
				variant="paragraph"
				size="small"
				weight="regular"
				color="inherit"
				textOverflow="wrap"
			>
				Every popup below is held open by <code>ForceOpenProvider</code>, so they all fit in one
				snapshot. Without it, the popup that opens last takes the focus and closes the rest.
			</Typography>
			<ForceOpenProvider>
				<div key={windowHeight} className={`${styles.showcaseGrid} ${styles.marginTopMedium}`}>
					<ShowcaseCell
						testId="showcase-color"
						title="A color"
						note={
							<>
								The area is painted for the hue, the preview sits next to the hue strip, and the hex
								field shows the six digits. The hue strip holds the keyboard focus here.
							</>
						}
					>
						<ColorPicker
							nativeButton
							side="bottom"
							align="start"
							testId="showcase-color"
							defaultValue="#4e74f8"
						>
							<button type="button" {...swatchProps('#4e74f8', 'Series color')} />
						</ColorPicker>
					</ShowcaseCell>

					<ShowcaseCell
						testId="showcase-empty"
						title="No color"
						note={
							<>
								<code>undefined</code> or <code>&apos;&apos;</code>. The panel opens at{' '}
								<code>#000000</code>, the hex field is empty and the preview shows the empty
								pattern. The first change sets a color.
							</>
						}
					>
						<ColorPicker nativeButton side="bottom" align="start" testId="showcase-empty">
							<button type="button" {...swatchProps(undefined, 'Base color')} />
						</ColorPicker>
					</ShowcaseCell>

					<ShowcaseCell
						testId="showcase-alpha"
						title="Read as written, written as hex"
						note={
							<>
								A saved <code>#3A2A6380</code> shows as <code>3a2a63</code>: the alpha is dropped
								and the case lowered. Nothing is written until the user changes the color.
							</>
						}
					>
						<ColorPicker
							nativeButton
							side="bottom"
							align="start"
							testId="showcase-alpha"
							defaultValue="#3A2A6380"
						>
							<button type="button" {...swatchProps('#3a2a63', 'Threshold color')} />
						</ColorPicker>
					</ShowcaseCell>

					<ShowcaseCell
						testId="showcase-clear"
						title="allowClear"
						note={
							<>
								The clear button sits at the end of the hex field while there is a color. It calls{' '}
								<code>onChange</code> with <code>undefined</code> and closes the popup.
							</>
						}
					>
						<ColorPicker
							nativeButton
							side="bottom"
							align="start"
							testId="showcase-clear"
							defaultValue="#e5484d"
							allowClear
						>
							<button type="button" {...swatchProps('#e5484d', 'Highlight color')} />
						</ColorPicker>
					</ShowcaseCell>

					<ShowcaseCell
						testId="showcase-footer"
						title="Footer"
						note={
							<>
								<code>footer</code> renders under the hex field and receives the color the panel
								shows. It wraps inside the popup width, and the popup grows in height with it.
							</>
						}
					>
						<ColorPicker
							nativeButton
							side="bottom"
							align="start"
							testId="showcase-footer"
							defaultValue="#f5d90a"
							footer={(color) => <ContrastNote background={color} />}
						>
							<button type="button" {...swatchProps('#f5d90a', 'Panel background')} />
						</ColorPicker>
					</ShowcaseCell>

					<ShowcaseCell
						testId="showcase-invalid"
						title="Hex text that is not a color"
						note={
							<>
								The field takes three or six digits. While the text is not a color it carries{' '}
								<code>aria-invalid</code>, and the blur puts the color back. Typing never moves the
								panel.
							</>
						}
					>
						<ColorPicker
							nativeButton
							side="bottom"
							align="start"
							testId="showcase-invalid"
							defaultValue="#30a46c"
						>
							<button type="button" {...swatchProps('#30a46c', 'Threshold color')} />
						</ColorPicker>
					</ShowcaseCell>

					<ShowcaseCell
						testId="showcase-readonly"
						title="Read-only"
						note={
							<>
								The popup still opens, so the hex can be read and copied. The area and the hue strip
								stay focusable and change nothing, and <code>allowClear</code> renders no button.
							</>
						}
					>
						<ColorPicker
							nativeButton
							side="bottom"
							align="start"
							testId="showcase-readonly"
							defaultValue="#8e4ec6"
							allowClear
							readOnly
							readOnlyTooltip="Set by the dashboard owner"
						>
							<button type="button" {...swatchProps('#8e4ec6', 'Series color')} />
						</ColorPicker>
					</ShowcaseCell>

					<ShowcaseCell
						testId="showcase-disabled"
						short
						title="Disabled"
						note={
							<>
								Stays closed, even under <code>ForceOpenProvider</code>. The trigger carries{' '}
								<code>aria-disabled</code> and <code>data-disabled</code>, never the native
								attribute, so the reason opens on hover and on focus. It is held open here.
							</>
						}
					>
						<div className={styles.tooltipRoom}>
							<ColorPicker
								nativeButton
								side="bottom"
								align="start"
								testId="showcase-disabled"
								defaultValue="#4e74f8"
								disabled
								disabledTooltip="Pick a data source first"
							>
								<button type="button" {...swatchProps('#4e74f8', 'Series color')} />
							</ColorPicker>
						</div>
					</ShowcaseCell>
				</div>
			</ForceOpenProvider>
		</div>
	);
}

/**
 * Every state of the panel held open in one snapshot: a color, no color, a value read with its
 * alpha dropped, the clear button, a footer, invalid hex text, read-only, and the disabled trigger
 * with its reason. The call sites (`PresetSwatches`, `LegendRows`), clearing and forms are stories
 * of their own, because their `play` drives a single picker open and closed from a fresh mount.
 */
export const ColorPickerShowcase: Story = {
	parameters: {
		layout: 'fullscreen',
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	render: () => <ColorPickerShowcaseView />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		await waitFor(() =>
			expect(document.querySelectorAll('[data-slot="color-picker-popup"]')).toHaveLength(
				OPEN_POPUPS.length,
			),
		);
		await waitForEffects();

		for (const testId of OPEN_POPUPS) {
			const trigger = within(canvas.getByTestId(`${testId}-cell`)).getByTestId(testId);

			expect(trigger).toHaveAttribute('aria-expanded', 'true');
			expect(trigger).toHaveAttribute('data-popup-open');
		}

		expect(getNode('showcase-color-hex')).toHaveValue('4e74f8');
		expect(getNode('showcase-empty-hex')).toHaveValue('');
		expect(getNode('showcase-empty-preview')).toHaveAttribute('data-empty');
		expect(getNode('showcase-alpha-hex')).toHaveValue('3a2a63');
		expect(getNode('showcase-clear-clear')).toHaveAccessibleName('Clear color');
		expect(getNode('showcase-footer-footer')).toHaveTextContent(/reads at \d+\.\d:1/);
		expect(getNode('showcase-readonly-popup')).toHaveAttribute('data-readonly');
		expect(getNode('showcase-readonly-hex')).toHaveAttribute('readonly');
		expect(document.querySelector('[data-testid="showcase-readonly-clear"]')).toBeNull();

		const disabledTrigger = within(canvas.getByTestId('showcase-disabled-cell')).getByTestId(
			'showcase-disabled',
		);

		expect(disabledTrigger).toHaveAttribute('aria-disabled', 'true');
		expect(disabledTrigger).not.toHaveAttribute('disabled');
		expect(document.querySelector('[data-testid="showcase-disabled-popup"]')).toBeNull();

		// Each popup moved the focus to its area as it opened. Focusing one hue strip last leaves a
		// single focus ring in the snapshot, and a focus that leaves a forced popup does not close it.
		within(getNode('showcase-color-hue')).getByRole('slider', { name: 'Hue' }).focus();

		// Typed without the focus, which would put the field in edit mode with the panel's digits.
		const invalidField = getNode('showcase-invalid-hex');

		fireEvent.change(invalidField, { target: { value: '30a4zz' } });
		await waitFor(() => expect(invalidField).toHaveAttribute('aria-invalid', 'true'));
		expect(invalidField).toHaveAttribute('data-invalid');
		expect(getNode('showcase-invalid-preview')).not.toHaveAttribute('data-empty');

		// Base UI opens a tooltip when the pointer enters its trigger. Hovering is not a press, so
		// the popups stay as they are.
		fireEvent.pointerEnter(disabledTrigger);
		fireEvent.mouseEnter(disabledTrigger);
		fireEvent.mouseMove(disabledTrigger);

		await waitFor(() =>
			expect(document.querySelectorAll('[data-slot="tooltip-content"]')).toHaveLength(1),
		);
		expect(document.querySelectorAll('[data-slot="color-picker-popup"]')).toHaveLength(
			OPEN_POPUPS.length,
		);
	},
};

/**
 * The text panel background: two presets that are not colors, eight colors, and the custom slot
 * that opens the picker. `''` is the default panel, `'transparent'` no fill.
 */
const BACKGROUND_PRESETS = [
	{ value: '', label: 'Default panel' },
	{ value: 'transparent', label: 'Transparent' },
	{ value: '#e5484d', label: 'Red' },
	{ value: '#f76b15', label: 'Orange' },
	{ value: '#f5d90a', label: 'Yellow' },
	{ value: '#30a46c', label: 'Green' },
	{ value: '#12a594', label: 'Teal' },
	{ value: '#4e74f8', label: 'Blue' },
	{ value: '#8e4ec6', label: 'Purple' },
	{ value: '#d6409f', label: 'Pink' },
];

/**
 * Where the custom slot starts while a preset holds the value.
 */
const CUSTOM_START = '#6e56cf';

function PresetSwatchesView({
	onAfterChange,
}: {
	onAfterChange?: (value: string | undefined) => void;
}): ReactElement {
	const [background, setBackground] = useState('');
	const isCustom = !BACKGROUND_PRESETS.some((preset) => preset.value === background);
	const customColor = isCustom ? background : CUSTOM_START;

	return (
		<div className={styles.roomBelow}>
			<Hint>
				The picker is the last slot of a preset row, the path to any other color. It is controlled
				and only updates in <code>onAfterChange</code>, so the dashboard is written once per change,
				while the panel and the contrast note still follow the drag.
			</Hint>
			<fieldset className={styles.fieldset}>
				<legend className={styles.legend}>
					<Label>Background</Label>
				</legend>
				<div className={styles.row}>
					{BACKGROUND_PRESETS.map((preset) => (
						<button
							key={preset.label}
							type="button"
							className={styles.swatch}
							style={
								preset.value === 'transparent'
									? undefined
									: swatchStyle(preset.value === '' ? 'var(--l1-background)' : preset.value)
							}
							data-transparent={preset.value === 'transparent' || undefined}
							aria-label={preset.label}
							aria-pressed={background === preset.value}
							onClick={() => setBackground(preset.value)}
						/>
					))}
					<ColorPicker
						nativeButton
						side="bottom"
						align="start"
						testId="background-custom"
						value={customColor}
						onAfterChange={(next) => {
							onAfterChange?.(next);

							if (next !== undefined) {
								setBackground(next);
							}
						}}
						footer={(color) => <ContrastNote background={color} />}
					>
						<button
							type="button"
							className={styles.swatch}
							style={isCustom ? swatchStyle(customColor) : undefined}
							data-any-color={!isCustom || undefined}
							aria-label={isCustom ? `Custom color, ${customColor}` : 'Custom color'}
							aria-pressed={isCustom}
						/>
					</ColorPicker>
				</div>
			</fieldset>
			<Result testId="background-result">
				Stored background: {background === '' ? "'' (default panel)" : background}
			</Result>
		</div>
	);
}

/**
 * The swatch row with a custom slot, as the heatmap base color, the text panel background and the
 * threshold color fields use it. The footer is the contrast note.
 */
export const PresetSwatches: Story = {
	args: { onAfterChange: fn() },
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	render: ({ onAfterChange }) => <PresetSwatchesView onAfterChange={onAfterChange} />,
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);
		const custom = canvas.getByTestId('background-custom');

		await waitForEffects();
		expect(custom).toHaveAttribute('aria-pressed', 'false');

		fireEvent.click(custom);

		const area = await waitFor(() => getNode('background-custom-area'));
		const saturation = within(area).getByRole('slider', { name: 'Saturation' });

		expect(getNode('background-custom-footer')).toHaveTextContent(/reads at \d+\.\d:1/);

		fireEvent.keyDown(saturation, { key: 'ArrowLeft', shiftKey: true });

		await waitFor(() => expect(custom).toHaveAttribute('aria-pressed', 'true'));

		const picked = `#${(getNode('background-custom-hex') as HTMLInputElement).value}`;

		expect(picked).not.toBe(CUSTOM_START);
		expect(args.onAfterChange).toHaveBeenCalledTimes(1);
		expect(args.onAfterChange).toHaveBeenCalledWith(picked);
		expect(canvas.getByTestId('background-result')).toHaveTextContent(picked);
		expect(custom).toHaveAccessibleName(`Custom color, ${picked}`);

		fireEvent.keyDown(saturation, { key: 'Escape' });
		await waitFor(() => expect(custom).toHaveFocus());

		// A preset takes the value back, and the custom slot returns to where it starts.
		fireEvent.click(canvas.getByRole('button', { name: 'Transparent' }));
		await waitFor(() => expect(custom).toHaveAttribute('aria-pressed', 'false'));
		expect(canvas.getByTestId('background-result')).toHaveTextContent('transparent');

		// Left open on the draft, which is what the snapshot should show.
		fireEvent.click(custom);
		await waitFor(() => expect(getNode('background-custom-popup')).toBeVisible());
	},
};

const SERIES = [
	{ label: 'cpu.user', auto: '#4e74f8' },
	{ label: 'cpu.system', auto: '#f76b15' },
	{ label: 'cpu.iowait', auto: '#30a46c' },
	{ label: 'cpu.steal', auto: '#d6409f' },
];

function LegendRowsView(): ReactElement {
	const [overrides, setOverrides] = useState<Record<string, string>>({});

	return (
		<div className={styles.roomBelow}>
			<Hint>
				The whole legend row is the trigger. Its name carries the hex, so a screen reader hears
				which color the series has. Reset appears once a series has its own color.
			</Hint>
			<div className={styles.legendList}>
				{SERIES.map((series) => {
					const color = overrides[series.label] ?? series.auto;

					return (
						<div key={series.label} className={styles.legendItem}>
							<ColorPicker
								nativeButton
								side="bottom"
								align="start"
								testId={`legend-${series.label}`}
								value={color}
								onAfterChange={(next) => {
									if (next !== undefined) {
										setOverrides((current) => ({ ...current, [series.label]: next }));
									}
								}}
							>
								<button
									type="button"
									className={styles.legendRow}
									aria-label={`Series color for ${series.label}, ${color}`}
								>
									<span className={styles.legendSwatch} style={swatchStyle(color)} />
									<Typography
										as="span"
										variant="label"
										size="small"
										weight="regular"
										color="inherit"
										textOverflow="ellipsis"
										display="block"
									>
										{series.label}
									</Typography>
								</button>
							</ColorPicker>
							{overrides[series.label] !== undefined && (
								<Button
									variant={ButtonVariant.Ghost}
									color={ButtonColor.Secondary}
									size="sm"
									aria-label={`Reset the color of ${series.label}`}
									onClick={() => setOverrides(({ [series.label]: _removed, ...rest }) => rest)}
								>
									Reset
								</Button>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}

/**
 * The legend list of the panel editor: one picker per series, and the row as its trigger. A typed
 * hex commits on `Enter` and keeps the popup open.
 */
export const LegendRows: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		controls: { disable: true },
	},
	render: () => <LegendRowsView />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const row = canvas.getByRole('button', { name: 'Series color for cpu.system, #f76b15' });

		await waitForEffects();
		fireEvent.click(row);

		const field = await waitFor(() => getNode('legend-cpu.system-hex'));

		expect(field).toHaveValue('f76b15');
		expect(getNode('legend-cpu.system-popup')).toHaveAccessibleName(
			'Series color for cpu.system, #f76b15',
		);

		// Typing calls nothing. Pasted upper case with a `#` is read as lower case digits.
		fireEvent.change(field, { target: { value: '#12A594' } });
		expect(row).toHaveAccessibleName('Series color for cpu.system, #f76b15');

		fireEvent.keyDown(field, { key: 'Enter' });

		await waitFor(() => expect(row).toHaveAccessibleName('Series color for cpu.system, #12a594'));
		expect(field).toHaveValue('12a594');
		expect(getNode('legend-cpu.system-popup')).toBeVisible();

		fireEvent.keyDown(field, { key: 'Escape' });
		await waitFor(() => expect(row).toHaveFocus());

		const reset = canvas.getByRole('button', { name: 'Reset the color of cpu.system' });

		fireEvent.click(reset);
		await waitFor(() => expect(row).toHaveAccessibleName('Series color for cpu.system, #f76b15'));
		expect(canvas.queryByRole('button', { name: 'Reset the color of cpu.system' })).toBeNull();

		// Left open, so the snapshot shows the row as the trigger with its popup under it.
		fireEvent.click(row);
		await waitFor(() => expect(getNode('legend-cpu.system-popup')).toBeVisible());
	},
};

function ClearingView({
	onChange,
}: {
	onChange?: (value: string | undefined) => void;
}): ReactElement {
	const [color, setColor] = useState<string | undefined>('#e5484d');

	return (
		<div className={styles.roomBelow}>
			<Hint>
				With <code>allowClear</code>, the clear button in the hex field, or Delete and Backspace on
				the closed trigger, take the picker back to no color.
			</Hint>
			<div className={styles.row}>
				<Label>Highlight</Label>
				<ColorPicker
					nativeButton
					side="bottom"
					align="start"
					testId="highlight"
					allowClear
					value={color}
					onChange={(next) => {
						onChange?.(next);
						setColor(next);
					}}
				>
					<button type="button" {...swatchProps(color, 'Highlight color')} />
				</ColorPicker>
			</div>
			<Result testId="highlight-result">Stored: {color ?? 'undefined (no highlight)'}</Result>
		</div>
	);
}

/**
 * `allowClear`: the clear button closes the popup and leaves the focus on the trigger, and `Delete`
 * on the closed trigger does the same. Without a color there is nothing to clear.
 */
export const Clearing: Story = {
	args: { onChange: fn() },
	parameters: {
		// Every state it passes through is held open in `ColorPickerShowcase`.
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	render: ({ onChange }) => <ClearingView onChange={onChange} />,
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByTestId('highlight');

		await waitForEffects();
		fireEvent.click(trigger);

		const clear = await waitFor(() => getNode('highlight-clear'));

		fireEvent.click(clear);

		await waitFor(() =>
			expect(document.querySelector('[data-testid="highlight-popup"]')).toBeNull(),
		);
		await waitFor(() => expect(trigger).toHaveFocus());
		expect(args.onChange).toHaveBeenLastCalledWith(undefined);
		expect(trigger).toHaveAccessibleName('Highlight color, no color');

		// No color: no clear button, an empty field, and the preview shows the empty pattern.
		fireEvent.click(trigger);

		const field = await waitFor(() => getNode('highlight-hex'));

		expect(field).toHaveValue('');
		expect(getNode('highlight-preview')).toHaveAttribute('data-empty');
		expect(document.querySelector('[data-testid="highlight-clear"]')).toBeNull();

		fireEvent.change(field, { target: { value: 'fd0' } });
		fireEvent.keyDown(field, { key: 'Enter' });

		await waitFor(() => expect(trigger).toHaveAccessibleName('Highlight color, #ffdd00'));
		expect(getNode('highlight-clear')).toBeVisible();

		fireEvent.keyDown(field, { key: 'Escape' });
		await waitFor(() => expect(trigger).toHaveFocus());

		fireEvent.keyDown(trigger, { key: 'Delete' });
		await waitFor(() => expect(trigger).toHaveAccessibleName('Highlight color, no color'));
		expect(canvas.getByTestId('highlight-result')).toHaveTextContent('undefined');
	},
};

function InAFormView(): ReactElement {
	const [threshold, setThreshold] = useState<string | undefined>();
	const [submitted, setSubmitted] = useState<string>('Nothing submitted yet.');

	return (
		<div className={styles.roomBelow}>
			<Hint>
				Each picker submits <code>#rrggbb</code> under its <code>name</code>. A required picker with
				no color blocks the submit and takes the focus. Read-only is submitted, disabled is left
				out.
			</Hint>
			<form
				className={styles.form}
				onSubmit={(event) => {
					event.preventDefault();
					const entries = [...new FormData(event.currentTarget).entries()];

					setSubmitted(
						`Submitted ${entries.map(([key, value]) => `${key}=${String(value)}`).join(', ')}`,
					);
				}}
				onInvalid={() => setSubmitted('Blocked: the threshold needs a color.')}
			>
				<div className={styles.field}>
					<Label>Threshold color</Label>
					<ColorPicker
						nativeButton
						side="bottom"
						align="start"
						testId="form-threshold"
						name="threshold"
						required
						value={threshold}
						onAfterChange={setThreshold}
					>
						<button type="button" {...swatchProps(threshold, 'Threshold color')} />
					</ColorPicker>
				</div>
				<div className={styles.field}>
					<Label>Brand color</Label>
					<ColorPicker
						nativeButton
						side="bottom"
						align="start"
						testId="form-brand"
						name="brand"
						defaultValue="#4e74f8"
						readOnly
						readOnlyTooltip="Set by your workspace admin"
					>
						<button type="button" {...swatchProps('#4e74f8', 'Brand color')} />
					</ColorPicker>
				</div>
				<div className={styles.field}>
					<Label>Annotation color</Label>
					<ColorPicker
						nativeButton
						side="bottom"
						align="start"
						testId="form-annotation"
						name="annotation"
						defaultValue="#f76b15"
						disabled
						disabledTooltip="Turn annotations on first"
					>
						<button type="button" {...swatchProps('#f76b15', 'Annotation color')} />
					</ColorPicker>
				</div>
				<Button
					variant={ButtonVariant.Solid}
					color={ButtonColor.Primary}
					size="md"
					type="submit"
					testId="form-submit"
				>
					Save
				</Button>
			</form>
			<Result testId="form-result">{submitted}</Result>
		</div>
	);
}

/**
 * The hidden input each picker renders, and how `required`, `readOnly` and `disabled` reach the
 * submit.
 */
export const InAForm: Story = {
	parameters: {
		// Every state it passes through is held open in `ColorPickerShowcase`.
		chromatic: { disableSnapshot: true },
		controls: { disable: true },
	},
	render: () => <InAFormView />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const threshold = canvas.getByTestId('form-threshold');
		const result = canvas.getByTestId('form-result');

		await waitForEffects();
		fireEvent.click(canvas.getByTestId('form-submit'));

		await waitFor(() => expect(result).toHaveTextContent('Blocked'));
		await waitFor(() => expect(threshold).toHaveFocus());

		fireEvent.click(threshold);

		const field = await waitFor(() => getNode('form-threshold-hex'));

		fireEvent.change(field, { target: { value: 'e5484d' } });
		fireEvent.keyDown(field, { key: 'Enter' });
		await waitFor(() => expect(threshold).toHaveAccessibleName('Threshold color, #e5484d'));

		fireEvent.keyDown(field, { key: 'Escape' });
		await waitFor(() => expect(threshold).toHaveFocus());

		fireEvent.click(canvas.getByTestId('form-submit'));
		await waitFor(() =>
			expect(result).toHaveTextContent('Submitted threshold=#e5484d, brand=#4e74f8'),
		);
		expect(result).not.toHaveTextContent('annotation');
	},
};
