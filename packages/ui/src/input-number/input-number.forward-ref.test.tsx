import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { InputNumber, type InputNumberRef } from './index.js';

describe('InputNumber — forward ref', () => {
	it('forwards an imperative ref with focus/blur/nativeElement', () => {
		const ref = createRef<InputNumberRef>();
		render(<InputNumber ref={ref} placeholder="0" testId="num" />);
		expect(ref.current).not.toBeNull();
		expect(ref.current?.nativeElement).toBeInstanceOf(HTMLInputElement);
		ref.current?.focus();
		expect(document.activeElement).toBe(ref.current?.nativeElement);
		ref.current?.blur();
		expect(document.activeElement).not.toBe(ref.current?.nativeElement);
	});

	it('positions the caret via focus({ cursor })', () => {
		const ref = createRef<InputNumberRef>();
		render(<InputNumber ref={ref} defaultValue={12345} testId="num" />);
		ref.current?.focus({ cursor: 'end' });
		const el = ref.current?.nativeElement;
		expect(el?.selectionStart).toBe(el?.value.length);
		ref.current?.focus({ cursor: 'start' });
		expect(el?.selectionStart).toBe(0);
		ref.current?.focus({ cursor: 'all' });
		expect(el?.selectionStart).toBe(0);
		expect(el?.selectionEnd).toBe(el?.value.length);
	});
});
