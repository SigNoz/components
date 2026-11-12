import { describe, expect, it, vi } from 'vitest';
import {
	capturePointer,
	clamp,
	formatHueValueText,
	formatPercentValueText,
	getAreaKeyChange,
	getHueKeyChange,
	hexToHsv,
	hsvToHex,
	parseColorValue,
	parseHexInput,
	readPointerFraction,
	toHexDigits,
} from '../utils.js';

describe('parseColorValue', () => {
	it.each([
		['#3a2a63', '#3a2a63'],
		['#3A2A63', '#3a2a63'],
		['#abc', '#aabbcc'],
		['#AbC', '#aabbcc'],
		['#abcd', '#aabbcc'],
		['#3a2a6380', '#3a2a63'],
		['#3A2A63FF', '#3a2a63'],
	])('reads %s as %s', (value, hex) => {
		expect(parseColorValue(value)).toEqual({ hex, isInvalid: false });
	});

	it.each([undefined, ''])('reads %j as no color, without flagging it', (value) => {
		expect(parseColorValue(value)).toEqual({ hex: undefined, isInvalid: false });
	});

	it.each([
		'red',
		'rgb(1, 2, 3)',
		'3a2a63',
		'#12',
		'#12345',
		'#1234567',
		'#ggg',
		' #abc',
		null,
		42,
	])('flags %j as invalid, with no color', (value) => {
		expect(parseColorValue(value)).toEqual({ hex: undefined, isInvalid: true });
	});
});

describe('parseHexInput', () => {
	it.each([
		['3a2a63', '#3a2a63'],
		['#3A2A63', '#3a2a63'],
		['abc', '#aabbcc'],
		['#ABC', '#aabbcc'],
		[' 3a2a63 ', '#3a2a63'],
	])('reads %j as %s', (text, hex) => {
		expect(parseHexInput(text)).toBe(hex);
	});

	it.each(['', '#', 'ab', 'abcd', '3a2a6380', '##abc', 'xyz', '3a2a6'])('rejects %j', (text) => {
		expect(parseHexInput(text)).toBeUndefined();
	});
});

describe('toHexDigits', () => {
	it('drops the # and leaves an empty field for no color', () => {
		expect(toHexDigits('#3a2a63')).toBe('3a2a63');
		expect(toHexDigits(undefined)).toBe('');
	});
});

describe('hsvToHex', () => {
	it.each([
		[{ h: 0, s: 100, v: 100 }, '#ff0000'],
		[{ h: 120, s: 100, v: 100 }, '#00ff00'],
		[{ h: 240, s: 100, v: 100 }, '#0000ff'],
		[{ h: 60, s: 100, v: 100 }, '#ffff00'],
		[{ h: 200, s: 0, v: 100 }, '#ffffff'],
		[{ h: 200, s: 80, v: 0 }, '#000000'],
		[{ h: 0, s: 50, v: 50 }, '#804040'],
		[{ h: 0, s: 0, v: 50 }, '#808080'],
	])('writes %j as %s', (hsv, hex) => {
		expect(hsvToHex(hsv)).toBe(hex);
	});

	it('writes lower case', () => {
		expect(hsvToHex({ h: 300, s: 72, v: 91 })).toMatch(/^#[\da-f]{6}$/);
	});
});

describe('hexToHsv', () => {
	it('reads hue, saturation and brightness', () => {
		expect(hexToHsv('#ff0000', 0)).toEqual({ h: 0, s: 100, v: 100 });
		expect(hexToHsv('#00ff00', 0)).toEqual({ h: 120, s: 100, v: 100 });
		expect(hexToHsv('#0000ff', 0)).toEqual({ h: 240, s: 100, v: 100 });

		const { h, s, v } = hexToHsv('#3a2a63', 0);
		expect(Math.round(h)).toBe(257);
		expect(Math.round(s)).toBe(58);
		expect(Math.round(v)).toBe(39);
	});

	it('keeps the fallback hue for a color with no hue', () => {
		expect(hexToHsv('#808080', 257).h).toBe(257);
		expect(hexToHsv('#000000', 42).h).toBe(42);
		expect(hexToHsv('#ffffff', 300).h).toBe(300);
	});

	it('keeps a hue between 359 and 360, which the strip cannot step to', () => {
		const { h } = hexToHsv('#ff0001', 0);

		expect(h).toBeGreaterThan(359);
		expect(h).toBeLessThan(360);
	});

	it.each(['#3a2a63', '#4e74f8', '#010203', '#fefefe', '#ff00ff', '#123456', '#abcdef', '#ff0001'])(
		'reads %s back to the same hex',
		(hex) => {
			expect(hsvToHex(hexToHsv(hex, 0))).toBe(hex);
		},
	);
});

describe('value texts', () => {
	it('reads the percent and the hex', () => {
		expect(formatPercentValueText(60, '#3a2a63')).toBe('60%, #3a2a63');
		expect(formatPercentValueText(0, undefined)).toBe('0%, no color');
	});

	it('reads the degrees and the hex', () => {
		expect(formatHueValueText(255, '#3a2a63')).toBe('255 degrees, #3a2a63');
		expect(formatHueValueText(0, undefined)).toBe('0 degrees, no color');
	});
});

describe('readPointerFraction', () => {
	function box(left: number, top: number, width: number, height: number): Element {
		return {
			getBoundingClientRect: () => ({ left, top, width, height }) as DOMRect,
		} as Element;
	}

	it('reads the point as a fraction of the box from its top left', () => {
		expect(readPointerFraction({ clientX: 150, clientY: 75 }, box(100, 50, 200, 100))).toEqual({
			x: 0.25,
			y: 0.25,
		});
	});

	it('clamps a point outside the box to its edges', () => {
		expect(readPointerFraction({ clientX: 0, clientY: 900 }, box(100, 50, 200, 100))).toEqual({
			x: 0,
			y: 1,
		});
	});

	it('reads 0 on a box with no size', () => {
		expect(readPointerFraction({ clientX: 10, clientY: 10 }, box(0, 0, 0, 0))).toEqual({
			x: 0,
			y: 0,
		});
	});
});

describe('capturePointer', () => {
	it('swallows the error of a pointer the browser does not track', () => {
		const element = document.createElement('div');
		document.body.append(element);
		const spy = vi.spyOn(element, 'setPointerCapture');

		expect(() => capturePointer(element, 4242)).not.toThrow();
		expect(spy).toHaveBeenCalledWith(4242);
		element.remove();
	});
});

describe('getAreaKeyChange', () => {
	const hsv = { h: 200, s: 50, v: 50 };

	it.each<[key: string, shift: boolean, axis: 's' | 'v', value: number]>([
		['ArrowRight', false, 's', 51],
		['ArrowLeft', false, 's', 49],
		['ArrowUp', false, 'v', 51],
		['ArrowDown', false, 'v', 49],
		['ArrowRight', true, 's', 60],
		['ArrowLeft', true, 's', 40],
		['ArrowUp', true, 'v', 60],
		['ArrowDown', true, 'v', 40],
		['PageUp', false, 'v', 60],
		['PageDown', false, 'v', 40],
		['Home', false, 's', 0],
		['End', false, 's', 100],
	])('%s with shift %s moves %s to %d', (key, shift, axis, value) => {
		const change = getAreaKeyChange(key, shift, hsv);

		expect(change?.axis).toBe(axis);
		expect(change?.hsv).toEqual({ ...hsv, [axis]: value });
	});

	it('clamps to 0 and 100', () => {
		expect(getAreaKeyChange('ArrowRight', true, { h: 0, s: 95, v: 50 })?.hsv.s).toBe(100);
		expect(getAreaKeyChange('PageDown', false, { h: 0, s: 50, v: 4 })?.hsv.v).toBe(0);
	});

	it('steps from the rounded value, so a fraction read off a hex lands on a whole percent', () => {
		expect(getAreaKeyChange('ArrowRight', false, { h: 0, s: 57.6, v: 38.8 })?.hsv.s).toBe(59);
	});

	it('takes no other key', () => {
		expect(getAreaKeyChange('Enter', false, hsv)).toBeUndefined();
		expect(getAreaKeyChange('a', false, hsv)).toBeUndefined();
	});
});

describe('getHueKeyChange', () => {
	it.each<[key: string, shift: boolean, from: number, to: number]>([
		['ArrowRight', false, 100, 101],
		['ArrowUp', false, 100, 101],
		['ArrowLeft', false, 100, 99],
		['ArrowDown', false, 100, 99],
		['ArrowRight', true, 100, 136],
		['ArrowDown', true, 100, 64],
		['PageUp', false, 100, 136],
		['PageDown', false, 100, 64],
		['Home', false, 100, 0],
		['End', false, 100, 359],
		['ArrowLeft', false, 0, 0],
		['PageUp', false, 340, 359],
	])('%s with shift %s moves %d to %d', (key, shift, from, to) => {
		expect(getHueKeyChange(key, shift, from)).toBe(to);
	});

	it('takes no other key', () => {
		expect(getHueKeyChange('Tab', false, 100)).toBeUndefined();
	});

	it('keeps a hue past the last step as it is on a key that cannot move it', () => {
		expect(getHueKeyChange('ArrowRight', false, 359.7)).toBe(359.7);
		expect(getHueKeyChange('ArrowLeft', false, 359.7)).toBe(358);
	});
});

describe('clamp', () => {
	it('keeps a value between the bounds', () => {
		expect(clamp(5, 0, 10)).toBe(5);
		expect(clamp(-1, 0, 10)).toBe(0);
		expect(clamp(11, 0, 10)).toBe(10);
	});
});
