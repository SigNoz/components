import { Calendar, type CalendarProps, Typography } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactElement, type ReactNode, useState } from 'react';
import { fn } from 'storybook/test';
import { allModes } from '../.storybook/modes.js';
import styles from './calendar.stories.module.css';

/** Wednesday 11 June 2025: mid-week, mid-month, so every story reads the same on every run. */
const TODAY = new Date(2025, 5, 11);

const day = (date: number): Date => new Date(2025, 5, date);

/**
 * `CalendarProps` is a union discriminated on `mode`, and each arm types `selected` and `onSelect`
 * differently. `Omit` over that union keeps only the props every arm shares, which is what the
 * playground can forward blindly; the selection itself is picked per mode below.
 */
type CalendarPlaygroundProps = Omit<CalendarProps, 'mode' | 'selected' | 'onSelect'> & {
	mode?: 'single' | 'multiple' | 'range';
	onSelect?: (...selection: unknown[]) => void;
};

const meta: Meta<typeof Calendar> = {
	title: 'Primitive Components/Calendar',
	component: Calendar,
	args: {
		onSelect: fn(),
		mode: 'single',
		captionLayout: 'label',
		showOutsideDays: true,
		numberOfMonths: 1,
	},
	argTypes: {
		mode: {
			control: 'select',
			options: ['single', 'multiple', 'range'],
			description: 'How many days can be selected at once, and what `selected` holds.',
			table: {
				category: 'Selection',
				type: { summary: "'single' | 'multiple' | 'range'" },
			},
		},
		selected: {
			control: false,
			description: 'The current selection. Its shape follows `mode`.',
			table: { category: 'Selection', type: { summary: 'Date | Date[] | DateRange' } },
		},
		required: {
			control: 'boolean',
			description: 'Stops the selection from being cleared once a day has been picked.',
			table: { category: 'Selection', type: { summary: 'boolean' } },
		},
		disabled: {
			control: false,
			description: 'Matchers for the days that cannot be picked.',
			table: { category: 'Selection', type: { summary: 'Matcher | Matcher[]' } },
		},
		captionLayout: {
			control: 'select',
			options: ['label', 'dropdown', 'dropdown-months', 'dropdown-years'],
			description:
				'Whether the month and year read as plain text or as dropdowns you can navigate with.',
			table: {
				category: 'Appearance',
				type: { summary: "'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years'" },
				defaultValue: { summary: 'label' },
			},
		},
		showOutsideDays: {
			control: 'boolean',
			description: 'Fills the first and last week with the days of the neighbouring months.',
			table: {
				category: 'Appearance',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'true' },
			},
		},
		numberOfMonths: {
			control: { type: 'number', min: 1, max: 3 },
			description: 'How many months are shown side by side.',
			table: {
				category: 'Appearance',
				type: { summary: 'number' },
				defaultValue: { summary: '1' },
			},
		},
		fixedWeeks: {
			control: 'boolean',
			description: 'Always draws six weeks, so the grid does not change height between months.',
			table: { category: 'Appearance', type: { summary: 'boolean' } },
		},
		hideWeekdays: {
			control: 'boolean',
			description: 'Drops the row of weekday names above the grid.',
			table: { category: 'Appearance', type: { summary: 'boolean' } },
		},
		showWeekNumber: {
			control: 'boolean',
			description: 'Adds a column with the number of each week in the year.',
			table: { category: 'Appearance', type: { summary: 'boolean' } },
		},
		hideNavigation: {
			control: 'boolean',
			description: 'Drops the month arrows.',
			table: { category: 'Behavior', type: { summary: 'boolean' } },
		},
		disableNavigation: {
			control: 'boolean',
			description: 'Keeps the calendar on one month, arrows and dropdowns included.',
			table: { category: 'Behavior', type: { summary: 'boolean' } },
		},
		animate: {
			control: 'boolean',
			description: 'Slides between months instead of swapping them.',
			table: { category: 'Behavior', type: { summary: 'boolean' } },
		},
		weekStartsOn: {
			control: 'select',
			options: [0, 1, 2, 3, 4, 5, 6],
			description: 'Which day the week starts on, `0` being Sunday.',
			table: { category: 'Behavior', type: { summary: '0 | 1 | 2 | 3 | 4 | 5 | 6' } },
		},
		timeZone: {
			control: 'text',
			description: 'IANA time zone the days are resolved in. Experimental upstream.',
			table: { category: 'Behavior', type: { summary: 'string' } },
		},
		locale: {
			control: false,
			description: 'A locale from `react-day-picker/locale`, which renames every label.',
			table: { category: 'Behavior', type: { summary: 'Locale' } },
		},
		components: {
			control: false,
			description: "Replaces one of react-day-picker's own components, `DayButton` included.",
			table: { category: 'Behavior', type: { summary: 'Partial<CustomComponents>' } },
		},
		footer: {
			control: 'text',
			description: 'Rendered under the grid in a live region, for a hint or the current selection.',
			table: { category: 'Accessibility', type: { summary: 'ReactNode' } },
		},
		onSelect: {
			control: false,
			description: 'Called with the new selection whenever a day is picked.',
			table: { category: 'Events' },
		},
		onMonthChange: {
			control: false,
			description: 'Called with the new month whenever the calendar navigates.',
			table: { category: 'Events' },
		},
		className: {
			control: 'text',
			description: "Merged onto the root element, after the calendar's own class.",
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		classNames: {
			control: false,
			description:
				"One class per part of the grid, appended to the calendar's own class for that part " +
				'rather than replacing it.',
			table: { category: 'Styling', type: { summary: 'Partial<ClassNames>' } },
		},
		testId: {
			control: 'text',
			description:
				'Forwarded to the root element as `data-testid`, and the stem every part below derives ' +
				'its own from, a date cell ending in `-button-{DD-MM-YYYY}`.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
	parameters: {
		layout: 'fullscreen',
		backgrounds: { disable: true },
		controls: { disable: false },
		docs: { source: { type: 'code' } },
	},
};

export default meta;
type Story = StoryObj<typeof Calendar>;

/**
 * `onSelect` is not a key of every arm of the union, so it cannot be read off the story args by
 * name. The story sets it, this finds it, and the playground decides which arm it belongs to.
 */
function storyOnSelect(args: object): ((...selection: unknown[]) => void) | undefined {
	return 'onSelect' in args ? (args.onSelect as (...selection: unknown[]) => void) : undefined;
}

/**
 * Drives whichever selection the `mode` control is on, so one playground covers all three.
 */
function CalendarPlayground({
	mode = 'single',
	onSelect,
	className,
	...args
}: CalendarPlaygroundProps): ReactElement {
	const calendarClassName = className ? `${styles.calendarCard} ${className}` : styles.calendarCard;

	const [single, setSingle] = useState<Date | undefined>(TODAY);
	const [multiple, setMultiple] = useState<Date[]>([day(9), day(11)]);
	const [range, setRange] = useState<{ from: Date | undefined; to?: Date }>({
		from: day(9),
		to: day(13),
	});

	if (mode === 'multiple') {
		return (
			<Calendar
				{...args}
				mode="multiple"
				today={TODAY}
				defaultMonth={TODAY}
				selected={multiple}
				onSelect={(value) => {
					setMultiple(value ?? []);
					onSelect?.(value);
				}}
				className={calendarClassName}
			/>
		);
	}

	if (mode === 'range') {
		return (
			<Calendar
				{...args}
				mode="range"
				today={TODAY}
				defaultMonth={TODAY}
				selected={range}
				onSelect={(value) => {
					setRange(value ?? { from: undefined });
					onSelect?.(value);
				}}
				className={calendarClassName}
			/>
		);
	}

	return (
		<Calendar
			{...args}
			mode="single"
			today={TODAY}
			defaultMonth={TODAY}
			selected={single}
			onSelect={(value) => {
				setSingle(value);
				onSelect?.(value);
			}}
			className={calendarClassName}
		/>
	);
}

export const Default: Story = {
	parameters: {
		// Playground: every state it can be driven into is covered by `CalendarShowcase`.
		chromatic: { disableSnapshot: true },
	},
	render: ({ mode, ...args }) => (
		<div className="story-container-full">
			<CalendarPlayground
				testId="default-calendar"
				{...args}
				mode={mode}
				onSelect={storyOnSelect(args)}
			/>
		</div>
	),
};

function Example({ title, children }: { title: string; children: ReactNode }): ReactElement {
	return (
		<div className={styles.calendarCell}>
			<Typography size="sm" weight="medium" className={styles.caption}>
				{title}
			</Typography>
			{children}
		</div>
	);
}

/**
 * The days the showcase forces a pseudo-state onto, keyed by the class the matcher writes on
 * the cell. `storybook-addon-pseudo-states` matches the button inside it.
 */
const PSEUDO_MODIFIERS = {
	pseudoHover: day(2),
	pseudoFocus: day(3),
	pseudoActive: day(4),
};

const PSEUDO_CLASS_NAMES = {
	pseudoHover: 'pseudo-hover',
	pseudoFocus: 'pseudo-focus',
	pseudoActive: 'pseudo-active',
};

/**
 * Every selection mode, caption, grid option and day state in one snapshot.
 */
export const CalendarShowcase: Story = {
	parameters: {
		chromatic: { disableSnapshot: false, modes: allModes },
		pseudo: {
			hover: '.pseudo-hover [data-variant="day"]',
			focusVisible: '.pseudo-focus [data-variant="day"]',
			active: '.pseudo-active [data-variant="day"]',
		},
	},
	render: () => (
		<div className="story-container-full">
			<div className={styles.columnLayout}>
				<div className="story-section">
					<Typography size="base" weight="semibold">
						Selection
					</Typography>
					<Typography size="sm">
						<code>mode</code> decides what <code>selected</code> holds. A day inside a range is
						painted from its position in that range, not as a selected day.
					</Typography>
					<div className={styles.calendarGrid}>
						<Example title="single">
							<Calendar
								mode="single"
								today={TODAY}
								defaultMonth={TODAY}
								selected={TODAY}
								onSelect={fn()}
								className={styles.calendarCard}
							/>
						</Example>
						<Example title="range">
							<Calendar
								mode="range"
								today={TODAY}
								defaultMonth={TODAY}
								selected={{ from: day(9), to: day(13) }}
								onSelect={fn()}
								className={styles.calendarCard}
							/>
						</Example>
						<Example title="multiple">
							<Calendar
								mode="multiple"
								today={TODAY}
								defaultMonth={TODAY}
								selected={[day(3), day(11), day(20)]}
								onSelect={fn()}
								className={styles.calendarCard}
							/>
						</Example>
					</div>
				</div>

				<div className="story-section">
					<Typography size="base" weight="semibold">
						Caption and navigation
					</Typography>
					<Typography size="sm">
						The arrows sit over the caption row, one cell wide each. At the edge of{' '}
						<code>startMonth</code> / <code>endMonth</code> the arrow stays in place and carries{' '}
						<code>aria-disabled</code>, so it keeps its slot in the layout.
					</Typography>
					<div className={styles.calendarGrid}>
						<Example title="label caption">
							<Calendar
								mode="single"
								today={TODAY}
								defaultMonth={TODAY}
								className={styles.calendarCard}
							/>
						</Example>
						<Example title="dropdown caption">
							<Calendar
								mode="single"
								captionLayout="dropdown"
								today={TODAY}
								defaultMonth={TODAY}
								startMonth={new Date(2024, 0)}
								endMonth={new Date(2026, 11)}
								className={styles.calendarCard}
							/>
						</Example>
						<Example title="previous month disabled">
							<Calendar
								mode="single"
								today={TODAY}
								defaultMonth={TODAY}
								startMonth={new Date(2025, 5)}
								className={styles.calendarCard}
							/>
						</Example>
						<Example title="no navigation">
							<Calendar
								mode="single"
								hideNavigation
								today={TODAY}
								defaultMonth={TODAY}
								className={styles.calendarCard}
							/>
						</Example>
						<Example title="two months">
							<Calendar
								mode="range"
								numberOfMonths={2}
								today={TODAY}
								defaultMonth={TODAY}
								selected={{ from: day(25), to: new Date(2025, 6, 4) }}
								onSelect={fn()}
								className={styles.calendarCard}
							/>
						</Example>
					</div>
				</div>

				<div className="story-section">
					<Typography size="base" weight="semibold">
						Grid
					</Typography>
					<Typography size="sm">
						Everything in the grid measures against <code>--calendar-cell-size</code>, the
						week-number column and the month arrows included.
					</Typography>
					<div className={styles.calendarGrid}>
						<Example title="outside days hidden">
							<Calendar
								mode="single"
								showOutsideDays={false}
								today={TODAY}
								defaultMonth={TODAY}
								className={styles.calendarCard}
							/>
						</Example>
						<Example title="week numbers">
							<Calendar
								mode="single"
								showWeekNumber
								today={TODAY}
								defaultMonth={TODAY}
								className={styles.calendarCard}
							/>
						</Example>
						<Example title="six weeks, always">
							<Calendar
								mode="single"
								fixedWeeks
								today={TODAY}
								defaultMonth={TODAY}
								className={styles.calendarCard}
							/>
						</Example>
						<Example title="no weekday row, week starts Monday">
							<Calendar
								mode="single"
								hideWeekdays
								weekStartsOn={1}
								today={TODAY}
								defaultMonth={TODAY}
								className={styles.calendarCard}
							/>
						</Example>
					</div>
				</div>

				<div className="story-section">
					<Typography size="base" weight="semibold">
						Day states
					</Typography>
					<Typography size="sm">
						<code>hover</code>, <code>focus</code> and <code>active</code> are forced by{' '}
						<code>storybook-addon-pseudo-states</code> onto the 2nd, 3rd and 4th of the month. The
						second calendar selects those same three days, so a day keeps its selection colour while
						it is hovered rather than falling back to the plain one. A disabled day is disabled
						natively, so it takes no pointer and no focus.
					</Typography>
					<div className={styles.calendarGrid}>
						<Example title="hover, focus, active">
							<Calendar
								mode="single"
								today={TODAY}
								defaultMonth={TODAY}
								modifiers={PSEUDO_MODIFIERS}
								modifiersClassNames={PSEUDO_CLASS_NAMES}
								className={styles.calendarCard}
							/>
						</Example>
						<Example title="hover, focus, active on a selection">
							<Calendar
								mode="range"
								today={TODAY}
								defaultMonth={TODAY}
								selected={{ from: day(2), to: day(4) }}
								onSelect={fn()}
								modifiers={PSEUDO_MODIFIERS}
								modifiersClassNames={PSEUDO_CLASS_NAMES}
								className={styles.calendarCard}
							/>
						</Example>
						<Example title="weekends disabled">
							<Calendar
								mode="single"
								today={TODAY}
								defaultMonth={TODAY}
								disabled={[{ dayOfWeek: [0, 6] }]}
								className={styles.calendarCard}
							/>
						</Example>
						<Example title="selected and disabled together">
							<Calendar
								mode="single"
								today={TODAY}
								defaultMonth={TODAY}
								selected={TODAY}
								onSelect={fn()}
								disabled={[{ before: day(9) }]}
								className={styles.calendarCard}
							/>
						</Example>
						<Example title="footer">
							<Calendar
								mode="single"
								today={TODAY}
								defaultMonth={TODAY}
								selected={TODAY}
								onSelect={fn()}
								footer="Pick the day the report starts on."
								className={styles.calendarCard}
							/>
						</Example>
					</div>
				</div>
			</div>
		</div>
	),
};
