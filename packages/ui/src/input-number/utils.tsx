import { ChevronDown, ChevronUp } from '@signozhq/icons';
import type * as React from 'react';
import type { InputNumberControls, InputNumberProps, InputNumberValue } from './input-number.js';

export const DEFAULT_STEP = 1;

export const isNumberLike = (value: unknown): value is number =>
	typeof value === 'number' && !Number.isNaN(value);

export const clamp = (value: number, min: number | undefined, max: number | undefined): number => {
	let next = value;
	if (max !== undefined && next > max) next = max;
	if (min !== undefined && next < min) next = min;
	return next;
};

export const isOutOfRange = (
	value: InputNumberValue,
	min: number | undefined,
	max: number | undefined
): boolean => {
	if (!isNumberLike(value)) return false;
	if (max !== undefined && value > max) return true;
	if (min !== undefined && value < min) return true;
	return false;
};

export const roundToPrecision = (value: number, precision: number | undefined): number => {
	if (precision === undefined) return value;
	const factor = 10 ** precision;
	return Math.round(value * factor) / factor;
};

export const formatForDisplay = (
	value: InputNumberValue,
	precision: number | undefined,
	decimalSeparator: string | undefined,
	formatter: InputNumberProps['formatter']
): string => {
	if (value === null || value === undefined) return '';
	let display: string = precision !== undefined ? value.toFixed(precision) : String(value);
	if (decimalSeparator) {
		display = display.replace('.', decimalSeparator);
	}
	if (formatter) {
		display = formatter(value, { userTyping: false, input: display });
	}
	return display;
};

export const parseFromInput = (
	raw: string,
	decimalSeparator: string | undefined,
	parser: InputNumberProps['parser']
): InputNumberValue => {
	let work = raw;
	if (parser) work = parser(work);
	if (decimalSeparator) work = work.split(decimalSeparator).join('.');
	if (work === '' || work === '-' || work === '.') return null;
	const parsed = Number(work);
	return Number.isNaN(parsed) ? null : parsed;
};

export const resolveControls = (
	controls: InputNumberControls | undefined
): { enabled: boolean; upIcon: React.ReactNode; downIcon: React.ReactNode } => {
	if (controls === false) {
		return { enabled: false, upIcon: null, downIcon: null };
	}
	if (controls && typeof controls === 'object') {
		return {
			enabled: true,
			upIcon: controls.upIcon ?? <ChevronUp aria-hidden="true" />,
			downIcon: controls.downIcon ?? <ChevronDown aria-hidden="true" />,
		};
	}
	return {
		enabled: controls === true,
		upIcon: <ChevronUp aria-hidden="true" />,
		downIcon: <ChevronDown aria-hidden="true" />,
	};
};
