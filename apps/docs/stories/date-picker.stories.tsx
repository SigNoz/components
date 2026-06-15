import { DatePicker } from '@signozhq/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

const meta: Meta<typeof DatePicker> = {
	title: 'Composed Components/DatePicker',
	component: DatePicker,
	tags: ['autodocs'],
	argTypes: {
		id: {
			control: 'text',
			description: 'A unique identifier for the date picker.',
			table: { category: 'Accessibility', type: { summary: 'string' } },
		},
		date: {
			control: false,
			description: 'The selected date.',
			table: { category: 'State', type: { summary: 'Date | undefined' } },
		},
		onDateChange: {
			control: false,
			description: 'Callback when date changes.',
			table: { category: 'Events', type: { summary: '(date: Date | undefined) => void' } },
		},
		time: {
			control: 'text',
			description: 'The selected time in HH:mm:ss format.',
			table: {
				category: 'State',
				type: { summary: 'string' },
				defaultValue: { summary: "'12:00:00'" },
			},
		},
		onTimeChange: {
			control: false,
			description: 'Callback when time changes.',
			table: { category: 'Events', type: { summary: '(time: string) => void' } },
		},
		timezone: {
			control: 'text',
			description: 'The selected timezone.',
			table: {
				category: 'State',
				type: { summary: 'string' },
				defaultValue: { summary: "'UTC'" },
			},
		},
		onTimezoneChange: {
			control: false,
			description: 'Callback when timezone changes.',
			table: { category: 'Events', type: { summary: '(timezone: string) => void' } },
		},
		placeholder: {
			control: 'text',
			description: 'Placeholder text.',
			table: {
				category: 'Content',
				type: { summary: 'string' },
				defaultValue: { summary: "'Pick a date'" },
			},
		},
		showTime: {
			control: 'boolean',
			description: 'Whether to show time selection.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		showTimezone: {
			control: 'boolean',
			description: 'Whether to show timezone selection.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		showActions: {
			control: 'boolean',
			description: 'Whether to show action buttons (Cancel/OK).',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		closeOnSelect: {
			control: 'boolean',
			description: 'Whether to close popover on date selection.',
			table: {
				category: 'Behavior',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'true' },
			},
		},
		disabled: {
			control: 'boolean',
			description: 'Whether the picker is disabled.',
			table: {
				category: 'State',
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		buttonVariant: {
			control: 'select',
			options: ['solid', 'outlined', 'dashed', 'ghost', 'link', 'action'],
			description: 'Button variant for the trigger.',
			table: {
				category: 'Appearance',
				type: { summary: 'ButtonVariantValue' },
				defaultValue: { summary: "'outlined'" },
			},
		},
		buttonColor: {
			control: 'select',
			options: ['primary', 'destructive', 'warning', 'secondary', 'none'],
			description: 'Button color for the trigger.',
			table: {
				category: 'Appearance',
				type: { summary: 'ButtonColorValue' },
				defaultValue: { summary: "'secondary'" },
			},
		},
		buttonSize: {
			control: 'select',
			options: ['sm', 'md', 'lg'],
			description: 'Button size for the trigger.',
			table: {
				category: 'Appearance',
				type: { summary: 'ButtonSizeValue' },
				defaultValue: { summary: "'md'" },
			},
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		style: {
			control: false,
			description: 'Inline styles for custom styling.',
			table: { category: 'Styling', type: { summary: 'React.CSSProperties' } },
		},
		popoverContentClassName: {
			control: 'text',
			description: 'Additional CSS classes for the popover content.',
			table: { category: 'Styling', type: { summary: 'string' } },
		},
		trigger: {
			control: false,
			description: 'Custom trigger element.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
		actions: {
			control: false,
			description: 'Custom action buttons.',
			table: { category: 'Content', type: { summary: 'React.ReactNode' } },
		},
		timezones: {
			control: false,
			description: 'Available timezones.',
			table: {
				category: 'Content',
				type: { summary: 'readonly { value: string; label: string }[]' },
			},
		},
		calendarProps: {
			control: false,
			description: 'Calendar props.',
			table: { category: 'Content', type: { summary: 'CalendarProps' } },
		},
		testId: {
			control: 'text',
			description: 'Test ID for the date picker.',
			table: { category: 'Testing', type: { summary: 'string' } },
		},
	},
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

const fixedDate = 1771949360343;

export const Default: Story = {
	args: {
		placeholder: 'Pick a date',
		showTime: false,
		showTimezone: false,
		showActions: false,
		closeOnSelect: true,
		disabled: false,
		buttonVariant: 'outlined',
		buttonColor: 'secondary',
		buttonSize: 'md',
	},
	render: (args) => {
		const [date, setDate] = React.useState<Date | undefined>(new Date(fixedDate));
		const [time, setTime] = React.useState(args.time ?? '12:00:00');
		const [timezone, setTimezone] = React.useState(args.timezone ?? 'UTC');

		return (
			<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
				<div>
					<h3 style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
						Selected Date:
					</h3>
					<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
						{date
							? args.showTime
								? `${date.toLocaleDateString()} at ${time}${args.showTimezone ? ` (${timezone})` : ''}`
								: date.toLocaleDateString()
							: 'No date selected'}
					</p>
				</div>
				<DatePicker
					{...args}
					date={date}
					onDateChange={setDate}
					time={time}
					onTimeChange={setTime}
					timezone={timezone}
					onTimezoneChange={setTimezone}
				/>
			</div>
		);
	},
};

export const Preview: Story = {
	parameters: {
		chromatic: { disableSnapshot: false },
	},
	render: () => {
		function DateOnlySection() {
			const [dateOnlyDate, setDateOnlyDate] = React.useState<Date | undefined>(new Date(fixedDate));

			return (
				<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
					<div>
						<h3 style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
							Selected Date:
						</h3>
						<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
							{dateOnlyDate ? dateOnlyDate.toLocaleDateString() : 'No date selected'}
						</p>
					</div>
					<DatePicker
						date={dateOnlyDate}
						onDateChange={setDateOnlyDate}
						showTime={false}
						showTimezone={false}
						placeholder="Pick a date"
					/>
				</div>
			);
		}

		function DateAndTimeSection() {
			const [dateTimeDate, setDateTimeDate] = React.useState<Date | undefined>(new Date(fixedDate));
			const [dateTimeTime, setDateTimeTime] = React.useState('09:30:00');

			return (
				<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
					<div>
						<h3 style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
							Selected Date & Time:
						</h3>
						<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
							{dateTimeDate
								? `${dateTimeDate.toLocaleDateString()} at ${dateTimeTime}`
								: 'No date selected'}
						</p>
					</div>
					<DatePicker
						date={dateTimeDate}
						onDateChange={setDateTimeDate}
						time={dateTimeTime}
						onTimeChange={setDateTimeTime}
						showTime={true}
						showTimezone={false}
						placeholder="Pick a date and time"
					/>
				</div>
			);
		}

		function WithTimezoneSection() {
			const [tzDate, setTzDate] = React.useState<Date | undefined>(new Date(fixedDate));
			const [tzTime, setTzTime] = React.useState('15:45:00');
			const [tzTimezone, setTzTimezone] = React.useState('America/New_York');

			return (
				<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
					<div>
						<h3 style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
							Selected Date & Time:
						</h3>
						<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
							{tzDate
								? `${tzDate.toLocaleDateString()} at ${tzTime} (${tzTimezone})`
								: 'No date selected'}
						</p>
					</div>
					<DatePicker
						date={tzDate}
						onDateChange={setTzDate}
						time={tzTime}
						onTimeChange={setTzTime}
						timezone={tzTimezone}
						onTimezoneChange={setTzTimezone}
						showTime={true}
						showTimezone={true}
						placeholder="Pick a date, time, and timezone"
					/>
				</div>
			);
		}

		function WithActionsSection() {
			const [actionsDate, setActionsDate] = React.useState<Date | undefined>(new Date(fixedDate));
			const [actionsTime, setActionsTime] = React.useState('12:00:00');
			const [actionsTimezone, setActionsTimezone] = React.useState('UTC');

			return (
				<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
					<div>
						<h3 style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
							Selected Date & Time:
						</h3>
						<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
							{actionsDate
								? `${actionsDate.toLocaleDateString()} at ${actionsTime} (${actionsTimezone})`
								: 'No date selected'}
						</p>
					</div>
					<DatePicker
						date={actionsDate}
						onDateChange={setActionsDate}
						time={actionsTime}
						onTimeChange={setActionsTime}
						timezone={actionsTimezone}
						onTimezoneChange={setActionsTimezone}
						showTime={true}
						showTimezone={true}
						showActions={true}
						closeOnSelect={false}
						placeholder="Pick a date, time, and timezone"
					/>
				</div>
			);
		}

		function DifferentButtonVariantsSection() {
			const [solidDate, setSolidDate] = React.useState<Date | undefined>(new Date(fixedDate));
			const [outlinedDate, setOutlinedDate] = React.useState<Date | undefined>(new Date(fixedDate));
			const [ghostDate, setGhostDate] = React.useState<Date | undefined>(new Date(fixedDate));

			return (
				<div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
						<h3 style={{ fontSize: '0.875rem', fontWeight: 500 }}>Button Variants:</h3>

						<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
							<p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
								Solid variant:
							</p>
							<DatePicker
								date={solidDate}
								onDateChange={setSolidDate}
								buttonVariant="solid"
								showTime={false}
								showTimezone={false}
							/>
						</div>

						<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
							<p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
								Outlined variant:
							</p>
							<DatePicker
								date={outlinedDate}
								onDateChange={setOutlinedDate}
								buttonVariant="outlined"
								showTime={false}
								showTimezone={false}
							/>
						</div>

						<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
							<p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
								Ghost variant:
							</p>
							<DatePicker
								date={ghostDate}
								onDateChange={setGhostDate}
								buttonVariant="ghost"
								showTime={false}
								showTimezone={false}
							/>
						</div>
					</div>
				</div>
			);
		}

		function DifferentButtonSizesSection() {
			const [smDate, setSmDate] = React.useState<Date | undefined>(new Date(fixedDate));
			const [mdDate, setMdDate] = React.useState<Date | undefined>(new Date(fixedDate));

			return (
				<div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
						<h3 style={{ fontSize: '0.875rem', fontWeight: 500 }}>Button Sizes:</h3>

						<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
							<p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>Small size:</p>
							<DatePicker
								date={smDate}
								onDateChange={setSmDate}
								buttonSize="sm"
								showTime={false}
								showTimezone={false}
							/>
						</div>

						<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
							<p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
								Medium size (default):
							</p>
							<DatePicker
								date={mdDate}
								onDateChange={setMdDate}
								buttonSize="md"
								showTime={false}
								showTimezone={false}
							/>
						</div>
					</div>
				</div>
			);
		}

		function DisabledSection() {
			const [disabledDate, setDisabledDate] = React.useState<Date | undefined>(new Date(fixedDate));

			return (
				<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
					<div>
						<h3 style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
							Disabled State:
						</h3>
						<p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
							The picker is disabled and cannot be interacted with.
						</p>
					</div>
					<DatePicker
						date={disabledDate}
						onDateChange={setDisabledDate}
						disabled={true}
						showTime={false}
						showTimezone={false}
					/>
				</div>
			);
		}

		return (
			<div
				style={{
					padding: '2rem',
					display: 'flex',
					flexDirection: 'column',
					gap: '2.5rem',
					backgroundColor: 'var(--background)',
				}}
			>
				<section>
					<h3
						style={{
							fontSize: '0.875rem',
							fontWeight: 500,
							marginBottom: '0.75rem',
							color: 'var(--muted-foreground)',
						}}
					>
						Date Only
					</h3>
					<DateOnlySection />
				</section>
				<section>
					<h3
						style={{
							fontSize: '0.875rem',
							fontWeight: 500,
							marginBottom: '0.75rem',
							color: 'var(--muted-foreground)',
						}}
					>
						Date And Time
					</h3>
					<DateAndTimeSection />
				</section>
				<section>
					<h3
						style={{
							fontSize: '0.875rem',
							fontWeight: 500,
							marginBottom: '0.75rem',
							color: 'var(--muted-foreground)',
						}}
					>
						With Timezone
					</h3>
					<WithTimezoneSection />
				</section>
				<section>
					<h3
						style={{
							fontSize: '0.875rem',
							fontWeight: 500,
							marginBottom: '0.75rem',
							color: 'var(--muted-foreground)',
						}}
					>
						With Actions
					</h3>
					<WithActionsSection />
				</section>
				<section>
					<h3
						style={{
							fontSize: '0.875rem',
							fontWeight: 500,
							marginBottom: '0.75rem',
							color: 'var(--muted-foreground)',
						}}
					>
						Different Button Variants
					</h3>
					<DifferentButtonVariantsSection />
				</section>
				<section>
					<h3
						style={{
							fontSize: '0.875rem',
							fontWeight: 500,
							marginBottom: '0.75rem',
							color: 'var(--muted-foreground)',
						}}
					>
						Different Button Sizes
					</h3>
					<DifferentButtonSizesSection />
				</section>
				<section>
					<h3
						style={{
							fontSize: '0.875rem',
							fontWeight: 500,
							marginBottom: '0.75rem',
							color: 'var(--muted-foreground)',
						}}
					>
						Disabled
					</h3>
					<DisabledSection />
				</section>
			</div>
		);
	},
};
