import { Popover as BasePopover } from '@base-ui/react/popover';
import type { ReactNode, RefObject } from 'react';
import type { Modifiers } from 'react-day-picker';
import { Button } from '../../button/button.js';
import { Calendar } from '../../calendar/calendar.js';
import { Combobox } from '../../combobox/combobox.js';
import { ForceOpenReset } from '../../lib/force-open.js';
import { usePopupContainer } from '../../lib/popup-container.js';
import { partTestId } from '../../lib/utils.js';
import { DatePickerText } from '../constants.js';
import styles from '../date-picker.module.scss';
import type {
	DatePickerImplProps,
	DatePickerTimeType,
	DatePickerTimezoneOptionType,
} from '../types.js';
import { formatIsoDay } from '../utils.js';
import { DatePickerDayButton, UNAVAILABLE_MODIFIER } from './date-picker-day-button.js';
import { DatePickerPositioner } from './date-picker-positioner.js';
import { DatePickerTime } from './date-picker-time.js';

const CALENDAR_COMPONENTS = { DayButton: DatePickerDayButton };

/**
 * @access private
 */
export type DatePickerPopupProps = {
	trigger: Element | null;
	popupRef: RefObject<HTMLDivElement>;
	container: DatePickerImplProps['container'];
	showTime: boolean;
	/**
	 * The day the popup opens on and puts the focus on.
	 */
	startDay: Date;
	selectedDay: Date | undefined;
	today: Date;
	minDay: Date | undefined;
	maxDay: Date | undefined;
	isUnavailable: (day: Date) => boolean;
	time: DatePickerTimeType;
	timezoneOptions: ReadonlyArray<DatePickerTimezoneOptionType> | undefined;
	timezone: string | undefined;
	canApply: boolean;
	testId: string | undefined;
	onPick: (day: Date) => void;
	onTimeChange: (time: DatePickerTimeType) => void;
	onTimezoneChange: (timezone: string | undefined) => void;
	onApply: () => void;
};

/**
 * The portalled popup: one month of `Calendar`, and with `showTime` the time row, the time zone
 * field and `Apply`.
 *
 * @access private
 */
export function DatePickerPopup({
	trigger,
	popupRef,
	container,
	showTime,
	startDay,
	selectedDay,
	today,
	minDay,
	maxDay,
	isUnavailable,
	time,
	timezoneOptions,
	timezone,
	canApply,
	testId,
	onPick,
	onTimeChange,
	onTimezoneChange,
	onApply,
}: DatePickerPopupProps): ReactNode {
	const popupContainer = usePopupContainer();
	// A `minDate` after `maxDate` disables every day. The arrows then stay on the first limit,
	// since react-day-picker cannot navigate an end month before its start month.
	const endMonth =
		minDay !== undefined && maxDay !== undefined && maxDay < minDay ? minDay : maxDay;

	return (
		<BasePopover.Portal container={container === undefined ? popupContainer : container}>
			<DatePickerPositioner trigger={trigger}>
				<BasePopover.Popup
					ref={popupRef}
					data-slot="date-picker-popup"
					aria-label={showTime ? DatePickerText.ChooseDateAndTime : DatePickerText.ChooseDate}
					className={styles['date-picker__popup']}
					initialFocus={() =>
						popupRef.current?.querySelector<HTMLElement>(
							`[data-slot="calendar-button"][data-day="${formatIsoDay(startDay)}"]:not([data-outside])`,
						) ?? true
					}
					finalFocus={() => (trigger instanceof HTMLElement ? trigger : true)}
					{...(testId === undefined ? {} : { 'data-testid': partTestId(testId, 'popup') })}
				>
					<div data-slot="date-picker-calendar" className={styles['date-picker__calendar']}>
						<Calendar
							mode="single"
							required
							selected={selectedDay}
							onSelect={(_selected: Date, day: Date, modifiers: Modifiers) => {
								if (modifiers[UNAVAILABLE_MODIFIER] !== true) {
									onPick(day);
								}
							}}
							defaultMonth={startDay}
							startMonth={minDay}
							endMonth={endMonth}
							today={today}
							fixedWeeks
							modifiers={{ [UNAVAILABLE_MODIFIER]: isUnavailable }}
							components={CALENDAR_COMPONENTS}
							testId={partTestId(testId, 'calendar')}
						/>
					</div>
					{showTime && (
						<div data-slot="date-picker-footer" className={styles['date-picker__footer']}>
							<DatePickerTime
								time={time}
								testId={testId}
								onChange={onTimeChange}
								onApply={onApply}
							/>
							{timezoneOptions !== undefined && (
								<div data-slot="date-picker-timezone" className={styles['date-picker__timezone']}>
									<ForceOpenReset>
										<Combobox
											aria-label={DatePickerText.Timezone}
											placeholder={DatePickerText.TimezonePlaceholder}
											searchInputProps={{ placeholder: DatePickerText.TimezoneSearch }}
											items={timezoneOptions.map((option) => ({
												type: 'item' as const,
												value: option.value,
												label: option.label,
											}))}
											value={timezone}
											onChange={onTimezoneChange}
											container={container}
											testId={partTestId(testId, 'timezone')}
										/>
									</ForceOpenReset>
								</div>
							)}
							<div data-slot="date-picker-apply" className={styles['date-picker__apply']}>
								<Button
									variant="solid"
									color="primary"
									size="sm"
									disabled={!canApply}
									disabledTooltip={undefined}
									onClick={onApply}
									testId={partTestId(testId, 'apply')}
								>
									{DatePickerText.Apply}
								</Button>
							</div>
						</div>
					)}
				</BasePopover.Popup>
			</DatePickerPositioner>
		</BasePopover.Portal>
	);
}
