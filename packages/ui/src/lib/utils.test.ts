// packages/ui/src/lib/utils.test.ts
import { describe, expect, it } from 'vitest';
import { cn } from './utils.js';

describe('cn utility', () => {
	it('should merge class names', () => {
		expect(cn('foo', 'bar')).toBe('foo bar');
	});

	it('should handle conditional classes', () => {
		expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
	});

	it('should handle undefined and null', () => {
		expect(cn('foo', undefined, null, 'bar')).toBe('foo bar');
	});

	it('should handle arrays', () => {
		expect(cn(['foo', 'bar'])).toBe('foo bar');
	});

	it('should handle objects', () => {
		expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
	});

	it('should handle empty input', () => {
		expect(cn()).toBe('');
	});
});
