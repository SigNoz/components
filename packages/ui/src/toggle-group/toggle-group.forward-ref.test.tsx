import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { ToggleGroup, ToggleGroupItem, ToggleGroupSimple } from './index.js';

describe('ToggleGroup forwardRef', () => {
	it('ToggleGroup forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<ToggleGroup ref={ref} type="single">
				<ToggleGroupItem value="a">A</ToggleGroupItem>
			</ToggleGroup>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('ToggleGroupItem forwards ref', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<ToggleGroup type="single">
				<ToggleGroupItem ref={ref} value="a">
					A
				</ToggleGroupItem>
			</ToggleGroup>
		);
		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
	});

	it('ToggleGroupSimple forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(<ToggleGroupSimple ref={ref} type="single" items={[{ value: 'a', label: 'A' }]} />);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});
});
