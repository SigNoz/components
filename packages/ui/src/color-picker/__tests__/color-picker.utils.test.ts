import { describe, expect, it, vi } from 'vitest';
import {
	capturePointer,
	clamp,
	formatHueValueText,
	formatPercentValueText,
	getAreaKeyChange,
	getStripKeyChange,
	hexToHsva,
	hexToRgb,
	hsvaToHex,
	parseColorValue,
	parseHexInput,
	parseIntegerInput,
	percentToAlphaDigits,
	readPointerFraction,
	rgbToHex,
	toAlphaDigits,
	toHexDigits,
	toOpaqueHex,
	withAlphaDigits,
} from '../utils.js';

const HUE_STRIP = { max: 359, largeStep: 36 };
const ALPHA_STRIP = { max: 100, largeStep: 10 };

describe('parseColorValue', () => {
	it.each([
		['#3a2a63', '#3a2a63'],
		['#3A2A63', '#3a2a63'],
		['#abc', '#aabbcc'],
		['#AbC', '#aabbcc'],
		['#abcd', '#aabbccdd'],
		['#abc8', '#aabbcc88'],
		['#3a2a6380', '#3a2a6380'],
		['#3A2A6380', '#3a2a6380'],
		['#3a2a6300', '#3a2a6300'],
	])('reads %s as %s', (value, hex) => {
		expect(parseColorValue(value, false)).toEqual({ hex, isInvalid: false });
	});

	it.each([
		['#3a2a63ff', '#3a2a63'],
		['#3A2A63FF', '#3a2a63'],
		['#abcf', '#aabbcc'],
		['#ABCF', '#aabbcc'],
	])('drops the opaque alpha of %s, so one color has one hex', (value, hex) => {
		expect(parseColorValue(value, false)).toEqual({ hex, isInvalid: false });
	});

	it.each([
		['#3a2a63', '#3a2a63'],
		['#abc', '#aabbcc'],
		['#abcd', '#aabbcc'],
		['#3a2a6380', '#3a2a63'],
		['#3A2A6300', '#3a2a63'],
	])('reads %s as %s with isOpaque', (value, hex) => {
		expect(parseColorValue(value, true)).toEqual({ hex, isInvalid: false });
	});

	it.each([false, true])('reads no color, without flagging it, with isOpaque %s', (isOpaque) => {
		expect(parseColorValue(undefined, isOpaque)).toEqual({ hex: undefined, isInvalid: false });
		expect(parseColorValue('', isOpaque)).toEqual({ hex: undefined, isInvalid: false });
	});

	it.each([
		'red',
		'rgb(1, 2, 3)',
		'3a2a63',
		'#12',
		'#12345',
		'#1234567',
		'#123456789',
		'#ggg',
		' #abc',
		null,
		42,
	])('flags %j as invalid, with no color', (value) => {
		expect(parseColorValue(value, false)).toEqual({ hex: undefined, isInvalid: true });
		expect(parseColorValue(value, true)).toEqual({ hex: undefined, isInvalid: true });
	});
});

describe('parseHexInput', () => {
	it.each([
		['3a2a63', '#3a2a63'],
		['#3A2A63', '#3a2a63'],
		['abc', '#aabbcc'],
		['#ABC', '#aabbcc'],
		[' 3a2a63 ', '#3a2a63'],
	])('reads %j as %s, with no alpha written', (text, hex) => {
		expect(parseHexInput(text, false)).toEqual({ hex, hasAlpha: false });
		expect(parseHexInput(text, true)).toEqual({ hex, hasAlpha: false });
	});

	it.each([
		['abcd', '#aabbccdd'],
		['#ABC8', '#aabbcc88'],
		['3a2a6380', '#3a2a6380'],
		['#3A2A6380', '#3a2a6380'],
		['3a2a6300', '#3a2a6300'],
	])('reads %j as %s, with an alpha written', (text, hex) => {
		expect(parseHexInput(text, false)).toEqual({ hex, hasAlpha: true });
	});

	it.each([
		['3a2a63ff', '#3a2a63'],
		['abcf', '#aabbcc'],
	])('reads the opaque alpha of %j as a written alpha, left out of the hex', (text, hex) => {
		expect(parseHexInput(text, false)).toEqual({ hex, hasAlpha: true });
	});

	it.each(['abcd', '#abc8', '3a2a6380', '3a2a63ff'])('rejects %j with isOpaque', (text) => {
		expect(parseHexInput(text, true)).toBeUndefined();
	});

	it.each(['', '#', 'ab', '3a2a6', '3a2a638', '3a2a63800', '##abc', 'xyz', 'rgb(1, 2, 3)'])(
		'rejects %j',
		(text) => {
			expect(parseHexInput(text, false)).toBeUndefined();
			expect(parseHexInput(text, true)).toBeUndefined();
		},
	);
});

describe('parseIntegerInput', () => {
	it.each<[text: string, max: number, value: number]>([
		['0', 255, 0],
		['7', 255, 7],
		['007', 255, 7],
		[' 42 ', 255, 42],
		['255', 255, 255],
		['100', 100, 100],
	])('reads %j up to %d as %d', (text, max, value) => {
		expect(parseIntegerInput(text, max)).toBe(value);
	});

	it.each<[text: string, max: number]>([
		['256', 255],
		['101', 100],
		['', 255],
		[' ', 255],
		['-1', 255],
		['+5', 255],
		['1.5', 255],
		['1e2', 255],
		['abc', 255],
		['1 2', 255],
		['1000', 255],
	])('rejects %j up to %d', (text, max) => {
		expect(parseIntegerInput(text, max)).toBeUndefined();
	});
});

describe('toHexDigits', () => {
	it('drops the #, and the alpha, and leaves an empty field for no color', () => {
		expect(toHexDigits('#3a2a63')).toBe('3a2a63');
		expect(toHexDigits('#3a2a6380')).toBe('3a2a63');
		expect(toHexDigits(undefined)).toBe('');
	});
});

describe('toOpaqueHex', () => {
	it('drops the alpha of a color, and leaves an opaque one as it is', () => {
		expect(toOpaqueHex('#3a2a6380')).toBe('#3a2a63');
		expect(toOpaqueHex('#3a2a63')).toBe('#3a2a63');
	});
});

describe('toAlphaDigits', () => {
	it('reads the alpha byte, and ff for a color with none', () => {
		expect(toAlphaDigits('#3a2a6380')).toBe('80');
		expect(toAlphaDigits('#3a2a6300')).toBe('00');
		expect(toAlphaDigits('#3a2a63')).toBe('ff');
	});
});

describe('percentToAlphaDigits', () => {
	it.each([
		[0, '00'],
		[10, '1a'],
		[25, '40'],
		[50, '80'],
		[100, 'ff'],
	])('writes %d percent as %s', (percent, digits) => {
		expect(percentToAlphaDigits(percent)).toBe(digits);
	});

	it('stays inside a byte', () => {
		expect(percentToAlphaDigits(-5)).toBe('00');
		expect(percentToAlphaDigits(150)).toBe('ff');
	});
});

describe('withAlphaDigits', () => {
	it.each([
		['#3a2a63', '80', '#3a2a6380'],
		['#3a2a6380', '40', '#3a2a6340'],
		['#3a2a6380', '00', '#3a2a6300'],
		['#3a2a6380', 'ff', '#3a2a63'],
		['#3a2a63', 'ff', '#3a2a63'],
	])('writes the alpha of %s as %s, giving %s', (hex, digits, expected) => {
		expect(withAlphaDigits(hex, digits)).toBe(expected);
	});
});

describe('hsvaToHex', () => {
	it.each([
		[{ h: 0, s: 100, v: 100, a: 100 }, '#ff0000'],
		[{ h: 120, s: 100, v: 100, a: 100 }, '#00ff00'],
		[{ h: 240, s: 100, v: 100, a: 100 }, '#0000ff'],
		[{ h: 60, s: 100, v: 100, a: 100 }, '#ffff00'],
		[{ h: 200, s: 0, v: 100, a: 100 }, '#ffffff'],
		[{ h: 200, s: 80, v: 0, a: 100 }, '#000000'],
		[{ h: 0, s: 50, v: 50, a: 100 }, '#804040'],
		[{ h: 0, s: 0, v: 50, a: 100 }, '#808080'],
	])('writes %j as %s, with no alpha while it is opaque', (hsva, hex) => {
		expect(hsvaToHex(hsva)).toBe(hex);
	});

	it.each([
		[{ h: 0, s: 100, v: 100, a: 50 }, '#ff000080'],
		[{ h: 0, s: 50, v: 50, a: 50 }, '#80404080'],
		[{ h: 0, s: 100, v: 100, a: 0 }, '#ff000000'],
		[{ h: 0, s: 100, v: 100, a: 25 }, '#ff000040'],
	])('writes %j as %s, with the alpha', (hsva, hex) => {
		expect(hsvaToHex(hsva)).toBe(hex);
	});

	it('writes lower case', () => {
		expect(hsvaToHex({ h: 300, s: 72, v: 91, a: 100 })).toMatch(/^#[\da-f]{6}$/);
		expect(hsvaToHex({ h: 300, s: 72, v: 91, a: 70 })).toMatch(/^#[\da-f]{8}$/);
	});
});

describe('hexToHsva', () => {
	it('reads hue, saturation, brightness and alpha', () => {
		expect(hexToHsva('#ff0000', 0)).toEqual({ h: 0, s: 100, v: 100, a: 100 });
		expect(hexToHsva('#00ff00', 0)).toEqual({ h: 120, s: 100, v: 100, a: 100 });
		expect(hexToHsva('#0000ff', 0)).toEqual({ h: 240, s: 100, v: 100, a: 100 });

		const { h, s, v, a } = hexToHsva('#3a2a63', 0);
		expect(Math.round(h)).toBe(257);
		expect(Math.round(s)).toBe(58);
		expect(Math.round(v)).toBe(39);
		expect(a).toBe(100);
	});

	it('reads the alpha byte as a percent, fraction kept', () => {
		expect(hexToHsva('#ff0000ff', 0).a).toBe(100);
		expect(hexToHsva('#ff000000', 0).a).toBe(0);
		expect(hexToHsva('#ff000080', 0).a).toBeCloseTo(50.2, 1);
		expect(Math.round(hexToHsva('#3a2a6340', 0).a)).toBe(25);
	});

	it('keeps the fallback hue for a color with no hue', () => {
		expect(hexToHsva('#808080', 257).h).toBe(257);
		expect(hexToHsva('#000000', 42).h).toBe(42);
		expect(hexToHsva('#ffffff', 300).h).toBe(300);
		expect(hexToHsva('#80808040', 257).h).toBe(257);
	});

	it('keeps a hue between 359 and 360, which the strip cannot step to', () => {
		const { h } = hexToHsva('#ff0001', 0);

		expect(h).toBeGreaterThan(359);
		expect(h).toBeLessThan(360);
	});

	it.each(['#3a2a63', '#4e74f8', '#010203', '#fefefe', '#ff00ff', '#123456', '#abcdef', '#ff0001'])(
		'reads %s back to the same hex',
		(hex) => {
			expect(hsvaToHex(hexToHsva(hex, 0))).toBe(hex);
		},
	);

	it.each(['#3a2a6380', '#4e74f8c0', '#ff000001', '#ffffff00', '#12345640'])(
		'reads %s back to the same hex, alpha included',
		(hex) => {
			expect(hsvaToHex(hexToHsva(hex, 0))).toBe(hex);
		},
	);

	it('reads every alpha byte back to the same one', () => {
		for (let byte = 0; byte < 256; byte += 1) {
			const digits = byte.toString(16).padStart(2, '0');
			const hex = `#3a2a63${digits}`;

			expect(hsvaToHex(hexToHsva(hex, 0))).toBe(byte === 255 ? '#3a2a63' : hex);
		}
	});
});

describe('hexToRgb', () => {
	it('reads the three channels, and ignores the alpha', () => {
		expect(hexToRgb('#3a2a63')).toEqual({ r: 58, g: 42, b: 99 });
		expect(hexToRgb('#3a2a6380')).toEqual({ r: 58, g: 42, b: 99 });
		expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
		expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
	});
});

describe('rgbToHex', () => {
	it('writes the channels as six lower case digits', () => {
		expect(rgbToHex({ r: 58, g: 42, b: 99 })).toBe('#3a2a63');
		expect(rgbToHex({ r: 1, g: 2, b: 3 })).toBe('#010203');
		expect(rgbToHex({ r: 255, g: 171, b: 205 })).toBe('#ffabcd');
	});

	it('rounds a channel and keeps it inside a byte', () => {
		expect(rgbToHex({ r: 300, g: -5, b: 12.6 })).toBe('#ff000d');
	});
});

describe('value texts', () => {
	it('reads the percent and the hex', () => {
		expect(formatPercentValueText(60, '#3a2a63')).toBe('60%, #3a2a63');
		expect(formatPercentValueText(50, '#3a2a6380')).toBe('50%, #3a2a6380');
		expect(formatPercentValueText(0, undefined)).toBe('0%, no color');
	});

	it('reads the degrees and the hex', () => {
		expect(formatHueValueText(255, '#3a2a63')).toBe('255 degrees, #3a2a63');
		expect(formatHueValueText(255, '#3a2a6380')).toBe('255 degrees, #3a2a6380');
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
	const hsva = { h: 200, s: 50, v: 50, a: 100 };

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
		const change = getAreaKeyChange(key, shift, hsva);

		expect(change?.axis).toBe(axis);
		expect(change?.hsva).toEqual({ ...hsva, [axis]: value });
	});

	it('clamps to 0 and 100', () => {
		expect(getAreaKeyChange('ArrowRight', true, { h: 0, s: 95, v: 50, a: 100 })?.hsva.s).toBe(100);
		expect(getAreaKeyChange('PageDown', false, { h: 0, s: 50, v: 4, a: 100 })?.hsva.v).toBe(0);
	});

	it('steps from the rounded value, so a fraction read off a hex lands on a whole percent', () => {
		expect(getAreaKeyChange('ArrowRight', false, { h: 0, s: 57.6, v: 38.8, a: 100 })?.hsva.s).toBe(
			59,
		);
	});

	it('leaves the hue and the alpha as they are', () => {
		const translucent = { h: 200.4, s: 50, v: 50, a: 37.5 };

		for (const key of ['ArrowRight', 'ArrowUp', 'PageUp', 'Home', 'End']) {
			const change = getAreaKeyChange(key, false, translucent);

			expect(change?.hsva.h).toBe(200.4);
			expect(change?.hsva.a).toBe(37.5);
		}
	});

	it('takes no other key', () => {
		expect(getAreaKeyChange('Enter', false, hsva)).toBeUndefined();
		expect(getAreaKeyChange('a', false, hsva)).toBeUndefined();
	});
});

describe('getStripKeyChange on the hue strip', () => {
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
		expect(getStripKeyChange(key, shift, from, HUE_STRIP)).toBe(to);
	});

	it('takes no other key', () => {
		expect(getStripKeyChange('Tab', false, 100, HUE_STRIP)).toBeUndefined();
	});

	it('keeps a hue past the last step as it is on a key that cannot move it', () => {
		expect(getStripKeyChange('ArrowRight', false, 359.7, HUE_STRIP)).toBe(359.7);
		expect(getStripKeyChange('ArrowLeft', false, 359.7, HUE_STRIP)).toBe(358);
	});
});

describe('getStripKeyChange on the alpha strip', () => {
	it.each<[key: string, shift: boolean, from: number, to: number]>([
		['ArrowRight', false, 50, 51],
		['ArrowUp', false, 50, 51],
		['ArrowLeft', false, 50, 49],
		['ArrowDown', false, 50, 49],
		['ArrowRight', true, 50, 60],
		['ArrowUp', true, 50, 60],
		['ArrowLeft', true, 50, 40],
		['ArrowDown', true, 50, 40],
		['PageUp', false, 50, 60],
		['PageDown', false, 50, 40],
		['Home', false, 50, 0],
		['End', false, 50, 100],
		['ArrowLeft', false, 0, 0],
		['PageDown', false, 4, 0],
		['ArrowRight', false, 100, 100],
		['PageUp', false, 95, 100],
	])('%s with shift %s moves %d to %d', (key, shift, from, to) => {
		expect(getStripKeyChange(key, shift, from, ALPHA_STRIP)).toBe(to);
	});

	it('steps from the rounded value, so a fraction read off a hex lands on a whole percent', () => {
		expect(getStripKeyChange('ArrowRight', false, 50.2, ALPHA_STRIP)).toBe(51);
		expect(getStripKeyChange('ArrowLeft', false, 50.2, ALPHA_STRIP)).toBe(49);
	});

	it('keeps a fraction as it is on a key that cannot move it', () => {
		expect(getStripKeyChange('ArrowRight', false, 99.6, ALPHA_STRIP)).toBe(99.6);
		expect(getStripKeyChange('ArrowLeft', false, 99.6, ALPHA_STRIP)).toBe(99);
	});

	it('takes no other key', () => {
		expect(getStripKeyChange('Enter', false, 50, ALPHA_STRIP)).toBeUndefined();
	});
});

describe('clamp', () => {
	it('keeps a value between the bounds', () => {
		expect(clamp(5, 0, 10)).toBe(5);
		expect(clamp(-1, 0, 10)).toBe(0);
		expect(clamp(11, 0, 10)).toBe(10);
	});
});
