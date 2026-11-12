import { Popover as BasePopover } from '@base-ui/react/popover';
import { X } from '@signozhq/icons';
import {
	type CSSProperties,
	forwardRef,
	type KeyboardEvent,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { toCssLength } from '../lib/css-length.js';
import { fieldInvalidDataProps, useFieldContext } from '../lib/field-context.js';
import { useForceOpen } from '../lib/force-open.js';
import { mergeRefs } from '../lib/merge-refs.js';
import { useControlBlur } from '../lib/use-control-blur.js';
import { useControlledValue } from '../lib/use-controlled-value.js';
import { useIsomorphicLayoutEffect } from '../lib/use-isomorphic-layout-effect.js';
import { useLabelFor } from '../lib/use-label-for.js';
import { joinIdRefs, partTestId, type RejectedProps } from '../lib/utils.js';
import { TooltipProviderIfMissing } from '../tooltip/subcomponents/tooltip-provider.js';
import { DatePickerText } from './constants.js';
import styles from './date-picker.module.scss';
import { DatePickerHiddenInput } from './subcomponents/date-picker-hidden-input.js';
import { DatePickerPopup } from './subcomponents/date-picker-popup.js';
import { DatePickerTrigger } from './subcomponents/date-picker-trigger.js';
import type {
	DateAdapter,
	DatePickerComponentType,
	DatePickerDraftType,
	DatePickerImplProps,
} from './types.js';
import {
	clampDay,
	compareDays,
	formatDefaultValue,
	formatFormValue,
	readNow,
	nativeDateAdapter,
	readTime,
	readWallClock,
	startOfDay,
	withTime,
} from './utils.js';

type PopoverChangeDetails = BasePopover.Root.ChangeEventDetails;

const DatePickerImpl = forwardRef<HTMLButtonElement, DatePickerImplProps & RejectedProps>(
	function DatePicker(props, ref) {
		const {
			adapter,
			nullable = false,
			value: valueProp,
			defaultValue,
			onChange,
			onBlur,
			placeholder,
			showTime = false,
			showTimezone,
			formatValue,
			minDate,
			maxDate,
			disabledDate,
			allowClear = false,
			name,
			form,
			required,
			disabled = false,
			disabledTooltip,
			readOnly = false,
			readOnlyTooltip,
			container,
			width,
			maxWidth,
			testId,
			id,
			className: _className,
			style: _style,
			...triggerProps
		} = props;

		const [value, setValue] = useControlledValue<unknown>({
			component: 'DatePicker',
			value: valueProp,
			defaultValue,
			empty: undefined,
		});
		const field = useFieldContext();
		// A `Field` around the date picker announces it as required with `aria-required` alone, and
		// its own prop wins. The form's own validation owns the rule, and the native `required` of
		// the hidden input would stop the browser's submit before it runs.
		const isRequired = required ?? false;
		const isFieldRequired = required === undefined && field?.required === true;
		const { rootRef, popupRef, handleBlur, handleFocus, trackOpenChange } = useControlBlur(onBlur);

		const isTimezoneControlled = showTimezone !== undefined && 'value' in showTimezone;
		const [uncontrolledTimezone, setUncontrolledTimezone] = useState(showTimezone?.defaultValue);
		const committedTimezone =
			showTimezone === undefined
				? undefined
				: isTimezoneControlled
					? showTimezone.value
					: uncontrolledTimezone;

		const wallValue = readWallClock(adapter, value, committedTimezone);
		const isValueInvalid = value !== undefined && value !== null && wallValue === undefined;

		useEffect(() => {
			if (isValueInvalid) {
				console.warn('DatePicker: the adapter read `value` as an invalid date, showing no value.');
			}
		}, [isValueInvalid]);

		const isInert = disabled || readOnly;
		const forcedOpen = useForceOpen();
		const [openState, setOpenState] = useState(false);
		// Read again on each open, so a page left open past midnight marks the right day as today.
		const [now, setNow] = useState(() => new Date());
		const open = (forcedOpen || openState) && !isInert;
		// What the popup edits with `showTime` until `Apply`. `null` while nothing was edited, so the
		// popup shows the committed value.
		const [editedDraft, setEditedDraft] = useState<DatePickerDraftType | null>(null);
		// Turning `disabled` or `readOnly` on closes an open popup and drops its draft, and turning it
		// off again does not bring the popup back. Adjusted while rendering, so no frame shows the
		// popup over an inert field.
		const [wasInert, setWasInert] = useState(isInert);

		if (wasInert !== isInert) {
			setWasInert(isInert);

			if (isInert) {
				setOpenState(false);
				setEditedDraft(null);
			}
		}

		const draft: DatePickerDraftType = editedDraft ?? {
			day: wallValue === undefined ? undefined : startOfDay(wallValue),
			time: readTime(wallValue),
			timezone: committedTimezone,
		};
		// The zone the popup draws in: the one of the draft, which the time zone field moves.
		const popupTimezone = showTimezone === undefined ? undefined : draft.timezone;

		const readDay = (date: unknown): Date | undefined => {
			const wallClock = readWallClock(adapter, date, popupTimezone);

			return wallClock === undefined ? undefined : startOfDay(wallClock);
		};
		const minDay = readDay(minDate);
		const maxDay = readDay(maxDate);
		const today = readDay(adapter.fromDate(now, undefined)) ?? startOfDay(now);

		const isUnavailable = (day: Date): boolean => {
			if (minDay !== undefined && compareDays(day, minDay) < 0) {
				return true;
			}

			if (maxDay !== undefined && compareDays(day, maxDay) > 0) {
				return true;
			}

			return disabledDate?.(adapter.fromDate(startOfDay(day), popupTimezone)) === true;
		};

		const startDay = clampDay(draft.day ?? today, minDay, maxDay);

		function close(): void {
			// Back on the trigger before the popup unmounts. Otherwise the focused day is removed with
			// it, and a dialog around the date picker moves the focus to its panel.
			const active = popupRef.current?.ownerDocument.activeElement;

			if (active != null && popupRef.current?.contains(active)) {
				triggerElement?.focus();
			}

			setOpenState(false);
			setEditedDraft(null);
		}

		function commit(next: unknown, timezone: string | undefined): void {
			setValue(next);
			// The only `undefined` is a clear, which a nullable date picker reports as `null`.
			onChange?.(next === undefined && nullable ? null : next, { timezone });
		}

		function handleOpenChange(nextOpen: boolean, eventDetails: PopoverChangeDetails): void {
			if (nextOpen && isInert) {
				eventDetails.cancel();
				return;
			}

			trackOpenChange(nextOpen, eventDetails.reason);

			if (nextOpen) {
				setNow(readNow());
				setOpenState(true);
			} else {
				close();
			}
		}

		function handlePick(day: Date): void {
			if (showTime) {
				setEditedDraft({ ...draft, day: startOfDay(day) });
				return;
			}

			if (wallValue === undefined || compareDays(day, wallValue) !== 0) {
				commit(adapter.fromDate(startOfDay(day), undefined), undefined);
			}

			close();
		}

		// The day is checked again because a zone change moves the limits under a day already picked.
		const canApply =
			draft.day !== undefined &&
			!isUnavailable(draft.day) &&
			(showTimezone === undefined || draft.timezone !== undefined);

		function handleApply(): void {
			if (draft.day === undefined || !canApply) {
				return;
			}

			if (showTimezone !== undefined && !isTimezoneControlled) {
				setUncontrolledTimezone(popupTimezone);
			}

			commit(adapter.fromDate(withTime(draft.day, draft.time), popupTimezone), popupTimezone);
			close();
		}

		const hasValue = wallValue !== undefined;
		const showClear = allowClear && !isInert && hasValue;

		function clear(): void {
			commit(undefined, committedTimezone);
		}

		function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
			// An inert trigger acts on no key and leaves every key to the browser, eg: reload and find.
			if (isInert) {
				return;
			}

			if (event.key === 'ArrowDown' && !open) {
				event.preventDefault();
				setNow(readNow());
				setOpenState(true);
				return;
			}

			if ((event.key === 'Delete' || event.key === 'Backspace') && showClear) {
				event.preventDefault();
				clear();
			}
		}

		const timezoneLabel =
			committedTimezone === undefined
				? undefined
				: (showTimezone?.options.find((option) => option.value === committedTimezone)?.label ??
					committedTimezone);
		let text: string | undefined;

		if (hasValue) {
			text =
				formatValue === undefined
					? formatDefaultValue(wallValue, showTime, timezoneLabel)
					: formatValue(value, { timezone: committedTimezone });
		}

		// The trigger is a `<button>`, so the field's `<label for>` names it once it points at the
		// trigger's id: the field's control id, unless the date picker has an `id` of its own.
		const triggerId = id ?? field?.controlId;
		const claimControl = field?.claimControl;

		useIsomorphicLayoutEffect(() => {
			if (claimControl === undefined || triggerId === undefined) {
				return undefined;
			}

			claimControl(triggerId);

			return () => claimControl(undefined);
		}, [claimControl, triggerId]);

		const [labelId, labelRef] = useLabelFor(triggerId);
		// State, not a ref: the popup reads the layer the trigger sits in when it mounts.
		const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(null);
		const triggerRef = useMemo(() => mergeRefs(ref, labelRef, setTriggerElement), [ref, labelRef]);
		// The field's label is read from the context, not from the DOM: the label only points at the
		// trigger after the claim above, which runs after the trigger mounted.
		const fieldLabelId = field?.kind === 'field' ? field.labelId : undefined;
		const labelledBy =
			triggerProps['aria-labelledby'] ??
			(triggerProps['aria-label'] === undefined ? (labelId ?? fieldLabelId) : undefined);
		const accessibleName =
			triggerProps['aria-label'] ?? (labelledBy === undefined ? placeholder : undefined);

		// What a surrounding `Field` hands the trigger, as defaults the caller's own attributes win
		// over.
		const forwardedProps =
			field === null
				? triggerProps
				: {
						...triggerProps,
						'aria-describedby': joinIdRefs(triggerProps['aria-describedby'], field.describedBy),
						'aria-invalid':
							triggerProps['aria-invalid'] ?? (field.status === 'danger' ? true : undefined),
						...fieldInvalidDataProps(field),
					};

		const rootStyle = {
			...(width != null && { '--date-picker-internal-width': toCssLength(width) }),
			...(maxWidth != null && { '--date-picker-internal-max-width': toCssLength(maxWidth) }),
		} as CSSProperties;

		return (
			<TooltipProviderIfMissing>
				<BasePopover.Root open={open} onOpenChange={handleOpenChange} modal={false}>
					<div
						ref={rootRef}
						data-slot="date-picker"
						data-disabled={(disabled && !readOnly) || undefined}
						data-readonly={readOnly || undefined}
						data-clearable={showClear || undefined}
						data-popup-open={open || undefined}
						className={styles['date-picker']}
						style={rootStyle}
						onBlur={handleBlur}
						onFocus={handleFocus}
					>
						<DatePickerTrigger
							ref={triggerRef}
							forwardedProps={forwardedProps}
							id={triggerId}
							accessibleName={accessibleName}
							labelledBy={labelledBy}
							text={text}
							placeholder={placeholder}
							open={open}
							showTime={showTime}
							showTimezone={showTimezone !== undefined}
							required={isRequired || isFieldRequired}
							disabled={disabled}
							disabledTooltip={disabledTooltip}
							readOnly={readOnly}
							readOnlyTooltip={readOnlyTooltip}
							testId={testId}
							onKeyDown={handleTriggerKeyDown}
						/>
						{showClear && (
							<button
								type="button"
								tabIndex={-1}
								aria-label={DatePickerText.Clear}
								data-slot="date-picker-clear"
								className={styles['date-picker__clear']}
								onClick={() => {
									clear();
									triggerElement?.focus();
								}}
								{...(testId === undefined ? {} : { 'data-testid': partTestId(testId, 'clear') })}
							>
								<X />
							</button>
						)}
						<DatePickerHiddenInput
							trigger={triggerElement}
							name={name}
							form={form}
							value={formatFormValue(wallValue, showTime)}
							timezone={committedTimezone}
							showTimezone={showTimezone !== undefined}
							// A read-only field cannot be filled in, so it is left out of the check, like a native one.
							required={isRequired && !readOnly}
							disabled={disabled && !readOnly}
							onReset={() => {
								setEditedDraft(null);
								setValue(defaultValue);

								if (!isTimezoneControlled) {
									setUncontrolledTimezone(showTimezone?.defaultValue);
								}
							}}
						/>
					</div>
					<DatePickerPopup
						trigger={triggerElement}
						popupRef={popupRef}
						onBlur={handleBlur}
						onFocus={handleFocus}
						container={container}
						showTime={showTime}
						startDay={startDay}
						selectedDay={draft.day}
						today={today}
						minDay={minDay}
						maxDay={maxDay}
						isUnavailable={isUnavailable}
						time={draft.time}
						timezoneOptions={showTimezone?.options}
						timezone={draft.timezone}
						canApply={canApply}
						testId={testId}
						onPick={handlePick}
						onTimeChange={(time) => setEditedDraft({ ...draft, time })}
						onTimezoneChange={(timezone) => setEditedDraft({ ...draft, timezone })}
						onApply={handleApply}
					/>
				</BasePopover.Root>
			</TooltipProviderIfMissing>
		);
	},
);

/**
 * Builds a date picker whose dates are the adapter's type, for an app that holds its dates in a
 * date library (`dayjs`, `date-fns`, Luxon, Temporal). Write it once, next to the app's other
 * wrappers. The returned date picker takes every prop of {@link DatePicker}.
 *
 * Only an adapter that declares `supportsTimezone: true` gives a date picker that takes
 * `showTimezone`. Type the adapter as `DateAdapter<TDate, true>`, or write it inline.
 *
 * @example
 * ```ts
 * import { createDatePicker, type DateAdapter } from '@signozhq/ui/date-picker';
 * import dayjs, { type Dayjs } from 'dayjs';
 *
 * const dayjsAdapter: DateAdapter<Dayjs, true> = {
 *   supportsTimezone: true,
 *   toDate: (value, timezone) => {
 *     const v = timezone ? value.tz(timezone) : value;
 *     // `new Date(year, ...)` reads a year from 0 to 99 as 1900 to 1999.
 *     const date = new Date(0);
 *     date.setFullYear(v.year(), v.month(), v.date());
 *     date.setHours(v.hour(), v.minute(), v.second(), 0);
 *     return date;
 *   },
 *   fromDate: (date, timezone) => {
 *     if (!timezone) {
 *       return dayjs(date);
 *     }
 *     return dayjs.tz(dayjs(date).format('YYYY-MM-DDTHH:mm:ss'), timezone);
 *   },
 * };
 *
 * export const DatePicker = createDatePicker(dayjsAdapter);
 * ```
 */
export function createDatePicker<TDate>(
	adapter: DateAdapter<TDate, true>,
): DatePickerComponentType<TDate, true>;
export function createDatePicker<TDate>(
	adapter: DateAdapter<TDate>,
): DatePickerComponentType<TDate>;
export function createDatePicker<TDate>(
	adapter: DateAdapter<TDate, boolean>,
): DatePickerComponentType<TDate, boolean> {
	const internalAdapter = adapter as DateAdapter<unknown, boolean>;
	const BoundDatePicker = forwardRef<HTMLButtonElement, Omit<DatePickerImplProps, 'adapter'>>(
		function DatePicker(props, ref) {
			return (
				<DatePickerImpl {...(props as DatePickerImplProps)} adapter={internalAdapter} ref={ref} />
			);
		},
	);

	return BoundDatePicker as unknown as DatePickerComponentType<TDate, boolean>;
}

/**
 * Renders a field that picks one day, or one day and a time of day (Base UI `Popover` and
 * `Calendar`). Its dates are native `Date`s; an app that holds them in a date library makes its
 * own with {@link createDatePicker}.
 *
 * The date picker owns its markup: there are no subcomponents to import and nothing to compose.
 * The trigger is the field, the same as `Select` and `Combobox`, and the popup holds one month of
 * `Calendar`. `id`, `aria-*`, `data-*` and the ref land on the trigger.
 *
 * Visual values are `--date-picker-*` custom properties, defaults in the `css-tokens` region of
 * [./index.ts](./index.ts).
 *
 * ### Accessibility
 *
 * The trigger is `role="combobox"` with `aria-haspopup="dialog"`, and its text is the formatted
 * value. It is named by `aria-label`, `aria-labelledby` or a `<label for>` pointing at its `id`,
 * and by `placeholder` when none of them is given.
 *
 * The popup is a `role="dialog"` named `Choose date`, or `Choose date and time` with `showTime`.
 * The grid is the one of `Calendar`. The time fields are spin buttons named `Hours`, `Minutes` and
 * `Seconds` in a group named `Time`, and the time zone field is a `Combobox` named `Time zone`.
 *
 * ### Selection
 *
 * The popup opens on the selected day, or today, moved to the nearest limit when it is outside
 * `minDate` and `maxDate`, and puts the focus on it. Without `showTime` a pick calls `onChange`
 * with the start of the day and closes the popup. Picking the selected day closes it and calls
 * nothing.
 *
 * With `showTime` the popup holds a draft: a pick moves the draft day, and `Apply` calls
 * `onChange` once with the day, the time and the zone. `Esc`, a press outside, focus that leaves
 * the popup and a press on the trigger drop the draft.
 *
 * ### Keyboard
 *
 * `Enter`, `Space` and `ArrowDown` on the trigger open the popup, and `Delete` and `Backspace`
 * clear the value with `allowClear`. In the grid, the arrows move one day or one week, `Home` and
 * `End` move to the ends of the week, `PageUp` and `PageDown` one month, with `Shift` one year. A
 * disabled day takes the focus and cannot be picked. In a time field the arrows step and wrap,
 * digits replace the value, the second digit moves to the next field, and `Enter` applies. `Esc`
 * closes the popup and returns the focus to the trigger.
 *
 * ### Time zone
 *
 * The date picker does no time zone math: the adapter does. The selected zone decides what shows:
 * the text in the trigger, the selected day, the time row, today, and the days the limits
 * disable. Changing the zone keeps the wall clock of the draft.
 *
 * ### Disabled and read-only
 *
 * `disabled` and `readOnly` keep the popup closed, block the keys on the trigger and hide the
 * clear button. The trigger carries `aria-disabled` or `aria-readonly`, never the native
 * `disabled`, so it stays focusable and its tooltip reachable. `readOnly` outranks `disabled`:
 * with both, only `readOnlyTooltip` shows, and the value is submitted.
 *
 * `aria-invalid` reaches the trigger like any other `aria-*` prop and paints its border in the
 * destructive colour.
 *
 * ### Forms
 *
 * An input under the trigger carries `name` and `form`, so the date picker submits with the form,
 * and the browser checks `required` against it. A form reset brings an uncontrolled date picker
 * back to `defaultValue` and drops the draft of an open popup. A reset the form cancels changes
 * nothing.
 *
 * ### Asserting on it
 *
 * `testId` is `data-testid` on the trigger, and it names everything else: the parts are
 * `` `${testId}-clear` ``, `-popup`, `-calendar`, `-time-hours`, `-time-minutes`, `-time-seconds`,
 * `-timezone` and `-apply`. The calendar names its own parts from `` `${testId}-calendar` ``, eg:
 * `` `${testId}-calendar-button-06-11-2026` ``. Otherwise use the data attributes, never the
 * hashed class names.
 *
 * | trigger attribute | value |
 * |---|---|
 * | `data-slot` | `"date-picker-trigger"` |
 * | `data-disabled`, `data-readonly` | present while the prop is true, `data-disabled` only without `readOnly` |
 * | `data-popup-open` | present while the popup is open |
 * | `data-show-time`, `data-show-timezone` | present with `showTime` and `showTimezone` |
 * | `data-empty` | present while there is no value |
 * | `data-empty-label` | present while `formatValue` returns an empty string |
 *
 * | `data-slot` | rendered |
 * |---|---|
 * | `date-picker` | always, the root around the trigger, `data-clearable` while the clear button shows |
 * | `date-picker-input` | always, the input under the trigger that the form submits and validates |
 * | `date-picker-trigger` | always, the field |
 * | `date-picker-value`, `date-picker-placeholder` | inside the trigger, one of the two, `data-truncated` while cut off |
 * | `date-picker-icon` | inside the trigger, the calendar glyph |
 * | `date-picker-clear` | with `allowClear` and a value, while the date picker is usable |
 * | `date-picker-positioner`, `date-picker-popup` | while the popup is open |
 * | `date-picker-calendar` | the calendar, whose parts keep the slots of `Calendar` |
 * | `date-picker-footer` | with `showTime`, the time row, the time zone field and `Apply` |
 * | `date-picker-time`, `date-picker-time-field` | with `showTime`, the row and each of its three fields |
 * | `date-picker-timezone` | with `showTimezone` |
 * | `date-picker-apply` | with `showTime` |
 *
 * @example
 * ```tsx
 * <label htmlFor="expiry">Expires on</label>
 * <DatePicker id="expiry" placeholder="Select date" minDate={today} value={expiry} onChange={setExpiry} />
 * ```
 *
 * @example
 * ```tsx
 * // A day and a time, committed together with Apply
 * <DatePicker aria-label="Starts at" placeholder="Select date and time" showTime value={start} onChange={setStart} />
 * ```
 */
export const DatePicker = createDatePicker(nativeDateAdapter);
