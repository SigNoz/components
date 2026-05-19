import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { RadioGroup, RadioGroupItem, RadioGroupLabel } from './index.js';

describe('RadioGroup forwardRef', () => {
	it('RadioGroup forwards ref', () => {
		const ref = createRef<HTMLDivElement>();
		render(
			<RadioGroup ref={ref}>
				<RadioGroupItem value="a">A</RadioGroupItem>
			</RadioGroup>
		);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});

	it('RadioGroupItem forwards ref', () => {
		const ref = createRef<HTMLButtonElement>();
		render(
			<RadioGroup>
				<RadioGroupItem ref={ref} value="a">
					A
				</RadioGroupItem>
			</RadioGroup>
		);
		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
	});

	it('RadioGroupLabel forwards ref', () => {
		const ref = createRef<HTMLLabelElement>();
		render(
			<RadioGroup>
				<RadioGroupItem value="a">
					<RadioGroupLabel ref={ref}>Label A</RadioGroupLabel>
				</RadioGroupItem>
			</RadioGroup>
		);
		expect(ref.current).toBeInstanceOf(HTMLLabelElement);
	});
});
